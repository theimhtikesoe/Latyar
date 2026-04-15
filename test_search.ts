
import { semanticSearchDocuments } from "./shared/semanticSearch";

async function test() {
  console.log("Testing Semantic Search...");
  
  // Set required environment variables for the test
  process.env.SUPABASE_URL = process.env.SUPABASE_URL || "https://xyz.supabase.co";
  process.env.SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "dummy-key";
  
  // Force OpenAI to use the standard API base URL
  process.env.OPENAI_BASE_URL = "https://api.openai.com/v1";

  try {
    const query = "HS code for chemicals";
    console.log(`Query: "${query}"`);
    
    // Use the hardcoded key from the source for testing
    const hardcodedKey = "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";
    const response = await semanticSearchDocuments(query, { apiKey: process.env.OPENAI_API_KEY });
    console.log("Response:", JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("Search failed:", error);
  }
}

test();
