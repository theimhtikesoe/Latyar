import { performHybridSearch } from "./shared/hybridSearch";
import * as dotenv from "dotenv";

dotenv.config();

async function test() {
  const query = "export";
  console.log(`Testing hybrid search for query: "${query}"...`);
  
  try {
    const result = await performHybridSearch(query, { limit: 3 });
    console.log("\n--- Hybrid Search Results ---");
    console.log(`Message: ${result.message || "None"}`);
    console.log(`\nSynthesized Summary:\n${result.synthesizedSummary}`);
    
    console.log(`\nInternal Results (${result.internalResults.length}):`);
    result.internalResults.forEach((r, i) => {
      console.log(`${i + 1}. ${r.title} (Score: ${r.score})`);
    });
    
    console.log(`\nNews Results (${result.newsResults.length}):`);
    result.newsResults.forEach((n, i) => {
      console.log(`${i + 1}. ${n.title} (${n.source})`);
    });
  } catch (error) {
    console.error("Test failed:", error);
  }
}

test();
