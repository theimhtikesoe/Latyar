/**
 * MyanmarSearchBox.tsx
 * Killer UX: typeahead suggestions · smart category filters ·
 * language toggle · search history · skeleton loading ·
 * latency display · Neon-Noir design system
 */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface InternalResult {
  id: string;
  title: string;
  content: string;
  metadata: Record<string, unknown> | null;
  score: number;
}

interface NewsResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  date: string;
}

interface SearchResult {
  internalResults: InternalResult[];
  newsResults: NewsResult[];
  synthesizedSummary: string;
  message: string | null;
  latency?: { total: number; internal: number; news: number; synthesis: number };
  queryEnhanced?: string;
  error?: boolean;
}

type Language = "en" | "my";
type Category = "all" | "trade" | "export" | "import" | "economy" | "regulations";

interface Suggestion {
  text: string;
  lang: Language;
  category: Category;
}

// ─────────────────────────────────────────────────────────────
// Suggestion Corpus
// ─────────────────────────────────────────────────────────────

const SUGGESTIONS: Suggestion[] = [
  // English
  { text: "Myanmar export regulations 2026", lang: "en", category: "export" },
  { text: "Import license validity Myanmar", lang: "en", category: "import" },
  { text: "Myanmar customs duty rates", lang: "en", category: "trade" },
  { text: "Myanmar trade permit procedures", lang: "en", category: "trade" },
  { text: "Myanmar economy outlook 2026", lang: "en", category: "economy" },
  { text: "TradeNet 2.0 application process", lang: "en", category: "regulations" },
  { text: "HS code lookup Myanmar", lang: "en", category: "regulations" },
  { text: "Myanmar investment regulations FDI", lang: "en", category: "economy" },
  { text: "Special Economic Zone Myanmar", lang: "en", category: "economy" },
  { text: "Myanmar forex currency regulations", lang: "en", category: "regulations" },
  { text: "Myanmar food import standards", lang: "en", category: "import" },
  { text: "Myanmar manufacturing export incentives", lang: "en", category: "export" },
  // Myanmar
  { text: "ပို့ကုန်လိုင်စင် လျှောက်ထားနည်း", lang: "my", category: "export" },
  { text: "သွင်းကုန် HS Code ရှာဖွေရေး", lang: "my", category: "import" },
  { text: "ကုန်သွယ်ရေး စည်းမျဉ်း ၂၀၂၆", lang: "my", category: "trade" },
  { text: "မြန်မာ့စီးပွားရေး သုံးသပ်ချက်", lang: "my", category: "economy" },
  { text: "အကောက်ခွန် နှုန်းထားများ", lang: "my", category: "regulations" },
  { text: "ရေသန့်ဘူး တင်ပို့ခွင့် လျှောက်ထားရေး", lang: "my", category: "export" },
  { text: "ကုမ္ပဏီ မှတ်ပုံတင် လုပ်ငန်းစဉ်", lang: "my", category: "regulations" },
];

const CATEGORY_CONFIG: Record<Category, { label: string; icon: string; color: string }> = {
  all: { label: "All", icon: "◈", color: "#00d9ff" },
  trade: { label: "Trade", icon: "⇄", color: "#00d9ff" },
  export: { label: "Export", icon: "↗", color: "#4ade80" },
  import: { label: "Import", icon: "↙", color: "#f59e0b" },
  economy: { label: "Economy", icon: "▲", color: "#a78bfa" },
  regulations: { label: "Regulations", icon: "§", color: "#ff6b35" },
};

const RECENT_SEARCHES_KEY = "latyar_recent_searches";
const MAX_RECENT = 6;

