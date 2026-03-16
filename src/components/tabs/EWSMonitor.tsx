"use client";

import { ShieldAlert, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import { EWS_DATA } from "@/data/mockData";

const statusColors: Record<string, string> = {
  green: "#00CC66",
  yellow: "#FF9900",
  orange: "#F97316",
  red: "#FF3366",
};

const statusIcons: Record<string, React.ReactNode> = {
  green: <CheckCircle size={16} />,
  yellow: <Info size={16} />,
  orange: <AlertTriangle size={16} />,
  red: <XCircle size={16} />,
};

export default function EWSMonitor() {
  return (
    <div className="max-w-3xl animate-fadeInUp">
      <div className="p-6" style={{ background: "white", border: "2px solid #111", boxShadow: "4px 4px 0px #111" }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 flex items-center justify-center" style={{ border: "2px solid #F97316" }}>
            <ShieldAlert size={18} color="#F97316" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold text-[#111]">
              Early Warning Signal (EWS) Monitor
            </h2>
            <p className="text-[11px] text-[#888]">
              Post-disbursement covenant monitoring -- 6-month simulation for
              Rathi Steels
            </p>
          </div>
          <span className="text-[10px] font-bold text-[#FF3366] px-3 py-1.5 font-mono uppercase" style={{ border: "2px solid #FF3366" }}>
            SMA-1 RISK
          </span>
        </div>

        {/* EWS Timeline */}
        <div className="mt-6 relative">
          {EWS_DATA.map((item, i) => {
            const color = statusColors[item.status];
            return (
              <div
                key={i}
                className="flex gap-4 mb-1 relative animate-slideIn"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Connector */}
                {i < EWS_DATA.length - 1 && (
                  <div
                    className="absolute left-[17px] top-[38px] w-[2px]"
                    style={{
                      height: "calc(100% - 10px)",
                      background: `linear-gradient(${color}, ${statusColors[EWS_DATA[i + 1].status]})`,
                      opacity: 0.4,
                    }}
                  />
                )}

                {/* Status dot */}
                <div
                  className="w-[36px] h-[36px] flex items-center justify-center flex-shrink-0 z-10"
                  style={{
                    background: `${color}15`,
                    border: `2px solid ${color}`,
                  }}
                >
                  <span style={{ color }}>{statusIcons[item.status]}</span>
                </div>

                {/* Content card */}
                <div
                  className="flex-1 p-3.5 mb-3"
                  style={{
                    background: "#F4F4F0",
                    borderLeft: `3px solid ${color}`,
                    border: "2px solid #111",
                    borderLeftWidth: "3px",
                    borderLeftColor: color,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-semibold text-[#111]">
                      {item.month}
                    </span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 font-mono uppercase"
                      style={{ border: `2px solid ${color}`, color }}
                    >
                      {item.label}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {item.events.map((event, j) => (
                      <li
                        key={j}
                        className="text-[11px] leading-relaxed flex items-start gap-2"
                        style={{
                          color:
                            item.status === "red"
                              ? "#CC0044"
                              : item.status === "orange"
                                ? "#CC7700"
                                : "#555",
                        }}
                      >
                        <span className="mt-1.5 w-1 h-1 flex-shrink-0" style={{ background: color }} />
                        {event}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action box */}
        <div
          className="mt-4 p-4"
          style={{
            background: "white",
            border: "2px solid #FF3366",
            boxShadow: "2px 2px 0px #111",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert size={14} color="#FF3366" />
            <span className="text-xs font-bold text-[#FF3366] uppercase font-mono">
              AUTOMATED ACTION TRIGGERED
            </span>
          </div>
          <p className="text-[11px] text-[#333] leading-relaxed">
            Based on deteriorating EWS signals, the system recommends: (1)
            Initiate pre-NPA resolution under RBI framework, (2) Convene special
            Credit Committee review, (3) Increase monitoring frequency to
            weekly, (4) Consider reducing drawing power to 60% of current limit.
            Estimated time to NPA if trajectory continues: 3-4 months.
          </p>
        </div>

        <div className="mt-4 p-4 text-xs text-[#555] leading-relaxed" style={{ background: "#F4F4F0", border: "1px solid #ddd" }}>
          <strong className="text-[#111]">Why this matters:</strong> 70% of
          NBFC losses occur post-disbursement due to missed early warning
          signals. This module continuously monitors covenants, GST trends,
          CIBIL changes, and litigation updates -- automatically escalating when
          thresholds are breached. This transforms Findesk AI from a
          one-time decisioning tool into a continuous credit monitoring platform.
        </div>
      </div>
    </div>
  );
}
