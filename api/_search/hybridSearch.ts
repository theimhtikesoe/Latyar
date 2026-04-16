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
  
  if (!effectiveApiKey) {
    console.error("❌ OPENAI_API_KEY is not set in environment variables.");
    return "Unable to synthesize results due to missing API key. Please configure OPENAI_API_KEY in your environment.";
  }

  if (effectiveApiKey.includes("sk-proj-***") || effectiveApiKey === "your_openai_api_key") {
    console.error("❌ OPENAI_API_KEY contains placeholder value. Please set a real API key.");
    return "Unable to synthesize results due to invalid API key. Please check your server configuration.";
  }

  console.log("✅ OPENAI_API_KEY is configured. Starting synthesis...");

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

  const systemPrompt = `You are an expert economic analyst specializing in Myanmar's trade and market conditions.
Your goal is to provide a strategic summary based on internal data and latest internet news for the query: "${query}".
Focus on practical insights, current trends, and regulatory impacts in Myanmar.
Always respond in the language used in the query (Myanmar or English).`;

  const userPrompt = `Contextual Query: "${query}" in Myanmar's economic environment.

${internalContext}

${newsContext}

Please synthesize the above information into a professional, actionable summary for a business user. Highlight key takeaways and current status.`;

  for (const modelName of summaryModelCandidates) {
    try {
      console.log(`Attempting synthesis with model: ${modelName}`);
      const { text } = await generateText({
        model: openaiInstance(modelName),
        system: systemPrompt,
        prompt: userPrompt,
        temperature: 0.6,
      });
      console.log(`✅ Successfully synthesized with ${modelName}`);
      return text;
    } catch (error) {
      console.warn(`⚠️ Model ${modelName} failed:`, error instanceof Error ? error.message : error);
    }
  }

  console.error("❌ Failed to synthesize results with all candidate models.");
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
    if (error instanceof Error && error.message === "Synthesis timeout") {
      console.warn("⚠️ Synthesis timed out after 15 seconds");
      synthesizedSummary = shouldSummarize ? "Summary generation is taking longer than expected. Please try again later." : "";
    } else {
      console.error("❌ Synthesis failed:", error instanceof Error ? error.message : error);
      synthesizedSummary = shouldSummarize ? "Summary generation failed. Please try again later." : "";
    }
  }

  return {
    internalResults,
    newsResults,
    synthesizedSummary:
      synthesizedSummary ||
      (shouldSummarize && !options?.apiKey && !process.env.OPENAI_API_KEY ? "Unable to synthesize results due to missing API key. Please configure OPENAI_API_KEY in your environment." : ""),
    message: internalResponse.message,
  };
}
