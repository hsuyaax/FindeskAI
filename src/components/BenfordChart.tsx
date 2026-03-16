"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { BENFORD_DATA } from "@/data/mockData";

export default function BenfordChart() {
  const chartData = BENFORD_DATA.map((d) => ({
    digit: d.digit.toString(),
    Expected: d.expected,
    Actual: d.actual,
    anomaly: Math.abs(d.actual - d.expected) > 3,
  }));

  return (
    <div className="w-full h-[240px] overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
          <XAxis
            dataKey="digit"
            tick={{ fill: "#555", fontSize: 12 }}
            axisLine={{ stroke: "#111" }}
            label={{ value: "First Digit", position: "insideBottom", offset: -2, fill: "#888", fontSize: 11 }}
          />
          <YAxis
            tick={{ fill: "#555", fontSize: 11 }}
            axisLine={{ stroke: "#111" }}
            tickFormatter={(v) => `${v}%`}
            domain={[0, 35]}
          />
          <Tooltip
            contentStyle={{
              background: "white",
              border: "2px solid #111",
              borderRadius: 0,
              color: "#111",
              fontSize: 12,
            }}
            formatter={(value) => [`${value}%`]}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "#555" }}
            iconType="square"
          />
          <Bar dataKey="Expected" fill="#0033FF" fillOpacity={0.5} radius={[0, 0, 0, 0]} barSize={14} />
          <Bar dataKey="Actual" radius={[0, 0, 0, 0]} barSize={14}>
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.anomaly ? "#FF3366" : "#00CC66"}
                fillOpacity={0.7}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
