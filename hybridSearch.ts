/**
 * hybridSearch.ts — Myanmar Economy Search Platform
 * Overhauled: parallel I/O, typed errors, Myanmar query enhancement,
 * model fallback chain, per-stage timeouts, latency telemetry.
 */

import { semanticSearchDocuments, type SemanticSearchResult } from "./semanticSearch";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface InternalResult {
  id: string;
  title: string;
  content: string;
  metadata: Record<string, unknown> | null;
  score: number;
}

export interface NewsResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  date: string;
}

export interface SearchLatency {
  total: number;
  internal: number;
  news: number;
  synthesis: number;
}

export interface HybridSearchResult {
  internalResults: InternalResult[];
  newsResults: NewsResult[];
  synthesizedSummary: string;
  message: string | null;
  latency?: SearchLatency;
  queryEnhanced?: string;
}

export interface HybridSearchOptions {
  limit?: number;
  apiKey?: string;
  includeNews?: boolean;
  includeSummary?: boolean;
  language?: "en" | "my" | string;
  category?: string;
  timeout?: number;
}

// ─────────────────────────────────────────────────────────────
// Myanmar Query Enhancer
// Expands Myanmar terms with English equivalents so the
// embedding model (trained on mixed-language data) can
// find cross-lingual semantic neighbours.
// ─────────────────────────────────────────────────────────────

const MM_TERM_MAP: Record<string, string[]> = {
  ကုန်သွယ်: ["trade", "commerce"],
  ကုန်သွယ်ရေး: ["trade", "commerce", "trading"],
  ပို့ကုန်: ["export", "exports"],
  သွင်းကုန်: ["import", "imports"],
  လိုင်စင်: ["license", "permit"],
  ပါမစ်: ["permit", "authorization"],
  ဥပဒေ: ["law", "regulation"],
  စည်းမျဉ်း: ["regulation", "rule", "policy"],
  အကောက်ခွန်: ["customs", "duty", "tariff"],
  ကုန်ဈေးနှုန်း: ["price", "tariff", "rate"],
  ငွေကြေး: ["currency", "monetary", "finance"],
  စီးပွားရေး: ["economy", "economic", "business"],
  ဘဏ်: ["bank", "banking"],
  ရင်းနှီးမြှုပ်နှံမှု: ["investment", "FDI", "capital"],
  ဈေးကွက်: ["market"],
  ဈေးနှုန်း: ["price", "rate"],
  မြန်မာ: ["Myanmar", "Burma"],
  ရေသန့်ဘူး: ["bottled water", "purified water", "beverage"],
  ဆေး: ["medicine", "pharmaceutical", "drug"],
  စားနပ်ရိက္ခာ: ["food", "foodstuff", "commodity"],
  ဆောက်လုပ်ရေး: ["construction", "infrastructure"],
  စက်ရုံ: ["factory", "manufacturing", "industry"],
  ဝင်ငွေ: ["income", "revenue", "earnings"],
  အခွန်: ["tax", "taxation"],
  ကုမ္ပဏီ: ["company", "corporation", "enterprise"],
  HS: ["HS code", "harmonized system"],
};

/** Detects whether a string contains Myanmar Unicode characters */
export function isMyanmarText(text: string): boolean {
  return /[\u1000-\u109F\uAA60-\uAA7F]/.test(text);
}

/**
 * Enhances a Myanmar or English query by appending relevant
 * cross-lingual terms to improve embedding coverage.
 */
export function enhanceQuery(query: string): string {
  if (!query.trim()) return query;

  const additions: string[] = [];

  for (const [mmTerm, engTerms] of Object.entries(MM_TERM_MAP)) {
    if (query.includes(mmTerm)) {
      for (const eng of engTerms) {
        if (!query.toLowerCase().includes(eng.toLowerCase())) {
          additions.push(eng);
        }
      }
    }
  }

  // For pure English queries about Myanmar topics, add "Myanmar" if missing
  const myanmarKeywords = ["myanmar", "burma", "burmese"];
  const hasMyanmar = myanmarKeywords.some(k => query.toLowerCase().includes(k));
  if (!isMyanmarText(query) && !hasMyanmar && additions.length === 0) {
    // Let the query stand as-is — it may be generic enough
  }

  return additions.length > 0
    ? `${query} ${additions.slice(0, 4).join(" ")}`
    : query;
}

