import { createOpenAI } from "@ai-sdk/openai";
import { createClient } from "@supabase/supabase-js";
import { embed, generateObject } from "ai";
import { z } from "zod";

const knowledgeDraftSchema = z.object({
  title: z.string().min(2).max(300),
  shortDescription: z.string().min(5).max(1000),
  summaryBullets: z.array(z.string().min(5).max(2000)).min(1).max(20),
});

const previewRequestSchema = z.object({
  mode: z.literal("preview"),
  content: z.string().min(40).max(50_000),
  language: z.enum(["my", "en"]).optional(),
});

const saveRequestSchema = z.object({
  mode: z.literal("save"),
  content: z.string().min(40).max(50_000),
  language: z.enum(["my", "en"]).optional(),
});

export const knowledgeRequestSchema = z.discriminatedUnion("mode", [
  previewRequestSchema,
  saveRequestSchema,
]);

export type KnowledgeRequest = z.infer<typeof knowledgeRequestSchema>;

export type KnowledgeCard = {
  id: string;
  title: string;
  shortDescription: string;
  summaryBullets: string[];
  content: string;
  createdAt: string | null;
};

type KnowledgeDraft = z.infer<typeof knowledgeDraftSchema>;

type DocumentInsert = {
  title: string;
  content: string;
  metadata: Record<string, unknown>;
  embedding: number[];
};

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "";

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
}

function getOpenAIInstance(apiKey?: string) {
  const effectiveApiKey = apiKey || process.env.OPENAI_API_KEY;
  if (!effectiveApiKey || effectiveApiKey.includes("sk-proj-***") || effectiveApiKey === "your_openai_api_key") {
    throw new Error("Missing valid OPENAI_API_KEY.");
  }

  const baseURL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  return createOpenAI({
    apiKey: effectiveApiKey,
    baseURL,
  });
}

function normalizeContent(content: string) {
  return content.replace(/\r\n/g, "\n").trim();
}

function getKnowledgeModel() {
  return process.env.OPENAI_SUMMARY_MODEL || "gpt-4o-mini";
}

function getEmbeddingModel() {
  return process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";
}

function fallbackTitle(content: string) {
  const sentence = content.split(/[\n.!?]/).map((part) => part.trim()).find(Boolean) || "Knowledge Note";
  return sentence.length > 72 ? `${sentence.slice(0, 69).trim()}...` : sentence;
}

function fallbackShortDescription(content: string) {
  const normalized = content.replace(/\s+/g, " ").trim();
  if (normalized.length <= 160) return normalized;
  return `${normalized.slice(0, 157).trim()}...`;
}

function fallbackBullets(content: string) {
  return content
    .split(/\n+/)
    .map((line) => line.replace(/^[\s\-*•\d.)]+/, "").trim())
    .filter((line) => line.length > 12)
    .slice(0, 4);
}

export async function generateKnowledgeDraft(
  content: string,
  language: "my" | "en" = "my",
  apiKey?: string
): Promise<KnowledgeDraft> {
  const normalized = normalizeContent(content);
  const openai = getOpenAIInstance(apiKey);

  try {
    const result = await generateObject({
      model: openai(getKnowledgeModel()),
      schema: knowledgeDraftSchema,
      temperature: 0.4,
      system:
        language === "my"
          ? "You are an expert knowledge curator for a Myanmar trade intelligence platform. Your goal is to extract EVERY important detail, regulation, and procedural step from the source text. Do not provide a brief overview; provide a deep, technical, and comprehensive summary in Myanmar."
          : "You are an expert knowledge curator for a trade intelligence platform. Your goal is to extract EVERY important detail, regulation, and procedural step from the source text. Do not provide a brief overview; provide a deep, technical, and comprehensive summary in English.",
      prompt:
        language === "my"
          ? `အောက်ပါ စာသားမှ အရေးကြီးသောအချက်အလက်များ အားလုံးကို အသေးစိတ်ထုတ်ယူပြီး JSON format ဖြင့် ပြန်ပေးပါ။

Requirements:
- title: စာသား၏ အကြောင်းအရာကို တိကျစွာ ဖော်ပြသော ခေါင်းစဉ်
- shortDescription: စာသားတစ်ခုလုံး၏ အနှစ်ချုပ်ကို ဖော်ပြသော ပြည့်စုံသည့် အပိုဒ် (အနည်းဆုံး စာလုံးရေ ၅၀)
- summaryBullets: အရေးကြီးသော အချက်အလက်များ၊ ကိန်းဂဏန်းများ၊ လုပ်ထုံးလုပ်နည်းများနှင့် စည်းမျဉ်းများ အားလုံးကို တစ်ခုချင်းစီ အသေးစိတ် ရေးသားထားသော list (အနည်းဆုံး ၅ ခုမှ ၁၅ ခုအထိ)
- **အရေးကြီးသည်**: မူရင်းစာသားထဲရှိ အချက်အလက်များ တစ်ခုမှ မကျန်စေဘဲ အသေးစိတ် ရေးသားပေးရန် လိုအပ်သည်။
- Myanmar language ဖြင့်သာ ရေးသားပါ။

Text:
${normalized}`
          : `Extract ALL important details, technical specs, regulations, and procedural steps from the text below and return them in JSON format.

Requirements:
- title: A precise and informative title for the content.
- shortDescription: A comprehensive paragraph summarizing the entire text (at least 50 words).
- summaryBullets: A detailed list of ALL key facts, numbers, procedures, and regulations found in the text (provide between 5 to 15 detailed bullets).
- **CRITICAL**: Do not omit any technical details or important facts. The goal is a complete extraction, not a high-level summary.
- Write in English.

Text:
${normalized}`,
    });

    return result.object;
  } catch {
    const fallback = fallbackBullets(normalized);
    return {
      title: fallbackTitle(normalized),
      shortDescription: fallbackShortDescription(normalized),
      summaryBullets: fallback.length >= 3 ? fallback : [fallbackShortDescription(normalized), "Source text saved for semantic retrieval.", "Review the original text for full detail."],
    };
  }
}

