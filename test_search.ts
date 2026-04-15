
import { semanticSearchDocuments } from "./shared/semanticSearch";

async function test() {
  console.log("Testing Semantic Search...");
  
  // Ensure environment variables are set
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.OPENAI_API_KEY) {
    console.error("Error: Missing required environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY)");
    return;
  }

  try {
    const query = "HS code for chemicals";
    console.log(`Query: "${query}"`);
    
    const response = await semanticSearchDocuments(query);
    console.log("Response:", JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("Search failed:", error);
  }
}

test();
