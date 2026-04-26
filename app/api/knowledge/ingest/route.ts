import {
  knowledgeRequestSchema,
  saveKnowledgeEntry,
} from "../../../../../shared/knowledge.js";

export async function POST(request: Request): Promise<Response> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = knowledgeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  try {
    // This route is specifically for ingestion/saving
    if (parsed.data.mode !== "save") {
      return Response.json({ message: "This endpoint only supports 'save' mode." }, { status: 400 });
    }

    const knowledge = await saveKnowledgeEntry(parsed.data.content, parsed.data.language);
    return Response.json({ knowledge }, { status: 200 });
  } catch (error) {
    console.error("Ingest API error:", error);
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Knowledge ingestion failed.",
      },
      { status: 500 }
    );
  }
}
