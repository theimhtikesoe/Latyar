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
        query: `${query} latest news`,
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

  if (!effectiveApiKey || effectiveApiKey.includes("sk-proj-***") || effectiveApiKey === "your_openai_api_key") {
    console.error("OpenAI API Key is missing or invalid in environment variables.");
    return "Unable to synthesize results due to missing API key. Please check your server configuration.";
  }

  try {
    const baseURL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
    const openaiInstance = createOpenAI({
      apiKey: effectiveApiKey,
      baseURL: baseURL,
    });

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

    const systemPrompt = `You are an expert economic analyst specializing in Myanmar's trade and market conditions.
Your goal is to provide a strategic summary based on internal data and latest internet news for the query: "${query}".
Focus on practical insights, current trends, regulatory impacts, and economic implications in Myanmar.
Always respond in the language used in the query (Myanmar or English).
Highlight key takeaways and current status relevant to Myanmar's economy.`;

    const userPrompt = `Contextual Query: "${query}" in Myanmar's economic environment.

${internalContext}

${newsContext}

Please synthesize the above information into a professional, actionable summary for a business user. Highlight key takeaways, current status, and implications for Myanmar's economy.`;

    let lastError: unknown = null;
    for (const modelName of summaryModelCandidates) {
      try {
        const { text } = await generateText({
          model: openaiInstance(modelName),
          system: systemPrompt,
          prompt: userPrompt,
          temperature: 0.6,
        });
        return text;
      } catch (error) {
        lastError = error;
      }
    }

    console.warn("Failed to synthesize results with all candidate models:", lastError);
    return "Unable to synthesize results at this time.";
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

  try {
    // Fetch internal results and news in parallel for better performance
    const [internalResponse, newsResults] = await Promise.all([
      semanticSearchDocuments(trimmedQuery, options),
      includeNews ? fetchLatestNews(trimmedQuery) : Promise.resolve([] as NewsResult[]),
    ]);

    const internalResults = internalResponse.results ?? [];

    // Synthesize results using LLM only if requested and we have content to synthesize
    const shouldSummarize = includeSummary && (internalResults.length > 0 || newsResults.length > 0);
    
    // Add a timeout to synthesis to prevent long waits
    const synthesisPromise = shouldSummarize
      ? synthesizeResults(trimmedQuery, internalResults, newsResults, options?.apiKey)
      : Promise.resolve("");

    const timeoutPromise = new Promise<string>((_, reject) =>
      setTimeout(() => reject(new Error("Synthesis timeout")), 15000)
    );

    let synthesizedSummary = "";
    try {
      synthesizedSummary = await Promise.race([synthesisPromise, timeoutPromise]);
    } catch (error) {
      console.warn("Synthesis failed or timed out:", error);
      synthesizedSummary = shouldSummarize ? "Summary generation is taking longer than expected. Please try again later." : "";
    }

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
