import { createOpenAI, openai } from "@ai-sdk/openai";
import { embed } from "ai";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 20;
const DEFAULT_SCAN_LIMIT = 2000;
const DEFAULT_THRESHOLD = 0.1; // Lowered threshold for better recall in semantic search

export type SemanticSearchResult = {
  id: string;
  title: string | null;
  content: string;
  metadata: Record<string, unknown> | null;
  score: number;
};

export type SemanticSearchResponse = {
  results: SemanticSearchResult[];
  message?: string;
};

type DocumentsRow = {
  id: string;
  title: string | null;
  content: string | null;
  metadata: Record<string, unknown> | null;
  embedding: number[] | string | null;
};

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function normalizeLimit(limit?: number): number {
  if (!Number.isFinite(limit)) {
    return DEFAULT_LIMIT;
  }

  return Math.max(1, Math.min(MAX_LIMIT, Math.floor(limit as number)));
}

function normalizeScanLimit(value: unknown): number {
  const parsed = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(parsed)) {
    return DEFAULT_SCAN_LIMIT;
  }

  return Math.max(100, Math.min(20_000, Math.floor(parsed as number)));
}

function normalizeEmbedding(value: DocumentsRow["embedding"]): number[] | null {
  if (Array.isArray(value) && value.every((item) => typeof item === "number")) {
    return value;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed) && parsed.every((item) => typeof item === "number")) {
        return parsed;
      }
    } catch {
      return null;
    }
  }

  return null;
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || b.length === 0 || a.length !== b.length) {
    return -1;
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let index = 0; index < a.length; index += 1) {
    dot += a[index] * b[index];
    normA += a[index] * a[index];
    normB += b[index] * b[index];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);

  if (denominator === 0) {
    return -1;
  }

  return dot / denominator;
}

function toContentPreview(content: string): string {
  const trimmed = content.trim();
  if (trimmed.length <= 300) {
    return trimmed;
  }

  return `${trimmed.slice(0, 297)}...`;
}

function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "";

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY)."
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
}

async function createQueryEmbedding(query: string, apiKey?: string): Promise<number[]> {
  const effectiveApiKey = apiKey || process.env.OPENAI_API_KEY;
  
  if (!effectiveApiKey || effectiveApiKey.includes("sk-proj-***")) {
    throw new Error("Invalid or missing OPENAI_API_KEY. Please set it in Vercel environment variables.");
  }

  const baseURL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const embeddingModel = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";
  
  const openaiInstance = createOpenAI({ 
    apiKey: effectiveApiKey,
    baseURL: baseURL
  });

  const { embedding } = await embed({
    model: openaiInstance.embedding(embeddingModel),
    value: query,
  });

  return embedding;
}

async function fetchLexicalFallback(query: string, limit: number): Promise<SemanticSearchResult[]> {
  const supabase = createSupabaseClient();
  const escaped = query.replace(/[%_]/g, (match) => `\\${match}`);
  const pattern = `%${escaped}%`;
  const { data, error } = await supabase
    .from("documents")
    .select("id, title, content, metadata")
    .or(`content.ilike.${pattern},title.ilike.${pattern}`)
    .limit(limit);

  if (error) {
    throw new Error(`Supabase fallback search failed: ${error.message}`);
  }

  return (data ?? [])
    .map((row) => {
      const content = typeof row.content === "string" ? row.content : "";
      if (!content) {
        return null;
      }

      return {
        id: String(row.id),
        title: typeof row.title === "string" ? row.title : null,
        content: toContentPreview(content),
        metadata: row.metadata as Record<string, unknown> | null,
        score: 0,
      } satisfies SemanticSearchResult;
    })
    .filter((item): item is SemanticSearchResult => item !== null);
}

