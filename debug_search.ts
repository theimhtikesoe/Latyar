
import { semanticSearchDocuments } from "./shared/semanticSearch";

async function debug() {
  console.log("--- Debugging Search Function ---");
  console.log("Environment Variables Check:");
  console.log("SUPABASE_URL:", process.env.SUPABASE_URL ? "SET" : "NOT SET");
  console.log("SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "SET" : "NOT SET");
  console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "SET" : "NOT SET");

  const query = "test query";
  console.log(`\nTesting with query: "${query}"`);

  try {
    const result = await semanticSearchDocuments(query);
    console.log("\nSearch Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("\nSearch failed with error:");
    console.error(error);
    if (error instanceof Error) {
      console.error("Stack trace:", error.stack);
    }
  }
}

debug();
