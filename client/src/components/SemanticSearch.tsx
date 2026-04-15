import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

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

export default function SemanticSearch() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const { language } = useLanguage();
  const isMyanmar = language === "my";

  const copy = {
    placeholder: isMyanmar
      ? "ဥပမာ - ဓာတုပစ္စည်းတင်သွင်းမှု HS code"
      : "Example - HS code classification for chemical imports",
    title: isMyanmar ? "အသိပညာအခြေပြု ရှာဖွေမှု" : "Semantic Search",
    description: isMyanmar
      ? "OpenAI embedding + Supabase documents table ဖြင့် အသိပညာအလိုက် ရှာဖွေပါ။"
      : "Search by meaning using OpenAI embeddings and your Supabase documents table.",
    emptyQuery: isMyanmar ? "ရှာဖွေရန် keyword တစ်ခုထည့်ပါ။" : "Please enter a keyword to search.",
    apiError: (status: number) =>
      isMyanmar ? `Search API error (${status})` : `Search API error (${status})`,
    connectError: isMyanmar
      ? "Search service ကို ချိတ်ဆက်မရပါ။ API configuration ကို စစ်ဆေးပါ။"
      : "Could not connect to the search service. Please check API configuration.",
    submit: isMyanmar ? "ရှာဖွေမည်" : "Search",
    searching: isMyanmar ? "ရှာဖွေနေသည်..." : "Searching...",
    similarity: isMyanmar ? "ဆင်တူမှု" : "Similarity",
    untitled: isMyanmar ? "ခေါင်းစဉ်မရှိသော စာရွက်စာတမ်း" : "Untitled Document",
  };

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!query.trim()) {
      setResults([]);
      setMessage(copy.emptyQuery);
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query.trim(),
          limit: 5,
        }),
      });

      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        setResults([]);
        setMessage(copy.apiError(response.status));
        return;
      }

      const payload = (await response.json()) as SearchResponse;
      setResults(payload.results ?? []);

      if (!response.ok) {
        setMessage(payload.message ?? copy.apiError(response.status));
        return;
      }

      setMessage(payload.message ?? null);
    } catch {
      setResults([]);
      setMessage(copy.connectError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-primary/40 bg-card/70">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl">{copy.title}</CardTitle>
        <CardDescription>{copy.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.placeholder}
            aria-label={isMyanmar ? "အသိပညာအခြေပြု ရှာဖွေမှု" : "Semantic search query"}
          />
          <Button type="submit" className="sm:w-auto" disabled={isLoading}>
            <Search className="mr-2 h-4 w-4" />
            {isLoading ? copy.searching : copy.submit}
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
                  {copy.similarity}: {(result.score * 100).toFixed(1)}%
                </p>
                <h3 className="mt-1 text-lg font-semibold">
                  {result.title ?? copy.untitled}
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
