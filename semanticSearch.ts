/**
 * semanticSearch.ts — Myanmar Economy Search Platform
 * Multi-tier fallback: Vector RPC → Manual cosine → Lexical → Suggested docs
 * Myanmar Unicode normalization and cross-lingual embedding strategy.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface DocumentRecord {
  id: string;
  title: string | null;
  content: string;
  metadata: Record<string, unknown> | null;
  embedding?: number[] | null;
  score?: number;
}

export interface SemanticSearchResult {
  results: Array<{
    id: string;
    title: string;
    content: string;
    metadata: Record<string, unknown> | null;
    score: number;
  }>;
  message?: string;
  strategy?: "vector_rpc" | "cosine_scan" | "lexical" | "suggested";
}

export interface SemanticSearchOptions {
  limit?: number;
  threshold?: number;
  scanLimit?: number;
  alwaysReturn?: boolean;
}

// ─────────────────────────────────────────────────────────────
// Myanmar Unicode Normalizer
// Myanmar has several encoding variants (Zawgyi vs Unicode).
// We normalise common confusable codepoints so queries match
// stored content regardless of which input method was used.
// ─────────────────────────────────────────────────────────────

const ZAWGYI_TO_UNICODE: Array<[RegExp, string]> = [
  // Common Zawgyi-to-Unicode substitutions (subset)
  [/\u1031\u103b/g, "\u103b\u1031"],
  [/\u1031\u103c/g, "\u103c\u1031"],
  [/\u103a\u1037/g, "\u1037\u103a"],
  [/\u1004\u103a\u1039/g, "\u1004\u103a\u1039"],
];

/**
 * Normalize Myanmar text for consistent matching.
 * Handles basic Zawgyi/Unicode ordering differences.
 */
export function normalizeMyanmarText(text: string): string {
  let normalized = text;
  for (const [pattern, replacement] of ZAWGYI_TO_UNICODE) {
    normalized = normalized.replace(pattern, replacement);
  }
  return normalized.trim();
}

/**
 * Detect whether query is primarily in Myanmar script.
 */
export function isMyanmarScript(text: string): boolean {
  const myanmarChars = (text.match(/[\u1000-\u109F\uAA60-\uAA7F]/g) ?? []).length;
  const totalChars = text.replace(/\s/g, "").length;
  return totalChars > 0 && myanmarChars / totalChars > 0.3;
}

/**
 * Build the embedding input: for Myanmar queries, prepend a
 * semantic anchor in English so the model (which is largely
 * English-trained) has a bridging representation.
 */
function buildEmbeddingInput(query: string): string {
  const normalized = normalizeMyanmarText(query);

  if (isMyanmarScript(normalized)) {
    // Prepend English context anchor for cross-lingual embedding
    return `Myanmar economy trade: ${normalized}`;
  }

  return normalized;
}

// ─────────────────────────────────────────────────────────────
// Supabase Client (lazy singleton)
// ─────────────────────────────────────────────────────────────

let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (_supabase) return _supabase;

  const url =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  _supabase = createClient(url, key, {
    auth: { persistSession: false },
  });
  return _supabase;
}

// ─────────────────────────────────────────────────────────────
// Embedding Generator (OpenAI, with proxy fallback)
// ─────────────────────────────────────────────────────────────

