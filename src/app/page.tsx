"use client";

import { useState } from "react";
import {
  Brain, Users, AlertTriangle, GitCompare, Sliders, FlaskConical,
  Clock, FileText, Building2, BarChart3, ShieldAlert, Search, Sparkles,
  Upload, ArrowRight,
} from "lucide-react";
import { COMPANY } from "@/data/mockData";
import { VIVRITI_CAPITAL, VIVRITI_RATIOS } from "@/data/realData";
import { useAnalysis, type AnalysisData } from "@/lib/AnalysisContext";
import UploadSection from "@/components/UploadSection";
import FiveCAnalysis from "@/components/tabs/FiveCAnalysis";
import CreditCommittee from "@/components/tabs/CreditCommittee";
import GSTForensics from "@/components/tabs/GSTForensics";
import Reconciliation from "@/components/tabs/Reconciliation";
import WhatIfSimulator from "@/components/tabs/WhatIfSimulator";
import BenfordAnalysis from "@/components/tabs/BenfordAnalysis";
import Pipeline from "@/components/tabs/Pipeline";
import CAMOutput from "@/components/tabs/CAMOutput";
import PeerComparison from "@/components/tabs/PeerComparison";
import EWSMonitor from "@/components/tabs/EWSMonitor";
import ResearchAgent from "@/components/tabs/ResearchAgent";
import VivritiDashboard from "@/components/tabs/VivritiDashboard";
import DataEnricher from "@/components/DataEnricher";

