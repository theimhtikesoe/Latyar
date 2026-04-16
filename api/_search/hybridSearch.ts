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
  directAnswer?: string;
  message?: string;
};

async function fetchLatestNews(query: string): Promise<NewsResult[]> {
  const tavilyApiKey = process.env.TAVILY_API_KEY;
  if (!tavilyApiKey) return [];

  try {
    // Enhance query with Myanmar economy context for better results
    const enhancedQuery = `${query} Myanmar economy trade market 2024 2025`;
    
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: tavilyApiKey,
        query: enhancedQuery,
        include_answer: true,
        max_results: 10,
        include_raw_content: true,
        search_depth: "advanced",
      }),
    });

    if (!response.ok) return [];

    const data = (await response.json()) as {
      results?: Array<{ title: string; url: string; content: string; source: string }>;
      answer?: string;
    };

    const results = (data.results ?? []).map((result) => ({
      title: result.title,
      url: result.url,
      snippet: result.content.slice(0, 300), // Increased snippet length for more context
      source: result.source,
    }));
    
    console.log(`✅ Fetched ${results.length} news results for query: "${query}"`);
    return results;
  } catch {
    return [];
  }
}

async function synthesizeResults(
  query: string,
  internalResults: SemanticSearchResult[],
  newsResults: NewsResult[],
  apiKey?: string,
  language?: string
): Promise<{ summary: string; directAnswer?: string }> {
  const effectiveApiKey = apiKey || process.env.OPENAI_API_KEY;
  
  if (!effectiveApiKey) {
    console.error("❌ OPENAI_API_KEY is not set in environment variables.");
    return { summary: "Unable to synthesize results due to missing API key. Please configure OPENAI_API_KEY in your environment." };
  }

  if (effectiveApiKey.includes("sk-proj-***") || effectiveApiKey === "your_openai_api_key") {
    console.error("❌ OPENAI_API_KEY contains placeholder value. Please set a real API key.");
    return { summary: "Unable to synthesize results due to invalid API key. Please check your server configuration." };
  }

  console.log("✅ OPENAI_API_KEY is configured. Starting synthesis...");

  const baseURL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const openaiInstance = createOpenAI({ apiKey: effectiveApiKey, baseURL });

  const isMyanmar = language === "my";
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

  const systemPrompt = `You are an expert economic analyst specializing in Myanmar's trade, commerce, and market conditions.
Your goal is to provide a comprehensive, strategic summary based on internal documentation and the latest internet news.
Query: "${query}"

Analysis Framework:
1. Current Market Status: Provide up-to-date information about the query topic in Myanmar's economy
2. Key Trends: Identify emerging patterns and shifts in the market
3. Regulatory Environment: Explain relevant policies, regulations, and compliance requirements
4. Economic Implications: Assess impact on Myanmar's economy, trade, and business environment
5. Risk Factors: Highlight potential challenges and opportunities
6. Recommendations: Provide actionable insights for business decision-making

Response Guidelines:
- Always respond in ${isMyanmar ? "Myanmar" : "English"} language
- Use specific data points and recent news when available
- Highlight key takeaways and current status
- Focus on practical, business-relevant information
- Be concise but comprehensive
- If the query asks for specific numbers (prices, rates, etc.), provide them clearly at the beginning`;

  const userPrompt = `Analyze the following query in the context of Myanmar's economy and trade:

Query: "${query}"

${internalContext}

${newsContext}

Based on the above internal documentation and latest news, provide a comprehensive analysis that includes:
1. Current situation and market status
2. Key developments and recent news
3. Regulatory and policy context
4. Economic implications and trends
5. Risks and opportunities
6. Practical recommendations for stakeholders

${isMyanmar ? "အကျဉ်းချုပ်ကို အလုပ်သမားများ၊ ကုန်သည်များ၊ ရင်းနှီးမြုပ်နှံသူများအတွက် အသုံးပြုနိုင်သော ပရော်ဖက်ရှင်နယ် အချက်အလက်အခြေခံ အကျဉ်းချုပ်ပြုလုပ်ပါ။" : "Provide a professional, data-driven summary suitable for business decision-makers."}`;

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
      
      // Extract direct answer if query asks for specific information
      let directAnswer: string | undefined;
      if (text && (query.toLowerCase().includes("price") || query.toLowerCase().includes("rate") || query.toLowerCase().includes("cost") || query.includes("စျေး") || query.includes("နှုန်း"))) {
        const lines = text.split('\n');
        if (lines.length > 0) {
          directAnswer = lines[0];
        }
      }
      
      return { summary: text, directAnswer };
    } catch (error) {
      console.warn(`⚠️ Model ${modelName} failed:`, error instanceof Error ? error.message : error);
    }
  }

  console.error("❌ Failed to synthesize results with all candidate models.");
  return { summary: "" };
}

export async function performHybridSearch(
  query: string,
  options?: { limit?: number; apiKey?: string; includeNews?: boolean; includeSummary?: boolean; language?: string }
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
    ? synthesizeResults(trimmedQuery, internalResults, newsResults, options?.apiKey, options?.language)
    : Promise.resolve({ summary: "", directAnswer: undefined });

  const timeoutPromise = new Promise<{ summary: string; directAnswer?: string }>((_, reject) =>
    setTimeout(() => reject(new Error("Synthesis timeout")), 15000)
  );

  let synthesisResult = { summary: "", directAnswer: undefined };
  try {
    synthesisResult = await Promise.race([synthesisPromise, timeoutPromise]);
  } catch (error) {
    if (error instanceof Error && error.message === "Synthesis timeout") {
      console.warn("⚠️ Synthesis timed out after 15 seconds");
      synthesisResult = shouldSummarize ? { summary: "Summary generation is taking longer than expected. Please try again later." } : { summary: "" };
    } else {
      console.error("❌ Synthesis failed:", error instanceof Error ? error.message : error);
      synthesisResult = shouldSummarize ? { summary: "Summary generation failed. Please try again later." } : { summary: "" };
    }
  }

  return {
    internalResults,
    newsResults,
    synthesizedSummary: synthesisResult.summary,
    directAnswer: synthesisResult.directAnswer,
    message: internalResponse.message,
  };
}
