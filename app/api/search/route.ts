import { performHybridSearch } from "../../../shared/hybridSearch";

type SearchRequestBody = {
  query?: unknown;
  limit?: unknown;
};

function getSearchPayload(body: SearchRequestBody): { query: string; limit?: number } {
  const query = typeof body.query === "string" ? body.query : "";
  const limit = typeof body.limit === "number" ? body.limit : undefined;

  return { query, limit };
}

export async function POST(request: Request): Promise<Response> {
  let body: SearchRequestBody;

  try {
    body = (await request.json()) as SearchRequestBody;
  } catch {
    return Response.json(
      {
        results: [],
        message: "Invalid JSON body.",
      },
      { status: 400 }
    );
  }

  const { query, limit } = getSearchPayload(body);

  try {
    const response = await performHybridSearch(query, { limit });
    const status = query.trim() ? 200 : 400;
    return Response.json(response, { status });
  } catch (error) {
    return Response.json(
      {
        internalResults: [],
        newsResults: [],
        synthesizedSummary: "",
        message: error instanceof Error ? error.message : "Unexpected search error.",
      },
      { status: 500 }
    );
  }
}
