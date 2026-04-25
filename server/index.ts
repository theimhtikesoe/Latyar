import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { performHybridSearch } from "../shared/hybridSearch";
import {
  knowledgeRequestSchema,
  listKnowledgeEntries,
  previewKnowledgeEntry,
  saveKnowledgeEntry,
} from "../shared/knowledge";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);
  app.use(express.json());

  app.post("/api/search", async (req, res) => {
    const query = typeof req.body?.query === "string" ? req.body.query : "";
    const limit = typeof req.body?.limit === "number" ? req.body.limit : undefined;
    const apiKey = typeof req.body?.apiKey === "string" ? req.body.apiKey : undefined;

    try {
      const response = await performHybridSearch(query, { limit, apiKey });
      const status = query.trim() ? 200 : 400;
      res.status(status).json(response);
    } catch (error) {
      res.status(500).json({
        internalResults: [],
        newsResults: [],
        synthesizedSummary: "",
        message: error instanceof Error ? error.message : "Unexpected search error.",
      });
    }
  });

  app.get("/api/knowledge", async (_req, res) => {
    try {
      const knowledge = await listKnowledgeEntries();
      res.status(200).json({ knowledge });
    } catch (error) {
      res.status(500).json({
        knowledge: [],
        message: error instanceof Error ? error.message : "Failed to load knowledge entries.",
      });
    }
  });

  app.post("/api/knowledge", async (req, res) => {
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
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
