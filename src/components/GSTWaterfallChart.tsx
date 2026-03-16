"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  LabelList,
} from "recharts";

const data = [
  { name: "3B Reported", value: 72.4, fill: "#0033FF" },
  { name: "2A Verified", value: 58.1, fill: "#00CC66" },
  { name: "Gap", value: 14.3, fill: "#FF3366" },
  { name: "Bank Stmt", value: 69.8, fill: "#FF9900" },
];

export default function GSTWaterfallChart() {
  return (
    <div className="w-full h-[220px] overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 25, right: 20, bottom: 5, left: 10 }}>
          <XAxis
            dataKey="name"
            tick={{ fill: "#555", fontSize: 11 }}
            axisLine={{ stroke: "#111" }}
            tickLine={{ stroke: "#111" }}
          />
          <YAxis
            tick={{ fill: "#555", fontSize: 11 }}
            axisLine={{ stroke: "#111" }}
            tickLine={{ stroke: "#111" }}
            tickFormatter={(v) => `₹${v}Cr`}
            domain={[0, 80]}
          />
          <Tooltip
            contentStyle={{
              background: "white",
              border: "2px solid #111",
              borderRadius: 0,
              color: "#111",
              fontSize: 12,
            }}
            formatter={(value) => [`₹${value} Cr`, "Amount"]}
          />
          <ReferenceLine y={58.1} stroke="#00CC66" strokeDasharray="4 4" strokeOpacity={0.5} />
          <Bar dataKey="value" radius={[0, 0, 0, 0]} barSize={40}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.fill} fillOpacity={0.85} />
            ))}
            <LabelList
              dataKey="value"
              position="top"
              formatter={(v) => `₹${v}Cr`}
              style={{ fill: "#111", fontSize: 12, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
