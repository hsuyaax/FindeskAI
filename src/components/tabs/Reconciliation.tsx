"use client";

import { GitCompare, Award, FileText, Building, BarChart3 } from "lucide-react";
import { RECONCILIATION_DATA } from "@/data/mockData";

const TRUST_HIERARCHY = [
  {
    rank: 1,
    emoji: "\u{1F947}",
    source: "Bank Statement",
    reason: "Third-party verified, real-time cash flow record",
    trust: "Highest",
    color: "#00CC66",
  },
  {
    rank: 2,
    emoji: "\u{1F948}",
    source: "GSTR-2A (Supplier-Filed)",
    reason: "Auto-populated from supplier filings, cannot be manipulated by borrower",
    trust: "High",
    color: "#0033FF",
  },
  {
    rank: 3,
    emoji: "\u{1F949}",
    source: "GSTR-3B (Self-Filed)",
    reason: "Self-reported by borrower, can be inflated — lowest trust in GST stack",
    trust: "Low",
    color: "#FF9900",
  },
  {
    rank: 4,
    emoji: "\u{1F4C4}",
    source: "Annual Report",
    reason: "Audited but annual, backward-looking, subject to accounting choices",
    trust: "Medium",
    color: "#6633FF",
  },
];

export default function Reconciliation() {
  return (
    <div className="max-w-5xl animate-fadeInUp space-y-5">
      <div className="p-4 md:p-6" style={{ background: "white", border: "2px solid #111", boxShadow: "4px 4px 0px #111" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ border: "2px solid #0033FF" }}>
            <GitCompare size={18} color="#0033FF" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-[#111]">Three-Way Data Reconciliation</h2>
            <p className="text-[11px] text-[#888]">
              Every key metric verified against 3 independent sources. Discrepancies flagged
              with the trusted source identified.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr style={{ borderBottom: "2px solid #111" }}>
                {[
                  "Metric",
                  "Annual Report",
                  "GST Returns",
                  "Bank Statement",
                  "Confidence",
                  "Note",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2.5 text-left text-[#888] font-semibold text-[10px] uppercase font-mono"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECONCILIATION_DATA.map((r, i) => (
                <tr
                  key={i}
                  className="transition-colors"
                  style={{ borderBottom: "1px solid #eee" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#F4F4F0"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td className="px-3 py-2.5 text-[#111] font-semibold">
                    {r.metric}
                  </td>
                  <td className="px-3 py-2.5 text-[#333]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{r.ar}</td>
                  <td className="px-3 py-2.5 text-[#333]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{r.gst}</td>
                  <td className="px-3 py-2.5 text-[#333]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{r.bank}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className="px-2 py-0.5 text-[10px] font-bold font-mono uppercase"
                      style={{
                        border: `2px solid ${r.conf === "HIGH" ? "#00CC66" : "#FF9900"}`,
                        color: r.conf === "HIGH" ? "#00CC66" : "#FF9900",
                      }}
                    >
                      {r.conf}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-[#555] text-[10px]">
                    {r.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 p-4 text-xs text-[#555] leading-relaxed" style={{ background: "#F4F4F0", border: "1px solid #ddd" }}>
          <strong className="text-[#111]">Methodology:</strong> The system cross-references
          every financial metric against Annual Report filings, GST returns (both 3B and 2A),
          and bank statement data. Where sources disagree, the system recommends which source
          to trust based on the verification hierarchy below.
        </div>
      </div>

      {/* Enhancement 6: Trust Hierarchy Visual */}
      <div className="p-4 md:p-6" style={{ background: "white", border: "2px solid #0033FF", boxShadow: "4px 4px 0px #111" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ border: "2px solid #0033FF" }}>
            <Award size={18} color="#0033FF" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#111]">Data Source Trust Hierarchy</h2>
            <p className="text-[11px] text-[#888]">
              Ranked by verification independence and manipulation resistance
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {TRUST_HIERARCHY.map((item) => (
            <div
              key={item.rank}
              className="flex items-center gap-3 md:gap-4 p-3 md:p-4 transition-all"
              style={{
                background: "#F4F4F0",
                borderLeft: `4px solid ${item.color}`,
                border: `2px solid #111`,
                borderLeftWidth: "4px",
                borderLeftColor: item.color,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-1px, -1px)"; e.currentTarget.style.boxShadow = "3px 3px 0px #111"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0, 0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <span className="text-2xl">{item.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[13px] font-bold text-[#111]">
                    {item.source}
                  </span>
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 font-mono uppercase"
                    style={{
                      border: `2px solid ${item.color}`,
                      color: item.color,
                    }}
                  >
                    {item.trust} Trust
                  </span>
                </div>
                <p className="text-[11px] text-[#555]">{item.reason}</p>
              </div>
              <div
                className="text-xl md:text-3xl font-extrabold opacity-20 metric-value flex-shrink-0 whitespace-nowrap"
                style={{ color: item.color, fontFamily: "'JetBrains Mono', monospace" }}
              >
                #{item.rank}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 text-xs text-[#555] leading-relaxed" style={{ background: "#F4F4F0", border: "1px solid #ddd" }}>
          <strong className="text-[#111]">Key Insight:</strong> When Bank Statement and GSTR-2A align
          but differ from GSTR-3B (as in Rathi Steels&apos; case), the system trusts the Bank+2A figure.
          The {"\u20B9"}14.3Cr gap ({"\u20B9"}72.4Cr self-reported vs {"\u20B9"}58.1Cr verified) is a strong
          indicator of revenue inflation. This trust hierarchy is why our system catches fraud that
          traditional single-source analysis misses.
        </div>
      </div>
    </div>
  );
}
