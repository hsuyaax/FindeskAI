"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, Building2, TrendingUp } from "lucide-react";
import { PEER_BENCHMARKS } from "@/data/mockData";
import { NBFC_PEER_TABLE, VIVRITI_RATIOS } from "@/data/realData";

export default function PeerComparison() {
  const [showNBFC, setShowNBFC] = useState(true);

  const chartData = PEER_BENCHMARKS.map((d) => ({
    metric: d.metric,
    "Rathi Steels": d.company,
    "Sector Median": d.median,
    "Top Quartile": d.topQuartile,
  }));

  return (
    <div className="max-w-5xl animate-fadeInUp space-y-5">
      {/* Enhancement 1: Real NBFC Peer Table */}
      <div className="p-4 md:p-6" style={{ background: "white", border: "2px solid #6633FF", boxShadow: "4px 4px 0px #111" }}>
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ border: "2px solid #6633FF" }}>
            <Building2 size={18} color="#6633FF" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-[#111]">
              Real NBFC Benchmark Comparison
            </h2>
            <p className="text-[11px] text-[#888]">
              Benchmarked against real NBFC annual reports — Vivriti Capital, Moneyboxx Finance, Tata Capital
            </p>
          </div>
          <span className="text-[9px] font-bold text-[#6633FF] px-2 py-1 font-mono uppercase" style={{ border: "2px solid #6633FF" }}>
            REAL PDF DATA
          </span>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-[11px]">
            <thead>
              <tr style={{ borderBottom: "2px solid #111" }}>
                <th className="px-3 py-2.5 text-left text-[#888] font-semibold font-mono uppercase">Metric</th>
                <th className="px-3 py-2.5 text-center text-[#0033FF] font-semibold">Rathi Steels</th>
                <th className="px-3 py-2.5 text-center text-[#6633FF] font-semibold">Vivriti Capital</th>
                <th className="px-3 py-2.5 text-center text-[#FF9900] font-semibold">Moneyboxx</th>
                <th className="px-3 py-2.5 text-center text-[#00CC66] font-semibold">Tata Capital</th>
              </tr>
            </thead>
            <tbody>
              {NBFC_PEER_TABLE.map((row, i) => (
                <tr key={i} className="transition-colors" style={{ borderBottom: "1px solid #eee" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#F4F4F0"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td className="px-3 py-2.5 text-[#111] font-semibold">{row.metric}</td>
                  <td className="px-3 py-2.5 text-center text-[#0033FF]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{row.rathi}</td>
                  <td className="px-3 py-2.5 text-center text-[#6633FF]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{row.vivriti}</td>
                  <td className="px-3 py-2.5 text-center text-[#FF9900]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{row.moneyboxx}</td>
                  <td className="px-3 py-2.5 text-center text-[#00CC66]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{row.tata}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vivriti Spotlight */}
        <div className="mt-4 p-4" style={{ background: "#F4F4F0", border: "2px solid #6633FF" }}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} color="#6633FF" />
            <span className="text-xs font-bold text-[#6633FF]">Vivriti Capital -- Key Computed Ratios (FY25)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { label: "D/E Ratio", value: `${VIVRITI_RATIOS.deRatio}x`, color: "#FF9900" },
              { label: "RoA", value: `${VIVRITI_RATIOS.roa}%`, color: "#00CC66" },
              { label: "Credit Cost", value: `${VIVRITI_RATIOS.creditCost}%`, color: "#FF3366" },
              { label: "NIM Proxy", value: `${VIVRITI_RATIOS.nimProxy}%`, color: "#0033FF" },
              { label: "Cost/Income", value: `${VIVRITI_RATIOS.costToIncome}%`, color: "#FF9900" },
            ].map((item) => (
              <div key={item.label} className="text-center p-2" style={{ background: "white", border: "2px solid #111" }}>
                <div className="text-[10px] text-[#888] mb-0.5 font-mono uppercase">{item.label}</div>
                <div className="text-sm font-bold metric-value" style={{ color: item.color, fontFamily: "'JetBrains Mono', monospace" }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[#888] mt-2">
            All ratios computed by our ratio engine from extracted PDF data -- LLM never does math.
          </p>
        </div>
      </div>

      {/* Original Steel Sector Comparison */}
      <div className="p-4 md:p-6" style={{ background: "white", border: "2px solid #111", boxShadow: "4px 4px 0px #111" }}>
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ border: "2px solid #6633FF" }}>
            <BarChart3 size={18} color="#6633FF" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-[#111]">
              Peer Comparison -- Steel Manufacturing (SME Segment)
            </h2>
            <p className="text-[11px] text-[#888]">
              Rathi Steels vs. Steel Sector Median vs. Top Quartile |
              Benchmarks sourced from ICRA Steel Sector Outlook FY24
            </p>
          </div>
        </div>

        <div className="w-full h-[280px] md:h-[340px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 20, bottom: 25, left: 0 }}
            >
              <XAxis
                dataKey="metric"
                tick={{ fill: "#555", fontSize: 10 }}
                axisLine={{ stroke: "#111" }}
                tickLine={{ stroke: "#111" }}
                angle={-20}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={{ fill: "#555", fontSize: 11 }}
                axisLine={{ stroke: "#111" }}
                tickLine={{ stroke: "#111" }}
              />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "2px solid #111",
                  borderRadius: 0,
                  color: "#111",
                  fontSize: 12,
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11 }}
                iconType="square"
              />
              <Bar
                dataKey="Rathi Steels"
                fill="#0033FF"
                radius={[0, 0, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="Sector Median"
                fill="#FF9900"
                fillOpacity={0.7}
                radius={[0, 0, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="Top Quartile"
                fill="#00CC66"
                fillOpacity={0.5}
                radius={[0, 0, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Metric-by-metric table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr style={{ borderBottom: "2px solid #111" }}>
                <th className="px-3 py-2 text-left text-[#888] font-semibold font-mono uppercase">
                  Metric
                </th>
                <th className="px-3 py-2 text-center text-[#0033FF] font-semibold">
                  Rathi Steels
                </th>
                <th className="px-3 py-2 text-center text-[#FF9900] font-semibold">
                  Sector Median
                </th>
                <th className="px-3 py-2 text-center text-[#00CC66] font-semibold">
                  Top Quartile
                </th>
                <th className="px-3 py-2 text-center text-[#888] font-semibold font-mono uppercase">
                  Assessment
                </th>
              </tr>
            </thead>
            <tbody>
              {PEER_BENCHMARKS.map((d, i) => {
                const isBetter =
                  d.metric === "D/E Ratio"
                    ? d.company <= d.median
                    : d.company >= d.median;
                return (
                  <tr
                    key={i}
                    className="transition-colors"
                    style={{ borderBottom: "1px solid #eee" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#F4F4F0"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <td className="px-3 py-2 text-[#111] font-semibold">
                      {d.metric}
                    </td>
                    <td className="px-3 py-2 text-center text-[#0033FF] font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {d.company}
                      {d.unit}
                    </td>
                    <td className="px-3 py-2 text-center text-[#FF9900]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {d.median}
                      {d.unit}
                    </td>
                    <td className="px-3 py-2 text-center text-[#00CC66]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {d.topQuartile}
                      {d.unit}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 font-mono uppercase"
                        style={{
                          border: `2px solid ${isBetter ? "#00CC66" : "#FF3366"}`,
                          color: isBetter ? "#00CC66" : "#FF3366",
                        }}
                      >
                        {isBetter ? "ABOVE" : "BELOW"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 text-xs text-[#555] leading-relaxed" style={{ background: "#F4F4F0", border: "1px solid #ddd" }}>
          <strong className="text-[#111]">Key Takeaway:</strong> Rathi Steels
          is <span className="text-[#FF3366] font-semibold">below median</span> on
          Revenue Growth, EBITDA Margin, DSCR, and Capacity Utilization -- the four
          metrics most critical for debt servicing. However, it is{" "}
          <span className="text-[#00CC66] font-semibold">above median</span> on
          Collateral Coverage and Net Worth, which partially mitigates risk. This
          peer-relative view supports a conditional approval with reduced exposure.
        </div>
      </div>
    </div>
  );
}
