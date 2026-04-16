import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createSupabaseClient } from "./_search/supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ message: "Method not allowed. Use GET." });
    return;
  }

  const id = typeof req.query?.id === "string" ? req.query.id : "";
  if (!id.trim()) {
    res.status(400).json({ message: "Missing required query parameter: id" });
    return;
  }

  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("documents")
      .select("id, title, content, metadata")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      res.status(500).json({ message: error.message });
      return;
    }

    if (!data) {
      res.status(404).json({ message: "Document not found." });
      return;
    }

    res.status(200).json({
      id: String(data.id),
      title: typeof data.title === "string" ? data.title : null,
      content: typeof data.content === "string" ? data.content : "",
      metadata: (data.metadata as Record<string, unknown> | null) ?? null,
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Unexpected document fetch error.",
    });
  }
}