// ─────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────

/** Race a promise against a timeout; resolves to fallback on timeout */
async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), ms);
  });
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    return result;
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}

/** Validate that an API key looks real (not a placeholder) */
function isValidApiKey(key: string | undefined): key is string {
  if (!key) return false;
  if (key.includes("***")) return false;
  if (key === "your_openai_api_key") return false;
  if (key.startsWith("sk-") || key.startsWith("sk-proj-")) return true;
  return key.length > 20; // allow custom proxy keys
}

// ─────────────────────────────────────────────────────────────
// News Fetcher (Tavily)
// ─────────────────────────────────────────────────────────────

async function fetchLatestNews(
  query: string,
  maxRetries = 1
): Promise<NewsResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return [];

  // Ensure Myanmar context in news query
  const newsQuery = isMyanmarText(query)
    ? `Myanmar economy trade ${enhanceQuery(query)}`
    : query.toLowerCase().includes("myanmar")
    ? query
    : `Myanmar economy ${query}`;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey,
          query: newsQuery,
          search_depth: "basic",
          include_answer: false,
          max_results: 5,
          topic: "general",
        }),
        signal: AbortSignal.timeout(8_000),
      });

      if (response.status === 429 && attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 1_200 * (attempt + 1)));
        continue;
      }
      if (!response.ok) return [];

      const data = (await response.json()) as {
        results?: Array<{
          title?: string;
          url: string;
          content?: string;
          published_date?: string;
          source?: string;
        }>;
      };

      return (data.results ?? []).map((r) => ({
        title: r.title ?? "Untitled",
        url: r.url,
        snippet: (r.content ?? "").slice(0, 320),
        source: r.source ?? (() => { try { return new URL(r.url).hostname; } catch { return r.url; } })(),
        date: r.published_date ?? new Date().toISOString().split("T")[0],
      }));
    } catch {
      if (attempt === maxRetries) return [];
    }
  }
  return [];
}

// ─────────────────────────────────────────────────────────────
// AI Synthesis (OpenAI, model fallback chain)
// ─────────────────────────────────────────────────────────────

const MODEL_CHAIN = [
  process.env.OPENAI_SUMMARY_MODEL,
  "gpt-4o-mini",
  "gpt-4.1-mini",
  "gpt-4-turbo",
].filter(Boolean) as string[];

async function synthesizeResults(params: {
  query: string;
  internalResults: InternalResult[];
  newsResults: NewsResult[];
  apiKey?: string;
  language?: string;
}): Promise<string> {
  const { query, internalResults, newsResults, apiKey, language } = params;

  const key = apiKey ?? process.env.OPENAI_API_KEY;
  if (!isValidApiKey(key)) {
    return "Unable to synthesize results: missing or invalid OPENAI_API_KEY.";
  }

  const baseUrl = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
  const isMyanmar = isMyanmarText(query) || language === "my";

  // Build context block
  const docContext = internalResults
    .slice(0, 3)
    .map((r, i) => `[Doc ${i + 1}] ${r.title ?? "Untitled"}\n${r.content.slice(0, 500)}`)
    .join("\n\n");

  const newsContext = newsResults
    .slice(0, 3)
    .map((n, i) => `[News ${i + 1}] ${n.title} — ${n.source} (${n.date})\n${n.snippet}`)
    .join("\n\n");

  if (!docContext && !newsContext) {
    return isMyanmar
      ? "သင်၏ရှာဖွေမှုနှင့်ပတ်သက်သည့် သတင်းအချက်အလက် မတွေ့ပါ။"
      : "No relevant information found for your query.";
  }

  const systemPrompt = [
    "You are an expert economic analyst specializing in Myanmar's trade, investment, and regulatory environment.",
    `Respond in ${isMyanmar ? "Myanmar (Burmese) language" : "English"}.`,
    "Be concise, professional, and actionable. Use bullet points only when listing multiple distinct items.",
    "Highlight: regulatory impacts, compliance requirements, market trends, and practical recommendations.",
    "Cite document or news sources inline as [Doc N] or [News N].",
  ].join(" ");

  const userPrompt = `Query: "${query}"

${docContext ? `=== Internal Documents ===\n${docContext}` : ""}
${newsContext ? `\n=== Latest News ===\n${newsContext}` : ""}

Provide a professional analysis. Be specific and actionable.`;

  for (const model of MODEL_CHAIN) {
    try {
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          max_tokens: 900,
          temperature: 0.45,
        }),
        signal: AbortSignal.timeout(18_000),
      });

      if (res.status === 404) continue; // model not available
      if (res.status === 401) return "Invalid OpenAI API key. Please update OPENAI_API_KEY.";
      if (res.status === 429) return "OpenAI rate limit reached. Please retry shortly.";
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({})) as { error?: { message?: string } };
        console.error(`[synthesize] ${model} error ${res.status}:`, errBody?.error?.message);
        continue;
      }

      const data = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const text = data.choices?.[0]?.message?.content?.trim();
      if (text) return text;
    } catch (err) {
      console.error(`[synthesize] ${model} threw:`, err);
      continue;
    }
  }

  return "Summary generation failed after trying all models. Raw results are shown below.";
}

