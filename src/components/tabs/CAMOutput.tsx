"use client";

import { useState, useRef } from "react";
import {
  FileText, FileCheck, CheckCircle, AlertTriangle, Download,
  Volume2, VolumeX, Sparkles, Loader2,
} from "lucide-react";
import { FIVE_CS, TERM_SHEET, COMPLIANCE_CHECKS, COMPANY } from "@/data/mockData";
import { checkCompliance } from "@/lib/complianceChecker";
import { useAnalysis } from "@/lib/AnalysisContext";

const EXECUTIVE_SUMMARY = `This is the Findesk AI Executive Summary for Rathi Steels Private Limited.

The application seeks a credit facility of 18.50 Crores for working capital augmentation and capacity expansion. After comprehensive analysis across the Five Cs of Credit framework, the engine recommends a reduced sanction of 12 Crores, working capital only, subject to additional conditions.

Key Risk Flags: A 19.7% mismatch between GSTR 3B and GSTR 2A returns indicates potential circular trading. Quarter-end spike patterns in June, September, and January are consistent with accommodation entries. Capacity utilization stands at only 42%, with DSCR of 1.08x on reported figures, dropping to 0.91x on adjusted revenues.

However, collateral coverage is strong at 1.69x, and the promoter has 15 years of industry experience with clean MCA compliance. The credit committee recommends conditional approval at 12 Crores with enhanced monitoring, accelerated 6-month review, and mandatory quarterly GST reconciliation.`;