export async function createKnowledgeEmbedding(content: string, apiKey?: string): Promise<number[]> {
  const openai = getOpenAIInstance(apiKey);
  const { embedding } = await embed({
    model: openai.embedding(getEmbeddingModel()),
    value: normalizeContent(content),
  });
  return embedding;
}

async function insertKnowledgeDocument(input: DocumentInsert) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("documents")
    .insert({
      title: input.title,
      content: input.content,
      metadata: input.metadata,
      embedding: input.embedding,
    })
    .select("id, title, content, metadata, created_at")
    .single();

  if (error) {
    throw new Error(`Failed to save knowledge entry: ${error.message}`);
  }

  return data as {
    id: string | number;
    title: string | null;
    content: string | null;
    metadata: Record<string, unknown> | null;
  };
}

function mapDocumentToCard(row: {
  id: string | number;
  title: string | null;
  content: string | null;
  metadata: Record<string, unknown> | null;
  created_at?: string | null;
}): KnowledgeCard | null {
  const metadata = row.metadata ?? {};
  const summaryBullets = Array.isArray(metadata.summaryBullets)
    ? metadata.summaryBullets.filter((item): item is string => typeof item === "string")
    : [];
  const shortDescription = typeof metadata.shortDescription === "string" ? metadata.shortDescription : "";

  if (!row.title || !row.content) {
    return null;
  }

  return {
    id: String(row.id),
    title: row.title || "Untitled Knowledge",
    shortDescription,
    summaryBullets,
    content: row.content || "",
    createdAt: row.created_at ?? null,
  };
}

export async function saveKnowledgeEntry(
  content: string,
  language: "my" | "en" = "my",
  apiKey?: string
): Promise<KnowledgeCard> {
  const normalized = normalizeContent(content);
  
  // Attempt to generate draft and embedding
  // If embedding fails (e.g. quota), we still want to save the text for keyword search
  const draft = await generateKnowledgeDraft(normalized, language, apiKey);
  
  let embedding: number[] = [];
  try {
    embedding = await createKnowledgeEmbedding(normalized, apiKey);
  } catch (error) {
    console.error("Embedding generation failed, saving with empty embedding:", error);
    // Create a zero vector of the expected dimension (1536 for text-embedding-3-small)
    embedding = new Array(1536).fill(0);
  }

  const saved = await insertKnowledgeDocument({
    title: draft.title,
    content: normalized,
    embedding,
    metadata: {
      shortDescription: draft.shortDescription,
      summaryBullets: draft.summaryBullets,
      source: "knowledge-dashboard",
      language,
      updatedAt: new Date().toISOString(),
      embedding_error: embedding.every(v => v === 0) ? "quota_exceeded" : undefined,
    },
  });

  return {
    id: String(saved.id),
    title: saved.title || draft.title,
    shortDescription: draft.shortDescription,
    summaryBullets: draft.summaryBullets,
    content: saved.content || normalized,
    createdAt: (saved as any).created_at ?? new Date().toISOString(),
  };
}

export async function previewKnowledgeEntry(
  content: string,
  language: "my" | "en" = "my",
  apiKey?: string
): Promise<Omit<KnowledgeCard, "id" | "createdAt">> {
  const normalized = normalizeContent(content);
  const draft = await generateKnowledgeDraft(normalized, language, apiKey);
  return {
    title: draft.title,
    shortDescription: draft.shortDescription,
    summaryBullets: draft.summaryBullets,
    content: normalized,
  };
}

export async function listKnowledgeEntries(limit = 12): Promise<KnowledgeCard[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("documents")
    .select("id, title, content, metadata, created_at")
    .order("id", { ascending: false })
    .limit(Math.max(1, Math.min(limit, 50)));

  if (error) {
    throw new Error(`Failed to load knowledge entries: ${error.message}`);
  }

  return ((data ?? []) as Array<{
    id: string | number;
    title: string | null;
    content: string | null;
    metadata: Record<string, unknown> | null;
    created_at?: string | null;
  }>)
    .map(mapDocumentToCard)
    .filter((item): item is KnowledgeCard => item !== null);
}
