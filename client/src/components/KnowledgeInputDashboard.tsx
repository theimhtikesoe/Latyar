import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Brain,
  Database,
  FileText,
  Loader2,
  Sparkles,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

type KnowledgeCard = {
  id: string;
  title: string;
  shortDescription: string;
  summaryBullets: string[];
  content: string;
  createdAt: string | null;
};

type KnowledgePreview = Omit<KnowledgeCard, "id" | "createdAt">;

function formatDate(value: string | null, language: "my" | "en") {
  if (!value) return language === "my" ? "ယခုတင်သွင်းထားသည်" : "Just added";

  try {
    return new Intl.DateTimeFormat(language === "my" ? "my-MM" : "en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function KnowledgeCardItem({
  item,
  isMyanmar,
}: {
  item: KnowledgeCard;
  isMyanmar: boolean;
}) {
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <Card className="border-border/70 bg-card/70 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/90">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="text-xl leading-tight">{item.title}</CardTitle>
            <CardDescription>{item.shortDescription}</CardDescription>
          </div>
          <div className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
            {formatDate(item.createdAt, isMyanmar ? "my" : "en")}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {item.summaryBullets.map((bullet) => (
            <div key={bullet} className="flex gap-3 text-sm text-foreground/90">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <p>{bullet}</p>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="px-0 text-primary hover:bg-transparent hover:text-primary/80"
          onClick={() => setShowOriginal((prev) => !prev)}
        >
          {showOriginal
            ? isMyanmar
              ? "မူရင်းစာသား ဖျောက်ရန်"
              : "Hide Original"
            : isMyanmar
              ? "မူရင်းစာသား ကြည့်ရန်"
              : "View Original"}
          <ArrowUpRight className="h-4 w-4" />
        </Button>

        {showOriginal ? (
          <div className="rounded-2xl border border-border/70 bg-background/60 p-4 text-sm text-muted-foreground whitespace-pre-wrap">
            {item.content}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default function KnowledgeInputDashboard() {
  const { language } = useLanguage();
  const isMyanmar = language === "my";
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const previewAbortRef = useRef<AbortController | null>(null);
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState<KnowledgePreview | null>(null);
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeCard[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const copy = {
    eyebrow: isMyanmar ? "Knowledge Input Dashboard" : "Knowledge Input Dashboard",
    title: isMyanmar ? "Search Engine Knowledge Base ကို တိုက်ရိုက် ဖြည့်သွင်းပါ" : "Feed your search engine knowledge base directly",
    description: isMyanmar
      ? "ရှည်လျားတဲ့ article, regulation note, customs logic သို့မဟုတ် research snippet ကို paste လုပ်လိုက်တာနဲ့ AI က summary ထုတ်ပေးပြီး Supabase knowledge store ထဲသို့ ချက်ချင်း update လုပ်နိုင်ပါတယ်။"
      : "Paste long articles, regulations, customs logic, or research notes and turn them into searchable knowledge with live AI summaries.",
    textareaLabel: isMyanmar ? "Knowledge Source Text" : "Knowledge Source Text",
    textareaPlaceholder: isMyanmar
      ? "ဥပမာ - Customs Valuation, WTO note, HS code guide, trade regulation update..."
      : "Paste a customs guide, WTO note, HS code explanation, regulation update, or any long-form knowledge here...",
    helper: isMyanmar
      ? "Paste လုပ်ပြီး ခဏစောင့်ပါ။ AI က title, short description နဲ့ summary bullets ကို auto-generate လုပ်ပေးပါမယ်။"
      : "Paste your source text and pause for a moment. AI will generate a title, short description, and bullet summary automatically.",
    updateButton: isMyanmar ? "Update Knowledge" : "Update Knowledge",
    generating: isMyanmar ? "AI summary ထုတ်နေသည်..." : "Generating AI summary...",
    saving: isMyanmar ? "Knowledge သိမ်းနေသည်..." : "Saving knowledge...",
    previewTitle: isMyanmar ? "AI Draft Preview" : "AI Draft Preview",
    previewDesc: isMyanmar ? "Paste လုပ်ထားတဲ့ text အပေါ်အခြေခံတဲ့ immediate preview" : "Immediate AI preview generated from your pasted text",
    cardsTitle: isMyanmar ? "Knowledge Cards" : "Knowledge Cards",
    cardsDesc: isMyanmar ? "Dashboard မှတင်ထားသော knowledge entries များ" : "Knowledge entries published from this dashboard",
    emptyState: isMyanmar
      ? "Knowledge card မရှိသေးပါ။ အောက်က input box မှာ article တစ်ခု paste လုပ်ပြီး knowledge base ကို စတင်တည်ဆောက်ပါ။"
      : "No knowledge cards yet. Paste your first article below to start building the knowledge base.",
    metrics: isMyanmar
      ? [
          { label: "AI Summary", value: "Live" },
          { label: "Storage", value: "Supabase" },
          { label: "Search", value: "Hybrid Ready" },
        ]
      : [
          { label: "AI Summary", value: "Live" },
          { label: "Storage", value: "Supabase" },
          { label: "Search", value: "Hybrid Ready" },
        ],
    titleLabel: isMyanmar ? "Catchy Title" : "Catchy Title",
    shortDescLabel: isMyanmar ? "Short Description" : "Short Description",
    summaryLabel: isMyanmar ? "Summary Bullets" : "Summary Bullets",
  };

  useEffect(() => {
    async function loadKnowledge() {
      try {
        const response = await fetch("/api/knowledge");
        if (!response.ok) {
          const payload = (await response.json()) as { message?: string };
          setMessage(payload.message ?? `Error ${response.status}: ${response.statusText}`);
          return;
        }
        const payload = (await response.json()) as { knowledge?: KnowledgeCard[] };
        setKnowledgeItems(payload.knowledge ?? []);
      } catch (error) {
        console.error("Load knowledge error:", error);
        setMessage(
          error instanceof Error 
            ? `Load Error: ${error.message}`
            : isMyanmar
              ? "Knowledge entries ကို မရယူနိုင်ပါ။ API configuration ကို စစ်ဆေးပါ။"
              : "Could not load knowledge entries. Please check the API configuration."
        );
      } finally {
        setLoadingList(false);
      }
    }

    loadKnowledge();
  }, [isMyanmar]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "0px";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 480)}px`;
  }, [content]);

  useEffect(() => {
    const trimmed = content.trim();
    if (trimmed.length < 40) {
      previewAbortRef.current?.abort();
      setPreview(null);
      setPreviewLoading(false);
      return;
    }

    setPreviewLoading(true);
    const controller = new AbortController();
    previewAbortRef.current?.abort();
    previewAbortRef.current = controller;

    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/knowledge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "preview",
            content: trimmed,
            language,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const payload = (await response.json()) as { message?: string };
          setMessage(payload.message ?? `Preview Error ${response.status}`);
          setPreview(null);
          return;
        }

        const payload = (await response.json()) as { preview?: KnowledgePreview };
        setPreview(payload.preview ?? null);
        setMessage(null);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Preview error:", error);
        setPreview(null);
        setMessage(
          error instanceof Error
            ? `Preview Error: ${error.message}`
            : isMyanmar
              ? "AI preview မထုတ်နိုင်ပါ။"
              : "Could not generate AI preview."
        );
      } finally {
        if (!controller.signal.aborted) {
          setPreviewLoading(false);
        }
      }
    }, 700);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [content, isMyanmar, language]);

  async function handleSave() {
    const trimmed = content.trim();
    if (trimmed.length < 40) {
      setMessage(isMyanmar ? "အနည်းဆုံး စာသား ၄၀ လုံး ထည့်ပေးပါ။" : "Please paste at least 40 characters of source text.");
      return;
    }

    setSaveLoading(true);
    setMessage(null);

    try {
      if (typeof fetch === 'undefined') {
        throw new Error("Browser fetch API is not available.");
      }
      const response = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "save",
          content: trimmed,
          language,
        }),
      });

      const payload = (await response.json()) as { knowledge?: KnowledgeCard; message?: string };
      if (!response.ok || !payload.knowledge) {
        setMessage(payload.message ?? null);
        return;
      }

      setKnowledgeItems((prev) => [payload.knowledge as KnowledgeCard, ...prev]);
      setContent("");
      setPreview(null);
      setMessage(isMyanmar ? "Knowledge base ကို update လုပ်ပြီးပါပြီ။" : "Knowledge base updated successfully.");
    } catch (error) {
      console.error("Save error:", error);
      setMessage(
        error instanceof Error 
          ? `Error: ${error.message}`
          : isMyanmar
            ? "Knowledge entry ကို မသိမ်းနိုင်ပါ။"
            : "Could not save the knowledge entry."
      );
    } finally {
      setSaveLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="section-padding">
        <div className="container">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-5">
                <div className="space-y-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{copy.eyebrow}</p>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{copy.title}</h1>
                  <p className="max-w-3xl text-muted-foreground">{copy.description}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {copy.metrics.map((metric, index) => {
                    const Icon = index === 0 ? Sparkles : index === 1 ? Database : Brain;
                    return (
                      <Card key={metric.label} className="border-border/70 bg-card/60">
                        <CardContent className="flex items-center gap-3 px-5 py-5">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{metric.label}</p>
                            <p className="mt-1 font-semibold text-foreground">{metric.value}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <Card className="border-primary/20 bg-card/60">
                <CardHeader>
                  <CardTitle className="text-2xl">{copy.previewTitle}</CardTitle>
                  <CardDescription>{copy.previewDesc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {previewLoading ? (
                    <div className="rounded-2xl border border-border/70 bg-background/50 p-5">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {copy.generating}
                      </div>
                    </div>
                  ) : preview ? (
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{copy.titleLabel}</p>
                        <p className="mt-2 font-semibold text-foreground">{preview.title}</p>
                      </div>
                      <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{copy.shortDescLabel}</p>
                        <p className="mt-2 text-sm text-foreground/90">{preview.shortDescription}</p>
                      </div>
                      <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{copy.summaryLabel}</p>
                        <div className="mt-3 space-y-2">
                          {preview.summaryBullets.map((bullet) => (
                            <div key={bullet} className="flex gap-3 text-sm text-foreground/90">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                              <p>{bullet}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-border/70 bg-background/40 p-5 text-sm text-muted-foreground">
                      {copy.helper}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="border-primary/20 bg-card/70 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
              <CardHeader>
                <CardTitle className="text-2xl">{copy.textareaLabel}</CardTitle>
                <CardDescription>{copy.helper}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={cn("rounded-3xl border border-border/70 bg-background/70 p-4 transition-all", previewLoading && "border-primary/30")}>
                  <Textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder={copy.textareaPlaceholder}
                    className="min-h-[180px] resize-none border-0 bg-transparent px-0 py-0 text-base shadow-none focus-visible:ring-0"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Wand2 className="h-4 w-4 text-primary" />
                    <span>{content.trim().length} characters</span>
                  </div>
                  <Button type="button" size="lg" onClick={handleSave} disabled={saveLoading || content.trim().length < 40}>
                    {saveLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {copy.saving}
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        {copy.updateButton}
                      </>
                    )}
                  </Button>
                </div>

                {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
              </CardContent>
            </Card>

            <div className="space-y-5">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">{copy.cardsTitle}</h2>
                <p className="text-muted-foreground">{copy.cardsDesc}</p>
              </div>

              {loadingList ? (
                <Card className="border-border/70 bg-card/60">
                  <CardContent className="flex items-center gap-3 px-6 py-6 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isMyanmar ? "Knowledge cards များ ရယူနေသည်..." : "Loading knowledge cards..."}
                  </CardContent>
                </Card>
              ) : knowledgeItems.length > 0 ? (
                <div className="grid gap-6 lg:grid-cols-2">
                  {knowledgeItems.map((item) => (
                    <KnowledgeCardItem key={item.id} item={item} isMyanmar={isMyanmar} />
                  ))}
                </div>
              ) : (
                <Card className="border-dashed border-border/70 bg-card/50">
                  <CardContent className="px-6 py-8 text-muted-foreground">{copy.emptyState}</CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