// ─────────────────────────────────────────────────────────────
// Main Orchestrator
// ─────────────────────────────────────────────────────────────

export async function performHybridSearch(
  query: string,
  options: HybridSearchOptions = {}
): Promise<HybridSearchResult> {
  const {
    limit = 5,
    apiKey,
    includeNews = true,
    includeSummary = true,
    language,
    timeout = 25_000,
  } = options;

  const totalStart = Date.now();

  // ── 0. Validate query ──────────────────────────────────────
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      internalResults: [],
      newsResults: [],
      synthesizedSummary: "",
      message: "Please enter a search query.",
    };
  }

  const enhanced = enhanceQuery(trimmed);

  // ── 1. Parallel: internal search + news fetch ──────────────
  const internalStart = Date.now();

  const [internalSettled, newsSettled] = await Promise.allSettled([
    withTimeout(
      semanticSearchDocuments(enhanced, { limit }),
      Math.floor(timeout * 0.55),
      { results: [], message: "Internal search timed out." } as SemanticSearchResult
    ),
    includeNews
      ? withTimeout(fetchLatestNews(trimmed), Math.floor(timeout * 0.45), [] as NewsResult[])
      : Promise.resolve([] as NewsResult[]),
  ]);

  const internalMs = Date.now() - internalStart;

  const internalData: SemanticSearchResult =
    internalSettled.status === "fulfilled"
      ? internalSettled.value
      : { results: [], message: "Internal search failed unexpectedly." };

  const newsResults: NewsResult[] =
    newsSettled.status === "fulfilled"
      ? (newsSettled.value as NewsResult[])
      : [];

  const internalResults = (internalData.results ?? []) as InternalResult[];

  // ── 2. Synthesis ───────────────────────────────────────────
  let synthesizedSummary = "";
  let synthesisMs = 0;

  if (includeSummary) {
    const synthStart = Date.now();
    synthesizedSummary = await withTimeout(
      synthesizeResults({ query: trimmed, internalResults, newsResults, apiKey, language }),
      Math.floor(timeout * 0.6),
      "Summary generation timed out. Please review the raw results below."
    );
    synthesisMs = Date.now() - synthStart;
  }

  // ── 3. Build message ───────────────────────────────────────
  let message: string | null = null;

  if (internalResults.length === 0 && newsResults.length === 0) {
    message = isMyanmarText(trimmed)
      ? "ရှာဖွေမှုရလဒ် မတွေ့ပါ။ ကျေးဇူးပြု၍ အောက်ပါ သော့ချက်စကားများဖြင့် ပြန်လည်ကြိုးစားပါ။"
      : "No results found. Try different keywords or broaden your search.";
  } else if (internalResults.length === 0 && internalData.message) {
    message = internalData.message as string;
  }

  return {
    internalResults,
    newsResults,
    synthesizedSummary,
    message,
    queryEnhanced: enhanced !== trimmed ? enhanced : undefined,
    latency: {
      total: Date.now() - totalStart,
      internal: internalMs,
      news: internalMs, // fetched in parallel with internal
      synthesis: synthesisMs,
    },
  };
}
