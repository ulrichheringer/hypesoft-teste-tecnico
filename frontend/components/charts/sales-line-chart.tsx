"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type SalesLineChartProps = {
  data: Array<{ label: string; value: number; benchmark: number }>;
};

export function SalesLineChart({ data }: SalesLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ left: 8, right: 8 }}>
        <CartesianGrid strokeDasharray="4 8" vertical={false} stroke="#E8ECF4" />
        <XAxis dataKey="label" axisLine={false} tickLine={false} fontSize={12} />
        <YAxis axisLine={false} tickLine={false} fontSize={12} width={28} />
        <Tooltip
          contentStyle={{
            borderRadius: 16,
            border: "1px solid #E8ECF4",
            boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#6366F1"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="benchmark"
          stroke="#EC4899"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
