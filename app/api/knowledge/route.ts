import {
  knowledgeRequestSchema,
  listKnowledgeEntries,
  previewKnowledgeEntry,
  saveKnowledgeEntry,
} from "../../../../shared/knowledge";

export async function GET(): Promise<Response> {
  try {
    const knowledge = await listKnowledgeEntries();
    return Response.json({ knowledge }, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        knowledge: [],
        message: error instanceof Error ? error.message : "Failed to load knowledge entries.",
      },
      { status: 500 }
    );
  }
}

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
    if (parsed.data.mode === "preview") {
      const preview = await previewKnowledgeEntry(parsed.data.content, parsed.data.language);
      return Response.json({ preview }, { status: 200 });
    }

    const knowledge = await saveKnowledgeEntry(parsed.data.content, parsed.data.language);
    return Response.json({ knowledge }, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Knowledge update failed.",
      },
      { status: 500 }
    );
  }
}
