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
    <div className="p-2 w-full md:w-2/3 text-foreground mt-3 mb-3 sm:mt-5 sm:mb-5">
      {title && <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={240} className="sm:!h-[300px]">
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 64, 64, 0.2)" />
          <XAxis
            dataKey="label"
            tick={{ fill: "red", fontSize: 12 }}
            axisLine={{ stroke: "red" }}
            tickLine={{ stroke: "red" }}
          />
          <YAxis
            domain={yDomain}
            tick={{ fill: "red", fontSize: 12 }}
            axisLine={{ stroke: "red" }}
            tickLine={{ stroke: "red" }}
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
