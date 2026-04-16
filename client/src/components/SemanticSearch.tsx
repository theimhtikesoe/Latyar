import { useState, useEffect, type FormEvent, useCallback } from "react";
import { Search, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

type InternalResult = {
  id: string;
  title: string | null;
  content: string;
  metadata: Record<string, unknown> | null;
  score: number;
};

type NewsResult = {
  title: string;
  url: string;
  snippet: string;
  source: string;
  date?: string;
};

type HybridSearchResponse = {
  internalResults: InternalResult[];
  newsResults: NewsResult[];
  synthesizedSummary: string;
  message?: string;
};

function SkeletonLoader() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-md border border-border/70 bg-background/50 p-4 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ))}
    </div>
  );
}

export default function SemanticSearch() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [internalResults, setInternalResults] = useState<InternalResult[]>([]);
  const [newsResults, setNewsResults] = useState<NewsResult[]>([]);
  const [synthesizedSummary, setSynthesizedSummary] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [includeNews, setIncludeNews] = useState(false);
  const [includeSummary, setIncludeSummary] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const [fullContentById, setFullContentById] = useState<Record<string, string>>({});
  const [loadingDocIds, setLoadingDocIds] = useState<Set<string>>(() => new Set());
  const { language } = useLanguage();
  const isMyanmar = language === "my";

  const handleSearchAction = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setInternalResults([]);
        setNewsResults([]);
        setSynthesizedSummary(null);
        setMessage(null);
        return;
      }

      setIsLoading(true);
      setMessage(null);

      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: searchQuery.trim(),
            limit: 5,
            includeNews,
            includeSummary,
          }),
        });

        const contentType = response.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) {
          setInternalResults([]);
          setNewsResults([]);
          setSynthesizedSummary(null);
          setMessage(
            isMyanmar
              ? `Search API error (${response.status})`
              : `Search API error (${response.status})`
          );
          return;
        }

        const payload = (await response.json()) as HybridSearchResponse;
        setInternalResults(payload.internalResults ?? []);
        setNewsResults(payload.newsResults ?? []);
        setSynthesizedSummary(payload.synthesizedSummary ?? null);
        setExpandedIds(new Set());
        setFullContentById({});
        setLoadingDocIds(new Set());

        if (!response.ok) {
          setMessage(
            payload.message ??
              (isMyanmar ? `Search API error (${response.status})` : `Search API error (${response.status})`)
          );
          return;
        }

        setMessage(payload.message ?? null);
      } catch {
        setInternalResults([]);
        setNewsResults([]);
        setSynthesizedSummary(null);
        setMessage(
          isMyanmar
            ? "Search service ကို ချိတ်ဆက်မရပါ။ API configuration ကို စစ်ဆေးပါ။"
            : "Could not connect to the search service. Please check API configuration."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [includeNews, includeSummary, isMyanmar]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setQuery(q);
      handleSearchAction(q);
    }
  }, [handleSearchAction]);

  const copy = {
    placeholder: isMyanmar
      ? "ဥပမာ - ဓာတုပစ္စည်းတင်သွင်းမှု HS code"
      : "Example - HS code classification for chemical imports",
    title: isMyanmar ? "အသိပညာအခြေပြု ရှာဖွေမှု" : "Semantic Search",
    description: isMyanmar
      ? "OpenAI embedding + Supabase documents table + Latest News ဖြင့် အသိပညာအလိုက် ရှာဖွေပါ။"
      : "Search by meaning using OpenAI embeddings, your Supabase documents, and latest news.",
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
    internalResults: isMyanmar ? "အတွင်းပိုင်း ရလဒ်များ" : "Internal Results",
    latestNews: isMyanmar ? "နောက်ဆုံးသတင်းများ" : "Latest News",
    synthesizedSummary: isMyanmar ? "ပေါင်းစည်းသော အကျဉ်းချုပ်" : "Synthesized Summary",
    readMore: isMyanmar ? "ပိုမိုဖတ်ရှုရန်" : "Read More",
    showLess: isMyanmar ? "ဖျောက်ရန်" : "Show Less",
    includeNews: isMyanmar ? "နောက်ဆုံးသတင်း ထည့်မည်" : "Include news",
    includeSummary: isMyanmar ? "အကျဉ်းချုပ် ထုတ်မည်" : "Generate summary",
    loading: isMyanmar ? "ဖတ်ရှုနေသည်..." : "Loading...",
  };

  async function toggleDocument(resultId: string) {
    const next = new Set(expandedIds);
    const isExpanded = next.has(resultId);
    if (isExpanded) {
      next.delete(resultId);
      setExpandedIds(next);
      return;
    }

    next.add(resultId);
    setExpandedIds(next);

    if (fullContentById[resultId]) {
      return;
    }

    const nextLoading = new Set(loadingDocIds);
    nextLoading.add(resultId);
    setLoadingDocIds(nextLoading);

    try {
      const response = await fetch(`/api/document?id=${encodeURIComponent(resultId)}`);
      const payload = (await response.json()) as { content?: unknown; message?: unknown };
      const content = typeof payload.content === "string" ? payload.content : "";
      setFullContentById((prev) => ({ ...prev, [resultId]: content }));
    } catch {
      setMessage(copy.connectError);
    } finally {
      setLoadingDocIds((prev) => {
        const updated = new Set(prev);
        updated.delete(resultId);
        return updated;
      });
    }
  }

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!query.trim()) {
      setInternalResults([]);
      setNewsResults([]);
      setSynthesizedSummary(null);
      setMessage(copy.emptyQuery);
      return;
    }

    // Update URL without reloading
    const url = new URL(window.location.href);
    url.searchParams.set("q", query.trim());
    window.history.pushState({}, "", url);

    await handleSearchAction(query);
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
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {copy.searching}
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                {copy.submit}
              </>
            )}
          </Button>
        </form>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Switch checked={includeNews} onCheckedChange={setIncludeNews} />
            {copy.includeNews}
          </label>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Switch checked={includeSummary} onCheckedChange={setIncludeSummary} />
            {copy.includeSummary}
          </label>
        </div>

        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}

        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <>
            {/* Synthesized Summary */}
            {synthesizedSummary ? (
              <div className="rounded-md border border-primary/40 bg-primary/5 p-4">
                <h3 className="font-semibold text-primary mb-2">{copy.synthesizedSummary}</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">{synthesizedSummary}</p>
              </div>
            ) : null}

            {/* Internal Results Section */}
            {internalResults.length > 0 ? (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-foreground">{copy.internalResults}</h3>
                {internalResults.map((result) => (
                  <div
                    key={result.id}
                    className="rounded-md border border-border/70 bg-background/50 p-4"
                  >
                    <p className="text-sm text-primary">
                      {copy.similarity}: {(result.score * 100).toFixed(1)}%
                    </p>
                    <h4 className="mt-1 text-lg font-semibold">
                      {result.title ?? copy.untitled}
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                      {expandedIds.has(result.id) ? fullContentById[result.id] || result.content : result.content}
                    </p>
                    <div className="mt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDocument(result.id)}
                        disabled={loadingDocIds.has(result.id)}
                        className="px-2"
                      >
                        {loadingDocIds.has(result.id)
                          ? copy.loading
                          : expandedIds.has(result.id)
                            ? copy.showLess
                            : copy.readMore}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Latest News Section */}
            {newsResults.length > 0 ? (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-foreground">{copy.latestNews}</h3>
                {newsResults.map((news, index) => (
                  <div
                    key={index}
                    className="rounded-md border border-border/70 bg-background/50 p-4 hover:bg-background/70 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground font-medium">{news.source}</p>
                        <h4 className="mt-1 text-base font-semibold leading-snug">{news.title}</h4>
                        <p className="mt-2 text-sm text-muted-foreground">{news.snippet}</p>
                      </div>
                      {news.url ? (
                        <a
                          href={news.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 mt-1"
                        >
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
