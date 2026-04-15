# Semantic Search Investigation Report

This report documents the findings from an investigation into the Semantic Search functionality in the Latyar repository.

## Current Status: **Not Working**

The Semantic Search feature is currently non-functional due to several critical issues identified during testing.

### Key Issues

| Issue | Description | Impact |
| :--- | :--- | :--- |
| **Invalid API Key** | The code contains a hardcoded OpenAI API key (`sk-proj-...vacA`) which is **invalid** or has expired. | All search attempts fail with a `401 Unauthorized` error from OpenAI. |
| **Missing Environment Variables** | The system requires `SUPABASE_URL` and `SUPABASE_ANON_KEY` to be set in the environment, but they are missing. | The search cannot connect to the database to retrieve documents. |
| **API Proxy Conflict** | In some environments, the AI SDK attempts to use a proxy (`api.manus.im`) which results in a `404 Not Found` for the embeddings endpoint. | Prevents the generation of search vectors. |

### Technical Details

1.  **Implementation**: The search uses `text-embedding-3-small` from OpenAI to generate embeddings for user queries and then calculates **Cosine Similarity** against documents stored in a Supabase table named `documents`.
2.  **Fallback Mechanism**: There is a lexical (keyword-based) fallback using Supabase's `ilike` operator, but this also fails because the Supabase credentials are not configured.
3.  **Duplication**: There are two separate backend implementations (one in `server/index.ts` and another in `api/search.ts`), which could lead to inconsistent behavior across different deployment platforms (e.g., Vercel vs. local Express).

### Recommendations to Fix

*   **Update API Keys**: Replace the hardcoded OpenAI key in `Latyar/shared/semanticSearch.ts` with a valid one, preferably via the `OPENAI_API_KEY` environment variable.
*   **Configure Supabase**: Set the `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (or `SUPABASE_ANON_KEY`) in your deployment environment (e.g., Vercel Environment Variables).
*   **Environment Setup**: Ensure a `.env` file is created for local development containing these keys.

---

## Testing Script

A test script `test_search.ts` has been added to the repository to help verify the search functionality. You can run it using:

```bash
npx tsx test_search.ts
```

*Note: You will need to set the required environment variables before running the script.*
