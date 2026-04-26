import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

function createSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey =
    process.env.SUPABASE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "";

  if (!supabaseUrl || !supabaseKey) {
    const missing = [];
    if (!supabaseUrl) missing.push("SUPABASE_URL");
    if (!supabaseKey) missing.push("SUPABASE_KEY (or SUPABASE_ANON_KEY)");
    
    const errorMsg = `Missing Supabase configuration: ${missing.join(", ")}. Please check your environment variables.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
}

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