async function generateEmbedding(text: string): Promise<number[]> {
  const key = process.env.OPENAI_API_KEY;
  if (!key || key.includes("***") || key === "your_openai_api_key") {
    throw new Error("OPENAI_API_KEY is missing or invalid.");
  }

  // Force the canonical OpenAI URL unless explicitly overridden.
  // This prevents proxy conflicts (e.g. api.manus.im returning 404).
  const baseUrl =
    process.env.OPENAI_BASE_URL?.includes("openai.com")
      ? process.env.OPENAI_BASE_URL
      : "https://api.openai.com/v1";

  const model =
    process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small";

  const embeddingInput = buildEmbeddingInput(text);

  const response = await fetch(`${baseUrl}/embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      input: embeddingInput,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(
      `OpenAI embeddings ${response.status}: ${err?.error?.message ?? response.statusText}`
    );
  }

  const data = (await response.json()) as {
    data?: Array<{ embedding: number[] }>;
  };

  const embedding = data.data?.[0]?.embedding;
  if (!embedding || embedding.length === 0) {
    throw new Error("OpenAI returned an empty embedding vector.");
  }

  return embedding;
}

// ─────────────────────────────────────────────────────────────
// Cosine similarity (pure TS, no deps)
// ─────────────────────────────────────────────────────────────

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

// ─────────────────────────────────────────────────────────────
// Search Tiers
// ─────────────────────────────────────────────────────────────

/** Tier 1: Supabase RPC — fastest, uses ivfflat index */
async function vectorRpcSearch(
  supabase: SupabaseClient,
  embedding: number[],
  threshold: number,
  limit: number
): Promise<SemanticSearchResult | null> {
  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: embedding,
    match_threshold: threshold,
    match_count: limit,
  });

  if (error) {
    console.warn("[search] RPC error:", error.message);
    return null;
  }

  if (!data || data.length === 0) return null;

  return {
    results: (data as DocumentRecord[]).map((r) => ({
      id: r.id,
      title: r.title ?? "Untitled",
      content: r.content,
      metadata: r.metadata,
      score: typeof r.score === "number" ? r.score : 0,
    })),
    strategy: "vector_rpc",
  };
}

/** Tier 2: Manual cosine scan — used when RPC is unavailable */
async function cosineManualSearch(
  supabase: SupabaseClient,
  queryEmbedding: number[],
  threshold: number,
  limit: number,
  scanLimit: number
): Promise<SemanticSearchResult | null> {
  const { data, error } = await supabase
    .from("documents")
    .select("id, title, content, metadata, embedding")
    .not("embedding", "is", null)
    .limit(scanLimit);

  if (error || !data) return null;

  const scored = (data as DocumentRecord[])
    .map((doc) => {
      if (!doc.embedding || !Array.isArray(doc.embedding)) return null;
      const sim = cosineSimilarity(queryEmbedding, doc.embedding as number[]);
      return { ...doc, score: sim };
    })
    .filter((d): d is DocumentRecord & { score: number } => d !== null && d.score > threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  if (scored.length === 0) return null;

  return {
    results: scored.map((r) => ({
      id: r.id,
      title: r.title ?? "Untitled",
      content: r.content,
      metadata: r.metadata,
      score: r.score,
    })),
    strategy: "cosine_scan",
  };
}

/** Tier 3: Lexical keyword fallback */
async function lexicalSearch(
  supabase: SupabaseClient,
  query: string,
  limit: number
): Promise<SemanticSearchResult | null> {
  // Extract key terms (skip Myanmar particles and common stopwords)
  const stopWords = new Set([
    "the", "a", "an", "is", "are", "of", "and", "or", "in", "on", "at",
    "for", "to", "with", "by", "ကို", "သည်", "မှ", "တွင်", "နှင့်",
  ]);

  const terms = query
    .toLowerCase()
    .split(/[\s,;:?!]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 2 && !stopWords.has(t));

  if (terms.length === 0) return null;

  // Use the longest term for the primary ILIKE search
  const primaryTerm = terms.sort((a, b) => b.length - a.length)[0];

  const { data, error } = await supabase
    .from("documents")
    .select("id, title, content, metadata")
    .or(`title.ilike.%${primaryTerm}%,content.ilike.%${primaryTerm}%`)
    .limit(limit);

  if (error || !data || data.length === 0) return null;

  return {
    results: (data as DocumentRecord[]).map((r, i) => ({
      id: r.id,
      title: r.title ?? "Untitled",
      content: r.content,
      metadata: r.metadata,
      // Approximate score by term frequency in content
      score: Math.max(
        0.1,
        0.5 - i * 0.05 + (terms.filter(t => r.content.toLowerCase().includes(t)).length * 0.1)
      ),
    })),
    strategy: "lexical",
    message: "Showing keyword matches (semantic search unavailable).",
  };
}

/** Tier 4: Return any recent documents as suggestions */
async function suggestedDocuments(
  supabase: SupabaseClient,
  limit: number
): Promise<SemanticSearchResult> {
  const { data } = await supabase
    .from("documents")
    .select("id, title, content, metadata")
    .order("created_at", { ascending: false })
    .limit(limit);

  return {
    results: (data ?? []).map((r: DocumentRecord, i: number) => ({
      id: r.id,
      title: r.title ?? "Untitled",
      content: r.content,
      metadata: r.metadata,
      score: Math.max(0.05, 0.3 - i * 0.05),
    })),
    strategy: "suggested",
    message: "No match found. Showing recently added documents.",
  };
}

// ─────────────────────────────────────────────────────────────
// Public Entry Point
// ─────────────────────────────────────────────────────────────

export async function semanticSearchDocuments(
  query: string,
  options: SemanticSearchOptions = {}
): Promise<SemanticSearchResult> {
  const {
    limit = 5,
    threshold = parseFloat(process.env.SEMANTIC_SEARCH_THRESHOLD ?? "0.1"),
    scanLimit = parseInt(process.env.SEMANTIC_SEARCH_SCAN_LIMIT ?? "2000"),
    alwaysReturn = process.env.SEMANTIC_SEARCH_ALWAYS_RETURN_RESULTS === "true",
  } = options;

  // ── Validate Supabase ──────────────────────────────────────
  const supabase = getSupabase();
  if (!supabase) {
    return {
      results: [],
      message:
        "Search service is currently unavailable due to configuration issues. " +
        "Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      strategy: "suggested",
    };
  }

  // ── Tier 1 & 2: Embedding-based search ────────────────────
  let embedding: number[] | null = null;
  let embeddingError: string | null = null;

  try {
    embedding = await generateEmbedding(query);
  } catch (err) {
    embeddingError =
      err instanceof Error ? err.message : "Unknown embedding error";
    console.warn("[search] Embedding generation failed:", embeddingError);
  }

  if (embedding) {
    // Tier 1: RPC (fast, indexed)
    try {
      const rpcResult = await vectorRpcSearch(supabase, embedding, threshold, limit);
      if (rpcResult && rpcResult.results.length > 0) return rpcResult;
    } catch (err) {
      console.warn("[search] RPC search threw:", err);
    }

    // Tier 2: Manual cosine scan (fallback if RPC not set up)
    try {
      const cosineResult = await cosineManualSearch(
        supabase,
        embedding,
        threshold,
        limit,
        scanLimit
      );
      if (cosineResult && cosineResult.results.length > 0) return cosineResult;
    } catch (err) {
      console.warn("[search] Cosine scan threw:", err);
    }
  }

  // ── Tier 3: Lexical keyword search ────────────────────────
  try {
    const lexResult = await lexicalSearch(supabase, query, limit);
    if (lexResult && lexResult.results.length > 0) {
      if (embeddingError) {
        lexResult.message = `Keyword matches (embedding unavailable: ${embeddingError}).`;
      }
      return lexResult;
    }
  } catch (err) {
    console.warn("[search] Lexical search threw:", err);
  }

  // ── Tier 4: Suggested docs (last resort) ──────────────────
  if (alwaysReturn) {
    return suggestedDocuments(supabase, limit);
  }

  return {
    results: [],
    message: embeddingError
      ? `No results found. Embedding error: ${embeddingError}`
      : "No results found for your query.",
    strategy: "suggested",
  };
}
