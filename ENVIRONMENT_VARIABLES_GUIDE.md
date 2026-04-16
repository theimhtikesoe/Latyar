# LatYar Environment Variables Configuration Guide

## Overview

LatYar uses multiple environment variables to function properly. This guide explains what each variable does, where to set them, and how to troubleshoot issues.

## Critical Environment Variables

### 1. OpenAI API Key (OPENAI_API_KEY)
**Purpose:** Used for generating embeddings and synthesizing summaries using LLM models.

**Format:** Must start with `sk-` or `sk-proj-`

**Where to set:**
- Vercel Dashboard → Settings → Environment Variables
- Set for all environments (Production, Preview, Development)

**Validation:**
- Must not be empty or contain placeholder values like `sk-proj-***`
- Must be a valid OpenAI API key from https://platform.openai.com/api-keys

**Error if missing:**
```
Invalid or missing OPENAI_API_KEY. Please set it in Vercel environment variables.
```

### 2. Supabase URL (SUPABASE_URL)
**Purpose:** Database connection URL for storing and retrieving documents.

**Format:** Should look like `https://xxxxx.supabase.co`

**Where to set:**
- Vercel Dashboard → Settings → Environment Variables
- Set for all environments

**Validation:**
- Must be a valid Supabase project URL
- Can also use `NEXT_PUBLIC_SUPABASE_URL` (public-facing)

**Error if missing:**
```
Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY).
```

### 3. Supabase Service Role Key (SUPABASE_SERVICE_ROLE_KEY)
**Purpose:** Authentication key for accessing Supabase database with full permissions.

**Format:** Long string starting with `eyJ...`

**Where to set:**
- Vercel Dashboard → Settings → Environment Variables
- Set for all environments (especially Production)

**Validation:**
- Must be the **Service Role Key**, not the Anon Key
- Can be found in Supabase Dashboard → Settings → API

**Error if missing:**
```
Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY).
```

### 4. Tavily API Key (TAVILY_API_KEY) - Optional but Recommended
**Purpose:** Fetches latest internet news for search queries.

**Format:** Should start with `tvly-`

**Where to set:**
- Vercel Dashboard → Settings → Environment Variables
- Set for all environments

**Validation:**
- Optional: If not set, news retrieval will be skipped gracefully
- If set, must be a valid Tavily API key from https://tavily.com

**Behavior if missing:**
- News results will be empty
- Search will still work with internal documents only
- No error is thrown

## Optional Environment Variables

### OPENAI_BASE_URL
**Purpose:** Override the default OpenAI API endpoint (for custom/proxy endpoints).

**Default:** `https://api.openai.com/v1`

**Example:** `https://api.custom-provider.com/v1`

### OPENAI_SUMMARY_MODEL
**Purpose:** Specify which model to use for generating summaries.

**Default:** Falls back to `gpt-4o-mini`, then `gpt-4.1-mini`, then `gpt-4-turbo`

**Example:** `gpt-4-turbo` or `gpt-4.1-mini`

### SEMANTIC_SEARCH_THRESHOLD
**Purpose:** Similarity threshold for semantic search results (0.0 to 1.0).

**Default:** `0.1` (10%)

**Higher value** = stricter matching, fewer results
**Lower value** = looser matching, more results

### SEMANTIC_SEARCH_SCAN_LIMIT
**Purpose:** Maximum number of documents to scan during semantic search.

**Default:** `2000`

**Higher value** = more thorough but slower
**Lower value** = faster but may miss relevant results

## Troubleshooting

### Issue: "Unable to synthesize results due to missing API key"

**Causes:**
1. `OPENAI_API_KEY` is not set
2. `OPENAI_API_KEY` contains placeholder value like `sk-proj-***`
3. `OPENAI_API_KEY` is set to `your_openai_api_key` (default placeholder)

**Solution:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Find `OPENAI_API_KEY`
3. Verify it starts with `sk-` or `sk-proj-`
4. If empty or placeholder, get a real key from https://platform.openai.com/api-keys
5. Update the value and redeploy

### Issue: "Search service is currently unavailable due to configuration issues"

**Causes:**
1. `SUPABASE_URL` is not set or invalid
2. `SUPABASE_SERVICE_ROLE_KEY` is not set or invalid
3. Supabase project is not accessible

**Solution:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Verify both `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
3. Check Supabase Dashboard → Settings → API for correct values
4. Ensure Supabase project is active and not paused
5. Redeploy after updating

### Issue: Search is very slow (>15 seconds)

**Causes:**
1. OpenAI API is slow or unresponsive
2. Supabase database is slow
3. Tavily API is slow (if news retrieval is enabled)

**Solution:**
1. Check OpenAI status at https://status.openai.com
2. Check Supabase status at https://status.supabase.com
3. Disable news retrieval temporarily (toggle "Include news" off in UI)
4. If issue persists, contact support

### Issue: No news results appearing

**Causes:**
1. `TAVILY_API_KEY` is not set (this is optional)
2. `TAVILY_API_KEY` is invalid
3. "Include news" toggle is off in the UI

**Solution:**
1. Check if "Include news" toggle is enabled in the search interface
2. If you want news results, set `TAVILY_API_KEY` in Vercel environment variables
3. Get a Tavily API key from https://tavily.com
4. Redeploy after updating

## Vercel Deployment Steps

1. **Go to Vercel Dashboard**
   - Navigate to your LatYar project
   - Click on "Settings" tab

2. **Add Environment Variables**
   - Click "Environment Variables"
   - Add each variable with its value
   - Make sure to set for all environments (Production, Preview, Development)

3. **Redeploy**
   - Go to "Deployments" tab
   - Click "Redeploy" on the latest deployment
   - Or push a new commit to trigger automatic deployment

## Testing Environment Variables

You can test if variables are correctly set by:

1. **Check Vercel Logs**
   - Go to Vercel Dashboard → Deployments
   - Click on a deployment → Logs
   - Look for error messages about missing API keys

2. **Test via API**
   ```bash
   curl -X POST https://your-latyar-app.vercel.app/api/search \
     -H "Content-Type: application/json" \
     -d '{"query":"ရေသန့်ဘူး","includeNews":true,"includeSummary":true}'
   ```

3. **Check Response**
   - If you get "Unable to synthesize results due to missing API key", check `OPENAI_API_KEY`
   - If you get "Search service is currently unavailable", check Supabase variables
   - If you get valid results, all variables are correctly set

## Security Best Practices

1. **Never commit API keys to Git**
   - Always use Vercel Environment Variables
   - Never put keys in `.env` files that are committed

2. **Use Service Role Key for Backend**
   - Always use `SUPABASE_SERVICE_ROLE_KEY` for server-side operations
   - Never expose this key to the client

3. **Rotate Keys Regularly**
   - Periodically regenerate API keys
   - Update Vercel environment variables after rotation

4. **Use Different Keys for Different Environments**
   - Consider using different Supabase projects for Production vs Preview
   - This prevents test data from affecting production

## Summary Checklist

- [ ] `OPENAI_API_KEY` is set and starts with `sk-` or `sk-proj-`
- [ ] `SUPABASE_URL` is set and looks like `https://xxxxx.supabase.co`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set and starts with `eyJ...`
- [ ] `TAVILY_API_KEY` is set (optional, for news retrieval)
- [ ] All variables are set in Vercel Dashboard for all environments
- [ ] Application has been redeployed after setting variables
- [ ] Search functionality works without "API key missing" errors

If you've verified all items in the checklist and still have issues, please check Vercel logs for detailed error messages.
