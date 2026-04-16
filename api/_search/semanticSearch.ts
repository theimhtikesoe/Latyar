import { createOpenAI } from "@ai-sdk/openai";
import { embed } from "ai";
import { createSupabaseClient } from "./supabase.js";

const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 20;
const DEFAULT_SCAN_LIMIT = 2000;
const DEFAULT_THRESHOLD = 0.1;

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

function normalizeLimit(limit?: number): number {
  if (!Number.isFinite(limit)) return DEFAULT_LIMIT;
  return Math.max(1, Math.min(MAX_LIMIT, Math.floor(limit as number)));
}

function normalizeScanLimit(value: unknown): number {
  const parsed = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(parsed)) return DEFAULT_SCAN_LIMIT;
  return Math.max(100, Math.min(20_000, Math.floor(parsed as number)));
}

function toContentPreview(content: string): string {
  const trimmed = content.trim();
  if (trimmed.length <= 300) return trimmed;
  return `${trimmed.slice(0, 297)}...`;
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
  if (a.length === 0 || b.length === 0 || a.length !== b.length) return -1;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let index = 0; index < a.length; index += 1) {
    dot += a[index] * b[index];
    normA += a[index] * a[index];
    normB += b[index] * b[index];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return -1;
  return dot / denominator;
}

async function createQueryEmbedding(query: string, apiKey?: string): Promise<number[]> {
  const effectiveApiKey = apiKey || process.env.OPENAI_API_KEY;
  if (!effectiveApiKey || effectiveApiKey.includes("sk-proj-***")) {
    throw new Error("Invalid or missing OPENAI_API_KEY.");
  }

  const baseURL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const embeddingModel = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";

  const openaiInstance = createOpenAI({ apiKey: effectiveApiKey, baseURL });
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

  const rows = (data ?? []) as Array<{
    id: unknown;
    title: unknown;
    content: unknown;
    metadata: unknown;
  }>;

  return rows
    .map((row) => {
      const content = typeof row.content === "string" ? row.content : "";
      if (!content) return null;

      return {
        id: String(row.id),
        title: typeof row.title === "string" ? row.title : null,
        content: toContentPreview(content),
        metadata: (row.metadata as Record<string, unknown> | null) ?? null,
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
    return { results: [], message: "Please provide a query before searching." };
  }

  const limit = normalizeLimit(options?.limit);
  const threshold = Number(process.env.SEMANTIC_SEARCH_THRESHOLD ?? DEFAULT_THRESHOLD);
  const scanLimit = normalizeScanLimit(process.env.SEMANTIC_SEARCH_SCAN_LIMIT);

  let supabase;
  try {
    supabase = createSupabaseClient();
  } catch {
    return { results: [], message: "Search service is unavailable (Supabase not configured)." };
  }

  let embedding: number[];
  try {
    embedding = await createQueryEmbedding(trimmedQuery, options?.apiKey);
  } catch {
    const fallback = await fetchLexicalFallback(trimmedQuery, limit);
    return {
      results: fallback,
      message: "Semantic search unavailable. Showing keyword matches instead.",
    };
  }

  // Vector RPC if available
  const { data: rpcData, error: rpcError } = await supabase.rpc("match_documents", {
    query_embedding: embedding,
    match_threshold: threshold,
    match_count: Math.max(limit * 6, 20),
  });

  if (!rpcError && rpcData) {
    const semanticResults = (rpcData as any[]).map((row) => ({
      id: String(row.id),
      title: (row.title as string | null) ?? null,
      content: toContentPreview(String(row.content || "")),
      metadata: (row.metadata as Record<string, unknown> | null) ?? null,
      score: Number(Number(row.similarity).toFixed(4)),
    })) as SemanticSearchResult[];

    if (semanticResults.length > 0) {
      return { results: semanticResults.slice(0, limit) };
    }
  }

  // Manual scan fallback
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
      if (!content || !rowEmbedding) return null;

      if (rowEmbedding.length !== embedding.length) {
        dimensionMismatchCount += 1;
        return null;
      }

      const similarity = cosineSimilarity(embedding, rowEmbedding);
      if (similarity < threshold) return null;

      return {
        id: String(row.id),
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
        "Document embeddings dimension mismatch. Recreate your document embeddings using the configured embedding model.",
    };
  }

  const lexical = await fetchLexicalFallback(trimmedQuery, limit);
  if (lexical.length > 0) {
    return { results: lexical, message: "Showing keyword matches." };
  }

  return { results: [], message: "No results found for this query." };
}
