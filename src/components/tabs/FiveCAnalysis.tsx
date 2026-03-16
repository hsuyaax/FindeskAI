"use client";

import { useState } from "react";
import {
  Shield, TrendingUp, Building2, Scale, Activity,
  Brain, Eye, FileText, ChevronDown, ChevronUp,
  MessageSquare, Globe, AlertOctagon, BarChart3, Sliders,
} from "lucide-react";
import {
  FIVE_CS as MOCK_FIVE_CS, AI_EXPLANATIONS as MOCK_EXPLANATIONS, EXPLANATION_TEXT as MOCK_EXPLANATION_TEXT,
  KEY_RISK_DRIVERS as MOCK_RISK_DRIVERS, SECTOR_INTELLIGENCE,
} from "@/data/mockData";
import type { PillarData } from "@/data/mockData";
import { DEFAULT_WEIGHTS, computeComposite } from "@/lib/scoringModel";
import ScoreGauge from "@/components/ScoreGauge";
import RadarChart from "@/components/RadarChart";
import FactorRow from "@/components/FactorRow";
import { useAnalysis } from "@/lib/AnalysisContext";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; color?: string }>> = {
  Shield, TrendingUp, Building2, Scale, Activity,
};

const sectorIconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  TrendingDown: TrendingUp,
  Users: Building2,
  Shield,
  BarChart3,
  AlertTriangle: AlertOctagon,
};

const BRUTALIST_COLORS: Record<string, string> = {
  "#F5B731": "#FF9900",
  "#F06050": "#FF3366",
  "#34D399": "#00CC66",
  "#4B8BF5": "#0033FF",
  "#7C6BF0": "#6633FF",
};

function mapColor(c: string): string {
  return BRUTALIST_COLORS[c] || c;
}