// ─────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function useRecentSearches() {
  const [recent, setRecent] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) ?? "[]");
    } catch {
      return [];
    }
  });

  const addRecent = useCallback((q: string) => {
    setRecent((prev) => {
      const updated = [q, ...prev.filter((r) => r !== q)].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearRecent = useCallback(() => {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    setRecent([]);
  }, []);

  return { recent, addRecent, clearRecent };
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

function SkeletonBlock({ width = "100%", height = 16 }: { width?: string; height?: number }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 4,
        background: "linear-gradient(90deg, #1a1f3a 25%, #242d4a 50%, #1a1f3a 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
      }}
    />
  );
}

function ScoreBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color = pct > 80 ? "#4ade80" : pct > 60 ? "#00d9ff" : pct > 40 ? "#f59e0b" : "#6b7494";
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        fontFamily: "'Fira Code', monospace",
        color,
        background: `${color}18`,
        border: `1px solid ${color}40`,
        borderRadius: 4,
        padding: "2px 6px",
        letterSpacing: "0.04em",
      }}
    >
      {pct}%
    </span>
  );
}

function LatencyBar({ latency }: { latency: SearchResult["latency"] }) {
  if (!latency) return null;
  return (
    <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#6b7494", fontFamily: "'Fira Code', monospace" }}>
      <span>⏱ {latency.total}ms total</span>
      <span>· {latency.internal}ms internal</span>
      <span>· {latency.synthesis}ms synthesis</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export function MyanmarSearchBox() {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [category, setCategory] = useState<Category>("all");
  const [includeNews, setIncludeNews] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedSuggestion, setFocusedSuggestion] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const { recent, addRecent, clearRecent } = useRecentSearches();
  const debouncedQuery = useDebounce(query, 200);

  // Compute filtered suggestions
  const filteredSuggestions = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();
    return SUGGESTIONS.filter((s) => {
      const matchesLang = s.lang === language;
      const matchesCat = category === "all" || s.category === category;
      const matchesQuery = q === "" || s.text.toLowerCase().includes(q);
      return matchesLang && matchesCat && matchesQuery;
    }).slice(0, 5);
  }, [debouncedQuery, language, category]);

  const showSuggestions = isFocused && (filteredSuggestions.length > 0 || recent.length > 0);

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setShowDropdown(false);
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Execute search
  const executeSearch = useCallback(
    async (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;

      // Cancel any in-flight request
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setIsLoading(true);
      setShowDropdown(false);
      setIsFocused(false);
      setExpandedIds(new Set());
      addRecent(trimmed);

      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: trimmed,
            limit: 6,
            includeNews,
            includeSummary,
            language,
            category: category !== "all" ? category : undefined,
          }),
          signal: abortRef.current.signal,
        });

        const data: SearchResult = await response.json();

        if (!response.ok && !data) {
          throw new Error(`HTTP ${response.status}`);
        }

        setResult(data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setResult({
          internalResults: [],
          newsResults: [],
          synthesizedSummary: "",
          message:
            err instanceof Error
              ? err.message
              : "Network error. Please check your connection and try again.",
          error: true,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [includeNews, includeSummary, language, category, addRecent]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allSugs = [
      ...filteredSuggestions.map((s) => s.text),
      ...recent,
    ];

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedSuggestion((prev) => Math.min(prev + 1, allSugs.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedSuggestion((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedSuggestion >= 0 && allSugs[focusedSuggestion]) {
        const picked = allSugs[focusedSuggestion];
        setQuery(picked);
        setFocusedSuggestion(-1);
        executeSearch(picked);
      } else {
        executeSearch(query);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setFocusedSuggestion(-1);
      inputRef.current?.blur();
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const totalResults =
    (result?.internalResults?.length ?? 0) + (result?.newsResults?.length ?? 0);

  // ── Styles ─────────────────────────────────────────────────

  const styles = {
    root: {
      fontFamily: "'Inter', system-ui, sans-serif",
      background: "#0a0e27",
      minHeight: "100vh",
      color: "#e8ecf1",
      padding: "40px 24px",
    } as React.CSSProperties,

    header: {
      maxWidth: 760,
      margin: "0 auto 36px",
      textAlign: "center" as const,
    },

    logo: {
      fontFamily: "'Poppins', system-ui, sans-serif",
      fontSize: 36,
      fontWeight: 700,
      color: "#00d9ff",
      textShadow: "0 0 30px rgba(0,217,255,0.5)",
      letterSpacing: "-0.02em",
      marginBottom: 8,
    },

    subtitle: {
      fontSize: 14,
      color: "#6b7494",
      letterSpacing: "0.08em",
      textTransform: "uppercase" as const,
    },

    container: {
      maxWidth: 760,
      margin: "0 auto",
    },

    searchWrap: {
      position: "relative" as const,
      marginBottom: 20,
    },

    searchBar: {
      display: "flex",
      alignItems: "center",
      background: "#1a1f3a",
      border: `1.5px solid ${isFocused ? "rgba(0,217,255,0.5)" : "rgba(0,217,255,0.12)"}`,
      borderRadius: 12,
      padding: "0 16px",
      gap: 12,
      transition: "border-color 0.2s, box-shadow 0.2s",
      boxShadow: isFocused
        ? "0 0 0 3px rgba(0,217,255,0.1), 0 0 20px rgba(0,217,255,0.15)"
        : "0 4px 16px rgba(0,0,0,0.3)",
    } as React.CSSProperties,

    input: {
      flex: 1,
      background: "transparent",
      border: "none",
      outline: "none",
      fontSize: 16,
      color: "#e8ecf1",
      padding: "16px 0",
      caretColor: "#00d9ff",
      fontFamily: "'Inter', system-ui, sans-serif",
    } as React.CSSProperties,

    searchBtn: {
      background: isLoading
        ? "rgba(0,217,255,0.15)"
        : "linear-gradient(135deg, #00d9ff, #0099cc)",
      border: "none",
      borderRadius: 8,
      padding: "8px 20px",
      color: isLoading ? "#00d9ff" : "#0a0e27",
      fontWeight: 600,
      fontSize: 14,
      cursor: isLoading ? "not-allowed" : "pointer",
      transition: "all 0.2s",
      whiteSpace: "nowrap" as const,
      display: "flex",
      alignItems: "center",
      gap: 6,
      fontFamily: "'Inter', system-ui, sans-serif",
    } as React.CSSProperties,

    dropdown: {
      position: "absolute" as const,
      top: "calc(100% + 8px)",
      left: 0,
      right: 0,
      background: "#1a1f3a",
      border: "1px solid rgba(0,217,255,0.15)",
      borderRadius: 12,
      overflow: "hidden",
      zIndex: 100,
      boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
    },

    filters: {
      display: "flex",
      gap: 10,
      marginBottom: 16,
      flexWrap: "wrap" as const,
    },

    toggles: {
      display: "flex",
      gap: 16,
      marginBottom: 24,
      alignItems: "center",
      flexWrap: "wrap" as const,
    },

    langToggle: {
      display: "flex",
      background: "#1a1f3a",
      border: "1px solid rgba(0,217,255,0.12)",
      borderRadius: 8,
      overflow: "hidden",
    },

    card: {
      background: "#1a1f3a",
      border: "1px solid rgba(0,217,255,0.08)",
      borderRadius: 12,
      padding: 20,
      marginBottom: 12,
      transition: "border-color 0.2s, box-shadow 0.2s",
      cursor: "pointer",
    } as React.CSSProperties,

    summaryCard: {
      background: "linear-gradient(135deg, rgba(0,217,255,0.05), rgba(181,55,242,0.03))",
      border: "1px solid rgba(0,217,255,0.2)",
      borderRadius: 12,
      padding: 24,
      marginBottom: 20,
      position: "relative" as const,
      overflow: "hidden",
    },

    newsCard: {
      background: "#1a1f3a",
      border: "1px solid rgba(255,107,53,0.12)",
      borderRadius: 12,
      padding: 16,
      marginBottom: 10,
      textDecoration: "none",
      display: "block",
      transition: "border-color 0.2s",
    } as React.CSSProperties,

    sectionTitle: {
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.1em",
      textTransform: "uppercase" as const,
      color: "#6b7494",
      marginBottom: 12,
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
  };

  const globalCss = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500;600&family=Fira+Code&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .result-card:hover {
      border-color: rgba(0,217,255,0.3) !important;
      box-shadow: 0 0 20px rgba(0,217,255,0.08);
    }
    .news-card:hover {
      border-color: rgba(255,107,53,0.35) !important;
    }
    .category-chip:hover {
      opacity: 0.85;
    }
    .search-btn:hover:not(:disabled) {
      box-shadow: 0 0 20px rgba(0,217,255,0.4) !important;
      transform: translateY(-1px);
    }
    .suggestion-item:hover {
      background: rgba(0,217,255,0.06) !important;
    }
    .lang-btn:hover {
      background: rgba(0,217,255,0.08) !important;
    }
    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 36px;
      height: 20px;
    }
    .toggle-switch input { opacity: 0; width: 0; height: 0; }
    .slider {
      position: absolute; cursor: pointer;
      top: 0; left: 0; right: 0; bottom: 0;
      background: #242d4a;
      border-radius: 20px;
      transition: 0.2s;
      border: 1px solid rgba(0,217,255,0.2);
    }
    .slider::before {
      position: absolute; content: "";
      height: 14px; width: 14px;
      left: 2px; bottom: 2px;
      background: #6b7494;
      border-radius: 50%;
      transition: 0.2s;
    }
    input:checked + .slider { background: rgba(0,217,255,0.2); border-color: rgba(0,217,255,0.5); }
    input:checked + .slider::before { transform: translateX(16px); background: #00d9ff; box-shadow: 0 0 8px rgba(0,217,255,0.5); }
    
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #1a1f3a; }
    ::-webkit-scrollbar-thumb { background: rgba(0,217,255,0.3); border-radius: 2px; }
  `;

  const renderDropdown = () => {
    if (!showSuggestions && !showDropdown) return null;

    return (
      <div ref={dropdownRef} style={styles.dropdown}>
        {/* Smart suggestions */}
        {filteredSuggestions.length > 0 && (
          <div style={{ padding: "8px 0" }}>
            <div style={{ padding: "6px 16px", fontSize: 10, color: "#6b7494", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              ◈ Smart Suggestions
            </div>
            {filteredSuggestions.map((s, i) => {
              const cat = CATEGORY_CONFIG[s.category];
              const isFoc = focusedSuggestion === i;
              return (
                <div
                  key={s.text}
                  className="suggestion-item"
                  style={{
                    padding: "10px 16px",
                    cursor: "pointer",
                    background: isFoc ? "rgba(0,217,255,0.08)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setQuery(s.text);
                    executeSearch(s.text);
                  }}
                >
                  <span style={{ color: cat.color, fontSize: 12, width: 16, textAlign: "center" }}>{cat.icon}</span>
                  <span style={{ flex: 1, fontSize: 14, color: "#e8ecf1" }}>{s.text}</span>
                  <span style={{ fontSize: 10, color: "#6b7494", background: `${cat.color}15`, padding: "2px 6px", borderRadius: 4 }}>
                    {cat.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Recent searches */}
        {recent.length > 0 && (
          <div style={{ padding: "8px 0", borderTop: filteredSuggestions.length > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
            <div style={{ padding: "6px 16px", fontSize: 10, color: "#6b7494", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>↺ Recent</span>
              <button
                onMouseDown={(e) => { e.preventDefault(); clearRecent(); }}
                style={{ background: "none", border: "none", color: "#6b7494", cursor: "pointer", fontSize: 10 }}
              >
                Clear
              </button>
            </div>
            {recent.map((r, i) => {
              const idx = filteredSuggestions.length + i;
              const isFoc = focusedSuggestion === idx;
              return (
                <div
                  key={r}
                  className="suggestion-item"
                  style={{
                    padding: "9px 16px",
                    cursor: "pointer",
                    background: isFoc ? "rgba(0,217,255,0.06)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setQuery(r);
                    executeSearch(r);
                  }}
                >
                  <span style={{ color: "#6b7494", fontSize: 13 }}>↵</span>
                  <span style={{ fontSize: 14, color: "#a0aac4" }}>{r}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <style>{globalCss}</style>

      <div style={styles.root}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>LatYar</div>
          <div style={styles.subtitle}>
            Myanmar Economy Intelligence Platform
          </div>
        </div>

        <div style={styles.container}>
          {/* Language Toggle + Toggles */}
          <div style={styles.toggles}>
            {/* Language toggle */}
            <div style={styles.langToggle}>
              {(["en", "my"] as Language[]).map((l) => (
                <button
                  key={l}
                  className="lang-btn"
                  onClick={() => setLanguage(l)}
                  style={{
                    background:
                      language === l
                        ? "rgba(0,217,255,0.15)"
                        : "transparent",
                    border: "none",
                    color: language === l ? "#00d9ff" : "#6b7494",
                    padding: "7px 14px",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: language === l ? 600 : 400,
                    fontFamily: "'Inter', system-ui, sans-serif",
                    transition: "all 0.2s",
                    borderRight: l === "en" ? "1px solid rgba(0,217,255,0.12)" : "none",
                  }}
                >
                  {l === "en" ? "🇬🇧 EN" : "🇲🇲 MY"}
                </button>
              ))}
            </div>

            {/* News toggle */}
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: includeNews ? "#e8ecf1" : "#6b7494" }}>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={includeNews}
                  onChange={(e) => setIncludeNews(e.target.checked)}
                />
                <span className="slider" />
              </label>
              Include News
            </label>

            {/* Summary toggle */}
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: includeSummary ? "#e8ecf1" : "#6b7494" }}>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={includeSummary}
                  onChange={(e) => setIncludeSummary(e.target.checked)}
                />
                <span className="slider" />
              </label>
              AI Summary
            </label>
          </div>

          {/* Search bar */}
          <div style={styles.searchWrap}>
            <div style={styles.searchBar}>
              {/* Search icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isFocused ? "#00d9ff" : "#6b7494"} strokeWidth="2" style={{ flexShrink: 0, transition: "stroke 0.2s" }}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>

              <input
                ref={inputRef}
                type="text"
                style={styles.input}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowDropdown(true);
                  setFocusedSuggestion(-1);
                }}
                onFocus={() => {
                  setIsFocused(true);
                  setShowDropdown(true);
                }}
                onKeyDown={handleKeyDown}
                placeholder={
                  language === "my"
                    ? "ရှာဖွေလိုသည့် ကုန်သွယ်ရေးအချက်အလက် ထည့်ပါ..."
                    : "Search trade regulations, HS codes, economy trends..."
                }
                autoComplete="off"
                spellCheck="false"
              />

              {/* Clear */}
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setResult(null);
                    inputRef.current?.focus();
                  }}
                  style={{ background: "none", border: "none", color: "#6b7494", cursor: "pointer", padding: 4, display: "flex" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}

              <button
                className="search-btn"
                style={styles.searchBtn}
                onClick={() => executeSearch(query)}
                disabled={isLoading || !query.trim()}
              >
                {isLoading ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Searching
                  </>
                ) : (
                  "Search →"
                )}
              </button>
            </div>

            {/* Dropdown */}
            {renderDropdown()}
          </div>

          {/* Category filter chips */}
          <div style={styles.filters}>
            {(Object.entries(CATEGORY_CONFIG) as [Category, typeof CATEGORY_CONFIG[Category]][]).map(
              ([key, cfg]) => (
                <button
                  key={key}
                  className="category-chip"
                  onClick={() => setCategory(key)}
                  style={{
                    background:
                      category === key
                        ? `${cfg.color}20`
                        : "rgba(255,255,255,0.03)",
                    border: `1px solid ${category === key ? cfg.color + "60" : "rgba(255,255,255,0.08)"}`,
                    color: category === key ? cfg.color : "#a0aac4",
                    borderRadius: 20,
                    padding: "6px 14px",
                    fontSize: 13,
                    cursor: "pointer",
                    fontWeight: category === key ? 600 : 400,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    transition: "all 0.2s",
                    fontFamily: "'Inter', system-ui, sans-serif",
                    boxShadow:
                      category === key
                        ? `0 0 12px ${cfg.color}20`
                        : "none",
                  }}
                >
                  <span>{cfg.icon}</span>
                  {cfg.label}
                </button>
              )
            )}
          </div>

          {/* ── Loading skeleton ── */}
          {isLoading && (
            <div style={{ animation: "fadeUp 0.3s ease" }}>
              {/* Summary skeleton */}
              <div style={{ ...styles.summaryCard, marginBottom: 20 }}>
                <div style={{ marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
                  <SkeletonBlock width="60px" height={12} />
                </div>
                <SkeletonBlock height={14} />
                <div style={{ marginTop: 8 }}>
                  <SkeletonBlock height={14} />
                </div>
                <div style={{ marginTop: 8 }}>
                  <SkeletonBlock width="75%" height={14} />
                </div>
              </div>

              {/* Doc skeletons */}
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ ...styles.card, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <SkeletonBlock width="55%" height={14} />
                    <SkeletonBlock width="40px" height={18} />
                  </div>
                  <SkeletonBlock height={12} />
                  <div style={{ marginTop: 6 }}>
                    <SkeletonBlock width="85%" height={12} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Results ── */}
          {!isLoading && result && (
            <div style={{ animation: "fadeUp 0.35s ease" }}>
              {/* Error / message banner */}
              {(result.error || result.message) && (
                <div
                  style={{
                    background: result.error
                      ? "rgba(239,68,68,0.08)"
                      : "rgba(0,217,255,0.06)",
                    border: `1px solid ${result.error ? "rgba(239,68,68,0.3)" : "rgba(0,217,255,0.2)"}`,
                    borderRadius: 10,
                    padding: "12px 16px",
                    marginBottom: 16,
                    fontSize: 14,
                    color: result.error ? "#fca5a5" : "#a0aac4",
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <span>{result.error ? "⚠" : "ℹ"}</span>
                  {result.message}
                  {result.error && (
                    <button
                      onClick={() => executeSearch(query)}
                      style={{
                        marginLeft: "auto",
                        background: "none",
                        border: "1px solid rgba(239,68,68,0.4)",
                        color: "#fca5a5",
                        borderRadius: 6,
                        padding: "4px 10px",
                        cursor: "pointer",
                        fontSize: 12,
                        fontFamily: "'Inter', system-ui, sans-serif",
                      }}
                    >
                      Retry
                    </button>
                  )}
                </div>
              )}

              {/* Enhanced query hint */}
              {result.queryEnhanced && (
                <div style={{ fontSize: 12, color: "#6b7494", marginBottom: 12, fontFamily: "'Fira Code', monospace" }}>
                  ↪ Enhanced: <span style={{ color: "#a0aac4" }}>{result.queryEnhanced}</span>
                </div>
              )}

              {/* Stats row */}
              {totalResults > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: "#6b7494" }}>
                    <span style={{ color: "#00d9ff", fontWeight: 600 }}>{totalResults}</span> results
                    {result.internalResults.length > 0 && ` · ${result.internalResults.length} internal`}
                    {result.newsResults.length > 0 && ` · ${result.newsResults.length} news`}
                  </div>
                  <LatencyBar latency={result.latency} />
                </div>
              )}

              {/* AI Summary */}
              {result.synthesizedSummary && (
                <div style={styles.summaryCard}>
                  {/* Glow orb decoration */}
                  <div style={{
                    position: "absolute",
                    top: -30,
                    right: -30,
                    width: 120,
                    height: 120,
                    background: "radial-gradient(circle, rgba(0,217,255,0.12), transparent 70%)",
                    pointerEvents: "none",
                  }} />

                  <div style={{ ...styles.sectionTitle, color: "#00d9ff" }}>
                    <span>◈</span> AI Analysis
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      lineHeight: 1.75,
                      color: "#e8ecf1",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {result.synthesizedSummary}
                  </div>
                </div>
              )}

              {/* Internal documents */}
              {result.internalResults.length > 0 && (
                <>
                  <div style={styles.sectionTitle}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6" />
                    </svg>
                    Internal Documents
                  </div>

                  {result.internalResults.map((doc) => {
                    const isExpanded = expandedIds.has(doc.id);
                    const preview = doc.content.slice(0, 200);
                    return (
                      <div
                        key={doc.id}
                        className="result-card"
                        style={styles.card}
                        onClick={() => toggleExpand(doc.id)}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#e8ecf1", flex: 1, marginRight: 12, lineHeight: 1.4 }}>
                            {doc.title || "Untitled Document"}
                          </h3>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                            <ScoreBadge score={doc.score} />
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#6b7494"
                              strokeWidth="2"
                              style={{ transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "none" }}
                            >
                              <path d="M6 9l6 6 6-6" />
                            </svg>
                          </div>
                        </div>

                        <p style={{ fontSize: 14, color: "#a0aac4", lineHeight: 1.65, margin: 0 }}>
                          {isExpanded ? doc.content : `${preview}${doc.content.length > 200 ? "…" : ""}`}
                        </p>

                        {doc.metadata && Object.keys(doc.metadata).length > 0 && (
                          <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {Object.entries(doc.metadata)
                              .slice(0, 3)
                              .map(([k, v]) => (
                                <span
                                  key={k}
                                  style={{
                                    fontSize: 11,
                                    color: "#6b7494",
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: 4,
                                    padding: "2px 7px",
                                  }}
                                >
                                  {k}: {String(v)}
                                </span>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}

              {/* News results */}
              {result.newsResults.length > 0 && (
                <>
                  <div style={{ ...styles.sectionTitle, marginTop: 24, color: "#ff6b35" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2-2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                      <path d="M18 14h-8M15 18h-5M10 6h8v4h-8z" />
                    </svg>
                    Latest News
                  </div>

                  {result.newsResults.map((news, i) => (
                    <a
                      key={i}
                      href={news.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="news-card"
                      style={styles.newsCard}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                        <h4 style={{ fontSize: 14, fontWeight: 600, color: "#e8ecf1", flex: 1, marginRight: 10, lineHeight: 1.4 }}>
                          {news.title}
                        </h4>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7494" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </div>
                      <p style={{ fontSize: 13, color: "#a0aac4", lineHeight: 1.6, margin: "0 0 8px" }}>
                        {news.snippet}
                      </p>
                      <div style={{ display: "flex", gap: 10, fontSize: 11, color: "#6b7494" }}>
                        <span style={{ color: "#ff6b35" }}>{news.source}</span>
                        <span>·</span>
                        <span>{news.date}</span>
                      </div>
                    </a>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !result && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7494" }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>◈</div>
              <div style={{ fontSize: 16, marginBottom: 8, color: "#a0aac4" }}>
                Myanmar Economy Intelligence
              </div>
              <div style={{ fontSize: 14 }}>
                Search trade regulations, HS codes, market trends, and more.
              </div>
              <div style={{ fontSize: 13, marginTop: 6 }}>
                Supports Myanmar (မြန်မာ) and English queries.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MyanmarSearchBox;
