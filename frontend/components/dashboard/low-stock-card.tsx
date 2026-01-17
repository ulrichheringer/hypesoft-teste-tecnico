import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/types/product";

const formatStock = (stock: number) => `${stock} un`;

type LowStockCardProps = {
  products: Product[];
};

export function LowStockCard({ products }: LowStockCardProps) {
  return (
    <Card className="h-full rounded-2xl border border-border bg-white/95 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-display text-base">Estoque baixo</CardTitle>
          <p className="text-xs text-muted-foreground">Itens abaixo de 10 unidades</p>
        </div>
        <span className="rounded-2xl bg-amber-100 p-2 text-amber-600">
          <AlertTriangle size={18} />
        </span>
      </CardHeader>
      <CardContent className="space-y-3">
        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground">Tudo certo por aqui.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium text-foreground">{product.name}</p>
                <p className="text-xs text-muted-foreground">{formatStock(product.stock)}</p>
              </div>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-600">
                Repor
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
