"use client"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

type BreakdownProps = {
  mode: "breakdown"
  lower: number
  upper: number
  core_open: number
  other: number
}

type CompletionProps = {
  mode: "completion"
  completed: number
  total?: number
}

type GpaByTypeProps = {
  mode: "gpa_by_type";
  gpaData: { name: string; avgGpa: number }[];
};

type Props = BreakdownProps | CompletionProps | GpaByTypeProps;

export function ChartPieLegend(props: Props) {
  const COLORS = ["#4f85d7ff", "#86ca82ff", "#ffec58ff", "#d272c8ff"]

  let chartData: { name: string; value: number }[] = []
  let title = ""
  let dynamicColors = COLORS

  if (props.mode === "breakdown") {
    const { lower, upper, core_open, other } = props
    chartData = [
      { name: "Lower Liberal", value: lower },
      { name: "Upper Liberal", value: upper },
      { name: "Core/Open", value: core_open },
      { name: "Other", value: other },
    ]
    title = "Course Type Breakdown"
  } else if (props.mode === "completion") {
    const total = props.total ?? 40
    const remaining = Math.max(total - props.completed, 0)
    chartData = [
      { name: "Completed", value: props.completed },
      { name: "Remaining", value: remaining },
    ]
    title = "Overall Degree Completion"
    dynamicColors = ["#00C49F", "#FF8042"]
  }
  else {
      chartData = props.gpaData.map(entry => ({
        name: entry.name,
        value: parseFloat(entry.avgGpa.toFixed(2)),
      }));
      title = "Average GPA by Course Type";
      dynamicColors = ["#7dd3fc", "#86efac", "#fcd34d", "#f0abfc"];
  }

  return (
    <div className="w-full h-[400px] max-w-2xl mx-auto text-center font-bold mt-5 mb-5">
      <h3 className="text-2xl mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius="80%"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={dynamicColors[index % dynamicColors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
