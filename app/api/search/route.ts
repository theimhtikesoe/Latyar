import { performHybridSearch } from "../../../shared/hybridSearch";

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

export async function POST(request: Request): Promise<Response> {
  let body: SearchRequestBody;

  try {
    body = (await request.json()) as SearchRequestBody;
  } catch {
    return Response.json(
      {
        internalResults: [],
        newsResults: [],
        synthesizedSummary: "",
        message: "Invalid JSON body.",
      },
      { status: 400 }
    );
  }

  const { query, limit, apiKey, includeNews, includeSummary } = getSearchPayload(body);

  try {
    const response = await performHybridSearch(query, { limit, apiKey, includeNews, includeSummary });
    const status = query.trim() ? 200 : 400;
    return Response.json(response, { status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected search error.";
    console.error("Search API Error:", message);
    return Response.json(
      {
        internalResults: [],
        newsResults: [],
        synthesizedSummary: "",
        message: `Search failed: ${message}. Check your environment variables (OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, TAVILY_API_KEY).`,
      },
      { status: 500 }
    );
  }
}
