import { openai } from "@ai-sdk/openai";
import { embed } from "ai";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 20;
const FETCH_LIMIT = 200;
const DEFAULT_THRESHOLD = 0.2;

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
  const supabaseUrl = getEnv("SUPABASE_URL");
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!supabaseKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY");
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
}

async function createQueryEmbedding(query: string): Promise<number[]> {
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: query,
  });

  return embedding;
}

async function fetchLexicalFallback(query: string, limit: number): Promise<SemanticSearchResult[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("documents")
    .select("id, title, content, metadata")
    .ilike("content", `%${query}%`)
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
  options?: { limit?: number }
): Promise<SemanticSearchResponse> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return {
      results: [],
      message: "Please provide a query before searching.",
    };
  }

  const limit = normalizeLimit(options?.limit);
  const embedding = await createQueryEmbedding(trimmedQuery);
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("documents")
    .select("id, title, content, metadata, embedding")
    .limit(FETCH_LIMIT);

  if (error) {
    throw new Error(`Supabase documents lookup failed: ${error.message}`);
  }

  const threshold = Number(process.env.SEMANTIC_SEARCH_THRESHOLD ?? DEFAULT_THRESHOLD);

  const scoredResults = ((data ?? []) as DocumentsRow[])
    .map((row) => {
      const content = typeof row.content === "string" ? row.content : "";
      const rowEmbedding = normalizeEmbedding(row.embedding);

      if (!content || !rowEmbedding) {
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

  const fallbackResults = await fetchLexicalFallback(trimmedQuery, limit);
  if (fallbackResults.length > 0) {
    return {
      results: fallbackResults,
      message: "No strong semantic matches found. Showing keyword matches instead.",
    };
  }

  return {
    results: [],
    message: "No results found for this query.",
  };
}
