"use client";

import { useState, useRef, useCallback } from "react";
import { Users, Eye, Sparkles, Loader2, AlertTriangle } from "lucide-react";
import { AGENT_DEBATE, COMPANY, FIVE_CS } from "@/data/mockData";
import { useAnalysis } from "@/lib/AnalysisContext";

const AGENTS_META = {
  hawk: { name: "Hawk Agent", role: "Risk Assessor", emoji: "\u{1F985}", color: "#FF3366" },
  dove: { name: "Dove Agent", role: "Relationship Manager", emoji: "\u{1F54A}\uFE0F", color: "#00CC66" },
  owl: { name: "Owl Agent", role: "Chief Credit Officer", emoji: "\u{1F989}", color: "#0033FF" },
};

export default function CreditCommittee() {
  const [isLive, setIsLive] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [liveTexts, setLiveTexts] = useState<Record<string, string>>({
    hawk: "",
    dove: "",
    owl: "",
  });
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const { analysis, isUsingMockData } = useAnalysis();

  // Build context from real analysis or mock data
  function buildCompanyContext() {
    if (!isUsingMockData && analysis) {
      const scores = analysis.fiveCScores
        ? Object.entries(analysis.fiveCScores).map(([k, v]) => `${k}: ${v.score}/100 (${v.label})`).join(", ")
        : "N/A";
      const risks = analysis.keyRisks?.map(r => `${r.factor}: ${r.detail}`).join(". ") || "";
      const strengths = analysis.keyStrengths?.map(s => `${s.factor}: ${s.detail}`).join(". ") || "";
      return `Company: ${analysis.company.name}
Sector: ${analysis.company.sector}
${analysis.company.requestedLoan ? `Loan Requested: ${analysis.company.requestedLoan}` : ""}
Five C Scores: ${scores}
Composite Score: ${analysis.compositeScore || "N/A"}/100
Key Risks: ${risks}
Key Strengths: ${strengths}
${analysis.ratios ? `Ratios: DSCR ${analysis.ratios.dscr || "N/A"}x, D/E ${analysis.ratios.deRatio || "N/A"}x, RoA ${analysis.ratios.roa || "N/A"}%, Credit Cost ${analysis.ratios.creditCost || "N/A"}%` : ""}
${analysis.executiveSummary || ""}`;
    }
    // Fallback to mock
    const scores = Object.entries(FIVE_CS)
      .map(([k, v]) => `${k}: ${v.score}/100 (${v.label})`)
      .join(", ");
    return `Company: ${COMPANY.name}
Sector: ${COMPANY.sector}
Loan Requested: ${COMPANY.requestedLoan}
Purpose: ${COMPANY.purpose}
Five C Scores: ${scores}
Key Issues: GST 3B vs 2A mismatch of \u20B914.3Cr (19.7%), DSCR 1.08x, capacity utilization 42%, client concentration 68%, revenue decline 17.2% YoY
Strengths: Collateral coverage 1.69x, Net Worth \u20B924.6Cr, Promoter experience 15 years, clean MCA compliance
CIBIL: 682 (below 700 threshold), 2 active litigations`;
  }

  const runLiveDebate = useCallback(async () => {
    setIsLive(true);
    setIsStreaming(true);
    setLiveTexts({ hawk: "", dove: "", owl: "" });

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyData: buildCompanyContext() }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error("Debate API failed");

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
            if (data.type === "start") {
              setActiveAgent(data.agent);
            } else if (data.type === "chunk") {
              setLiveTexts((prev) => ({
                ...prev,
                [data.agent]: prev[data.agent] + data.text,
              }));
            } else if (data.type === "done") {
              setActiveAgent(null);
            }
          } catch {
            // ignore parse errors
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Debate error:", err);
      }
    }

    setIsStreaming(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysis]);

  const stopDebate = () => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setActiveAgent(null);
  };

  const agents = ["hawk", "dove", "owl"] as const;

  return (
    <div className="animate-fadeInUp">
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="w-10 h-10 flex items-center justify-center flex-shrink-0" style={{ border: "2px solid #0033FF" }}>
          <Users size={20} color="#0033FF" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base md:text-lg font-bold text-[#111]">AI Credit Committee</h2>
          <p className="text-xs text-[#888]">Multi-Agent Adversarial Debate System</p>
        </div>

        {/* Live Debate Button */}
        {!isStreaming ? (
          <button
            onClick={runLiveDebate}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold cursor-pointer border-none transition-all"
            style={{
              background: "#0033FF",
              color: "#FFFFFF",
              boxShadow: "3px 3px 0px #111",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-1px, -1px)"; e.currentTarget.style.boxShadow = "4px 4px 0px #111"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0, 0)"; e.currentTarget.style.boxShadow = "3px 3px 0px #111"; }}
          >
            <Sparkles size={14} />
            Run Live AI Debate
          </button>
        ) : (
          <button
            onClick={stopDebate}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold cursor-pointer text-[#FF3366] transition-all"
            style={{ border: "2px solid #FF3366", background: "white" }}
          >
            <Loader2 size={14} className="animate-spin" />
            Stop Debate
          </button>
        )}
      </div>

      {isLive && (
        <div className="mb-4 flex items-center gap-2 px-3 py-2" style={{ background: "white", border: "2px solid #6633FF" }}>
          <Sparkles size={12} color="#6633FF" />
          <span className="text-[11px] text-[#6633FF]">
            {isStreaming
              ? `Live AI Debate in progress -- ${activeAgent ? AGENTS_META[activeAgent as keyof typeof AGENTS_META]?.name + " is arguing..." : "processing..."}`
              : "Live debate complete -- AI-generated arguments below"}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {agents.map((agent) => {
          const meta = AGENTS_META[agent];
          const mock = AGENT_DEBATE[agent];
          const text = isLive ? liveTexts[agent] : mock.argument;
          const isActive = activeAgent === agent;

          return (
            <div
              key={agent}
              className="p-4 md:p-5 transition-all"
              style={{
                background: "white",
                border: `2px solid ${isActive ? meta.color : "#111"}`,
                boxShadow: isActive
                  ? `6px 6px 0px ${meta.color}`
                  : "4px 4px 0px #111",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-1px, -1px)"; e.currentTarget.style.boxShadow = isActive ? `7px 7px 0px ${meta.color}` : "5px 5px 0px #111"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0, 0)"; e.currentTarget.style.boxShadow = isActive ? `6px 6px 0px ${meta.color}` : "4px 4px 0px #111"; }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{meta.emoji}</span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-[#111]">
                    {meta.name}
                  </div>
                  <div className="text-[10px] text-[#888]">{meta.role}</div>
                </div>
                <div
                  className="text-xs font-bold px-3 py-1.5 font-mono uppercase"
                  style={{
                    color: meta.color,
                    border: `2px solid ${meta.color}`,
                  }}
                >
                  {isLive
                    ? isActive
                      ? "ARGUING..."
                      : text
                        ? "DONE"
                        : "WAITING"
                    : mock.verdict}
                </div>
              </div>

              <div className="text-[12px] text-[#333] leading-7 whitespace-pre-wrap min-h-[100px] break-words overflow-hidden">
                {text || (
                  <span className="text-[#aaa] italic">
                    Waiting for turn...
                  </span>
                )}
                {isActive && (
                  <span className="inline-block w-2 h-4 bg-[#111] animate-pulse ml-0.5" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhancement 4: Dissent Note */}
      <div className="mt-5 p-4 md:p-5" style={{ background: "white", border: "2px solid #FF3366", boxShadow: "4px 4px 0px #111" }}>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <AlertTriangle size={16} color="#FF3366" />
          <span className="text-[13px] font-bold text-[#FF3366]">
            FORMAL DISSENT RECORDED
          </span>
          <span className="ml-auto text-[9px] text-[#888] px-2 py-1 font-mono uppercase whitespace-nowrap" style={{ background: "#F4F4F0", border: "1px solid #ddd" }}>
            Per Credit Committee Policy
          </span>
        </div>
        <div className="p-3 md:p-4" style={{ background: "#F4F4F0", border: "2px solid #FF3366" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{"\u{1F985}"}</span>
            <span className="text-xs font-bold text-[#FF3366]">Hawk Agent -- Dissent Statement</span>
          </div>
          <p className="text-[12px] text-[#CC0044] leading-relaxed break-words">
            The GST mismatch risk (19.7%) is insufficiently addressed by covenant requirements alone.
            Historical data shows that quarterly GST reconciliation covenants have a 40% non-compliance
            rate in the first year. The true revenue base ({"\u20B9"}58.1Cr from 2A) yields a DSCR of 0.91x —
            below the 1.0x survivability threshold. Formal dissent recorded per Credit Committee policy.
            Recommending this dissent be flagged to the Board Risk Committee.
          </p>
        </div>
        <p className="text-[10px] text-[#888] mt-3">
          Note: In real credit committees, dissent notes are mandatory documentation under RBI Corporate Governance guidelines.
          This ensures minority risk opinions are preserved even when overruled by the committee.
        </p>
      </div>

      <div className="mt-5 p-4 flex items-start gap-3" style={{ background: "#F4F4F0", border: "2px solid #111", boxShadow: "2px 2px 0px #111" }}>
        <Eye size={16} color="#0033FF" className="mt-0.5 flex-shrink-0" />
        <div>
          <span className="text-[#111] font-semibold text-xs">How it works: </span>
          <span className="text-xs text-[#555]">
            Findesk AI uses a <strong className="text-[#6633FF]">Financial Chain-of-Thought</strong> architecture
            based on peer-reviewed research (FinRobot, ICAIF 2024). Three specialized agents receive pre-computed
            structured data — financial ratios, cross-verification results, and FinBERT sentiment scores — then
            argue from opposing mandates. The Owl synthesizes both positions into a final credit thesis with
            specific conditions. All numerical analysis is deterministic; the LLM only generates narrative.
          </span>
        </div>
      </div>
    </div>
  );
}