export default function CAMOutput() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCAM, setGeneratedCAM] = useState("");

  const { analysis, isUsingMockData } = useAnalysis();
  const rbiChecks = checkCompliance(1200, { car: 18, ltvRatio: 59.2 }, 21469);

  const companyName = (!isUsingMockData && analysis) ? analysis.company.name : COMPANY.name;
  const companySector = (!isUsingMockData && analysis) ? analysis.company.sector : COMPANY.sector;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handleVoiceNarration = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    if (!("speechSynthesis" in window)) {
      alert("Your browser does not support text-to-speech.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(EXECUTIVE_SUMMARY);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Google") ||
          v.name.includes("Daniel") ||
          v.name.includes("Samantha"))
    );
    if (preferred) utterance.voice = preferred;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const generateLiveCAM = async () => {
    setIsGenerating(true);
    setGeneratedCAM("");

    try {
      let companyData: string;
      let scores: string;
      let debate: string;

      if (!isUsingMockData && analysis) {
        scores = analysis.fiveCScores
          ? Object.entries(analysis.fiveCScores).map(([k, v]) => `${k}: ${v.score}/100 (${v.label})`).join("\n")
          : "N/A";
        companyData = `Company: ${analysis.company.name}, Sector: ${analysis.company.sector}, ${analysis.company.requestedLoan ? `Loan: ${analysis.company.requestedLoan}, ` : ""}${analysis.ratios ? `DSCR: ${analysis.ratios.dscr}x, D/E: ${analysis.ratios.deRatio}x, RoA: ${analysis.ratios.roa}%, Credit Cost: ${analysis.ratios.creditCost}%` : ""}, Composite Score: ${analysis.compositeScore}/100, Recommendation: ${analysis.recommendation}`;
        debate = `Based on analysis: ${analysis.executiveSummary || "Multi-agent debate completed."}`;
      } else {
        scores = Object.entries(FIVE_CS).map(([k, v]) => `${k}: ${v.score}/100 (${v.label})`).join("\n");
        companyData = `Company: ${COMPANY.name}, Sector: ${COMPANY.sector}, Loan: ${COMPANY.requestedLoan}, Purpose: ${COMPANY.purpose}, Revenue: ₹72.4Cr (3B) / ₹58.1Cr (2A verified), DSCR: 1.08x, Net Worth: ₹24.6Cr, D/E: 1.12x, Collateral: 1.69x coverage, CIBIL: 682, Capacity Utilization: 42%`;
        debate = "Hawk: REJECT (GST fraud). Dove: CONDITIONAL APPROVE (strong collateral). Owl: CONDITIONAL APPROVE at ₹12Cr.";
      }

      const res = await fetch("/api/generate-cam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyData, scores, debate }),
      });

      if (!res.ok) throw new Error("CAM generation failed");

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
            if (data.text) {
              setGeneratedCAM((prev) => prev + data.text);
            }
          } catch {
            // ignore
          }
        }
      }
    } catch (err) {
      console.error("CAM generation error:", err);
    }

    setIsGenerating(false);
  };

  return (
    <div className="max-w-4xl animate-fadeInUp space-y-5">
      {/* Voice Narration + AI Generate buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          onClick={handleVoiceNarration}
          className="flex-1 py-3.5 flex items-center justify-center gap-3 cursor-pointer text-sm font-semibold transition-all border-none"
          style={{
            background: isPlaying ? "#FF3366" : "white",
            color: isPlaying ? "white" : "#0033FF",
            border: isPlaying ? "2px solid #FF3366" : "2px solid #0033FF",
            boxShadow: "3px 3px 0px #111",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-1px, -1px)"; e.currentTarget.style.boxShadow = "4px 4px 0px #111"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0, 0)"; e.currentTarget.style.boxShadow = "3px 3px 0px #111"; }}
        >
          {isPlaying ? <VolumeX size={18} /> : <Volume2 size={18} />}
          {isPlaying ? "Stop Narration" : "AI Voice Narration"}
        </button>

        <button
          onClick={generateLiveCAM}
          disabled={isGenerating}
          className="flex-1 py-3.5 flex items-center justify-center gap-3 cursor-pointer text-sm font-semibold transition-all border-none"
          style={{
            background: isGenerating ? "#F4F4F0" : "#0033FF",
            color: isGenerating ? "#555" : "#FFFFFF",
            border: isGenerating ? "2px solid #ddd" : "2px solid #0033FF",
            boxShadow: isGenerating ? "none" : "3px 3px 0px #111",
          }}
          onMouseEnter={(e) => { if (!isGenerating) { e.currentTarget.style.transform = "translate(-1px, -1px)"; e.currentTarget.style.boxShadow = "4px 4px 0px #111"; } }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0, 0)"; e.currentTarget.style.boxShadow = isGenerating ? "none" : "3px 3px 0px #111"; }}
        >
          {isGenerating ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Sparkles size={18} />
          )}
          {isGenerating ? "Generating CAM..." : "Generate CAM with AI"}
        </button>
      </div>

      {/* AI Generated CAM */}
      {(generatedCAM || isGenerating) && (
        <div className="p-4 md:p-6" style={{ background: "white", border: "2px solid #6633FF", boxShadow: "4px 4px 0px #111" }}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} color="#6633FF" />
            <span className="text-sm font-bold text-[#111]">
              AI-Generated Credit Appraisal Memo
            </span>
            <span className="text-[9px] text-[#888] px-2 py-0.5 font-mono uppercase" style={{ background: "#F4F4F0", border: "1px solid #ddd" }}>
              OpenAI
            </span>
          </div>
          <div className="text-[12px] text-[#333] leading-7 whitespace-pre-wrap">
            {generatedCAM}
            {isGenerating && (
              <span className="inline-block w-2 h-4 bg-[#6633FF] animate-pulse ml-0.5" />
            )}
          </div>
        </div>
      )}

      {/* Term Sheet */}
      <div className="p-4 md:p-6" style={{ background: "white", border: "2px solid #0033FF", boxShadow: "4px 4px 0px #111" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ border: "2px solid #0033FF" }}>
            <FileCheck size={18} color="#0033FF" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-[#111]">Auto-Generated Term Sheet</h2>
            <p className="text-[11px] text-[#888]">
              Commercial terms derived from risk analysis
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <tbody>
            {TERM_SHEET.map(([k, v], i) => (
              <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                <td className="px-3 py-2.5 text-[#555] font-semibold w-[35%]">
                  {k}
                </td>
                <td className="px-3 py-2.5 text-[#111]">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Compliance Checklist */}
      <div className="p-4 md:p-6" style={{ background: "white", border: "2px solid #111", boxShadow: "4px 4px 0px #111" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ border: "2px solid #00CC66" }}>
            <CheckCircle size={18} color="#00CC66" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#111]">RBI Compliance Checker</h2>
            <p className="text-[11px] text-[#888]">
              Automated regulatory compliance verification -- 8/8 norms checked
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {COMPLIANCE_CHECKS.map((c, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 transition-colors"
              style={{
                borderLeft: `3px solid ${c.status === "PASS" ? "#00CC66" : "#FF9900"}`,
                background: "white",
                border: "2px solid #111",
                borderLeftWidth: "3px",
                borderLeftColor: c.status === "PASS" ? "#00CC66" : "#FF9900",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#F4F4F0"}
              onMouseLeave={(e) => e.currentTarget.style.background = "white"}
            >
              {c.status === "PASS" ? (
                <CheckCircle
                  size={14}
                  color="#00CC66"
                  className="mt-0.5 flex-shrink-0"
                />
              ) : (
                <AlertTriangle
                  size={14}
                  color="#FF9900"
                  className="mt-0.5 flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#111]">
                    {c.rule}
                  </span>
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 font-mono uppercase"
                    style={{
                      border: `2px solid ${c.status === "PASS" ? "#00CC66" : "#FF9900"}`,
                      color: c.status === "PASS" ? "#00CC66" : "#FF9900",
                    }}
                  >
                    {c.status}
                  </span>
                </div>
                <p className="text-[11px] text-[#555] mt-0.5">{c.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CAM Preview */}
      <div className="bg-[#FEFCE8] p-4 md:p-6 text-[#1C1917]">
        <div className="text-center border-b-2 border-[#92400E] pb-4 mb-4">
          <div className="text-[10px] text-[#92400E] tracking-[0.15em] font-semibold">
            CONFIDENTIAL — FOR INTERNAL USE ONLY
          </div>
          <h2 className="text-lg md:text-xl font-extrabold text-[#1C1917] mt-2">
            CREDIT APPRAISAL MEMORANDUM
          </h2>
          <p className="text-xs text-[#44403C] mt-1">
            Rathi Steels Pvt. Ltd. | Working Capital + Term Loan
          </p>
          <p className="text-[11px] text-[#78716C] mt-0.5">
            Auto-generated by Findesk AI Engine |{" "}
            {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="text-xs leading-7 text-[#292524]">
          <h3 className="font-bold text-[13px] text-[#92400E] mb-2">
            1. EXECUTIVE SUMMARY
          </h3>
          <p className="mb-3">
            The application seeks a credit facility of ₹18.50 Crores for working
            capital augmentation and capacity expansion at the Bhiwandi
            manufacturing facility. Based on comprehensive analysis across the
            Five Cs of Credit framework, the engine recommends a{" "}
            <strong>reduced sanction of ₹12.00 Crores</strong> (working capital
            only), subject to additional conditions.
          </p>

          <h3 className="font-bold text-[13px] text-[#92400E] mb-2">
            2. KEY RISK FLAGS
          </h3>
          <p className="mb-2">
            <span className="text-[#CC0044] font-semibold">Critical:</span>{" "}
            19.7% mismatch between GSTR-3B and GSTR-2A returns indicating
            potential circular trading. Quarter-end spike pattern (Jun, Sep, Jan)
            consistent with accommodation entries.
          </p>
          <p className="mb-3">
            <span className="text-[#CC0044] font-semibold">High:</span>{" "}
            Capacity utilization at 42% (site visit confirmed) with DSCR of
            1.08x on reported figures, dropping to 0.91x on adjusted revenues.
          </p>

          <h3 className="font-bold text-[13px] text-[#92400E] mb-2">
            3. FIVE C SCORE SUMMARY
          </h3>
          <div className="flex gap-2 flex-wrap mb-3">
            {Object.entries(FIVE_CS).map(([k, v]) => (
              <div
                key={k}
                className="px-2.5 py-1 text-[11px] font-semibold"
                style={{
                  background:
                    v.score >= 75
                      ? "#DCFCE7"
                      : v.score >= 60
                        ? "#FEF9C3"
                        : "#FEE2E2",
                  color:
                    v.score >= 75
                      ? "#166534"
                      : v.score >= 60
                        ? "#854D0E"
                        : "#991B1B",
                }}
              >
                {k.charAt(0).toUpperCase() + k.slice(1)}: {v.score}/100
              </div>
            ))}
          </div>

          <h3 className="font-bold text-[13px] text-[#92400E] mb-2">
            4. CREDIT COMMITTEE OUTCOME
          </h3>
          <p className="mb-1">
            Three AI agents debated the application. Hawk Agent recommended
            REJECT (GST fraud signal, insolvent on true numbers). Dove Agent
            recommended CONDITIONAL APPROVE (strong collateral, promoter
            quality). Owl Agent synthesized: CONDITIONAL APPROVE at ₹12Cr with
            enhanced monitoring.
          </p>

          <div className="text-[10px] text-[#78716C] text-center mt-6 italic">
            [ ... Full 22-page CAM with all Five C sections available for
            download ... ]
          </div>
        </div>
      </div>

      {/* Download buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          className="flex-1 py-3 px-4 text-[#0033FF] cursor-pointer text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          style={{ border: "2px solid #0033FF", background: "white", boxShadow: "2px 2px 0px #111" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-1px, -1px)"; e.currentTarget.style.boxShadow = "3px 3px 0px #111"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0, 0)"; e.currentTarget.style.boxShadow = "2px 2px 0px #111"; }}
        >
          <Download size={14} />
          Download CAM (Word)
        </button>
        <button
          className="flex-1 py-3 px-4 text-[#6633FF] cursor-pointer text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          style={{ border: "2px solid #6633FF", background: "white", boxShadow: "2px 2px 0px #111" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-1px, -1px)"; e.currentTarget.style.boxShadow = "3px 3px 0px #111"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0, 0)"; e.currentTarget.style.boxShadow = "2px 2px 0px #111"; }}
        >
          <Download size={14} />
          Download CAM (PDF)
        </button>
        <button
          className="flex-1 py-3 px-4 text-[#00CC66] cursor-pointer text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          style={{ border: "2px solid #00CC66", background: "white", boxShadow: "2px 2px 0px #111" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-1px, -1px)"; e.currentTarget.style.boxShadow = "3px 3px 0px #111"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0, 0)"; e.currentTarget.style.boxShadow = "2px 2px 0px #111"; }}
        >
          <Download size={14} />
          Download Term Sheet
        </button>
      </div>
    </div>
  );
}
