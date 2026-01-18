import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string;
  delta: string;
  tone?: "primary" | "success" | "warning" | "info";
};

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-emerald-100 text-emerald-600",
  warning: "bg-amber-100 text-amber-600",
  info: "bg-sky-100 text-sky-600",
};

export function StatCard({ title, value, delta, tone = "primary" }: StatCardProps) {
  const isNegative = delta.trim().startsWith("-");
  return (
    <Card className="rounded-2xl border border-border bg-white/95 shadow-sm">
      <CardContent className="space-y-1 pr-3 pb-2 pt-2">
        <p className="text-m font-medium leading-tight text-muted-foreground">{title}</p>
        <div className="space-y-1">
          <p className="font-display text-2xl font-semibold text-foreground">{value}</p>
          <div
            className={cn(
              "flex items-center gap-2 text-xs",
              isNegative ? "text-rose-600" : "text-emerald-600",
            )}
          >
            <span
              className={cn(
                "flex items-center gap-1 rounded-full px-2 py-1",
                isNegative ? "bg-rose-50" : "bg-emerald-50",
              )}
            >
              {isNegative ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />} {delta}
            </span>
            <span className="text-muted-foreground">vs ultimo mes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
