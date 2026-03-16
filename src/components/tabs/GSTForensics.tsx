"use client";

import { AlertTriangle } from "lucide-react";
import { GST_MONTHLY } from "@/data/mockData";
import GSTWaterfallChart from "@/components/GSTWaterfallChart";

export default function GSTForensics() {
  return (
    <div className="max-w-4xl animate-fadeInUp">
      {/* Waterfall Chart */}
      <div className="p-4 md:p-6 mb-5" style={{ background: "white", border: "2px solid #111", boxShadow: "4px 4px 0px #111" }}>
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ border: "2px solid #FF3366" }}>
            <AlertTriangle size={18} color="#FF3366" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-[#FF3366]">
              GST Cross-Verification: Circular Trading Alert
            </h2>
            <p className="text-[11px] text-[#888]">
              Automated detection of revenue inflation via GSTR-3B vs 2A reconciliation
            </p>
          </div>
          <div className="ml-auto">
            <span className="text-xs font-bold text-[#FF3366] px-3 py-1.5 font-mono uppercase" style={{ border: "2px solid #FF3366" }}>
              19.7% MISMATCH
            </span>
          </div>
        </div>

        <GSTWaterfallChart />

        <div className="mt-4 p-4" style={{ background: "#F4F4F0", border: "2px solid #FF3366" }}>
          <div className="text-[13px] font-semibold text-[#FF3366] mb-2">
            Detection Algorithm
          </div>
          <div className="text-xs text-[#333] leading-7 space-y-0.5">
            <p>
              <strong className="text-[#FF9900]">Step 1:</strong> Extract GSTR-3B
              (self-reported) turnover: ₹72.4 Cr.
            </p>
            <p>
              <strong className="text-[#FF9900]">Step 2:</strong> Extract GSTR-2A
              (auto-populated from suppliers): ₹58.1 Cr.
            </p>
            <p>
              <strong className="text-[#FF9900]">Step 3:</strong> Compute variance:
              ₹14.3 Cr. (19.7%) -- exceeds 10% threshold
            </p>
            <p>
              <strong className="text-[#FF9900]">Step 4:</strong> Cross-check with bank
              statement credits: ₹69.8 Cr.
            </p>
            <p>
              <strong className="text-[#FF3366]">Finding:</strong> Bank turnover aligns
              with 2A (not 3B) → confirms true revenue is ~₹58-70 Cr. range. The ₹14.3 Cr.
              gap likely represents circular/accommodation entries.
            </p>
            <p>
              <strong className="text-[#FF3366]">Impact:</strong> Effective revenue ~20%
              lower than reported. DSCR recalculated on true revenue drops to 0.91x (below
              1.0x).
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="p-4 md:p-6" style={{ background: "white", border: "2px solid #111", boxShadow: "4px 4px 0px #111" }}>
        <h3 className="text-sm font-semibold mb-4 text-[#111]">
          Monthly GST Reconciliation (FY24)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr style={{ borderBottom: "2px solid #111" }}>
                {["Month", "3B (₹Cr)", "2A (₹Cr)", "Gap (%)", "Flag"].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2.5 text-left text-[#888] font-semibold uppercase font-mono text-[10px]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GST_MONTHLY.map((row, i) => {
                const gap = (((row.b3 - row.a2) / row.b3) * 100).toFixed(1);
                const gapNum = parseFloat(gap);
                return (
                  <tr
                    key={i}
                    className="transition-colors"
                    style={{
                      borderBottom: "1px solid #eee",
                      background: row.flag ? "#FFF0F3" : "transparent",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = row.flag ? "#FFE0E6" : "#F4F4F0"}
                    onMouseLeave={(e) => e.currentTarget.style.background = row.flag ? "#FFF0F3" : "transparent"}
                  >
                    <td className="px-3 py-2 text-[#333]">{row.month}</td>
                    <td className="px-3 py-2 text-[#333]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {row.b3.toFixed(1)}
                    </td>
                    <td className="px-3 py-2 text-[#333]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {row.a2.toFixed(1)}
                    </td>
                    <td
                      className="px-3 py-2 font-semibold metric-value"
                      style={{ color: gapNum > 15 ? "#FF3366" : "#FF9900", fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {gap}%
                    </td>
                    <td className="px-3 py-2">
                      {row.flag && (
                        <span className="text-[#FF3366] px-2 py-0.5 text-[10px] font-bold font-mono uppercase" style={{ border: "2px solid #FF3366" }}>
                          SPIKE
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] text-[#888]">
          Months flagged with SPIKE show &gt;35% gap -- consistent with quarter-end circular
          entries (Jun, Sep, Jan pattern).
        </p>
      </div>
    </div>
  );
}
