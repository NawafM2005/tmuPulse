"use client"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

type Props = {
  lower: number
  upper: number
  other: number
}

export function ChartPieLegend({ lower, upper, other }: Props) {
  const chartData = [
    { name: "Lower Liberal", value: lower },
    { name: "Upper Liberal", value: upper },
    { name: "Core/Open", value: other },
  ]

  const COLORS = ["#4f85d7ff", "#86ca82ff", "#ffec58ff"]

  return (
    <div className="w-full h-[400px] max-w-2xl mx-auto text-center font-bold mt-5 mb-5">
      <h3>Taken Stats</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius="80%"
            dataKey="value"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