const TABS = [
  { id: "research", label: "Research", num: "01", icon: Search },
  { id: "analysis", label: "Five C", num: "02", icon: Brain },
  { id: "debate", label: "Committee", num: "03", icon: Users },
  { id: "gst", label: "GST", num: "04", icon: AlertTriangle },
  { id: "reconcile", label: "Reconcile", num: "05", icon: GitCompare },
  { id: "whatif", label: "Stress", num: "06", icon: Sliders },
  { id: "benford", label: "Benford", num: "07", icon: FlaskConical },
  { id: "peers", label: "Peers", num: "08", icon: BarChart3 },
  { id: "ews", label: "EWS", num: "09", icon: ShieldAlert },
  { id: "timeline", label: "Pipeline", num: "10", icon: Clock },
  { id: "cam", label: "CAM", num: "11", icon: FileText },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface AnalyzedCompany {
  name: string;
  cin: string;
  sector: string;
  facility?: string;
  promoter?: string;
  requestedLoan?: string;
  compositeScore?: number;
  recommendation?: string;
  recommendedAmount?: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("analysis");
  const [analysisLoaded, setAnalysisLoaded] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [analyzedCompany, setAnalyzedCompany] = useState<AnalyzedCompany | null>(null);
  const { setAnalysis } = useAnalysis();

  const handleAnalysisComplete = (data: Record<string, unknown>) => {
    // Extract company info from API response
    const analysis = (data as { analysis?: Record<string, unknown> })?.analysis || data;
    const company = (analysis as { company?: Record<string, string> })?.company;
    const score = (analysis as { compositeScore?: number })?.compositeScore;
    const rec = (analysis as { recommendation?: string })?.recommendation;
    const amt = (analysis as { recommendedAmount?: string })?.recommendedAmount;

    if (company) {
      setAnalyzedCompany({
        name: company.name || "Uploaded Company",
        cin: company.cin || "N/A",
        sector: company.sector || "N/A",
        facility: company.facility,
        promoter: company.promoter,
        requestedLoan: company.requestedLoan,
        compositeScore: score,
        recommendation: rec,
        recommendedAmount: amt,
      });

      // Set global analysis context so all tabs can access it
      const fiveC = (analysis as Record<string, unknown>).fiveCScores as AnalysisData["fiveCScores"];
      const ratios = (analysis as Record<string, unknown>).ratios as AnalysisData["ratios"];
      const risks = (analysis as Record<string, unknown>).keyRisks as AnalysisData["keyRisks"];
      const strengths = (analysis as Record<string, unknown>).keyStrengths as AnalysisData["keyStrengths"];
      const summary = (analysis as Record<string, unknown>).executiveSummary as string;
      const src = ((data as Record<string, unknown>).source as string) || "ai-generated";

      setAnalysis({
        company: {
          name: company.name || "Uploaded Company",
          cin: company.cin || "N/A",
          sector: company.sector || "N/A",
          type: company.type,
          hq: company.facility,
          promoter: company.promoter,
          requestedLoan: company.requestedLoan,
          revenue: company.revenue,
          netWorth: company.netWorth,
        },
        fiveCScores: fiveC,
        ratios,
        compositeScore: score,
        recommendation: rec,
        recommendedAmount: amt,
        keyRisks: risks,
        keyStrengths: strengths,
        executiveSummary: summary,
        source: src as "pre-extracted" | "ai-generated",
      });
    }

    setAnalysisLoaded(true);
    setShowUpload(false);
    setDemoMode(false);
  };

  const handlePipelineStep = (step: number, status: string) => {
    console.log(`Pipeline step ${step}: ${status}`);
  };

  const handleStartDemo = () => {
    setDemoMode(true);
    setAnalyzedCompany(null);
    setAnalysis(null);
    setAnalysisLoaded(true);
    setShowUpload(false);
  };

  const handleLoadSample = () => {
    setDemoMode(false);
    setAnalyzedCompany(null);
    setAnalysis({ company: { name: COMPANY.name, cin: COMPANY.cin, sector: COMPANY.sector }, source: "sample" });
    setAnalysisLoaded(true);
    setShowUpload(false);
  };

  // Determine which company to show
  const currentCompany = demoMode
    ? {
        name: VIVRITI_CAPITAL.name,
        cin: VIVRITI_CAPITAL.cin,
        sector: VIVRITI_CAPITAL.sector,
        facility: VIVRITI_CAPITAL.hq,
        promoter: "Institutional (Lightrock, TVS Capital)",
        requestedLoan: "N/A",
      }
    : analyzedCompany
      ? {
          name: analyzedCompany.name,
          cin: analyzedCompany.cin,
          sector: analyzedCompany.sector,
          facility: analyzedCompany.facility || "",
          promoter: analyzedCompany.promoter || "",
          requestedLoan: analyzedCompany.requestedLoan || "N/A",
        }
      : COMPANY;

  // Decision display for banner
  const bannerDecision = analyzedCompany?.recommendation
    ? analyzedCompany.recommendation.replace("_", " ")
    : "Conditional";
  const bannerScore = analyzedCompany?.compositeScore || 68.2;
  const bannerAmount = analyzedCompany?.recommendedAmount || "\u20B912.00 Cr.";
  const bannerDecisionColor = bannerDecision.toUpperCase().includes("APPROVE") && !bannerDecision.toUpperCase().includes("CONDITIONAL")
    ? "#00CC66"
    : bannerDecision.toUpperCase().includes("REJECT")
      ? "#FF3366"
      : "#FF9900";

  // Not loaded yet — show landing page
  if (!analysisLoaded) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#F4F4F0", backgroundImage: "radial-gradient(#d1d5db 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
        {/* Header */}
        <header className="bg-white border-b-2 border-black px-4 md:px-6 py-2.5">
          <div className="max-w-[1400px] mx-auto flex items-center gap-3">
            <img src="/logo.png" alt="Findesk AI" className="h-9 w-auto flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-base md:text-lg font-bold tracking-tight leading-none uppercase truncate">Findesk AI</h1>
              <span className="text-[9px] md:text-[10px] font-mono text-gray-500 uppercase tracking-widest hidden sm:block">Smart Financial Intelligence Protocol</span>
            </div>
          </div>
        </header>

        {/* Landing Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-12 md:py-20">
          <div className="max-w-2xl w-full space-y-8">
            {/* Hero */}
            <div className="text-center">
              <span className="font-mono text-[10px] font-bold tracking-widest uppercase mb-3 block" style={{ color: "#0033FF" }}>
                [ CREDIT INTELLIGENCE ]
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
                Analyze any borrower.<br />Under 30 seconds. Full CAM.
              </h2>
              <p className="text-sm md:text-base text-gray-500 max-w-lg mx-auto">
                Upload financial documents to generate a complete credit appraisal with Five C scoring,
                GST forensics, multi-agent debate, and RBI compliance — powered by deterministic computation + AI.
              </p>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Upload Documents */}
              <button
                onClick={() => setShowUpload(true)}
                className="text-left p-5 md:p-6 cursor-pointer transition-all group"
                style={{
                  background: "white",
                  border: "2px solid #111",
                  boxShadow: "4px 4px 0px #111",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-2px, -2px)"; e.currentTarget.style.boxShadow = "6px 6px 0px #111"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0, 0)"; e.currentTarget.style.boxShadow = "4px 4px 0px #111"; }}
              >
                <Upload size={24} color="#0033FF" className="mb-3" />
                <h3 className="text-base font-bold mb-1">Upload Documents</h3>
                <p className="text-[11px] text-gray-500 mb-3">
                  PDF, Excel, or images — annual reports, GST returns, bank statements
                </p>
                <span className="font-mono text-[10px] font-bold uppercase flex items-center gap-1" style={{ color: "#0033FF" }}>
                  Start analysis <ArrowRight size={12} />
                </span>
              </button>

              {/* Case Study */}
              <button
                onClick={handleStartDemo}
                className="text-left p-5 md:p-6 cursor-pointer transition-all"
                style={{
                  background: "white",
                  border: "2px solid #0033FF",
                  boxShadow: "4px 4px 0px #0033FF",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-2px, -2px)"; e.currentTarget.style.boxShadow = "6px 6px 0px #0033FF"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0, 0)"; e.currentTarget.style.boxShadow = "4px 4px 0px #0033FF"; }}
              >
                <Sparkles size={24} color="#0033FF" className="mb-3" />
                <h3 className="text-base font-bold mb-1">Vivriti Capital Case Study</h3>
                <p className="text-[11px] text-gray-500 mb-3">
                  See a live analysis of Vivriti Capital using data extracted from their FY25 annual report
                </p>
                <span className="font-mono text-[10px] font-bold uppercase flex items-center gap-1" style={{ color: "#0033FF" }}>
                  View case study <ArrowRight size={12} />
                </span>
              </button>
            </div>

            {/* Or load sample */}
            <div className="text-center">
              <button
                onClick={handleLoadSample}
                className="font-mono text-[10px] text-gray-400 uppercase tracking-wider cursor-pointer bg-transparent border-none hover:text-gray-600 transition-colors"
              >
                or load sample borrower (Rathi Steels) →
              </button>
            </div>

            {/* Upload Section (shown when clicked) */}
            {showUpload && (
              <div className="animate-fadeInUp">
                <UploadSection
                  onAnalysisComplete={handleAnalysisComplete}
                  onPipelineStep={handlePipelineStep}
                />
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
              {[
                { label: "Five C Scoring", detail: "Weighted scorecard" },
                { label: "GST Forensics", detail: "3B vs 2A cross-check" },
                { label: "AI Committee", detail: "Hawk / Dove / Owl" },
                { label: "Full CAM", detail: "Auto-generated report" },
              ].map((f) => (
                <div key={f.label} className="p-3 text-center" style={{ background: "white", border: "1px solid #ddd" }}>
                  <p className="text-[11px] font-bold text-[#111]">{f.label}</p>
                  <p className="text-[9px] text-gray-400 font-mono uppercase">{f.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t-2 border-black bg-white px-4 md:px-6 py-3">
          <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
            <p className="font-mono text-[9px] md:text-[10px] text-gray-500 uppercase tracking-wider">
              Findesk AI &middot; Enterprise Credit Intelligence
            </p>
            <p className="font-mono text-[9px] md:text-[10px] text-gray-500 uppercase tracking-wider">
              OpenAI + FinBERT + Multi-Agent CoT
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Analysis loaded — show full dashboard
  return (
    <div className="min-h-screen" style={{ background: "#F4F4F0", backgroundImage: "radial-gradient(#d1d5db 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b-2 border-black px-4 md:px-6 py-2.5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img src="/logo.png" alt="Findesk AI" className="h-9 w-auto flex-shrink-0 cursor-pointer" onClick={() => { setAnalysisLoaded(false); setDemoMode(false); setShowUpload(false); setAnalyzedCompany(null); setAnalysis(null); }} />
            <div className="min-w-0">
              <h1 className="text-base md:text-lg font-bold tracking-tight leading-none uppercase truncate cursor-pointer" onClick={() => { setAnalysisLoaded(false); setDemoMode(false); setShowUpload(false); setAnalyzedCompany(null); setAnalysis(null); }}>Findesk AI</h1>
              <span className="text-[9px] md:text-[10px] font-mono text-gray-500 uppercase tracking-widest hidden sm:block">Smart Financial Intelligence Protocol</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="font-mono text-[9px] md:text-[10px] font-bold border-2 border-black bg-white px-2.5 md:px-4 py-1.5 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap"
              style={{ boxShadow: "2px 2px 0px #111" }}
            >
              {showUpload ? "Hide" : "Upload"}
            </button>

            <button
              onClick={() => setDemoMode(!demoMode)}
              className="font-mono text-[9px] md:text-[10px] font-bold border-2 px-2.5 md:px-4 py-1.5 uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-1.5 whitespace-nowrap"
              style={{
                background: demoMode ? "#0033FF" : "white",
                color: demoMode ? "white" : "#111",
                borderColor: demoMode ? "#0033FF" : "#111",
                boxShadow: demoMode ? "2px 2px 0px #001A80" : "2px 2px 0px #111",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full inline-block flex-shrink-0" style={{ background: demoMode ? "#00FF66" : "#FF3366" }} />
              <span className="hidden sm:inline">{demoMode ? "Case Study" : "Case Study"}</span>
              <span className="sm:hidden">{demoMode ? "Live" : "Demo"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Company Banner */}
      <div className="border-b-2 border-black bg-white px-4 md:px-6 py-4 md:py-6">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <span className="font-mono text-[10px] font-bold tracking-widest uppercase mb-1 block" style={{ color: "#0033FF" }}>
              [ {demoMode ? "CASE_STUDY" : "ACTIVE_ANALYSIS"} ]
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter mb-1 break-words">{currentCompany.name}</h2>
            <p className="font-mono text-[10px] md:text-[11px] text-gray-500 break-all">
              CIN: {currentCompany.cin} &nbsp;|&nbsp; {currentCompany.sector}
            </p>
          </div>

          <div className="flex flex-wrap border-2 border-black w-full lg:w-auto" style={{ boxShadow: "4px 4px 0px #111" }}>
            {demoMode ? (
              <>
                {[
                  { label: "Revenue", value: "\u20B91,347Cr" },
                  { label: "AUM", value: "\u20B99,081Cr" },
                  { label: "RoA", value: `${VIVRITI_RATIOS.roa}%` },
                  { label: "D/E", value: `${VIVRITI_RATIOS.deRatio}x` },
                ].map((m, i, arr) => (
                  <div key={m.label} className={`p-2.5 px-3 flex-1 min-w-[80px] ${i < arr.length - 1 ? "border-r-2 border-black" : ""}`} style={{ background: "#F4F4F0" }}>
                    <p className="font-mono text-[8px] md:text-[9px] uppercase text-gray-500 mb-0.5 font-bold">{m.label}</p>
                    <p className="font-mono text-sm md:text-lg font-bold">{m.value}</p>
                  </div>
                ))}
                <div className="p-2.5 px-3 bg-black text-white flex flex-col justify-center flex-1 min-w-[80px] border-t-2 border-black sm:border-t-0 sm:border-l-2">
                  <p className="font-mono text-[8px] md:text-[9px] uppercase text-gray-400 mb-0.5">Credit Cost</p>
                  <p className="font-mono text-sm md:text-lg font-bold" style={{ color: "#FF3366" }}>{VIVRITI_RATIOS.creditCost}%</p>
                </div>
              </>
            ) : (
              <>
                <div className="p-2.5 px-3 border-r-2 border-black flex-1 min-w-[80px]" style={{ background: "#F4F4F0" }}>
                  <p className="font-mono text-[8px] md:text-[9px] uppercase text-gray-500 mb-0.5 font-bold">Requested</p>
                  <p className="font-mono text-sm md:text-lg font-bold">{currentCompany.requestedLoan || "N/A"}</p>
                </div>
                <div className="p-2.5 px-3 border-r-2 border-black flex-1 min-w-[80px]" style={{ background: "#F4F4F0" }}>
                  <p className="font-mono text-[8px] md:text-[9px] uppercase text-gray-500 mb-0.5 font-bold">Score</p>
                  <p className="font-mono text-sm md:text-lg font-bold" style={{ color: "#0033FF" }}>{bannerScore}</p>
                </div>
                <div className="p-2.5 px-3 border-r-2 border-black flex-1 min-w-[80px]" style={{ background: "#F4F4F0" }}>
                  <p className="font-mono text-[8px] md:text-[9px] uppercase font-bold mb-0.5" style={{ color: "#0033FF" }}>Recommended</p>
                  <p className="font-mono text-sm md:text-lg font-bold" style={{ color: "#0033FF" }}>{bannerAmount}</p>
                </div>
                <div className="p-2.5 px-3 bg-black text-white flex flex-col justify-center flex-1 min-w-[80px]">
                  <p className="font-mono text-[8px] md:text-[9px] uppercase text-gray-400 mb-0.5">AI Verdict</p>
                  <p className="font-mono text-sm md:text-lg font-bold uppercase" style={{ color: bannerDecisionColor }}>{bannerDecision}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <nav className="w-full border-b-2 border-black bg-white">
        <div className="max-w-[1400px] mx-auto overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 md:px-4 py-2.5 border-r border-gray-200 cursor-pointer transition-colors font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${activeTab === tab.id ? "tab-active" : "hover:bg-gray-100"}`}
              >
                {tab.num}. {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Upload Section */}
      {showUpload && !demoMode && (
        <div className="px-4 md:px-6 pt-6 max-w-[1400px] mx-auto">
          <div className="max-w-2xl">
            <UploadSection
              onAnalysisComplete={handleAnalysisComplete}
              onPipelineStep={handlePipelineStep}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 md:px-6 py-6 md:py-8 max-w-[1400px] mx-auto">
        {demoMode ? (
          <VivritiDashboard />
        ) : (
          <>
            {activeTab === "research" && <ResearchAgent />}
            {activeTab === "analysis" && <FiveCAnalysis />}
            {activeTab === "debate" && <CreditCommittee />}
            {activeTab === "gst" && (
              <DataEnricher tabId="gst" fallback={<GSTForensics />}>
                {() => <GSTForensics />}
              </DataEnricher>
            )}
            {activeTab === "reconcile" && (
              <DataEnricher tabId="reconciliation" fallback={<Reconciliation />}>
                {() => <Reconciliation />}
              </DataEnricher>
            )}
            {activeTab === "whatif" && (
              <DataEnricher tabId="whatif" fallback={<WhatIfSimulator />}>
                {() => <WhatIfSimulator />}
              </DataEnricher>
            )}
            {activeTab === "benford" && (
              <DataEnricher tabId="benford" fallback={<BenfordAnalysis />}>
                {() => <BenfordAnalysis />}
              </DataEnricher>
            )}
            {activeTab === "peers" && (
              <DataEnricher tabId="peers" fallback={<PeerComparison />}>
                {() => <PeerComparison />}
              </DataEnricher>
            )}
            {activeTab === "ews" && (
              <DataEnricher tabId="ews" fallback={<EWSMonitor />}>
                {() => <EWSMonitor />}
              </DataEnricher>
            )}
            {activeTab === "timeline" && <Pipeline />}
            {activeTab === "cam" && <CAMOutput />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black bg-white px-4 md:px-6 py-3">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
          <p className="font-mono text-[9px] md:text-[10px] text-gray-500 uppercase tracking-wider">
            Findesk AI &middot; Enterprise Credit Intelligence
          </p>
          <p className="font-mono text-[9px] md:text-[10px] text-gray-500 uppercase tracking-wider">
            OpenAI + FinBERT + Multi-Agent CoT
          </p>
        </div>
      </footer>
    </div>
  );
}
