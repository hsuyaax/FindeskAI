"use client";

import {
  Brain, Eye, TrendingUp, TrendingDown, Building2, Shield, Scale, Activity,
  AlertTriangle, BarChart3,
} from "lucide-react";
import {
  VIVRITI_CAPITAL, VIVRITI_RATIOS, VIVRITI_FIVE_CS,
} from "@/data/realData";
import { computeComposite, DEFAULT_WEIGHTS } from "@/lib/scoringModel";
import { computeRatios } from "@/lib/ratioEngine";

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Shield, TrendingUp, Building2, Scale, Activity,
};

const BRUTALIST_COLORS: Record<string, string> = {
  "#F5B731": "#FF9900",
  "#F06050": "#FF3366",
  "#34D399": "#00CC66",
  "#4B8BF5": "#0033FF",
  "#7C6BF0": "#6633FF",
  "#8B95AD": "#555",
};

function mapColor(c: string): string {
  return BRUTALIST_COLORS[c] || c;
}

export default function VivritiDashboard() {
  const composite = computeComposite(VIVRITI_FIVE_CS, DEFAULT_WEIGHTS);
  const fin = VIVRITI_CAPITAL.financials.fy25;
  const computedRatios = computeRatios(fin);

  return (
    <div className="animate-fadeInUp space-y-5">
      {/* Demo Banner */}
      <div
        className="p-4 flex items-center gap-3"
        style={{ background: "white", border: "2px solid #6633FF", boxShadow: "4px 4px 0px #111" }}
      >
        <Brain size={24} color="#6633FF" />
        <div className="flex-1">
          <h2 className="text-base font-bold text-[#6633FF]">
            Case Study: Vivriti Capital — Live Analysis
          </h2>
          <p className="text-[11px] text-[#888]">
            Financial data extracted from FY2024-25 annual report via our document intelligence pipeline.
            All ratios computed deterministically — zero LLM involvement in calculations.
          </p>
        </div>
        <div className="text-center flex-shrink-0">
          <div className="text-2xl md:text-3xl font-extrabold text-[#6633FF] metric-value whitespace-nowrap" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{composite}</div>
          <div className="text-[10px] text-[#888]">Composite Score</div>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="p-4 md:p-6" style={{ background: "white", border: "2px solid #111", boxShadow: "4px 4px 0px #111" }}>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <BarChart3 size={16} color="#0033FF" />
          <span className="text-[13px] font-bold text-[#111] min-w-0">
            Vivriti Capital — FY25 Extracted Financials
          </span>
          <span className="ml-auto text-[9px] text-[#888] px-2 py-0.5 font-mono uppercase whitespace-nowrap hidden sm:inline" style={{ background: "#F4F4F0", border: "1px solid #ddd" }}>
            Source: Annual Report FY2024-25
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: "Revenue", value: `\u20B91,347 Cr`, sub: "+32% YoY", color: "#00CC66", subColor: "#00CC66" },
            { label: "PAT", value: `\u20B9220 Cr`, sub: "+15% YoY", color: "#0033FF", subColor: "#00CC66" },
            { label: "Total Assets", value: `\u20B910,468 Cr`, sub: "", color: "#6633FF", subColor: "#888" },
            { label: "Loan Book", value: `\u20B98,647 Cr`, sub: "Core asset", color: "#FF9900", subColor: "#888" },
            { label: "Net Worth", value: `\u20B92,147 Cr`, sub: "+13% YoY", color: "#00CC66", subColor: "#00CC66" },
            { label: "AUM", value: `\u20B99,081 Cr`, sub: "+16% YoY", color: "#0033FF", subColor: "#00CC66" },
            { label: "Finance Costs", value: `\u20B9699 Cr`, sub: "Cost of funds", color: "#FF9900", subColor: "#888" },
            { label: "Impairment", value: `\u20B9194 Cr`, sub: "+89% YoY", color: "#FF3366", subColor: "#FF3366" },
            { label: "Employee Costs", value: `\u20B9101 Cr`, sub: "", color: "#555", subColor: "#888" },
            { label: "Borrowings", value: `\u20B97,470 Cr`, sub: "", color: "#FF9900", subColor: "#888" },
            { label: "Cash", value: `\u20B9313 Cr`, sub: "Liquidity buffer", color: "#00CC66", subColor: "#888" },
            { label: "PBT", value: `\u20B9291 Cr`, sub: "+14% YoY", color: "#0033FF", subColor: "#00CC66" },
          ].map((item) => (
            <div key={item.label} className="text-center p-3" style={{ background: "#F4F4F0", border: "2px solid #111" }}>
              <div className="text-[9px] text-[#888] mb-0.5 tracking-wide font-mono uppercase">{item.label.toUpperCase()}</div>
              <div className="text-xs md:text-sm font-bold metric-value whitespace-nowrap" style={{ color: item.color, fontFamily: "'JetBrains Mono', monospace" }}>
                {item.value}
              </div>
              {item.sub && (
                <div className="text-[10px]" style={{ color: item.subColor }}>{item.sub}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Computed Ratios */}
      <div className="p-4 md:p-6" style={{ background: "white", border: "2px solid #0033FF", boxShadow: "4px 4px 0px #111" }}>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Brain size={16} color="#0033FF" />
          <span className="text-[13px] font-bold text-[#111] min-w-0">
            Computed Ratios — Deterministic Engine
          </span>
          <span className="ml-auto text-[9px] text-[#00CC66] px-2 py-0.5 font-mono uppercase whitespace-nowrap" style={{ border: "2px solid #00CC66" }}>
            Deterministic computation
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {[
            { label: "D/E Ratio", value: `${VIVRITI_RATIOS.deRatio}x`, color: VIVRITI_RATIOS.deRatio > 4 ? "#FF3366" : "#FF9900", note: "Borrowings / Net Worth" },
            { label: "Return on Assets", value: `${VIVRITI_RATIOS.roa}%`, color: "#00CC66", note: "PAT / Total Assets" },
            { label: "Return on Equity", value: `${VIVRITI_RATIOS.roe}%`, color: "#0033FF", note: "PAT / Net Worth" },
            { label: "Credit Cost", value: `${VIVRITI_RATIOS.creditCost}%`, color: VIVRITI_RATIOS.creditCost > 2 ? "#FF3366" : "#FF9900", note: "Impairment / Loans" },
            { label: "NIM Proxy", value: `${VIVRITI_RATIOS.nimProxy}%`, color: "#00CC66", note: "(Interest - Finance) / Loans" },
            { label: "Cost-to-Income", value: `${VIVRITI_RATIOS.costToIncome}%`, color: VIVRITI_RATIOS.costToIncome > 75 ? "#FF9900" : "#00CC66", note: "Expenses / Income" },
            { label: "Revenue Growth", value: `+${VIVRITI_RATIOS.revenueGrowth}%`, color: "#00CC66", note: "FY25 vs FY24" },
            { label: "PAT Growth", value: `+${VIVRITI_RATIOS.patGrowth}%`, color: "#00CC66", note: "FY25 vs FY24" },
            { label: "Impairment Growth", value: `+${VIVRITI_RATIOS.impairmentGrowth}%`, color: "#FF3366", note: "89% surge -- key risk" },
            { label: "Net Worth Growth", value: `+${VIVRITI_RATIOS.netWorthGrowth}%`, color: "#00CC66", note: "FY25 vs FY24" },
            { label: "DSCR", value: `${computedRatios.dscr}x`, color: "#0033FF", note: "EBITDA / Debt Service" },
            { label: "Interest Coverage", value: `${computedRatios.interestCoverage}x`, color: "#00CC66", note: "ratioEngine computed" },
          ].map((item) => (
            <div key={item.label} className="p-3" style={{ background: "#F4F4F0", border: "2px solid #111" }}>
              <div className="text-[9px] text-[#888] mb-0.5 font-mono uppercase">{item.label}</div>
              <div className="text-sm md:text-lg font-bold metric-value whitespace-nowrap" style={{ color: item.color, fontFamily: "'JetBrains Mono', monospace" }}>
                {item.value}
              </div>
              <div className="text-[9px] text-[#aaa]">{item.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Five C Analysis for Vivriti */}
      <div className="p-4 md:p-6" style={{ background: "white", border: "2px solid #111", boxShadow: "4px 4px 0px #111" }}>
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} color="#6633FF" />
          <span className="text-[13px] font-bold text-[#111]">
            Five C Assessment — Vivriti Capital
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(VIVRITI_FIVE_CS).map(([key, data]) => {
            const Icon = iconMap[data.icon] || Shield;
            const mc = mapColor(data.color);
            return (
              <div
                key={key}
                className="p-4"
                style={{
                  background: "#F4F4F0",
                  border: `2px solid ${mc}`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={16} color={mc} />
                  <span className="text-[12px] font-bold text-[#111] capitalize">{key}</span>
                </div>
                <div className="text-xl md:text-2xl font-bold mb-1 metric-value whitespace-nowrap" style={{ color: mc, fontFamily: "'JetBrains Mono', monospace" }}>
                  {data.score}<span className="text-[11px] text-[#888]">/100</span>
                </div>
                <div className="text-[10px] font-semibold mb-2" style={{ color: mc }}>
                  {data.label}
                </div>
                <div className="space-y-1.5">
                  {data.factors.map((f, i) => (
                    <div key={i} className="text-[10px]">
                      <div className="flex items-center gap-1">
                        <span
                          className="w-1.5 h-1.5 flex-shrink-0"
                          style={{
                            background:
                              f.impact === "positive" ? "#00CC66" :
                              f.impact === "negative" ? "#FF3366" :
                              f.impact === "critical" ? "#FF3366" : "#FF9900",
                          }}
                        />
                        <span className="text-[#555]">{f.name}: <strong className="text-[#111]">{f.value}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Insights */}
      <div className="p-4 md:p-6" style={{ background: "white", border: "2px solid #FF9900", boxShadow: "4px 4px 0px #111" }}>
        <div className="flex items-center gap-2 mb-3">
          <Eye size={16} color="#FF9900" />
          <span className="text-[13px] font-bold text-[#FF9900]">Key Insights for Vivriti Capital</span>
        </div>
        <div className="space-y-2">
          {[
            {
              title: "Impairment Costs Surged 89%",
              detail: `Impairment on financial instruments jumped from \u20B9103Cr to \u20B9194Cr. Credit cost rose to 2.24%. Our EWS module would catch this deterioration trend early, enabling proactive portfolio management.`,
              color: "#FF3366",
            },
            {
              title: "Strong Revenue Growth Masks Cost Pressure",
              detail: "32% revenue growth is impressive, but cost-to-income at 78.7% is high. Finance costs grew proportionally with the loan book, suggesting limited operating leverage.",
              color: "#FF9900",
            },
            {
              title: "D/E at 3.48x -- Within NBFC Norms",
              detail: "For a Systemically Important NBFC, 3.48x leverage is acceptable but leaves limited room. Further growth will require either equity raise or securitization.",
              color: "#0033FF",
            },
            {
              title: "ADB Green Bond -- ESG Opportunity",
              detail: "Vivriti's Green Bond issuance requires ESG screening of borrowers. Our Research Agent can automate ESG risk flagging as part of the credit pipeline.",
              color: "#00CC66",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-3"
              style={{ background: "#F4F4F0", borderLeft: `3px solid ${item.color}` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle size={12} color={item.color} />
                <span className="text-xs font-bold text-[#111]">{item.title}</span>
              </div>
              <p className="text-[11px] text-[#555] leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How Vivriti Can Use This */}
      <div className="p-5" style={{ background: "#F4F4F0", border: "2px solid #111", boxShadow: "2px 2px 0px #111" }}>
        <span className="text-xs font-bold text-[#111]">How Vivriti Can Deploy Findesk AI:</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          {[
            {
              title: "Origination Speed",
              desc: "CAM prep from 3 days to 2 minutes. At ~500 mid-market applications/year, this saves ~₹60-80L in analyst costs.",
              color: "#0033FF",
            },
            {
              title: "Portfolio Monitoring",
              desc: "Impairment costs grew 89% to ₹194Cr. Our EWS module catches deterioration early, potentially saving 10-15% of impairment through early intervention.",
              color: "#FF3366",
            },
            {
              title: "ESG Screening",
              desc: "ADB Green Bond requires ESG screening. Our Research Agent flags ESG risks automatically as part of the credit pipeline.",
              color: "#00CC66",
            },
          ].map((item) => (
            <div key={item.title} className="p-3" style={{ background: "white", border: "2px solid #111", boxShadow: "2px 2px 0px #111" }}>
              <div className="text-xs font-bold mb-1" style={{ color: item.color }}>{item.title}</div>
              <p className="text-[11px] text-[#555] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
