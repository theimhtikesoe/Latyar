import { semanticSearchDocuments, SemanticSearchResult } from "./semanticSearch";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

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

/**
 * Fetch latest news related to the query using Tavily Search API
 */
async function fetchLatestNews(query: string): Promise<NewsResult[]> {
  const tavilyApiKey = process.env.TAVILY_API_KEY;
  
  if (!tavilyApiKey) {
    console.warn("TAVILY_API_KEY not set, skipping news retrieval");
    return [];
  }

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: tavilyApiKey,
        query: `${query} latest news 2026`,
        include_answer: true,
        max_results: 5,
        include_raw_content: false,
      }),
    });

    if (!response.ok) {
      console.warn(`Tavily API error: ${response.status}`);
      return [];
    }

    const data = (await response.json()) as {
      results?: Array<{
        title: string;
        url: string;
        content: string;
        source: string;
      }>;
    };

    return (data.results ?? []).map((result) => ({
      title: result.title,
      url: result.url,
      snippet: result.content.slice(0, 200),
      source: result.source,
    }));
  } catch (error) {
    console.warn("Failed to fetch news:", error);
    return [];
  }
}

/**
 * Synthesize internal results and news into a comprehensive summary using LLM
 */
async function synthesizeResults(
  query: string,
  internalResults: SemanticSearchResult[],
  newsResults: NewsResult[],
  apiKey?: string
): Promise<string> {
  const effectiveApiKey = apiKey || process.env.OPENAI_API_KEY;

  if (!effectiveApiKey || effectiveApiKey.includes("sk-proj-***")) {
    return "Unable to synthesize results due to missing API key.";
  }

  try {
    const baseURL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
    const openaiInstance = createOpenAI({
      apiKey: effectiveApiKey,
      baseURL: baseURL,
    });

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
Format your response in a professional manner, highlighting key insights from both internal and external sources.
Use the language of the query (Myanmar or English).`;

    const userPrompt = `Query: "${query}"\n\n${internalContext}\n\n${newsContext}\n\nPlease provide a comprehensive summary combining both sources.`;

    const { text } = await generateText({
      model: openaiInstance("gpt-4-turbo"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
    });

    return text;
  } catch (error) {
    console.warn("Failed to synthesize results:", error);
    return "Unable to synthesize results at this time.";
  }
}

/**
 * Perform hybrid search combining internal semantic search with external news
 */
export async function performHybridSearch(
  query: string,
  options?: { limit?: number; apiKey?: string }
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

  try {
    // Fetch internal results from semantic search
    const internalResponse = await semanticSearchDocuments(trimmedQuery, options);
    const internalResults = internalResponse.results ?? [];

    // Fetch external news in parallel
    const newsResults = await fetchLatestNews(trimmedQuery);

    // Synthesize results using LLM
    const synthesizedSummary = await synthesizeResults(
      trimmedQuery,
      internalResults,
      newsResults,
      options?.apiKey
    );

    return {
      internalResults,
      newsResults,
      synthesizedSummary,
      message: internalResponse.message,
    };
  } catch (error) {
    console.error("Hybrid search error:", error);
    return {
      internalResults: [],
      newsResults: [],
      synthesizedSummary: "",
      message: error instanceof Error ? error.message : "Unexpected search error.",
    };
  }
}
