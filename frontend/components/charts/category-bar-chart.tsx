"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type CategoryBarChartProps = {
  data: Array<{ label: string; value: number }>;
};

export function CategoryBarChart({ data }: CategoryBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ left: 8, right: 8 }}>
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
        <Bar dataKey="value" fill="#0EA5E9" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
