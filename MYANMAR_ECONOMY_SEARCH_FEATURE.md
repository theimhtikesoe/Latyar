# Myanmar Economy Search Feature - Implementation Guide

## Overview

The LatYar application has been enhanced with a comprehensive **Myanmar Economy Search Feature** that combines:

1. **Internal Documentation Search** - Semantic search through local trade and economy documents
2. **Real-time Internet News** - Latest news from Tavily Search API about Myanmar's economy
3. **AI-Powered Summary** - Intelligent synthesis of internal and external data using OpenAI LLM

This feature enables users to search for Myanmar-specific economic information and receive actionable, professional summaries.

## Architecture

### Key Components

#### 1. Frontend (Client-Side)
- **File**: `/client/src/components/SemanticSearch.tsx`
- **Features**:
  - Search input with Myanmar/English language support
  - Toggle switches for "Include News" and "Generate Summary"
  - Real-time results display with similarity scores
  - Document expansion for full content viewing
  - Skeleton loading states

#### 2. Backend (Server-Side)

##### Next.js API Route
- **File**: `/app/api/search/route.ts`
- **Endpoint**: `POST /api/search`
- **Parameters**:
  - `query` (string): Search query in Myanmar or English
  - `limit` (number, optional): Maximum results to return (default: 5)
  - `includeNews` (boolean, optional): Include internet news (default: true)
  - `includeSummary` (boolean, optional): Generate AI summary (default: true)
  - `apiKey` (string, optional): Custom OpenAI API key

##### Vercel Serverless API
- **File**: `/api/search.ts`
- **Endpoint**: `POST /api/search` (Vercel deployment)
- Same parameters and functionality as Next.js route

##### Hybrid Search Logic
- **File**: `/shared/hybridSearch.ts`
- **Functions**:
  - `performHybridSearch()`: Main orchestrator
  - `fetchLatestNews()`: Fetches news via Tavily API
  - `synthesizeResults()`: Generates summary via OpenAI

##### Semantic Search
- **File**: `/api/_search/semanticSearch.ts` (Vercel)
- **File**: `/shared/semanticSearch.ts` (Shared)
- **Features**:
  - OpenAI embedding generation
  - Cosine similarity scoring
  - Fallback mechanisms (lexical, token-based, any documents)
  - Supabase RPC integration

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_SUMMARY_MODEL=gpt-4o-mini

# Tavily Search API (for internet news)
TAVILY_API_KEY=tvly-xxxxxxxxxxxxxxxx

# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Search Configuration
SEMANTIC_SEARCH_THRESHOLD=0.1
SEMANTIC_SEARCH_SCAN_LIMIT=2000
```

### 2. Required API Keys

#### OpenAI API Key
- Sign up at [OpenAI Platform](https://platform.openai.com)
- Create an API key in the dashboard
- Required models: `text-embedding-3-small`, `gpt-4o-mini`

#### Tavily Search API Key
- Sign up at [Tavily AI](https://tavily.com)
- Get your API key from the dashboard
- Used for fetching latest news about Myanmar economy

#### Supabase Configuration
- Create a project at [Supabase](https://supabase.com)
- Set up a `documents` table with columns:
  - `id` (UUID, primary key)
  - `title` (text, nullable)
  - `content` (text)
  - `metadata` (jsonb, nullable)
  - `embedding` (vector, 1536 dimensions for text-embedding-3-small)
- Generate a service role key from project settings

### 3. Database Setup

Create the documents table in Supabase:

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  content TEXT NOT NULL,
  metadata JSONB,
  embedding vector(1536),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

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
```

### 4. Populating Documents

Add Myanmar economy-related documents to the database:

```typescript
// Example: Add a document with embedding
const document = {
  title: "Myanmar Trade Regulations 2026",
  content: "Detailed content about Myanmar trade regulations...",
  metadata: { category: "trade", year: 2026 },
  embedding: await generateEmbedding("Myanmar Trade Regulations 2026...")
};

await supabase.from('documents').insert([document]);
```

## Usage

### Frontend Usage

Users can search for Myanmar economy information through the SemanticSearch component:

```typescript
// Example search queries
"ရေသန့်ဘူး" // Myanmar: Water sector
"Myanmar export import regulations" // English
"ကုန်သွယ်မှု စည်းမျဉ်း" // Myanmar: Trade rules
```

### API Usage

