"use client";

import { useState } from "react";
import { Sliders, TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";

export default function WhatIfSimulator() {
  const [revGrowth, setRevGrowth] = useState(0);
  const [steelPrice, setSteelPrice] = useState(0);
  const [capUtil, setCapUtil] = useState(42);
  const [loanAmt, setLoanAmt] = useState(12);
  const [gstOverride, setGstOverride] = useState(19.7);

  const adjCapacity = Math.min(
    100,
    Math.max(0, 61 + revGrowth * 0.8 + steelPrice * 0.5 + (capUtil - 42) * 0.4 - (gstOverride - 10) * 1.2)
  );
  const adjConditions = Math.min(100, Math.max(0, 55 + steelPrice * 0.7 + (capUtil - 42) * 0.3));
  const adjCollateral = Math.min(100, Math.max(0, 82 - (loanAmt - 12) * 2.5));
  const adjCapital = Math.min(100, Math.max(0, 78 - (loanAmt - 12) * 1.8));
  const adjComposite = (72 * 0.2 + adjCapacity * 0.25 + adjCapital * 0.2 + adjCollateral * 0.15 + adjConditions * 0.2).toFixed(1);
  const adjDecision = parseFloat(adjComposite) >= 72 ? "APPROVE" : parseFloat(adjComposite) >= 60 ? "CONDITIONAL" : "REJECT";
  const decColor = adjDecision === "APPROVE" ? "#00CC66" : adjDecision === "CONDITIONAL" ? "#FF9900" : "#FF3366";

  const originalScore = 68.2;
  const delta = (parseFloat(adjComposite) - originalScore).toFixed(1);
  const deltaNum = parseFloat(delta);

  const fixedCosts = 18.0;
  const debtService = 6.9 + (loanAmt - 12) * 0.12 * loanAmt;
  const ebitdaMargin = 0.042 + (revGrowth / 100) * 0.02 + (steelPrice / 100) * 0.03;
  const effectiveMargin = Math.max(0.02, ebitdaMargin + (capUtil - 42) * 0.002);
  const breakevenRevenue = (fixedCosts + debtService) / effectiveMargin;
  const currentVerifiedRevenue = 58.1 + (revGrowth / 100) * 58.1;
  const revenueBuffer = ((currentVerifiedRevenue - breakevenRevenue) / breakevenRevenue * 100).toFixed(1);
  const bufferIsNegative = parseFloat(revenueBuffer) < 0;

  const sliders = [
    { label: "Revenue Growth", val: revGrowth, set: setRevGrowth, min: -30, max: 20, unit: "%", icon: TrendingUp },
    { label: "Steel Price Change", val: steelPrice, set: setSteelPrice, min: -25, max: 15, unit: "%", icon: TrendingUp },
    { label: "Capacity Utilization", val: capUtil, set: setCapUtil, min: 20, max: 90, unit: "%", icon: Sliders },
    { label: "Loan Amount", val: loanAmt, set: setLoanAmt, min: 5, max: 25, unit: " Cr", icon: TrendingDown },
    { label: "GST Mismatch", val: gstOverride, set: setGstOverride, min: 0, max: 30, unit: "%", icon: Minus },
  ];

  return (
    <div className="max-w-3xl animate-fadeInUp">
      <div className="p-4 md:p-6" style={{ background: "white", border: "2px solid #111", boxShadow: "4px 4px 0px #111" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 flex items-center justify-center" style={{ border: "2px solid #0033FF" }}>
            <Sliders size={18} color="#0033FF" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#111]">Stress Testing Simulator</h2>
            <p className="text-[11px] text-[#888]">
              Adjust parameters to see real-time impact on credit decision
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {sliders.map((s) => (
            <div key={s.label}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[13px] text-[#333] font-medium">{s.label}</span>
                <span className="text-sm font-bold text-[#0033FF] metric-value" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {s.unit === " Cr" ? `\u20B9${s.val}${s.unit}` : `${s.val}${s.unit}`}
                </span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.unit === " Cr" ? 0.5 : 1}
                value={s.val}
                onChange={(e) => s.set(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-[#888] mt-1">
                <span>{s.unit === " Cr" ? `\u20B9${s.min}${s.unit}` : `${s.min}${s.unit}`}</span>
                <span>{s.unit === " Cr" ? `\u20B9${s.max}${s.unit}` : `${s.max}${s.unit}`}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Results */}
        <div className="mt-6 p-4 md:p-5 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4" style={{ background: "#F4F4F0", border: "2px solid #111" }}>
          <div className="text-center min-w-0">
            <div className="text-[10px] text-[#888] mb-1 tracking-wide font-mono uppercase truncate">ADJUSTED SCORE</div>
            <div className="text-2xl md:text-3xl font-extrabold metric-value whitespace-nowrap" style={{ color: decColor, fontFamily: "'JetBrains Mono', monospace" }}>
              {adjComposite}
            </div>
            <div className="text-[11px] mt-1 metric-value" style={{ color: deltaNum > 0 ? "#00CC66" : deltaNum < 0 ? "#FF3366" : "#888", fontFamily: "'JetBrains Mono', monospace" }}>
              {deltaNum > 0 ? "+" : ""}{delta} from base
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-[#888] mb-1 tracking-wide font-mono uppercase">DECISION</div>
            <div
              className="text-sm font-bold px-3 py-2 inline-block font-mono uppercase"
              style={{
                color: decColor,
                border: `2px solid ${decColor}`,
              }}
            >
              {adjDecision}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-[#888] mb-1 tracking-wide font-mono uppercase">CAPACITY</div>
            <div
              className="text-xl font-bold metric-value"
              style={{ color: adjCapacity >= 60 ? "#FF9900" : "#FF3366", fontFamily: "'JetBrains Mono', monospace" }}
            >
              {adjCapacity.toFixed(0)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-[#888] mb-1 tracking-wide font-mono uppercase">CONDITIONS</div>
            <div
              className="text-xl font-bold metric-value"
              style={{ color: adjConditions >= 60 ? "#FF9900" : "#FF3366", fontFamily: "'JetBrains Mono', monospace" }}
            >
              {adjConditions.toFixed(0)}
            </div>
          </div>
        </div>

        {/* Enhancement 3: Break-Even Analysis */}
        <div
          className="mt-5 p-5"
          style={{
            background: "white",
            border: `2px solid ${bufferIsNegative ? "#FF3366" : "#00CC66"}`,
            boxShadow: "2px 2px 0px #111",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} color={bufferIsNegative ? "#FF3366" : "#00CC66"} />
            <span className="text-[13px] font-bold" style={{ color: bufferIsNegative ? "#FF3366" : "#00CC66" }}>
              Break-Even Analysis -- DSCR = 1.0x Threshold
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4">
            <div className="text-center p-3" style={{ background: "#F4F4F0", border: "2px solid #111" }}>
              <div className="text-[10px] text-[#888] mb-1 font-mono uppercase truncate">BREAK-EVEN REVENUE</div>
              <div className="text-lg md:text-xl font-bold text-[#FF9900] metric-value whitespace-nowrap" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {"\u20B9"}{breakevenRevenue.toFixed(1)} Cr
              </div>
              <div className="text-[10px] text-[#888]">Where DSCR = 1.0x</div>
            </div>
            <div className="text-center p-3" style={{ background: "#F4F4F0", border: "2px solid #111" }}>
              <div className="text-[10px] text-[#888] mb-1 font-mono uppercase truncate">CURRENT VERIFIED</div>
              <div className="text-lg md:text-xl font-bold text-[#0033FF] metric-value whitespace-nowrap" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {"\u20B9"}{currentVerifiedRevenue.toFixed(1)} Cr
              </div>
              <div className="text-[10px] text-[#888]">2A-verified revenue</div>
            </div>
            <div className="text-center p-3" style={{ background: "#F4F4F0", border: "2px solid #111" }}>
              <div className="text-[10px] text-[#888] mb-1 font-mono uppercase truncate">REVENUE BUFFER</div>
              <div
                className="text-lg md:text-xl font-bold metric-value whitespace-nowrap"
                style={{ color: bufferIsNegative ? "#FF3366" : "#00CC66", fontFamily: "'JetBrains Mono', monospace" }}
              >
                {bufferIsNegative ? "" : "+"}{revenueBuffer}%
              </div>
              <div className="text-[10px]" style={{ color: bufferIsNegative ? "#FF3366" : "#00CC66" }}>
                {bufferIsNegative ? "NEGATIVE -- Cannot absorb decline" : "Positive buffer"}
              </div>
            </div>
          </div>

          <p className="text-[11px] leading-relaxed" style={{ color: bufferIsNegative ? "#CC0044" : "#555" }}>
            {bufferIsNegative
              ? `The borrower's verified revenue (\u20B9${currentVerifiedRevenue.toFixed(1)}Cr) is BELOW the break-even threshold (\u20B9${breakevenRevenue.toFixed(1)}Cr). At current parameters, DSCR < 1.0x -- the borrower cannot fully service debt from operations. This is a critical risk factor.`
              : `The borrower has a ${revenueBuffer}% revenue buffer above break-even. Revenue would need to decline by \u20B9${(currentVerifiedRevenue - breakevenRevenue).toFixed(1)}Cr before debt service is at risk.`}
          </p>
        </div>
      </div>
    </div>
  );
}
