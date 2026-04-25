import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  knowledgeRequestSchema,
  listKnowledgeEntries,
  previewKnowledgeEntry,
  saveKnowledgeEntry,
} from "../shared/knowledge.js";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method === "GET") {
    try {
      const knowledge = await listKnowledgeEntries();
      res.status(200).json({ knowledge });
    } catch (error) {
      res.status(500).json({
        knowledge: [],
        message: error instanceof Error ? error.message : "Failed to load knowledge entries.",
      });
    }
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    res.status(405).json({ message: "Method not allowed. Use GET or POST." });
    return;
  }

  const parsed = knowledgeRequestSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid request body." });
    return;
  }

  try {
    if (parsed.data.mode === "preview") {
      const preview = await previewKnowledgeEntry(parsed.data.content, parsed.data.language);
      res.status(200).json({ preview });
      return;
    }

    const knowledge = await saveKnowledgeEntry(parsed.data.content, parsed.data.language);
    res.status(200).json({ knowledge });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Knowledge update failed.",
    });
  }
}

