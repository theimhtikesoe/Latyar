import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type SearchResult = {
  id: string;
  title: string | null;
  content: string;
  metadata: Record<string, unknown> | null;
  score: number;
};

type SearchResponse = {
  results: SearchResult[];
  message?: string;
};

const PLACEHOLDER = "ဥပမာ - HS code classification for chemical imports";

export default function SemanticSearch() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!query.trim()) {
      setResults([]);
      setMessage("ရှာဖွေရန် keyword တစ်ခုထည့်ပါ။");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim(), limit: 5 }),
      });

      const payload = (await response.json()) as SearchResponse;
      setResults(payload.results ?? []);
      setMessage(payload.message ?? null);
    } catch {
      setResults([]);
      setMessage("Search service ကို ချိတ်ဆက်မရပါ။ API configuration ကို စစ်ဆေးပါ။");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-primary/40 bg-card/70">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl">Semantic Search</CardTitle>
        <CardDescription>
          OpenAI embedding + Supabase documents table ကို အသုံးပြုပြီး အသိပညာအရ ရှာဖွေပါ။
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={PLACEHOLDER}
            aria-label="Semantic search query"
          />
          <Button type="submit" className="sm:w-auto" disabled={isLoading}>
            <Search className="mr-2 h-4 w-4" />
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </form>

        {message ? (
          <p className="text-sm text-muted-foreground">{message}</p>
        ) : null}

        {results.length > 0 ? (
          <div className="space-y-3">
            {results.map((result) => (
              <div
                key={result.id}
                className="rounded-md border border-border/70 bg-background/50 p-4"
              >
                <p className="text-sm text-primary">
                  Similarity: {(result.score * 100).toFixed(1)}%
                </p>
                <h3 className="mt-1 text-lg font-semibold">
                  {result.title ?? "Untitled Document"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{result.content}</p>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