Make a POST request to `/api/search`:

```bash
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Myanmar economy 2026",
    "limit": 5,
    "includeNews": true,
    "includeSummary": true
  }'
```

### Response Format

```json
{
  "internalResults": [
    {
      "id": "doc-id-1",
      "title": "Myanmar Trade Regulations",
      "content": "Preview of content...",
      "metadata": { "category": "trade" },
      "score": 0.92
    }
  ],
  "newsResults": [
    {
      "title": "Myanmar Economy Shows Growth",
      "url": "https://example.com/article",
      "snippet": "Latest news about Myanmar economy...",
      "source": "Reuters",
      "date": "2026-04-16"
    }
  ],
  "synthesizedSummary": "Professional summary combining internal docs and latest news...",
  "message": null
}
```

## Myanmar Economy Focus

The AI summary is specifically optimized for Myanmar's economic context:

### System Prompt Emphasis
- Expert economic analyst specializing in Myanmar trade
- Focus on practical insights and current trends
- Regulatory impacts and economic implications
- Myanmar-specific market conditions

### Key Topics Covered
- Trade regulations and compliance
- Import/export procedures
- Market trends and economic indicators
- Geopolitical factors affecting trade
- Currency and financial regulations
- Sector-specific opportunities

### Language Support
- Full support for Myanmar (Burmese) language queries
- Automatic language detection
- Responses in the same language as the query

## Features

### 1. Semantic Search
- Uses OpenAI embeddings for intelligent document matching
- Cosine similarity scoring
- Fallback mechanisms for robustness

### 2. News Integration
- Real-time news from Tavily Search API
- Automatic filtering for Myanmar economy relevance
- Up to 5 latest news articles per search

### 3. AI Synthesis
- Combines internal documentation and external news
- Generates professional, actionable summaries
- Temperature set to 0.6 for balanced creativity and accuracy
- Model fallback chain: gpt-4o-mini → gpt-4.1-mini → gpt-4-turbo

### 4. Flexible Toggles
- Users can disable news inclusion for faster results
- Users can disable summary generation to see raw results
- Configurable result limits (1-20 documents)

## Error Handling

### Common Issues

#### Missing API Keys
- **Error**: "Unable to synthesize results due to missing API key"
- **Solution**: Ensure OPENAI_API_KEY is set in environment variables

#### Supabase Connection Failed
- **Error**: "Search service is unavailable (Supabase not configured)"
- **Solution**: Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY

#### No Results Found
- **Fallback**: Shows keyword-based matches or suggested documents
- **Message**: "Showing keyword matches" or "No match found. Showing suggested documents."

#### Embedding Dimension Mismatch
- **Error**: "Document embeddings dimension mismatch"
- **Solution**: Recreate embeddings with the configured model (text-embedding-3-small)

## Performance Optimization

### Caching
- Frontend caches search results in component state
- URL parameters allow bookmarking search results

### Parallel Processing
- News fetching and internal search run in parallel
- Improves response time significantly

### Limits
- Default result limit: 5 documents
- Maximum result limit: 20 documents
- Scan limit: 2000 documents per search

## Deployment

### Vercel Deployment
- Use `/api/search.ts` for serverless functions
- Ensure environment variables are set in Vercel dashboard
- Deploy with: `vercel deploy`

### Self-Hosted Deployment
- Use `/app/api/search/route.ts` with Next.js
- Or use `/server/index.ts` with Express
- Ensure all environment variables are configured

## Testing

### Local Development
```bash
npm run dev
# or
pnpm dev
```

### Test Search Queries
```
Myanmar trade regulations
ကုန်သွယ်မှု စည်းမျဉ်း
Myanmar export procedures
ရေသန့်ဘူး
Myanmar economy 2026
```

## Future Enhancements

1. **Multi-language Support**: Expand beyond Myanmar/English
2. **Custom Document Upload**: Allow users to add their own documents
3. **Search History**: Track and suggest previous searches
4. **Advanced Filters**: Filter by date, category, source
5. **Export Results**: Generate PDF/Excel reports
6. **Real-time Updates**: Websocket integration for live news

## Support

For issues or questions:
1. Check environment variables configuration
2. Verify API key validity
3. Check Supabase database connection
4. Review application logs for detailed error messages
5. Refer to individual API documentation (OpenAI, Tavily, Supabase)

## License

MIT License - See LICENSE file for details