export async function semanticSearchDocuments(
  query: string,
  options?: { limit?: number; apiKey?: string }
): Promise<SemanticSearchResponse> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return {
      results: [],
      message: "Please provide a query before searching.",
    };
  }

  const limit = normalizeLimit(options?.limit);
  const threshold = Number(process.env.SEMANTIC_SEARCH_THRESHOLD ?? DEFAULT_THRESHOLD);
  const scanLimit = normalizeScanLimit(process.env.SEMANTIC_SEARCH_SCAN_LIMIT);
  
  let supabase;
  try {
    supabase = createSupabaseClient();
  } catch (error) {
    console.error("Supabase client creation failed:", error);
    return {
      results: [],
      message: "Search service is currently unavailable due to configuration issues.",
    };
  }
  
  let embedding: number[];
  try {
    embedding = await createQueryEmbedding(trimmedQuery, options?.apiKey);
  } catch (error) {
    console.warn("Embedding failed, falling back to lexical search:", error);
    try {
      const fallbackResults = await fetchLexicalFallback(trimmedQuery, limit);
      return {
        results: fallbackResults,
        message: "Semantic search unavailable. Showing keyword matches instead.",
      };
    } catch (fallbackError) {
      console.error("Lexical fallback also failed:", fallbackError);
      throw fallbackError;
    }
  }

  // Attempt to use Supabase RPC for vector search (much more efficient)
  const { data: rpcData, error: rpcError } = await supabase.rpc('match_documents', {
    query_embedding: embedding,
    match_threshold: threshold,
    match_count: Math.max(limit * 6, 20) // Fetch more to allow for better filtering/ranking
  });

  let semanticResults: SemanticSearchResult[] = [];
  if (!rpcError && rpcData) {
    semanticResults = (rpcData as any[]).map(row => ({
      id: row.id,
      title: row.title,
      content: toContentPreview(row.content || ""),
      metadata: row.metadata,
      score: Number(row.similarity.toFixed(4)),
    }));
  } else if (rpcError) {
    const details = typeof (rpcError as any)?.message === "string" ? (rpcError as any).message : String(rpcError);
    console.warn("Vector RPC search failed:", details);
  }

  // Fetch lexical results for hybrid search
  let lexicalResults: SemanticSearchResult[] = [];
  try {
    lexicalResults = await fetchLexicalFallback(trimmedQuery, limit);
  } catch (lexicalError) {
    console.warn("Lexical search failed during hybrid phase:", lexicalError);
  }
  
  // Combine and deduplicate results
  const combinedMap = new Map<string, SemanticSearchResult>();
  
  // Add semantic results first (they have scores)
  semanticResults.forEach(res => combinedMap.set(res.id, res));
  
  // Add lexical results (if not already present, give them a base score)
  lexicalResults.forEach(res => {
    if (!combinedMap.has(res.id)) {
      combinedMap.set(res.id, { ...res, score: 0.05 }); // Base score for keyword match
    } else {
      // If already present, boost the score slightly for being a hybrid match
      const existing = combinedMap.get(res.id)!;
      combinedMap.set(res.id, { ...existing, score: Math.min(1, existing.score + 0.1) });
    }
  });

  const finalResults = Array.from(combinedMap.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  if (finalResults.length > 0) {
    const messageParts: string[] = [];
    if (rpcError) {
      const rpcMessage = typeof (rpcError as any)?.message === "string" ? (rpcError as any).message : "";
      if (rpcMessage.toLowerCase().includes("match_documents")) {
        messageParts.push(
          "Vector search function (match_documents) is not available. Using fallback search."
        );
      } else {
        messageParts.push("Vector search unavailable. Using fallback search.");
      }
    }

    return { results: finalResults, message: messageParts.length > 0 ? messageParts.join(" ") : undefined };
  }

  // Fallback to manual similarity calculation if RPC fails or returns no results
  console.log("RPC search failed or returned no results, falling back to manual scan.");
  const { data, error } = await supabase
    .from("documents")
    .select("id, title, content, metadata, embedding")
    .limit(scanLimit);

  if (error) {
    throw new Error(`Supabase documents lookup failed: ${error.message}`);
  }

  let dimensionMismatchCount = 0;

  const scoredResults = ((data ?? []) as DocumentsRow[])
    .map((row) => {
      const content = typeof row.content === "string" ? row.content : "";
      const rowEmbedding = normalizeEmbedding(row.embedding);

      if (!content || !rowEmbedding) {
        return null;
      }

      if (rowEmbedding.length !== embedding.length) {
        dimensionMismatchCount += 1;
        return null;
      }

      const similarity = cosineSimilarity(embedding, rowEmbedding);
      if (similarity < threshold) {
        return null;
      }

      return {
        id: row.id,
        title: row.title,
        content: toContentPreview(content),
        metadata: row.metadata,
        score: Number(similarity.toFixed(4)),
      } satisfies SemanticSearchResult;
    })
    .filter((item): item is SemanticSearchResult => item !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  if (scoredResults.length > 0) {
    return { results: scoredResults };
  }

  if (dimensionMismatchCount > 0) {
    return {
      results: [],
      message:
        "Your stored document embeddings do not match the current query embedding dimension. Recreate document embeddings using the same embedding model configured by OPENAI_EMBEDDING_MODEL (default: text-embedding-3-small) and ensure match_documents uses the correct vector dimension.",
    };
  }

  // Final fallback to lexical search
  const fallbackResults = await fetchLexicalFallback(trimmedQuery, limit);
  if (fallbackResults.length > 0) {
    return {
      results: fallbackResults,
      message: "Showing keyword matches.",
    };
  }

  return {
    results: [],
    message: "No results found for this query.",
  };
}
