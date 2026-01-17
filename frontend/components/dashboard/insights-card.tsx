import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InsightsCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="h-full rounded-2xl border border-border bg-white/95 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-display text-base">Insights de estoque</CardTitle>
          <p className="text-xs text-muted-foreground">Comparativo semanal</p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
          Weekly
        </span>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
