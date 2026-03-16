"use client";

import { useState } from "react";
import { CheckCircle, AlertTriangle, XCircle, Info, ChevronDown, ChevronUp } from "lucide-react";
import type { Factor } from "@/data/mockData";

const impactConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  positive: { color: "#00CC66", bg: "#E6FFF0", icon: <CheckCircle size={13} strokeWidth={2} /> },
  negative: { color: "#FF3366", bg: "#FFE6EE", icon: <AlertTriangle size={13} strokeWidth={2} /> },
  neutral: { color: "#FF9900", bg: "#FFF8E6", icon: <Info size={13} strokeWidth={2} /> },
  critical: { color: "#CC0044", bg: "#FFE6EE", icon: <XCircle size={13} strokeWidth={2} /> },
};

export default function FactorRow({ factor }: { factor: Factor }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = impactConfig[factor.impact];

  return (
    <div className="mb-1">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all duration-150"
        style={{
          background: expanded ? "#F4F4F0" : "transparent",
          borderLeft: `3px solid ${cfg.color}`,
        }}
      >
        <span style={{ color: cfg.color }}>{cfg.icon}</span>
        <span className="flex-1 text-[12px] font-medium text-[#111] min-w-0 break-words">
          {factor.name}
        </span>
        <span className="text-[11px] font-bold font-mono metric-value flex-shrink-0 whitespace-nowrap" style={{ color: cfg.color }}>
          {factor.value}
        </span>
        {expanded ? (
          <ChevronUp size={12} color="#888" />
        ) : (
          <ChevronDown size={12} color="#888" />
        )}
      </div>
      {expanded && (
        <div
          className="pl-9 pr-3 pb-2.5 text-[11px] leading-relaxed text-gray-600 animate-fadeInUp"
          style={{ animationDuration: "0.15s" }}
        >
          {factor.detail}
        </div>
      )}
    </div>
  );
}
