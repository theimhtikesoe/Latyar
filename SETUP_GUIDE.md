# LatYar Myanmar Economy Search - Setup Guide

## Quick Start

This guide will help you set up the Myanmar Economy Search feature with all necessary API keys and configurations.

## Step 1: Get OpenAI API Key

### Create OpenAI Account
1. Visit [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in to your account
3. Navigate to "API keys" section
4. Click "Create new secret key"
5. Copy and save the key (you won't see it again)

### Required Models
- **Embedding Model**: `text-embedding-3-small` (default)
- **Summary Model**: `gpt-4o-mini` (default, with fallback to `gpt-4.1-mini`)

### Pricing
- Embeddings: $0.02 per 1M tokens
- GPT-4o mini: $0.15 per 1M input tokens, $0.60 per 1M output tokens

## Step 2: Get Tavily Search API Key

### Create Tavily Account
1. Visit [Tavily AI](https://tavily.com)
2. Sign up for an account
3. Go to Dashboard → API Keys
4. Copy your API key

### Configuration
- Used for fetching latest news about Myanmar economy
- Supports Myanmar language queries
- Returns up to 5 results per search

## Step 3: Setup Supabase Database

### Create Supabase Project
1. Visit [Supabase](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Choose a region (recommended: Singapore for Asia)
5. Set a secure database password

### Get Connection Details
1. Go to Project Settings → Database
2. Copy the **Project URL** (SUPABASE_URL)
3. Go to Project Settings → API
4. Copy the **Service Role Key** (SUPABASE_SERVICE_ROLE_KEY)

### Create Documents Table

Run this SQL in the Supabase SQL Editor:

```sql
-- Create documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT NULL,
  embedding vector(1536) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster vector searches
CREATE INDEX documents_embedding_idx ON documents 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Create index for text search
CREATE INDEX documents_title_content_idx ON documents 
USING GIN (to_tsvector('english', title || ' ' || content));

-- Create RPC function for semantic search
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector,
  match_threshold float,
  match_count int
) RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  metadata JSONB,
  similarity float
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    documents.id,
    documents.title,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) AS similarity
  FROM documents
  WHERE 1 - (documents.embedding <=> query_embedding) > match_threshold
  ORDER BY documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;
```

## Step 4: Configure Environment Variables

### Create .env.local File

Create a file named `.env.local` in the project root:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-key-here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_SUMMARY_MODEL=gpt-4o-mini

# Tavily Search API
TAVILY_API_KEY=your-tavily-key-here

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Search Configuration (Optional)
SEMANTIC_SEARCH_THRESHOLD=0.1
SEMANTIC_SEARCH_SCAN_LIMIT=2000
SEMANTIC_SEARCH_ALWAYS_RETURN_RESULTS=true
```

### Environment Variables Explanation

| Variable | Description | Example |
|----------|-------------|---------|
| OPENAI_API_KEY | OpenAI API key for embeddings and LLM | sk-proj-xxx |
| OPENAI_BASE_URL | OpenAI API endpoint | https://api.openai.com/v1 |
| OPENAI_EMBEDDING_MODEL | Model for generating embeddings | text-embedding-3-small |
| OPENAI_SUMMARY_MODEL | Model for generating summaries | gpt-4o-mini |
| TAVILY_API_KEY | Tavily Search API key | tvly-xxx |
| SUPABASE_URL | Supabase project URL | https://xxx.supabase.co |
| SUPABASE_SERVICE_ROLE_KEY | Supabase service role key | eyJhbGc... |
| SEMANTIC_SEARCH_THRESHOLD | Minimum similarity score (0-1) | 0.1 |
| SEMANTIC_SEARCH_SCAN_LIMIT | Max documents to scan | 2000 |
| SEMANTIC_SEARCH_ALWAYS_RETURN_RESULTS | Return suggested docs if no match | true |

## Step 5: Add Sample Documents

### Add Myanmar Economy Documents

Create a script to populate your database with Myanmar economy documents:

```typescript
// scripts/seed-documents.ts
import { createClient } from "@supabase/supabase-js";
import { embed } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const sampleDocuments = [
  {
    title: "Myanmar Export-Import Regulations 2026",
    content: "Myanmar's export-import procedures and regulations for 2026...",
    metadata: { category: "trade", year: 2026, language: "en" },
  },
  {
    title: "မြန်မာ့ကုန်သွယ်ရေး စည်းမျဉ်း ၂၀၂၆",
    content: "မြန်မာ့ကုန်သွယ်ရေးဆိုင်ရာ စည်းမျဉ်းများ...",
    metadata: { category: "trade", year: 2026, language: "my" },
  },
  {
    title: "Myanmar Economic Overview",
    content: "Current economic situation and market trends in Myanmar...",
    metadata: { category: "economy", year: 2026, language: "en" },
  },
];

async function seedDocuments() {
  for (const doc of sampleDocuments) {
    // Generate embedding
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: `${doc.title} ${doc.content}`,
    });

    // Insert document
    const { error } = await supabase.from("documents").insert([
      {
        title: doc.title,
        content: doc.content,
        metadata: doc.metadata,
        embedding: embedding,
      },
    ]);

    if (error) {
      console.error(`Error inserting ${doc.title}:`, error);
    } else {
      console.log(`✓ Added: ${doc.title}`);
    }
  }
}

seedDocuments();
```

Run the script:
```bash
npx tsx scripts/seed-documents.ts
```

## Step 6: Test the Setup

### Test API Connection

```bash
# Start development server
npm run dev
# or
pnpm dev
```

### Test Search Endpoint

```bash
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Myanmar trade regulations",
    "limit": 5,
    "includeNews": true,
    "includeSummary": true
  }'
```

### Expected Response

```json
{
  "internalResults": [
    {
      "id": "doc-uuid",
      "title": "Myanmar Export-Import Regulations 2026",
      "content": "Preview of content...",
      "metadata": { "category": "trade", "year": 2026 },
      "score": 0.92
    }
  ],
  "newsResults": [
    {
      "title": "Myanmar Economy Shows Growth",
      "url": "https://example.com",
      "snippet": "Latest news...",
      "source": "Reuters",
      "date": "2026-04-16"
    }
  ],
  "synthesizedSummary": "Professional summary...",
  "message": null
}
```

## Step 7: Deploy to Vercel

### Setup Vercel Project

1. Push code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables in Project Settings

### Add Environment Variables in Vercel

1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.local`
3. Make sure to use the correct values for production

### Deploy

```bash
vercel deploy --prod
```

## Troubleshooting

### Issue: "Unable to synthesize results due to missing API key"

**Solution**: Check that `OPENAI_API_KEY` is set correctly
```bash
echo $OPENAI_API_KEY
```

### Issue: "Search service is unavailable (Supabase not configured)"

**Solution**: Verify Supabase credentials
```bash
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY
```

### Issue: "No results found"

**Solution**: 
1. Check if documents are in the database
2. Verify embeddings were created
3. Check semantic search threshold

### Issue: News not appearing

**Solution**: 
1. Verify `TAVILY_API_KEY` is set
2. Check Tavily API quota
3. Try with `includeNews: true` flag

### Issue: Slow search response

**Solution**:
1. Reduce `SEMANTIC_SEARCH_SCAN_LIMIT`
2. Increase `SEMANTIC_SEARCH_THRESHOLD`
3. Reduce result limit in request

## Cost Estimation

### Monthly Costs (Estimated)

| Service | Usage | Cost |
|---------|-------|------|
| OpenAI Embeddings | 1000 searches × 100 tokens | $0.02 |
| OpenAI GPT-4o mini | 1000 summaries × 200 tokens | $0.30 |
| Tavily Search | 1000 searches | $0-10 |
| Supabase | Free tier | $0 |
| **Total** | | **$0.32-10.32** |

## Next Steps

1. ✅ Set up API keys
2. ✅ Configure environment variables
3. ✅ Create Supabase database
4. ✅ Seed sample documents
5. ✅ Test the search feature
6. ✅ Deploy to production

## Support

For issues:
- Check [OpenAI Documentation](https://platform.openai.com/docs)
- Check [Tavily Documentation](https://tavily.com/docs)
- Check [Supabase Documentation](https://supabase.com/docs)
- Review application logs

## Additional Resources

- [LatYar Myanmar Economy Search Feature](./MYANMAR_ECONOMY_SEARCH_FEATURE.md)
- [API Documentation](./API_DOCS.md)
- [Development Guide](./DEVELOPMENT.md)
