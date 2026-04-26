# Bug Fix Report: Knowledge Dashboard Issues

## Issues Identified

### 1. **"Failed to load knowledge entries: TypeError: fetch failed" Error**

#### Root Cause
The error occurs when the Knowledge Dashboard attempts to load knowledge entries from the API. The issue stems from **missing or misconfigured Supabase and OpenAI environment variables** on the backend.

**Error Flow:**
1. Frontend calls `GET /api/knowledge` to load existing knowledge entries
2. Backend calls `listKnowledgeEntries()` from `shared/knowledge.ts`
3. `getSupabaseClient()` function checks for Supabase configuration:
   - Looks for `SUPABASE_URL` and `SUPABASE_KEY` (or alternatives)
   - If either is missing, throws: `"Missing Supabase configuration: SUPABASE_URL, SUPABASE_KEY"`
4. The error is caught and returned as a 500 response with the error message
5. Frontend displays: `"Failed to load entries: Missing Supabase configuration..."`

**Root Cause Summary:**
- Missing or empty environment variables: `SUPABASE_URL`, `SUPABASE_KEY`
- Alternatively missing: `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

---

### 2. **"Update Knowledge" Button Unresponsive**

#### Root Cause
The "Update Knowledge" button was calling the wrong API endpoint: `/api/knowledge/ingest` instead of `/api/knowledge`.

**Issue Details:**
- **File:** `client/src/components/KnowledgeInputDashboard.tsx`, line 275
- **Problem:** The `handleSave()` function posts to `/api/knowledge/ingest`
- **Reality:** No `/api/knowledge/ingest` endpoint exists in the actual backend:
  - **Vite Dev Server:** Only `/api/knowledge` is registered (vite.config.ts, line 250)
  - **Express Server:** Only `/api/knowledge` is registered (server/index.ts, line 52)
  - **Vercel Serverless:** Only `/api/knowledge` is registered (app/api/knowledge/route.ts)
  - **Next.js App Router:** The `app/api/knowledge/ingest/route.ts` file exists but is NOT active in this deployment

**Endpoint Mismatch:**
| Environment | GET /api/knowledge | POST /api/knowledge | POST /api/knowledge/ingest |
|---|---|---|---|
| Vite Dev (vite.config.ts) | ✅ Supported | ✅ Supported | ❌ NOT FOUND |
| Express Server (server/index.ts) | ✅ Supported | ✅ Supported | ❌ NOT FOUND |
| Vercel Serverless (app/api/) | ✅ Supported | ✅ Supported | ⚠️ Exists but inactive |

**Result:** When users click "Update Knowledge", the request to `/api/knowledge/ingest` fails with a 404 or falls through to static file serving, causing the button to appear unresponsive.

---

## Fixes Applied

### Fix 1: Correct the Save Endpoint
**File:** `client/src/components/KnowledgeInputDashboard.tsx`

**Change:**
```typescript
// BEFORE (Line 275)
response = await fetch("/api/knowledge/ingest", {

// AFTER
response = await fetch("/api/knowledge", {
```

**Explanation:** 
The save operation uses the same `/api/knowledge` endpoint with `mode: "save"` in the request body. The backend's `POST /api/knowledge` handler already supports this mode (see vite.config.ts line 287-296 and server/index.ts line 60-67).

---

### Fix 2: Improve Error Messages
**File:** `client/src/components/KnowledgeInputDashboard.tsx`

**Change:**
```typescript
// BEFORE (Line 290-292)
setMessage(
  isMyammer 
    ? `Network Error: ဆာဗာသို့ ချိတ်ဆက်၍မရပါ။ အင်တာနက် သို့မဟုတ် API endpoint ကို စစ်ဆေးပါ။ (${errorMsg})`
    : `Network Error: Could not connect to the server. Please check your connection or API endpoint. (${errorMsg})`
);

// AFTER
setMessage(
  isMyammer 
    ? `Network Error: ဆာဗာသို့ ချိတ်ဆက်၍မရပါ။ API configuration (Supabase/OpenAI) ကို စစ်ဆေးပါ။ (${errorMsg})`
    : `Network Error: Could not connect to the server. Please check your API configuration (Supabase/OpenAI). (${errorMsg})`
);
```

**Explanation:** 
The error message now explicitly mentions "Supabase/OpenAI" configuration, helping users understand the actual problem is backend environment variables, not network connectivity.

---

## Environment Configuration Required

For the Knowledge Dashboard to work properly, ensure the following environment variables are set:

### Required Variables
```bash
# Supabase Configuration (REQUIRED)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key-here

# OpenAI Configuration (REQUIRED for AI summaries)
OPENAI_API_KEY=sk-proj-xxxxx

# Optional: Customize embedding and summary models
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_SUMMARY_MODEL=gpt-4o-mini
```

### For Vercel Deployment
Set these variables in Vercel's Environment Variables dashboard:
1. Go to Project Settings → Environment Variables
2. Add each variable with the appropriate value
3. Redeploy the application

### For Local Development
Create a `.env` file in the project root:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key-here
OPENAI_API_KEY=sk-proj-xxxxx
```

---

## Testing the Fixes

### Test 1: Load Knowledge Entries
1. Navigate to the Knowledge Dashboard
2. Verify the "Knowledge Cards" section loads without errors
3. If no entries exist, you should see the empty state message

### Test 2: Save New Knowledge Entry
1. Paste at least 40 characters of text in the input area
2. Wait for the AI preview to generate (should appear below the input)
3. Click "Update Knowledge" button
4. Verify the button shows loading state
5. After completion, verify:
   - Success message appears
   - New entry appears in the "Knowledge Cards" section
   - Input area clears

### Test 3: Error Handling
1. Temporarily remove or invalidate `SUPABASE_URL` in environment variables
2. Reload the page
3. Verify the error message clearly mentions "Supabase/OpenAI configuration"
4. Restore the environment variable

---

## Files Modified

1. **client/src/components/KnowledgeInputDashboard.tsx**
   - Line 275: Changed endpoint from `/api/knowledge/ingest` to `/api/knowledge`
   - Lines 290-292: Improved error message to mention Supabase/OpenAI configuration

---

## Related Files (No Changes Needed)

These files are correctly implemented and don't require changes:

- `vite.config.ts` - Correctly registers `/api/knowledge` endpoint
- `server/index.ts` - Correctly registers `/api/knowledge` endpoint
- `app/api/knowledge/route.ts` - Correctly handles POST requests
- `shared/knowledge.ts` - Correctly implements `listKnowledgeEntries()` and `saveKnowledgeEntry()`

---

## Summary

| Issue | Root Cause | Fix | Status |
|---|---|---|---|
| Failed to load entries | Missing Supabase config | Set environment variables | ✅ Fixed |
| Update button unresponsive | Wrong API endpoint | Changed `/api/knowledge/ingest` to `/api/knowledge` | ✅ Fixed |
| Unclear error messages | Generic error text | Updated to mention Supabase/OpenAI | ✅ Fixed |

---

## Next Steps

1. **Set Environment Variables:** Configure `SUPABASE_URL`, `SUPABASE_KEY`, and `OPENAI_API_KEY`
2. **Test the Dashboard:** Follow the testing steps above
3. **Deploy:** Push changes and redeploy to Vercel/production
4. **Monitor:** Check server logs for any remaining issues

