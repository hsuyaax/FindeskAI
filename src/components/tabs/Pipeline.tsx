"use client";

import { useState } from "react";
import { Clock, AlertTriangle, CheckCircle, Zap, ScrollText, Download, Info, ShieldAlert, Cpu } from "lucide-react";
import { TIMELINE, AUDIT_TRAIL } from "@/data/mockData";

const severityConfig: Record<string, { color: string; bg: string; icon: React.ComponentType<{ size?: number; color?: string; className?: string }> }> = {
  info: { color: "#0033FF", bg: "#0033FF15", icon: Info },
  warning: { color: "#FF9900", bg: "#FF990015", icon: AlertTriangle },
  critical: { color: "#FF3366", bg: "#FF336615", icon: ShieldAlert },
};

export default function Pipeline() {
  const [showAudit, setShowAudit] = useState(false);

  const handleDownloadAudit = () => {
    const json = JSON.stringify(AUDIT_TRAIL, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "findesk-ai-audit-trail.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl animate-fadeInUp">
      <div className="p-4 md:p-6" style={{ background: "white", border: "2px solid #111", boxShadow: "4px 4px 0px #111" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ border: "2px solid #0033FF" }}>
            <Clock size={18} color="#0033FF" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-[#111]">Processing Pipeline</h2>
            <p className="text-[11px] text-[#888]">
              Complete analysis in under 30 seconds -- from PDF upload to CAM generation
            </p>
          </div>
        </div>

        <div className="relative">
          {TIMELINE.map((item, i) => (
            <div
              key={i}
              className="flex gap-4 mb-5 relative animate-slideIn"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Connector line */}
              {i < TIMELINE.length - 1 && (
                <div
                  className="absolute left-[15px] top-[34px] w-[2px]"
                  style={{
                    height: "calc(100% - 2px)",
                    background: item.status === "alert" ? "#FF3366" : "#ddd",
                    opacity: 0.5,
                  }}
                />
              )}

              {/* Status circle */}
              <div
                className="w-[32px] h-[32px] flex items-center justify-center flex-shrink-0 z-10"
                style={{
                  background: item.status === "alert" ? "#FF336622" : "#00CC6622",
                  border: `2px solid ${item.status === "alert" ? "#FF3366" : "#00CC66"}`,
                }}
              >
                {item.status === "alert" ? (
                  <AlertTriangle size={14} color="#FF3366" />
                ) : (
                  <CheckCircle size={14} color="#00CC66" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[13px] font-semibold text-[#111]">
                    {item.step}
                  </span>
                  <span className="text-[11px] text-[#888]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {item.time}
                  </span>
                </div>
                <div
                  className="text-xs leading-relaxed"
                  style={{
                    color: item.status === "alert" ? "#FF3366" : "#555",
                  }}
                >
                  {item.detail}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Speed comparison */}
        <div className="mt-4 p-4 flex items-center gap-3" style={{ background: "#F4F4F0", border: "2px solid #111", boxShadow: "2px 2px 0px #111" }}>
          <Zap size={18} color="#FF9900" />
          <div className="text-xs text-[#333]">
            Traditional CAM preparation:{" "}
            <strong className="text-[#555]">3-5 business days</strong>.
            Findesk AI:{" "}
            <strong className="text-[#00CC66]">under 30 seconds</strong>.
          </div>
        </div>

        {/* Architecture: What Runs Where */}
        <div className="mt-4 p-5" style={{ background: "#F4F4F0", border: "2px solid #6633FF" }}>
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert size={16} color="#6633FF" />
            <span className="text-[12px] font-bold text-[#111]">
              System Architecture — Hybrid AI + Deterministic Computation
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="p-3" style={{ background: "white", border: "2px solid #00CC66" }}>
              <div className="text-[10px] font-bold text-[#00CC66] mb-2 tracking-wide font-mono uppercase">LOCAL COMPUTATION ($0.00)</div>
              <div className="space-y-1">
                {[
                  "LayoutLMv3 — structure-aware OCR",
                  "Ratio Engine — 15+ financial ratios",
                  "GST Cross-Verifier — 3B vs 2A",
                  "Benford&apos;s Law — chi\u00B2 forensic test",
                  "FinBERT — financial sentiment (local)",
                  "Five C Scorecard — weighted scoring",
                  "RBI Compliance — 8 norms (rule engine)",
                  "Break-Even Calculator",
                  "What-If Stress Simulator",
                  "Three-Way Reconciliation",
                  "Trust Hierarchy Ranking",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <CheckCircle size={9} color="#00CC66" />
                    <span className="text-[10px] text-[#555]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3" style={{ background: "white", border: "2px solid #0033FF" }}>
              <div className="text-[10px] font-bold text-[#0033FF] mb-2 tracking-wide font-mono uppercase">CLOUD API -- $0.14/analysis</div>
              <div className="space-y-1">
                {[
                  "Credit Committee debate (CoT)",
                  "CAM narrative prose",
                  "Sector intelligence brief",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <CheckCircle size={9} color="#0033FF" />
                    <span className="text-[10px] text-[#555]">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3" style={{ borderTop: "1px solid #ddd" }}>
                <div className="text-[10px] font-bold text-[#888] mb-1.5 tracking-wide font-mono uppercase">REFERENCED RESEARCH</div>
                <div className="space-y-1 text-[9px] text-[#aaa]">
                  <div>FinGPT (Yang et al., 2023)</div>
                  <div>FinRobot (Zhou et al., ICAIF 2024)</div>
                  <div>FinBERT (Araci, 2019)</div>
                  <div>LayoutLMv3 (Microsoft, 2022)</div>
                  <div>Golec et al. (2025) — LLMs for Credit</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 text-center text-[10px] text-[#888]">
            11 components run locally | 3 use cloud API | ~20s local + ~26s API = 46s total compute
          </div>
        </div>

        {/* Enhancement 7: Token Counter */}
        <div className="mt-4 p-4" style={{ background: "#F4F4F0", border: "2px solid #0033FF" }}>
          <div className="flex items-center gap-2 mb-3">
            <Cpu size={16} color="#0033FF" />
            <span className="text-[12px] font-bold text-[#111]">LLM Usage & Cost Analysis</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div className="text-center p-2 min-w-0" style={{ background: "white", border: "2px solid #111" }}>
              <div className="text-[9px] text-[#888] mb-0.5 font-mono uppercase truncate">INPUT TOKENS</div>
              <div className="text-sm font-bold text-[#0033FF] metric-value whitespace-nowrap" style={{ fontFamily: "'JetBrains Mono', monospace" }}>42,318</div>
            </div>
            <div className="text-center p-2 min-w-0" style={{ background: "white", border: "2px solid #111" }}>
              <div className="text-[9px] text-[#888] mb-0.5 font-mono uppercase truncate">OUTPUT TOKENS</div>
              <div className="text-sm font-bold text-[#6633FF] metric-value whitespace-nowrap" style={{ fontFamily: "'JetBrains Mono', monospace" }}>8,734</div>
            </div>
            <div className="text-center p-2 min-w-0" style={{ background: "white", border: "2px solid #111" }}>
              <div className="text-[9px] text-[#888] mb-0.5 font-mono uppercase truncate">TOTAL TOKENS</div>
              <div className="text-sm font-bold text-[#111] metric-value whitespace-nowrap" style={{ fontFamily: "'JetBrains Mono', monospace" }}>51,052</div>
            </div>
            <div className="text-center p-2 min-w-0" style={{ background: "white", border: "2px solid #111" }}>
              <div className="text-[9px] text-[#888] mb-0.5 font-mono uppercase truncate">EST. COST</div>
              <div className="text-sm font-bold text-[#00CC66] metric-value whitespace-nowrap" style={{ fontFamily: "'JetBrains Mono', monospace" }}>$0.14</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3" style={{ background: "white", border: "1px solid #ddd" }}>
            <Zap size={12} color="#FF9900" />
            <span className="text-[11px] text-[#555]">
              <strong className="text-[#111]">At scale:</strong>{" "}
              $0.14 per analysis x 500 applications/year ={" "}
              <strong className="text-[#00CC66]">$70/year</strong> in AI costs
              vs ~{"\u20B9"}60-80L/year in analyst salary savings
            </span>
          </div>
          <div className="mt-2 text-[10px] text-[#aaa]">
            Breakdown: Research Agent (8,200 tokens) + Five C Analysis (12,400) + Credit Committee Debate (18,100 across 3 agents) + CAM Generation (12,352)
          </div>
        </div>
      </div>

      {/* Audit Trail */}
      <div className="mt-5 p-4 md:p-6" style={{ background: "white", border: "2px solid #111", boxShadow: "4px 4px 0px #111" }}>
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ border: "2px solid #FF9900" }}>
            <ScrollText size={18} color="#FF9900" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-[#111]">Audit Trail</h2>
            <p className="text-[11px] text-[#888]">
              Complete event log -- every decision traceable to source
            </p>
          </div>
          <button
            onClick={() => setShowAudit(!showAudit)}
            className="text-[11px] font-semibold px-3 py-1.5 cursor-pointer transition-all"
            style={{
              border: "2px solid #111",
              background: showAudit ? "#F4F4F0" : "white",
              color: "#555",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-1px, -1px)"; e.currentTarget.style.boxShadow = "2px 2px 0px #111"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0, 0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            {showAudit ? "Hide" : "Show"} Events ({AUDIT_TRAIL.length})
          </button>
          <button
            onClick={handleDownloadAudit}
            className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 cursor-pointer text-[#0033FF] transition-all"
            style={{ border: "2px solid #0033FF", background: "white" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-1px, -1px)"; e.currentTarget.style.boxShadow = "2px 2px 0px #111"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0, 0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <Download size={12} />
            JSON
          </button>
        </div>

        {showAudit && (
          <div className="space-y-1.5 animate-fadeInUp">
            {AUDIT_TRAIL.map((entry, i) => {
              const sev = severityConfig[entry.severity] || severityConfig.info;
              const SevIcon = sev.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 p-2.5 transition-colors"
                  style={{ borderLeft: `3px solid ${sev.color}` }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#F4F4F0"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <SevIcon size={14} color={sev.color} className="mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-semibold text-[#111]">
                        {entry.event}
                      </span>
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 font-mono uppercase"
                        style={{ border: `2px solid ${sev.color}`, color: sev.color }}
                      >
                        {entry.severity.toUpperCase()}
                      </span>
                      <span className="text-[9px] text-[#aaa] px-1.5 py-0.5" style={{ background: "#F4F4F0", border: "1px solid #ddd" }}>
                        {entry.agent}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#555] mt-0.5 truncate">
                      {entry.detail}
                    </p>
                  </div>
                  <span className="text-[9px] text-[#aaa] flex-shrink-0 whitespace-nowrap" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {entry.timestamp.split(" ")[1]}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {!showAudit && (
          <div className="flex gap-3 text-center">
            {(["info", "warning", "critical"] as const).map((sev) => {
              const count = AUDIT_TRAIL.filter((e) => e.severity === sev).length;
              const cfg = severityConfig[sev];
              return (
                <div
                  key={sev}
                  className="flex-1 p-3"
                  style={{ background: "white", border: `2px solid ${cfg.color}` }}
                >
                  <div className="text-lg font-bold" style={{ color: cfg.color }}>
                    {count}
                  </div>
                  <div className="text-[10px] text-[#888] capitalize font-mono uppercase">{sev}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
