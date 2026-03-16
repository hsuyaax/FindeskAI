"use client";

import type { PillarData } from "@/data/mockData";

export default function RadarChart({ data }: { data: Record<string, PillarData> }) {
  const categories = Object.keys(data);
  const n = categories.length;
  const size = 380;
  const cx = size / 2, cy = size / 2, maxR = 90;
  const angleSlice = (2 * Math.PI) / n;

  const getPoint = (i: number, r: number): [number, number] => {
    const angle = angleSlice * i - Math.PI / 2;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const dataPoints = categories.map((cat, i) => getPoint(i, maxR * (data[cat].score / 100)));

  // Per-vertex label positioning to prevent ANY overlap
  // Pentagon vertices (5 points): top, upper-right, lower-right, lower-left, upper-left
  // Order: character(0), capacity(1), capital(2), collateral(3), conditions(4)
  const labelConfigs: { x: number; y: number; anchor: "start" | "middle" | "end"; scoreDx: number; scoreDy: number }[] = categories.map((_, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const labelR = maxR + 30;
    const [lx, ly] = [cx + labelR * Math.cos(angle), cy + labelR * Math.sin(angle)];

    // Determine position zone
    const deg = ((angle * 180) / Math.PI + 360) % 360;

    if (deg >= 250 && deg <= 290) {
      // TOP — center aligned, score below
      return { x: lx, y: ly - 6, anchor: "middle" as const, scoreDx: 0, scoreDy: 16 };
    }
    if (deg > 290 || deg < 30) {
      // UPPER-RIGHT — left aligned, score below
      return { x: lx + 4, y: ly - 4, anchor: "start" as const, scoreDx: 0, scoreDy: 15 };
    }
    if (deg >= 30 && deg < 100) {
      // LOWER-RIGHT — left aligned, score below
      return { x: lx + 4, y: ly, anchor: "start" as const, scoreDx: 0, scoreDy: 15 };
    }
    if (deg >= 100 && deg < 170) {
      // LOWER-LEFT — right aligned, score below
      return { x: lx - 4, y: ly, anchor: "end" as const, scoreDx: 0, scoreDy: 15 };
    }
    // UPPER-LEFT (170-250) — right aligned, score below
    return { x: lx - 4, y: ly - 4, anchor: "end" as const, scoreDx: 0, scoreDy: 15 };
  });

  return (
    <svg className="max-w-full h-auto" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid polygons */}
      {gridLevels.map((level) => {
        const points = categories
          .map((_, i) => getPoint(i, maxR * level))
          .map((p) => p.join(","))
          .join(" ");
        return (
          <polygon
            key={level}
            points={points}
            fill="none"
            stroke={level === 1 ? "#111" : "#ddd"}
            strokeWidth={level === 1 ? 1.5 : 0.5}
          />
        );
      })}

      {/* Axis lines */}
      {categories.map((_, i) => {
        const [x, y] = getPoint(i, maxR);
        return (
          <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#ddd" strokeWidth="0.5" />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={dataPoints.map((p) => p.join(",")).join(" ")}
        fill="rgba(0, 51, 255, 0.08)"
        stroke="#0033FF"
        strokeWidth="2"
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle
          key={i}
          cx={p[0]}
          cy={p[1]}
          r={3.5}
          fill="#111"
          stroke="white"
          strokeWidth="2"
        />
      ))}

      {/* Labels — positioned per-vertex to avoid overlap */}
      {categories.map((cat, i) => {
        const cfg = labelConfigs[i];
        return (
          <g key={cat}>
            {/* Category name */}
            <text
              x={cfg.x}
              y={cfg.y}
              textAnchor={cfg.anchor}
              fill="#888"
              fontSize="9"
              fontWeight="600"
              fontFamily="Inter, sans-serif"
              style={{ textTransform: "uppercase" } as React.CSSProperties}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </text>
            {/* Score — always below the name, never on top */}
            <text
              x={cfg.x + cfg.scoreDx}
              y={cfg.y + cfg.scoreDy}
              textAnchor={cfg.anchor}
              fill="#111"
              fontSize="13"
              fontWeight="700"
              fontFamily="JetBrains Mono, monospace"
            >
              {data[cat].score}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
