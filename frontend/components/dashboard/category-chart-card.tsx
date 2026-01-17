import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CategoryChartCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="h-full rounded-2xl border border-border bg-white/95 shadow-sm">
      <CardHeader>
        <CardTitle className="font-display text-base">Produtos por categoria</CardTitle>
        <p className="text-xs text-muted-foreground">Distribuicao do inventario</p>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
