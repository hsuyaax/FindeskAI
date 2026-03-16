"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export interface AnalysisData {
  // Company info
  company: {
    name: string;
    cin: string;
    sector: string;
    type?: string;
    hq?: string;
    promoter?: string;
    requestedLoan?: string;
    revenue?: string;
    netWorth?: string;
  };
  // Five C scores
  fiveCScores?: {
    character: { score: number; label: string; reasoning: string };
    capacity: { score: number; label: string; reasoning: string };
    capital: { score: number; label: string; reasoning: string };
    collateral: { score: number; label: string; reasoning: string };
    conditions: { score: number; label: string; reasoning: string };
  };
  // Ratios
  ratios?: {
    dscr?: number;
    deRatio?: number;
    roa?: number;
    roe?: number;
    creditCost?: number;
    nim?: number;
    costToIncome?: number;
    operatingMargin?: number;
    interestCoverage?: number;
    currentRatio?: number;
    revenueGrowth?: number | null;
    patGrowth?: number | null;
    netWorthGrowth?: number | null;
  };
  // Overall
  compositeScore?: number;
  recommendation?: string;
  recommendedAmount?: string;
  keyRisks?: { factor: string; pillar: string; impact: number; detail: string }[];
  keyStrengths?: { factor: string; detail: string }[];
  executiveSummary?: string;
  // Source
  source?: "pre-extracted" | "ai-generated" | "sample";
}

interface AnalysisContextType {
  analysis: AnalysisData | null;
  setAnalysis: (data: AnalysisData | null) => void;
  isUsingMockData: boolean;
}

const AnalysisContext = createContext<AnalysisContextType>({
  analysis: null,
  setAnalysis: () => {},
  isUsingMockData: true,
});

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);

  return (
    <AnalysisContext.Provider
      value={{
        analysis,
        setAnalysis,
        isUsingMockData: !analysis || analysis.source === "sample",
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  return useContext(AnalysisContext);
}
