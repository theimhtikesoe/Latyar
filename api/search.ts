import type { VercelRequest, VercelResponse } from "@vercel/node";
import { semanticSearchDocuments } from "../shared/semanticSearch";

type SearchRequestBody = {
  query?: unknown;
  limit?: unknown;
};

function getSearchPayload(body: SearchRequestBody): { query: string; limit?: number } {
  const query = typeof body.query === "string" ? body.query : "";
  const limit = typeof body.limit === "number" ? body.limit : undefined;

  return { query, limit };
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({
      results: [],
      message: "Method not allowed. Use POST.",
    });
    return;
  }

  const body = (req.body ?? {}) as SearchRequestBody;
  const { query, limit } = getSearchPayload(body);

  try {
    const response = await semanticSearchDocuments(query, { limit });
    const status = query.trim() ? 200 : 400;
    res.status(status).json(response);
  } catch (error) {
    res.status(500).json({
      results: [],
      message: error instanceof Error ? error.message : "Unexpected search error.",
    });
  }
}
