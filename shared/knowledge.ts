import { createOpenAI } from "@ai-sdk/openai";
import { createClient } from "@supabase/supabase-js";
import { embed, generateObject } from "ai";
import { z } from "zod";

const knowledgeDraftSchema = z.object({
  title: z.string().min(6).max(120),
  shortDescription: z.string().min(12).max(220),
  summaryBullets: z.array(z.string().min(8).max(280)).min(3).max(6),
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
          ? "You are an expert knowledge curator for a Myanmar trade intelligence platform. Produce concise, professional Myanmar copy. Return only facts grounded in the provided text."
          : "You are an expert knowledge curator for a trade intelligence platform. Produce concise, professional English copy. Return only facts grounded in the provided text.",
      prompt:
        language === "my"
          ? `အောက်ပါ စာသားကို knowledge base ထဲထည့်သွင်းရန် အတွက် JSON field ၃ ခု ထုတ်ပေးပါ။

Requirements:
- title ကို catchy ဖြစ်အောင် ရေးပါ
- shortDescription ကို 1 sentence ပဲ ရေးပါ
- summaryBullets ကို 3 to 6 bullet points အဖြစ် ရေးပါ
- မူရင်းစာသားထဲမပါတဲ့ အချက်အလက် မထည့်ပါ
- Myanmar language ဖြင့် ရေးပါ

Text:
${normalized}`
          : `Create three JSON fields for a knowledge-base entry from the text below.

Requirements:
- Make the title catchy but professional
- Keep shortDescription to one sentence
- Write 3 to 6 concise bullet points in summaryBullets
- Do not invent facts not present in the source text
- Write in English

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
    .select("id, title, content, metadata")
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
}): KnowledgeCard | null {
  const metadata = row.metadata ?? {};
  const summaryBullets = Array.isArray(metadata.summaryBullets)
    ? metadata.summaryBullets.filter((item): item is string => typeof item === "string")
    : [];
  const shortDescription = typeof metadata.shortDescription === "string" ? metadata.shortDescription : "";
  const source = typeof metadata.source === "string" ? metadata.source : "";

  if (source !== "knowledge-dashboard") {
    return null;
  }

  return {
    id: String(row.id),
    title: row.title || "Untitled Knowledge",
    shortDescription,
    summaryBullets,
    content: row.content || "",
    createdAt: null,
  };
}

export async function saveKnowledgeEntry(
  content: string,
  language: "my" | "en" = "my",
  apiKey?: string
): Promise<KnowledgeCard> {
  const normalized = normalizeContent(content);
  const [draft, embedding] = await Promise.all([
    generateKnowledgeDraft(normalized, language, apiKey),
    createKnowledgeEmbedding(normalized, apiKey),
  ]);

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
    },
  });

  return {
    id: String(saved.id),
    title: saved.title || draft.title,
    shortDescription: draft.shortDescription,
    summaryBullets: draft.summaryBullets,
    content: saved.content || normalized,
    createdAt: null,
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
    .select("id, title, content, metadata")
    .limit(Math.max(1, Math.min(limit, 50)));

  if (error) {
    throw new Error(`Failed to load knowledge entries: ${error.message}`);
  }

  return ((data ?? []) as Array<{
    id: string | number;
    title: string | null;
    content: string | null;
    metadata: Record<string, unknown> | null;
  }>)
    .map(mapDocumentToCard)
    .filter((item): item is KnowledgeCard => item !== null)
    .reverse();
}
