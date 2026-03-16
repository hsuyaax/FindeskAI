"use client";

export default function ScoreGauge({
  score,
  label,
  size = 100,
}: {
  score: number;
  label?: string;
  size?: number;
}) {
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 75 ? "#00CC66" : score >= 60 ? "#FF9900" : "#FF3366";

  return (
    <div className="flex flex-col items-center max-w-[140px] mx-auto">
      <div className="relative" style={{ width: size + 16, height: size + 16 }}>
        <div className="absolute inset-0 border-2 border-black rounded-full" />
        <svg width={size + 16} height={size + 16} viewBox={`0 0 ${size + 16} ${size + 16}`}>
          {/* Background track */}
          <circle
            cx={(size + 16) / 2}
            cy={(size + 16) / 2}
            r={radius}
            fill="none"
            stroke="#eee"
            strokeWidth="6"
          />
          {/* Progress arc */}
          <circle
            cx={(size + 16) / 2}
            cy={(size + 16) / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="butt"
            transform={`rotate(-90 ${(size + 16) / 2} ${(size + 16) / 2})`}
            style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)" }}
          />
          {/* Score */}
          <text
            x={(size + 16) / 2}
            y={(size + 16) / 2 - 2}
            textAnchor="middle"
            fill="#111"
            fontSize="28"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
            letterSpacing="-0.04em"
          >
            {score}
          </text>
          <text
            x={(size + 16) / 2}
            y={(size + 16) / 2 + 16}
            textAnchor="middle"
            fill="#888"
            fontSize="10"
            fontFamily="JetBrains Mono, monospace"
            letterSpacing="0.1em"
          >
            / 100
          </text>
        </svg>
      </div>
      {label && (
        <span className="mt-2 text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color }}>
          {label}
        </span>
      )}
    </div>
  );
}
