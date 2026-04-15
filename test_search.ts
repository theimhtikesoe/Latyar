
import { semanticSearchDocuments } from "./shared/semanticSearch";

async function test() {
  console.log("Testing Semantic Search Error Handling...");
  
  const query = "HS code for chemicals";
  console.log(`Query: "${query}"`);

  try {
    const response = await semanticSearchDocuments(query);
    console.log("Response:", JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("Search failed with 500-like error:", error);
  }
}

test();
