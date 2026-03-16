"use client";

import { FlaskConical } from "lucide-react";
import BenfordChart from "@/components/BenfordChart";

export default function BenfordAnalysis() {
  return (
    <div className="max-w-3xl animate-fadeInUp">
      <div className="p-4 md:p-6" style={{ background: "white", border: "2px solid #111", boxShadow: "4px 4px 0px #111" }}>
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ border: "2px solid #FF9900" }}>
            <FlaskConical size={18} color="#FF9900" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-[#111]">
              Benford&apos;s Law -- Forensic Analytics
            </h2>
            <p className="text-[11px] text-[#888]">
              First-digit distribution analysis of 1,247 bank statement transactions
            </p>
          </div>
          <span className="text-[11px] font-bold text-[#FF3366] px-3 py-1.5 font-mono uppercase" style={{ border: "2px solid #FF3366" }}>
            p = 0.003 -- ANOMALY
          </span>
        </div>

        <BenfordChart />

        <div className="mt-4 p-4" style={{ background: "#F4F4F0", border: "2px solid #FF9900" }}>
          <div className="text-xs text-[#333] leading-7">
            <strong className="text-[#FF9900]">Interpretation: </strong>
            Digits 1 and 2 are under-represented (24.3% vs 30.1% expected, 15.8% vs 17.6%),
            while digits 3-6 are over-represented. This pattern is consistent with manual
            fabrication where people unconsciously avoid starting numbers with 1 and distribute
            digits more evenly. Combined with the GST mismatch finding, this strengthens the
            circular trading hypothesis.
          </div>
        </div>

        <div className="mt-4 p-4" style={{ background: "#F4F4F0", border: "1px solid #ddd" }}>
          <h4 className="text-xs font-semibold text-[#111] mb-2">What is Benford&apos;s Law?</h4>
          <p className="text-[11px] text-[#555] leading-relaxed">
            In naturally occurring datasets (revenues, expenses, transaction amounts), the first
            digit follows a specific distribution: 1 appears ~30% of the time, 2 appears ~17.6%,
            etc. Fabricated numbers tend to be more uniformly distributed. A Chi-squared
            goodness-of-fit test with p &lt; 0.05 indicates significant deviation from the
            expected distribution -- a statistical red flag for data manipulation.
          </p>
        </div>
      </div>
    </div>
  );
}