function PillarCard({
  name,
  data,
  isActive,
  onClick,
}: {
  name: string;
  data: PillarData;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = iconMap[data.icon] || Shield;
  const mc = mapColor(data.color);
  return (
    <div
      onClick={onClick}
      className="cursor-pointer transition-all duration-200 p-3.5"
      style={{
        background: isActive ? "#F4F4F0" : "white",
        border: isActive ? `2px solid ${mc}` : "2px solid #111",
        boxShadow: isActive ? `4px 4px 0px ${mc}` : "2px 2px 0px #111",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 flex items-center justify-center"
          style={{ background: `${mc}15`, border: `1px solid ${mc}` }}
        >
          <Icon size={18} color={mc} />
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-[#111]">{name}</div>
          <span className="text-[11px] font-medium" style={{ color: mc }}>
            {data.label}
          </span>
        </div>
        <div className="text-right flex-shrink-0">
          <span
            className="text-xl md:text-2xl font-bold metric-value whitespace-nowrap"
            style={{ color: mc, fontFamily: "'JetBrains Mono', monospace" }}
          >
            {data.score}
          </span>
          <span className="text-[11px] text-[#888]">/100</span>
        </div>
      </div>
    </div>
  );
}

function ConfigurableWeights({
  weights,
  onWeightsChange,
}: {
  weights: typeof DEFAULT_WEIGHTS;
  onWeightsChange: (w: typeof DEFAULT_WEIGHTS) => void;
}) {
  const pillars = [
    { key: "character", label: "Character", color: "#FF9900" },
    { key: "capacity", label: "Capacity", color: "#FF3366" },
    { key: "capital", label: "Capital", color: "#00CC66" },
    { key: "collateral", label: "Collateral", color: "#0033FF" },
    { key: "conditions", label: "Conditions", color: "#6633FF" },
  ] as const;

  const handleChange = (key: keyof typeof DEFAULT_WEIGHTS, val: number) => {
    const newWeights = { ...weights, [key]: val / 100 };
    const total = Object.values(newWeights).reduce((s, v) => s + v, 0);
    const normalized: typeof DEFAULT_WEIGHTS = {
      character: newWeights.character / total,
      capacity: newWeights.capacity / total,
      capital: newWeights.capital / total,
      collateral: newWeights.collateral / total,
      conditions: newWeights.conditions / total,
    };
    onWeightsChange(normalized);
  };

  return (
    <div className="p-4 mb-4" style={{ background: "white", border: "2px solid #111", boxShadow: "4px 4px 0px #111" }}>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <Sliders size={14} color="#0033FF" />
        <span className="text-[12px] font-bold text-[#111]">
          Configurable Five C Weights
        </span>
        <span className="ml-auto text-[9px] text-[#888] px-2 py-0.5 font-mono uppercase hidden sm:inline" style={{ background: "#F4F4F0", border: "1px solid #ddd" }}>
          Drag to adjust -- auto-normalizes to 100%
        </span>
      </div>
      <div className="space-y-2.5">
        {pillars.map((p) => (
          <div key={p.key} className="flex items-center gap-3">
            <span className="text-[11px] text-[#555] w-[70px] flex-shrink-0">{p.label}</span>
            <input
              type="range"
              min={5}
              max={50}
              value={Math.round(weights[p.key] * 100)}
              onChange={(e) => handleChange(p.key, parseInt(e.target.value))}
              className="flex-1 min-w-0"
              style={{ accentColor: p.color }}
            />
            <span
              className="text-[11px] font-bold w-[40px] text-right metric-value"
              style={{ color: p.color, fontFamily: "'JetBrains Mono', monospace" }}
            >
              {(weights[p.key] * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RiskDecompositionChart({ weights, fiveCS }: { weights: typeof DEFAULT_WEIGHTS; fiveCS: Record<string, PillarData> }) {
  const pillars = Object.entries(fiveCS);
  const totalWeighted = pillars.reduce(
    (sum, [key, val]) => sum + val.score * weights[key as keyof typeof DEFAULT_WEIGHTS],
    0
  );
  const colors: Record<string, string> = {
    character: "#FF9900",
    capacity: "#FF3366",
    capital: "#00CC66",
    collateral: "#0033FF",
    conditions: "#6633FF",
  };

  return (
    <div className="p-4 md:p-5 mt-4" style={{ background: "white", border: "2px solid #111", boxShadow: "4px 4px 0px #111" }}>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <BarChart3 size={16} color="#0033FF" />
        <span className="text-[13px] font-bold text-[#111] min-w-0">
          Risk Decomposition -- Weighted Contribution
        </span>
        <span className="ml-auto text-[11px] text-[#888] whitespace-nowrap">
          Composite: {totalWeighted.toFixed(1)}/100
        </span>
      </div>

      {/* Stacked horizontal bar */}
      <div className="w-full h-10 overflow-hidden flex" style={{ border: "2px solid #111" }}>
        {pillars.map(([key, val]) => {
          const w = weights[key as keyof typeof DEFAULT_WEIGHTS];
          const contribution = (val.score * w) / totalWeighted * 100;
          return (
            <div
              key={key}
              className="h-full flex items-center justify-center text-[9px] font-bold text-white transition-all"
              style={{
                width: `${contribution}%`,
                background: colors[key],
                minWidth: contribution > 5 ? "auto" : 0,
              }}
              title={`${key}: ${val.score} x ${(w * 100).toFixed(0)}% = ${(val.score * w).toFixed(1)}`}
            >
              {contribution > 8 && key.charAt(0).toUpperCase() + key.slice(1, 4)}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-2 md:gap-4 mt-3 flex-wrap">
        {pillars.map(([key, val]) => {
          const w = weights[key as keyof typeof DEFAULT_WEIGHTS];
          return (
            <div key={key} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5" style={{ background: colors[key] }} />
              <span className="text-[10px] text-[#555]">
                {key.charAt(0).toUpperCase() + key.slice(1)}: {val.score} x {(w * 100).toFixed(0)}% = <strong className="text-[#111]">{(val.score * w).toFixed(1)}</strong>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KeyRiskDrivers({ riskDrivers }: { riskDrivers: typeof MOCK_RISK_DRIVERS }) {
  return (
    <div className="p-4 md:p-5 mt-4" style={{ background: "white", border: "2px solid #FF3366", boxShadow: "4px 4px 0px #111" }}>
      <div className="flex items-center gap-2 mb-3">
        <AlertOctagon size={16} color="#FF3366" />
        <span className="text-[13px] font-bold text-[#FF3366]">
          Top Risk Drivers
        </span>
      </div>
      <div className="space-y-2">
        {riskDrivers.map((d, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3"
            style={{ background: "#F4F4F0", borderLeft: "3px solid #FF3366" }}
          >
            <div className="text-base font-bold text-[#FF3366] w-10 text-center flex-shrink-0 metric-value" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {d.impact > 0 ? "+" : ""}{d.impact}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-xs font-semibold text-[#111]">{d.factor}</span>
                <span className="text-[8px] px-1 py-0.5 font-mono uppercase text-[#FF3366] whitespace-nowrap" style={{ border: "1px solid #FF3366" }}>
                  {d.pillar}
                </span>
              </div>
              <p className="text-[11px] text-[#555] leading-relaxed">{d.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CreditOfficerNotes({
  onScoreAdjust,
}: {
  onScoreAdjust: (adj: number) => void;
}) {
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [adjustment, setAdjustment] = useState(0);
  const [compositeWithAdj, setCompositeWithAdj] = useState(68.2);

  const handleSubmit = () => {
    if (!notes.trim()) return;

    const lower = notes.toLowerCase();
    let adj = 0;

    if (lower.includes("strong") || lower.includes("reliable") || lower.includes("good relationship")) adj += 3;
    if (lower.includes("collateral") || lower.includes("property") || lower.includes("additional security")) adj += 2;
    if (lower.includes("turnaround") || lower.includes("improving") || lower.includes("recovery")) adj += 2;
    if (lower.includes("government order") || lower.includes("new contract") || lower.includes("diversif")) adj += 3;
    if (lower.includes("concern") || lower.includes("worried") || lower.includes("risk")) adj -= 2;
    if (lower.includes("fraud") || lower.includes("suspicious") || lower.includes("misrepresent")) adj -= 5;
    if (lower.includes("delay") || lower.includes("overdue") || lower.includes("default")) adj -= 3;
    if (lower.includes("promoter absent") || lower.includes("evasive") || lower.includes("uncooperative")) adj -= 4;

    adj = Math.max(-10, Math.min(10, adj));

    setAdjustment(adj);
    setCompositeWithAdj(68.2 + adj);
    setSubmitted(true);
    onScoreAdjust(adj);
  };

  return (
    <div className="p-4 md:p-5 mt-4" style={{ background: "white", border: "2px solid #6633FF", boxShadow: "4px 4px 0px #111" }}>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <MessageSquare size={16} color="#6633FF" />
        <span className="text-[13px] font-bold text-[#111] min-w-0">
          Credit Officer -- Qualitative Notes
        </span>
        <span className="ml-auto text-[9px] text-[#888] px-2 py-1 font-mono uppercase whitespace-nowrap" style={{ background: "#F4F4F0", border: "1px solid #ddd" }}>
          AI-adjusted scoring
        </span>
      </div>
      <p className="text-[11px] text-[#888] mb-3">
        Input your field observations, site visit notes, or management
        impressions. The AI will analyze sentiment and adjust the composite
        score accordingly.
      </p>
      <textarea
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          if (submitted) setSubmitted(false);
        }}
        placeholder="E.g., 'Promoter was cooperative during site visit. Factory appeared well-maintained but only 1 furnace was operational. Management mentioned a new government contract worth ₹8Cr expected in Q3. However, I have concerns about the GST mismatch — promoter was evasive when questioned.'"
        className="w-full h-28 p-3 text-xs text-[#111] resize-none focus:outline-none transition-colors"
        style={{ background: "#F4F4F0", border: "2px solid #ddd" }}
        onFocus={(e) => e.currentTarget.style.borderColor = "#6633FF"}
        onBlur={(e) => e.currentTarget.style.borderColor = "#ddd"}
      />
      <div className="flex items-center gap-3 mt-3 flex-wrap">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-white text-xs font-semibold cursor-pointer transition-all border-none"
          style={{ background: "#6633FF", boxShadow: "2px 2px 0px #111" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-1px, -1px)"; e.currentTarget.style.boxShadow = "3px 3px 0px #111"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0, 0)"; e.currentTarget.style.boxShadow = "2px 2px 0px #111"; }}
        >
          Analyze & Adjust Score
        </button>
        {submitted && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold animate-fadeInUp font-mono"
            style={{
              background: "white",
              color: adjustment >= 0 ? "#00CC66" : "#FF3366",
              border: `2px solid ${adjustment >= 0 ? "#00CC66" : "#FF3366"}`,
            }}
          >
            <Brain size={14} />
            AI Adjustment: {adjustment >= 0 ? "+" : ""}{adjustment} points →
            New Composite: {compositeWithAdj.toFixed(1)}
          </div>
        )}
      </div>
      {submitted && (
        <div className="mt-3 p-3 text-[11px] text-[#555] leading-relaxed animate-fadeInUp" style={{ background: "#F4F4F0", border: "1px solid #ddd" }}>
          <strong className="text-[#111]">AI Analysis of Notes:</strong>{" "}
          {adjustment > 0
            ? "Positive qualitative signals detected. Credit officer observations suggest mitigating factors that partially offset quantitative risks. Score adjusted upward."
            : adjustment < 0
              ? "Negative qualitative signals detected. Credit officer observations reinforce or add to quantitative risk factors. Score adjusted downward."
              : "Neutral qualitative signals. Credit officer observations neither significantly add to nor mitigate existing risk factors. No score adjustment."}
        </div>
      )}
    </div>
  );
}

function SectorIntelligence() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-4 md:p-5 mt-4" style={{ background: "white", border: "2px solid #111", boxShadow: "4px 4px 0px #111" }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"
      >
        <Globe size={16} color="#0033FF" />
        <span className="text-[13px] font-bold text-[#111]">
          Sector Intelligence Brief -- Steel Manufacturing
        </span>
        <span className="ml-auto text-[9px] text-[#888]">
          {expanded ? "Collapse" : "Expand"}
        </span>
        {expanded ? (
          <ChevronUp size={14} className="text-[#888]" />
        ) : (
          <ChevronDown size={14} className="text-[#888]" />
        )}
      </button>

      {expanded && (
        <div className="mt-4 space-y-3 animate-fadeInUp">
          {SECTOR_INTELLIGENCE.map((item, i) => {
            const Icon = sectorIconMap[item.icon] || Globe;
            const mc = mapColor(item.color);
            return (
              <div
                key={i}
                className="p-3"
                style={{
                  background: "#F4F4F0",
                  borderLeft: `3px solid ${mc}`,
                }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon size={14} color={mc} />
                  <span className="text-xs font-semibold text-[#111]">
                    {item.title}
                  </span>
                </div>
                <p className="text-[11px] text-[#555] leading-relaxed">
                  {item.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function FiveCAnalysis() {
  const [activePillar, setActivePillar] = useState("character");
  const [showExplanation, setShowExplanation] = useState(false);
  const [scoreAdj, setScoreAdj] = useState(0);
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const { analysis, isUsingMockData } = useAnalysis();

  // Build Five C data from analysis context or fall back to mock
  const FIVE_CS: Record<string, PillarData> = (!isUsingMockData && analysis?.fiveCScores)
    ? {
        character: {
          score: analysis.fiveCScores.character.score,
          label: analysis.fiveCScores.character.label,
          color: analysis.fiveCScores.character.score >= 75 ? "#00CC66" : analysis.fiveCScores.character.score >= 60 ? "#FF9900" : "#FF3366",
          icon: "Shield",
          factors: [{ name: "AI Assessment", value: `${analysis.fiveCScores.character.score}/100`, impact: analysis.fiveCScores.character.score >= 70 ? "positive" as const : "neutral" as const, detail: analysis.fiveCScores.character.reasoning }],
        },
        capacity: {
          score: analysis.fiveCScores.capacity.score,
          label: analysis.fiveCScores.capacity.label,
          color: analysis.fiveCScores.capacity.score >= 75 ? "#00CC66" : analysis.fiveCScores.capacity.score >= 60 ? "#FF9900" : "#FF3366",
          icon: "TrendingUp",
          factors: [{ name: "AI Assessment", value: `${analysis.fiveCScores.capacity.score}/100`, impact: analysis.fiveCScores.capacity.score >= 70 ? "positive" as const : analysis.fiveCScores.capacity.score >= 50 ? "neutral" as const : "negative" as const, detail: analysis.fiveCScores.capacity.reasoning }],
        },
        capital: {
          score: analysis.fiveCScores.capital.score,
          label: analysis.fiveCScores.capital.label,
          color: analysis.fiveCScores.capital.score >= 75 ? "#00CC66" : analysis.fiveCScores.capital.score >= 60 ? "#FF9900" : "#FF3366",
          icon: "Building2",
          factors: [{ name: "AI Assessment", value: `${analysis.fiveCScores.capital.score}/100`, impact: analysis.fiveCScores.capital.score >= 70 ? "positive" as const : "neutral" as const, detail: analysis.fiveCScores.capital.reasoning }],
        },
        collateral: {
          score: analysis.fiveCScores.collateral.score,
          label: analysis.fiveCScores.collateral.label,
          color: analysis.fiveCScores.collateral.score >= 75 ? "#00CC66" : analysis.fiveCScores.collateral.score >= 60 ? "#FF9900" : "#FF3366",
          icon: "Scale",
          factors: [{ name: "AI Assessment", value: `${analysis.fiveCScores.collateral.score}/100`, impact: analysis.fiveCScores.collateral.score >= 70 ? "positive" as const : "neutral" as const, detail: analysis.fiveCScores.collateral.reasoning }],
        },
        conditions: {
          score: analysis.fiveCScores.conditions.score,
          label: analysis.fiveCScores.conditions.label,
          color: analysis.fiveCScores.conditions.score >= 75 ? "#00CC66" : analysis.fiveCScores.conditions.score >= 60 ? "#FF9900" : "#FF3366",
          icon: "Activity",
          factors: [{ name: "AI Assessment", value: `${analysis.fiveCScores.conditions.score}/100`, impact: analysis.fiveCScores.conditions.score >= 70 ? "positive" as const : analysis.fiveCScores.conditions.score >= 50 ? "neutral" as const : "negative" as const, detail: analysis.fiveCScores.conditions.reasoning }],
        },
      }
    : MOCK_FIVE_CS;

  const AI_EXPLANATIONS: Record<string, string> = (!isUsingMockData && analysis?.fiveCScores)
    ? Object.fromEntries(
        Object.entries(analysis.fiveCScores).map(([key, val]) => [key, val.reasoning])
      )
    : MOCK_EXPLANATIONS;

  const KEY_RISK_DRIVERS = (!isUsingMockData && analysis?.keyRisks?.length)
    ? analysis.keyRisks
    : MOCK_RISK_DRIVERS;

  const EXPLANATION_TEXT = (!isUsingMockData && analysis?.executiveSummary)
    ? analysis.executiveSummary
    : MOCK_EXPLANATION_TEXT;

  const composite = computeComposite(FIVE_CS, weights) + scoreAdj;

  return (
    <div className="flex gap-4 md:gap-6 flex-wrap animate-fadeInUp">
      {/* Left: Radar + Weights + Pillar Cards */}
      <div className="w-full lg:w-[340px] flex-shrink-0">
        <div className="p-4 md:p-5 mb-4 flex flex-col items-center" style={{ background: "white", border: "2px solid #111", boxShadow: "4px 4px 0px #111" }}>
          <div className="text-[11px] text-[#888] font-semibold tracking-widest mb-2 uppercase font-mono">
            COMPOSITE CREDIT SCORE
          </div>
          <ScoreGauge score={parseFloat(composite.toFixed(1))} label={scoreAdj !== 0 ? `Adjusted (${scoreAdj >= 0 ? "+" : ""}${scoreAdj})` : "Moderate Risk"} size={120} />
          <div className="mt-4">
            <RadarChart data={FIVE_CS} />
          </div>
        </div>

        {/* Enhancement 2: Configurable Weights */}
        <ConfigurableWeights weights={weights} onWeightsChange={setWeights} />

        <div className="flex flex-col gap-2">
          {Object.entries(FIVE_CS).map(([key, val]) => (
            <PillarCard
              key={key}
              name={key.charAt(0).toUpperCase() + key.slice(1)}
              data={val}
              isActive={activePillar === key}
              onClick={() => setActivePillar(key)}
            />
          ))}
        </div>
      </div>

      {/* Right: Factor Details + New Sections */}
      <div className="flex-1 min-w-0">
        <div className="p-4 md:p-5" style={{ background: "white", border: "2px solid #111", boxShadow: "4px 4px 0px #111" }}>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Brain size={18} color="#0033FF" />
            <span className="text-sm md:text-[15px] font-bold text-[#111] min-w-0">
              {activePillar.charAt(0).toUpperCase() + activePillar.slice(1)} -- Factor Breakdown
            </span>
            <span
              className="ml-auto text-xs font-semibold px-3 py-1 font-mono whitespace-nowrap"
              style={{
                color: mapColor(FIVE_CS[activePillar].color),
                border: `2px solid ${mapColor(FIVE_CS[activePillar].color)}`,
              }}
            >
              Score: {FIVE_CS[activePillar].score}/100 -- {FIVE_CS[activePillar].label}
            </span>
          </div>

          <div className="space-y-0">
            {FIVE_CS[activePillar].factors.map((f, i) => (
              <FactorRow key={i} factor={f} />
            ))}
          </div>

          {/* AI Explanation */}
          <div className="mt-5 p-4" style={{ background: "#F4F4F0", border: "1px solid #ddd" }}>
            <div className="flex items-center gap-2 mb-2">
              <Eye size={14} color="#0033FF" />
              <span className="text-[#111] font-semibold text-xs">
                AI Explanation
              </span>
            </div>
            <p className="text-xs text-[#555] leading-relaxed">
              {AI_EXPLANATIONS[activePillar]}
            </p>
          </div>
        </div>

        {/* Risk Decomposition Chart */}
        <RiskDecompositionChart weights={weights} fiveCS={FIVE_CS} />

        {/* Key Risk Drivers */}
        <KeyRiskDrivers riskDrivers={KEY_RISK_DRIVERS} />

        {/* Credit Officer Notes Input */}
        <CreditOfficerNotes onScoreAdjust={setScoreAdj} />

        {/* Sector Intelligence Brief */}
        <SectorIntelligence />

        {/* Full Recommendation */}
        <div className="mt-4">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="w-full text-left p-4 cursor-pointer flex items-center gap-3 transition-all"
            style={{
              background: "white",
              border: "2px solid #0033FF",
              boxShadow: "4px 4px 0px #111",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-1px, -1px)"; e.currentTarget.style.boxShadow = "5px 5px 0px #111"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0, 0)"; e.currentTarget.style.boxShadow = "4px 4px 0px #111"; }}
          >
            <FileText size={18} color="#0033FF" />
            <div className="flex-1">
              <div className="text-[#111] text-[13px] font-semibold">
                Full AI Recommendation & Rationale
              </div>
              <div className="text-[#888] text-[11px]">
                Click to expand the complete decision narrative
              </div>
            </div>
            {showExplanation ? (
              <ChevronUp size={16} className="text-[#888]" />
            ) : (
              <ChevronDown size={16} className="text-[#888]" />
            )}
          </button>

          {showExplanation && (
            <div className="p-5 animate-fadeInUp" style={{ background: "#F4F4F0", border: "2px solid #111", borderTop: "none" }}>
              <pre className="text-[#333] text-xs leading-7 whitespace-pre-wrap font-sans">
                {EXPLANATION_TEXT}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
