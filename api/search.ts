import type { VercelRequest, VercelResponse } from "@vercel/node";
import { performHybridSearch } from "./_search/hybridSearch.js";

type SearchRequestBody = {
  query?: unknown;
  limit?: unknown;
  apiKey?: unknown;
  includeNews?: unknown;
  includeSummary?: unknown;
};

function getSearchPayload(body: SearchRequestBody): {
  query: string;
  limit?: number;
  apiKey?: string;
  includeNews?: boolean;
  includeSummary?: boolean;
} {
  const query = typeof body.query === "string" ? body.query : "";
  const limit = typeof body.limit === "number" ? body.limit : undefined;
  const apiKey = typeof body.apiKey === "string" ? body.apiKey : undefined;
  const includeNews = typeof body.includeNews === "boolean" ? body.includeNews : undefined;
  const includeSummary = typeof body.includeSummary === "boolean" ? body.includeSummary : undefined;

  return { query, limit, apiKey, includeNews, includeSummary };
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({
      internalResults: [],
      newsResults: [],
      synthesizedSummary: "",
      message: "Method not allowed. Use POST.",
    });
    return;
  }

  const body = (req.body ?? {}) as SearchRequestBody;
  const { query, limit, apiKey, includeNews, includeSummary } = getSearchPayload(body);

  try {
    const response = await performHybridSearch(query, { limit, apiKey, includeNews, includeSummary });
    const status = query.trim() ? 200 : 400;
    res.status(status).json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected search error.";
    console.error("Search API Error:", message);
    res.status(500).json({
      internalResults: [],
      newsResults: [],
      synthesizedSummary: "",
      message: `Search failed: ${message}. Check your environment variables (OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).`,
    });
  }
}
