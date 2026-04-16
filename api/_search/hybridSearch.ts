import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { semanticSearchDocuments, type SemanticSearchResult } from "./semanticSearch.js";

export type NewsResult = {
  title: string;
  url: string;
  snippet: string;
  source: string;
  date?: string;
};

export type HybridSearchResult = {
  internalResults: SemanticSearchResult[];
  newsResults: NewsResult[];
  synthesizedSummary: string;
  message?: string;
};

async function fetchLatestNews(query: string): Promise<NewsResult[]> {
  const tavilyApiKey = process.env.TAVILY_API_KEY;
  if (!tavilyApiKey) return [];

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: tavilyApiKey,
        query: `${query} latest news`,
        include_answer: false,
        max_results: 5,
        include_raw_content: false,
      }),
    });

    if (!response.ok) return [];

    const data = (await response.json()) as {
      results?: Array<{ title: string; url: string; content: string; source: string }>;
    };

    return (data.results ?? []).map((result) => ({
      title: result.title,
      url: result.url,
      snippet: result.content.slice(0, 200),
      source: result.source,
    }));
  } catch {
    return [];
  }
}

async function synthesizeResults(
  query: string,
  internalResults: SemanticSearchResult[],
  newsResults: NewsResult[],
  apiKey?: string
): Promise<string> {
  const effectiveApiKey = apiKey || process.env.OPENAI_API_KEY;
  if (!effectiveApiKey) return "";

  const baseURL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const openaiInstance = createOpenAI({ apiKey: effectiveApiKey, baseURL });

  const summaryModelCandidates = [
    process.env.OPENAI_SUMMARY_MODEL,
    "gpt-4o-mini",
    "gpt-4.1-mini",
    "gpt-4-turbo",
  ].filter((model): model is string => Boolean(model && model.trim()));

  const internalContext =
    internalResults.length > 0
      ? `Internal Documentation:\n${internalResults
          .map((r) => `- ${r.title || "Untitled"}: ${r.content}`)
          .join("\n")}`
      : "No internal documentation found.";

  const newsContext =
    newsResults.length > 0
      ? `Latest News:\n${newsResults
          .map((n) => `- ${n.title} (${n.source}): ${n.snippet}`)
          .join("\n")}`
      : "No recent news found.";

  const systemPrompt = `You are a helpful assistant that synthesizes information from internal documentation and external news sources.
Provide a clear, concise summary that combines both sources to answer the user's query about "${query}".
Use the language of the query (Myanmar or English).`;

  const userPrompt = `Query: "${query}"\n\n${internalContext}\n\n${newsContext}\n\nPlease provide a comprehensive summary combining both sources.`;

  for (const modelName of summaryModelCandidates) {
    try {
      const { text } = await generateText({
        model: openaiInstance(modelName),
        system: systemPrompt,
        prompt: userPrompt,
        temperature: 0.6,
      });
      return text;
    } catch {
      // try next
    }
  }

  return "";
}

export async function performHybridSearch(
  query: string,
  options?: { limit?: number; apiKey?: string; includeNews?: boolean; includeSummary?: boolean }
): Promise<HybridSearchResult> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return {
      internalResults: [],
      newsResults: [],
      synthesizedSummary: "",
      message: "Please provide a query before searching.",
    };
  }

  const includeNews = options?.includeNews ?? true;
  const includeSummary = options?.includeSummary ?? true;

  const [internalResponse, newsResults] = await Promise.all([
    semanticSearchDocuments(trimmedQuery, options),
    includeNews ? fetchLatestNews(trimmedQuery) : Promise.resolve([] as NewsResult[]),
  ]);

  const internalResults = internalResponse.results ?? [];

  const shouldSummarize = includeSummary && (internalResults.length > 0 || newsResults.length > 0);
  const synthesizedSummary = shouldSummarize
    ? await synthesizeResults(trimmedQuery, internalResults, newsResults, options?.apiKey)
    : "";

  return {
    internalResults,
    newsResults,
    synthesizedSummary:
      synthesizedSummary ||
      (shouldSummarize && options?.apiKey ? "" : "Unable to synthesize results due to missing API key."),
    message: internalResponse.message,
  };
}
