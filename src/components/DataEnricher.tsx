"use client";

import { useState, useEffect, type ReactNode } from "react";
import { Loader2, Search, AlertTriangle } from "lucide-react";
import { useAnalysis } from "@/lib/AnalysisContext";

interface DataEnricherProps {
  tabId: string;
  children: (data: Record<string, unknown> | null, isLoading: boolean) => ReactNode;
  fallback: ReactNode;
}

// Wraps a tab component. If we have real analysis data (not mock),
// fetches enriched data from /api/enrich using Tavily + OpenAI.
// Shows the enriched data, or falls back to mock data display.
export default function DataEnricher({ tabId, children, fallback }: DataEnricherProps) {
  const { analysis, isUsingMockData } = useAnalysis();
  const [enrichedData, setEnrichedData] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    // Reset when analysis changes
    setEnrichedData(null);
    setHasAttempted(false);
    setError("");
  }, [analysis?.company?.name]);

  // If using mock data, just show the fallback (original tab with mock data)
  if (isUsingMockData || !analysis) {
    return <>{fallback}</>;
  }

  const fetchEnrichedData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: analysis.company.name,
          tabId,
        }),
      });

      if (!res.ok) throw new Error("Enrichment failed");

      const result = await res.json();
      if (result.data) {
        setEnrichedData(result.data);
      } else {
        setError("Could not generate data for this tab");
      }
    } catch (err) {
      setError(String(err));
    }
    setIsLoading(false);
    setHasAttempted(true);
  };

  // If we have enriched data, render with it
  if (enrichedData) {
    return <>{children(enrichedData, false)}</>;
  }

  // If loading
  if (isLoading) {
    return (
      <div className="p-8 md:p-12 text-center" style={{ background: "white", border: "2px solid #111", boxShadow: "4px 4px 0px #111" }}>
        <Loader2 size={28} className="animate-spin mx-auto mb-4" color="#0033FF" />
        <h3 className="text-base font-bold mb-2">Analyzing {analysis.company.name}</h3>
        <p className="text-[11px] text-gray-500 mb-1">
          Searching the web for real-time data and generating analysis...
        </p>
        <p className="font-mono text-[10px] text-gray-400 uppercase tracking-wider">
          Tavily Search + OpenAI
        </p>
      </div>
    );
  }

  // Error state
  if (error && hasAttempted) {
    return (
      <div className="p-6" style={{ background: "white", border: "2px solid #FF3366", boxShadow: "4px 4px 0px #111" }}>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={16} color="#FF3366" />
          <span className="text-sm font-bold text-[#FF3366]">Data Enrichment Failed</span>
        </div>
        <p className="text-[11px] text-gray-500 mb-4">{error}</p>
        <div className="flex gap-3">
          <button
            onClick={fetchEnrichedData}
            className="font-mono text-[10px] font-bold px-4 py-2 cursor-pointer uppercase tracking-wider transition-all"
            style={{ background: "white", border: "2px solid #0033FF", color: "#0033FF", boxShadow: "2px 2px 0px #111" }}
          >
            Retry
          </button>
          <button
            onClick={() => setHasAttempted(false)}
            className="font-mono text-[10px] font-bold px-4 py-2 cursor-pointer uppercase tracking-wider text-gray-500"
            style={{ background: "#F4F4F0", border: "2px solid #ddd" }}
          >
            Show Sample Data
          </button>
        </div>
      </div>
    );
  }

  // Not yet attempted — show prompt to generate
  if (!hasAttempted) {
    return (
      <div className="space-y-5 animate-fadeInUp">
        <div className="p-6 md:p-8" style={{ background: "white", border: "2px solid #0033FF", boxShadow: "4px 4px 0px #111" }}>
          <div className="flex items-start gap-4">
            <Search size={20} color="#0033FF" className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-base font-bold mb-1">
                Generate live analysis for {analysis.company.name}
              </h3>
              <p className="text-[11px] text-gray-500 mb-4">
                This tab needs additional data that wasn&apos;t in the uploaded document.
                We&apos;ll search the web in real-time and generate a complete analysis.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={fetchEnrichedData}
                  className="font-mono text-[10px] font-bold px-5 py-2.5 cursor-pointer uppercase tracking-wider text-white transition-all flex items-center gap-2"
                  style={{ background: "#0033FF", border: "2px solid #0033FF", boxShadow: "3px 3px 0px #111" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-1px, -1px)"; e.currentTarget.style.boxShadow = "4px 4px 0px #111"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0, 0)"; e.currentTarget.style.boxShadow = "3px 3px 0px #111"; }}
                >
                  <Search size={12} />
                  Search & Generate
                </button>
                <button
                  onClick={() => { setHasAttempted(true); setError("skipped"); }}
                  className="font-mono text-[10px] font-bold px-4 py-2.5 cursor-pointer uppercase tracking-wider text-gray-500"
                  style={{ background: "#F4F4F0", border: "2px solid #ddd" }}
                >
                  Use Sample Data
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Show fallback below as preview */}
        <div style={{ opacity: 0.4, pointerEvents: "none" }}>
          {fallback}
        </div>
      </div>
    );
  }

  // Fallback if skipped
  return <>{fallback}</>;
}
