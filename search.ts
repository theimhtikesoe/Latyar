/**
 * api/search.ts — Vercel Serverless Function
 * Robust, typed, with CORS, input sanitisation, and structured error responses.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { performHybridSearch } from "../shared/hybridSearch";

// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────

const MAX_QUERY_LENGTH = 512;
const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 20;

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface SearchRequest {
  query?: unknown;
  limit?: unknown;
  apiKey?: unknown;
  includeNews?: unknown;
  includeSummary?: unknown;
  language?: unknown;
  category?: unknown;
}

interface ErrorResponse {
  internalResults: [];
  newsResults: [];
  synthesizedSummary: string;
  message: string;
  error: true;
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function sanitizeQuery(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw.slice(0, MAX_QUERY_LENGTH).trim();
}

function sanitizeLimit(raw: unknown): number {
  const n = typeof raw === "number" ? raw : parseInt(String(raw ?? ""), 10);
  if (isNaN(n) || n < 1) return DEFAULT_LIMIT;
  return Math.min(n, MAX_LIMIT);
}

function sanitizeBool(raw: unknown, defaultVal: boolean): boolean {
  if (typeof raw === "boolean") return raw;
  if (raw === "true") return true;
  if (raw === "false") return false;
  return defaultVal;
}

function sanitizeString(raw: unknown): string | undefined {
  return typeof raw === "string" && raw.trim().length > 0
    ? raw.trim()
    : undefined;
}

function errorResponse(res: VercelResponse, status: number, message: string): void {
  const body: ErrorResponse = {
    internalResults: [],
    newsResults: [],
    synthesizedSummary: "",
    message,
    error: true,
  };
  res.status(status).json(body);
}

// ─────────────────────────────────────────────────────────────
// Handler
// ─────────────────────────────────────────────────────────────

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // ── CORS preflight ─────────────────────────────────────────
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  // ── Method guard ───────────────────────────────────────────
  if (req.method !== "POST") {
    errorResponse(res, 405, "Method not allowed. Use POST.");
    return;
  }

  // ── Parse body ─────────────────────────────────────────────
  let body: SearchRequest = {};
  try {
    // Vercel auto-parses JSON when Content-Type is application/json
    body = (req.body ?? {}) as SearchRequest;
  } catch {
    errorResponse(res, 400, "Invalid JSON body.");
    return;
  }

  // ── Sanitize inputs ────────────────────────────────────────
  const query = sanitizeQuery(body.query);
  const limit = sanitizeLimit(body.limit);
  const apiKey = sanitizeString(body.apiKey);
  const includeNews = sanitizeBool(body.includeNews, true);
  const includeSummary = sanitizeBool(body.includeSummary, true);
  const language = sanitizeString(body.language);
  const category = sanitizeString(body.category);

  if (!query) {
    errorResponse(res, 400, "Missing required field: query.");
    return;
  }

  // ── Validate environment ───────────────────────────────────
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    errorResponse(
      res,
      503,
      "Search service is currently unavailable due to configuration issues. " +
        "Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment."
    );
    return;
  }

  // ── Execute search ─────────────────────────────────────────
  try {
    const result = await performHybridSearch(query, {
      limit,
      apiKey,
      includeNews,
      includeSummary,
      language,
      category,
      timeout: 24_000,
    });

    // Set cache headers: short TTL so results stay fresh
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Search-Strategy", result.internalResults.length > 0 ? "hybrid" : "news-only");
    if (result.latency) {
      res.setHeader("X-Latency-Total", String(result.latency.total));
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("[api/search] Unhandled error:", err);

    const message =
      err instanceof Error
        ? err.message
        : "An unexpected error occurred. Please try again.";

    errorResponse(res, 500, message);
  }
}
