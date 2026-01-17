import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/types/product";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

type TopProductsCardProps = {
  products: Product[];
  categoryMap: Record<string, string>;
};

export function TopProductsCard({ products, categoryMap }: TopProductsCardProps) {
  return (
    <Card className="h-full rounded-2xl border border-border bg-white/95 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-display text-base">Top produtos</CardTitle>
          <p className="text-xs text-muted-foreground">Melhor performance do estoque</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1 text-xs font-semibold text-primary"
        >
          Ver tudo <ChevronRight size={14} />
        </button>
      </CardHeader>
      <CardContent className="space-y-4">
        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem produtos ainda.</p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between rounded-2xl border border-border/70 bg-secondary/40 px-3 py-2"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {categoryMap[product.categoryId] || "Categoria"}
                </p>
              </div>
              <div className="text-right">
                <Badge className="rounded-full bg-emerald-100 text-emerald-700">
                  {product.stock} un
                </Badge>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatCurrency(product.price)}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
