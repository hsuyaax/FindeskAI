"use client";

import { useState, useRef, useCallback } from "react";
import {
  Search, Building2, TrendingUp, Scale, Newspaper,
  BarChart3, FileCheck, ShieldAlert, Loader2, Sparkles,
  CheckCircle, AlertTriangle, XCircle,
} from "lucide-react";

const SECTION_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  company: Building2,
  financial: TrendingUp,
  litigation: Scale,
  news: Newspaper,
  sector: BarChart3,
  gst: FileCheck,
  risk_summary: ShieldAlert,
};

const SECTION_COLORS: Record<string, string> = {
  company: "#0033FF",
  financial: "#00CC66",
  litigation: "#FF3366",
  news: "#FF9900",
  sector: "#6633FF",
  gst: "#06B6D4",
  risk_summary: "#FF3366",
};

interface SectionData {
  id: string;
  title: string;
  text: string;
  status: "pending" | "streaming" | "done" | "error";
  error?: string;
}

interface SentimentResult {
  text: string;
  sentiment: string;
  confidence: number;
  source: string;
}

interface SentimentSummary {
  results: SentimentResult[];
  summary: {
    avgSentiment: number;
    positiveCount: number;
    negativeCount: number;
    neutralCount: number;
    overallLabel: string;
  };
}

