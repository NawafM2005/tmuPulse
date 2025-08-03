"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface LineChartGenericProps {
  data: { label: string; [key: string]: number | string }[];
  dataKeys: { key: string; label: string }[];
  yDomain?: [number, number];
  title?: string;
}

export default function LineChartGeneric({
  data, 
  dataKeys,
  yDomain = [1, 4.33],
  title,
}: LineChartGenericProps) {
  return (
    <div className="p-2 w-2/3 text-background mt-5 mb-5">
      {title && <h3 className="text-xl font-bold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 64, 64, 0.2)" />
          <XAxis
            dataKey="label"
            tick={{ fill: "yellow", fontSize: 12 }}
            axisLine={{ stroke: "white" }}
            tickLine={{ stroke: "white" }}
          />
          <YAxis
            domain={yDomain}
            tick={{ fill: "white", fontSize: 12 }}
            axisLine={{ stroke: "white" }}
            tickLine={{ stroke: "white" }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#1E1E1E", border: "1px solid white" }}
            labelStyle={{ color: "white" }}
            itemStyle={{ color: "white" }}
          />
          <Legend wrapperStyle={{ color: "white" }} />
          {dataKeys.map((entry, i) => (
            <Line
              key={i}
              type="monotone"
              dataKey={entry.key}
              name={entry.label}
              stroke="#79cdc2ff"
              strokeWidth={4}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
