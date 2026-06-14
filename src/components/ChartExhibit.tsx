"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Exhibit } from "@/lib/types";

const PALETTE = [
  "#21b07e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
  "#14b8a6",
];

const axisStyle = { fill: "#9ca3af", fontSize: 12 };
const gridStyle = "#27303f";

const tooltipStyle = {
  backgroundColor: "#11161f",
  border: "1px solid #27303f",
  borderRadius: 8,
  color: "#f3f4f6",
  fontSize: 12,
};

export function ChartExhibit({ exhibit }: { exhibit: Exhibit }) {
  if (exhibit.kind === "bar") {
    return (
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={exhibit.data} margin={{ top: 8, right: 12, bottom: 4, left: -8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStyle} />
          <XAxis dataKey={exhibit.categoryKey} tick={axisStyle} />
          <YAxis tick={axisStyle} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#1a212d" }} />
          {(exhibit.series?.length ?? 0) > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {exhibit.series?.map((s, i) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              fill={PALETTE[i % PALETTE.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (exhibit.kind === "line") {
    return (
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={exhibit.data} margin={{ top: 8, right: 12, bottom: 4, left: -8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStyle} />
          <XAxis dataKey={exhibit.categoryKey} tick={axisStyle} />
          <YAxis tick={axisStyle} />
          <Tooltip contentStyle={tooltipStyle} />
          {(exhibit.series?.length ?? 0) > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {exhibit.series?.map((s, i) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={PALETTE[i % PALETTE.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  // pie
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={exhibit.data}
          dataKey={exhibit.valueKey ?? "value"}
          nameKey={exhibit.categoryKey ?? "name"}
          cx="50%"
          cy="50%"
          outerRadius={90}
          label={(entry) =>
            `${entry[exhibit.categoryKey ?? "name"]}: ${entry[exhibit.valueKey ?? "value"]}%`
          }
          labelLine={false}
        >
          {exhibit.data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}