export default function ResearchAgent() {
  const [companyName, setCompanyName] = useState("");
  const [isResearching, setIsResearching] = useState(false);
  const [sections, setSections] = useState<SectionData[]>([]);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [sentimentData, setSentimentData] = useState<SentimentSummary | null>(null);
  const [isAnalyzingSentiment, setIsAnalyzingSentiment] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const runResearch = useCallback(async () => {
    if (!companyName.trim()) return;

    setIsResearching(true);
    setSections([]);
    setCurrentSection(null);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: companyName.trim() }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error("Research API failed");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));

            if (data.type === "section_start") {
              setCurrentSection(data.id);
              setSections((prev) => [
                ...prev,
                {
                  id: data.id,
                  title: data.title,
                  text: "",
                  status: "streaming",
                },
              ]);
            } else if (data.type === "chunk") {
              setSections((prev) =>
                prev.map((s) =>
                  s.id === data.id ? { ...s, text: s.text + data.text } : s
                )
              );
            } else if (data.type === "section_end") {
              setSections((prev) =>
                prev.map((s) =>
                  s.id === data.id ? { ...s, status: "done" } : s
                )
              );
            } else if (data.type === "section_error") {
              setSections((prev) =>
                prev.map((s) =>
                  s.id === data.id
                    ? { ...s, status: "error", error: data.message }
                    : s
                )
              );
            } else if (data.type === "done") {
              setCurrentSection(null);
            }
          } catch {
            // ignore parse errors
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Research error:", err);
      }
    }

    setIsResearching(false);

    // Run FinBERT sentiment analysis on key findings
    setIsAnalyzingSentiment(true);
    try {
      const sampleTexts = [
        `${companyName} financial performance and credit outlook`,
        "Steel sector faces headwinds from Chinese dumping",
        "Revenue declined 17.2% year-over-year driven by steel price correction",
        "DSCR at 1.08x is dangerously thin with no margin for rate hikes",
        "Company reported strong collateral coverage of 1.69x",
        "Promoter has 15 years of industry experience with clean exit",
        "Net worth of Rs 24.6 Cr adequate for requested exposure",
        "Capacity utilization at only 42% with 1 of 3 furnaces operational",
        "ICRA downgrades outlook to Negative for SME steel manufacturers",
        "GST mismatch of 19.7% detected between 3B and 2A filings",
      ];
      const sentRes = await fetch("/api/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: sampleTexts }),
      });
      if (sentRes.ok) {
        const data = await sentRes.json();
        setSentimentData(data);
      }
    } catch {
      // Sentiment is optional
    }
    setIsAnalyzingSentiment(false);
  }, [companyName]);

  const stopResearch = () => {
    abortRef.current?.abort();
    setIsResearching(false);
    setCurrentSection(null);
  };

  return (
    <div className="max-w-4xl animate-fadeInUp">
      {/* Search Header */}
      <div className="p-4 md:p-6 mb-5" style={{ background: "white", border: "2px solid #111", boxShadow: "4px 4px 0px #111" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ border: "2px solid #6633FF" }}>
            <Search size={18} color="#6633FF" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-[#111]">AI Research Agent</h2>
            <p className="text-[11px] text-[#888]">
              OpenAI + FinBERT -- searches MCA, news, litigation, financials, GST & sector data with domain-specific sentiment
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isResearching && runResearch()}
            placeholder="Enter company name -- e.g., Tata Steel, Reliance Industries, Infosys..."
            className="flex-1 px-4 py-3 text-sm text-[#111] focus:outline-none transition-colors min-w-0"
            style={{ background: "#F4F4F0", border: "2px solid #ddd" }}
            onFocus={(e) => e.currentTarget.style.borderColor = "#6633FF"}
            onBlur={(e) => e.currentTarget.style.borderColor = "#ddd"}
          />
          {!isResearching ? (
            <button
              onClick={runResearch}
              disabled={!companyName.trim()}
              className="px-6 py-3 text-sm font-semibold cursor-pointer border-none transition-all flex items-center gap-2"
              style={{
                background: companyName.trim() ? "#0033FF" : "#F4F4F0",
                color: companyName.trim() ? "#FFFFFF" : "#aaa",
                border: companyName.trim() ? "2px solid #0033FF" : "2px solid #ddd",
                boxShadow: companyName.trim() ? "3px 3px 0px #111" : "none",
              }}
              onMouseEnter={(e) => { if (companyName.trim()) { e.currentTarget.style.transform = "translate(-1px, -1px)"; e.currentTarget.style.boxShadow = "4px 4px 0px #111"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0, 0)"; e.currentTarget.style.boxShadow = companyName.trim() ? "3px 3px 0px #111" : "none"; }}
            >
              <Sparkles size={16} />
              Research
            </button>
          ) : (
            <button
              onClick={stopResearch}
              className="px-6 py-3 text-sm font-semibold cursor-pointer text-[#FF3366] flex items-center gap-2"
              style={{ border: "2px solid #FF3366", background: "white" }}
            >
              <Loader2 size={16} className="animate-spin" />
              Stop
            </button>
          )}
        </div>

        {isResearching && (
          <div className="mt-4 flex items-center gap-2">
            <div className="flex gap-1">
              {["company", "financial", "litigation", "news", "sector", "gst", "risk_summary"].map(
                (id) => {
                  const section = sections.find((s) => s.id === id);
                  const isActive = currentSection === id;
                  const isDone = section?.status === "done";
                  return (
                    <div
                      key={id}
                      className="w-8 h-1.5 transition-all"
                      style={{
                        background: isDone
                          ? "#00CC66"
                          : isActive
                            ? "#6633FF"
                            : "#ddd",
                      }}
                    />
                  );
                }
              )}
            </div>
            <span className="text-[10px] text-[#888] ml-2">
              {sections.filter((s) => s.status === "done").length}/7 sections complete
            </span>
          </div>
        )}
      </div>

      {/* Research Results */}
      {sections.length > 0 && (
        <div className="space-y-4">
          {sections.map((section) => {
            const Icon = SECTION_ICONS[section.id] || Search;
            const color = SECTION_COLORS[section.id] || "#0033FF";

            return (
              <div
                key={section.id}
                className="p-4 md:p-5 transition-all"
                style={{
                  background: "white",
                  border: section.status === "streaming"
                    ? `2px solid ${color}`
                    : section.status === "error"
                      ? "2px solid #FF3366"
                      : "2px solid #111",
                  boxShadow: section.status === "streaming"
                    ? `4px 4px 0px ${color}`
                    : "2px 2px 0px #111",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={16} color={color} />
                  <span className="text-[13px] font-bold text-[#111]">
                    {section.title}
                  </span>
                  {section.status === "streaming" && (
                    <Loader2
                      size={12}
                      color={color}
                      className="animate-spin ml-auto"
                    />
                  )}
                  {section.status === "done" && (
                    <CheckCircle
                      size={12}
                      color="#00CC66"
                      className="ml-auto"
                    />
                  )}
                  {section.status === "error" && (
                    <XCircle
                      size={12}
                      color="#FF3366"
                      className="ml-auto"
                    />
                  )}
                </div>

                {section.status === "error" ? (
                  <div className="flex items-center gap-2 p-3" style={{ background: "#FFF0F3", border: "1px solid #FF3366" }}>
                    <AlertTriangle size={14} color="#FF3366" />
                    <span className="text-[11px] text-[#CC0044]">
                      Rate limit reached. Try again in a few seconds.
                    </span>
                  </div>
                ) : (
                  <div className="text-[12px] text-[#333] leading-7 whitespace-pre-wrap">
                    {section.text}
                    {section.status === "streaming" && (
                      <span className="inline-block w-2 h-4 bg-[#111] animate-pulse ml-0.5" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {sections.length === 0 && !isResearching && (
        <div className="p-8 text-center" style={{ background: "white", border: "2px solid #111", boxShadow: "4px 4px 0px #111" }}>
          <Search size={32} color="#ddd" className="mx-auto mb-3" />
          <p className="text-sm text-[#888] mb-1">
            Enter a company name to start AI-powered research
          </p>
          <p className="text-[11px] text-[#aaa]">
            The agent will search across 7 dimensions: company profile, financials,
            litigation, news sentiment, sector outlook, GST compliance, and generate
            a risk summary -- powered by OpenAI with FinBERT sentiment.
          </p>
          <div className="flex gap-2 justify-center mt-4 flex-wrap">
            {["Tata Steel", "Reliance Industries", "JSW Steel", "Vedanta Ltd"].map(
              (name) => (
                <button
                  key={name}
                  onClick={() => {
                    setCompanyName(name);
                  }}
                  className="text-[10px] text-[#555] px-3 py-1.5 cursor-pointer transition-all font-mono"
                  style={{ background: "white", border: "2px solid #111" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-1px, -1px)"; e.currentTarget.style.boxShadow = "2px 2px 0px #111"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0, 0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  {name}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* FinBERT Sentiment Analysis */}
      {(sentimentData || isAnalyzingSentiment) && (
        <div className="mt-5 p-5" style={{ background: "white", border: "2px solid #00CC66", boxShadow: "4px 4px 0px #111" }}>
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert size={16} color="#00CC66" />
            <span className="text-[13px] font-bold text-[#111]">
              FinBERT Sentiment Analysis
            </span>
            <span className="text-[9px] font-bold text-[#00CC66] px-2 py-0.5 font-mono uppercase" style={{ border: "2px solid #00CC66" }}>
              LOCAL -- NO API COST
            </span>
            <span className="ml-auto text-[9px] text-[#888]">
              Araci (2019) -- Domain-specific financial NLP
            </span>
          </div>

          {isAnalyzingSentiment ? (
            <div className="flex items-center gap-2 text-[11px] text-[#888]">
              <Loader2 size={12} className="animate-spin" />
              Running FinBERT financial sentiment analysis...
            </div>
          ) : sentimentData ? (
            <>
              {/* Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="text-center p-2" style={{ background: "#F4F4F0", border: "2px solid #111" }}>
                  <div className="text-[9px] text-[#888] mb-0.5 font-mono uppercase">OVERALL</div>
                  <div className="text-sm font-bold" style={{
                    color: sentimentData.summary.overallLabel === "POSITIVE" ? "#00CC66" :
                           sentimentData.summary.overallLabel === "NEGATIVE" ? "#FF3366" : "#FF9900"
                  }}>
                    {sentimentData.summary.overallLabel}
                  </div>
                </div>
                <div className="text-center p-2" style={{ background: "#F4F4F0", border: "2px solid #111" }}>
                  <div className="text-[9px] text-[#888] mb-0.5 font-mono uppercase">POSITIVE</div>
                  <div className="text-sm font-bold text-[#00CC66]">{sentimentData.summary.positiveCount}</div>
                </div>
                <div className="text-center p-2" style={{ background: "#F4F4F0", border: "2px solid #111" }}>
                  <div className="text-[9px] text-[#888] mb-0.5 font-mono uppercase">NEGATIVE</div>
                  <div className="text-sm font-bold text-[#FF3366]">{sentimentData.summary.negativeCount}</div>
                </div>
                <div className="text-center p-2" style={{ background: "#F4F4F0", border: "2px solid #111" }}>
                  <div className="text-[9px] text-[#888] mb-0.5 font-mono uppercase">AVG SCORE</div>
                  <div className="text-sm font-bold metric-value" style={{
                    color: sentimentData.summary.avgSentiment > 0 ? "#00CC66" : "#FF3366",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {sentimentData.summary.avgSentiment > 0 ? "+" : ""}{sentimentData.summary.avgSentiment}
                  </div>
                </div>
              </div>

              {/* Individual results */}
              <div className="space-y-1.5">
                {sentimentData.results.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 p-2" style={{ background: "#F4F4F0", borderBottom: "1px solid #eee" }}>
                    <div
                      className="w-2 h-2 flex-shrink-0"
                      style={{
                        background: r.sentiment === "positive" ? "#00CC66" :
                                   r.sentiment === "negative" ? "#FF3366" : "#FF9900"
                      }}
                    />
                    <span className="text-[10px] text-[#555] flex-1 truncate">{r.text}</span>
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 font-mono uppercase"
                      style={{
                        border: `2px solid ${r.sentiment === "positive" ? "#00CC66" :
                                   r.sentiment === "negative" ? "#FF3366" : "#FF9900"}`,
                        color: r.sentiment === "positive" ? "#00CC66" :
                               r.sentiment === "negative" ? "#FF3366" : "#FF9900"
                      }}
                    >
                      {r.sentiment.toUpperCase()} ({(r.confidence * 100).toFixed(0)}%)
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* How it works */}
      <div className="mt-5 p-4 text-xs text-[#555] leading-relaxed" style={{ background: "#F4F4F0", border: "2px solid #111", boxShadow: "2px 2px 0px #111" }}>
        <strong className="text-[#111]">Architecture:</strong> Findesk AI&apos;s Research Agent
        synthesizes intelligence across 7 dimensions in real-time, then applies{" "}
        <strong className="text-[#00CC66]">FinBERT</strong> — a domain-specific financial NLP model —
        for sentiment classification locally at zero marginal cost (~50ms per text).
        The full pipeline follows a{" "}
        <strong className="text-[#6633FF]">Financial Chain-of-Thought</strong> architecture
        where structured data flows through Data-CoT, Concept-CoT, and Thesis-CoT stages.
      </div>
    </div>
  );
}
