"use client";

import { AlertTriangle } from "lucide-react";
import { useI18n } from "@/components/i18n/i18n-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/types/product";

type LowStockCardProps = {
  products: Product[];
  onRestock?: (product: Product) => void;
};

export function LowStockCard({ products, onRestock }: LowStockCardProps) {
  const { t } = useI18n();
  const formatStock = (stock: number) => t("dashboard.units", { count: stock });

  return (
    <Card className="h-full rounded-2xl border border-border bg-white/95 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-display text-base">
            {t("dashboard.lowStock.title")}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {t("dashboard.lowStock.subtitle")}
          </p>
        </div>
        <span className="rounded-2xl bg-amber-100 p-2 text-amber-600">
          <AlertTriangle size={18} />
        </span>
      </CardHeader>
      <CardContent className="space-y-3">
        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("dashboard.lowStock.empty")}
          </p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium text-foreground">{product.name}</p>
                <p className="text-xs text-muted-foreground">{formatStock(product.stock)}</p>
              </div>
              <button
                type="button"
                className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-600 transition hover:bg-amber-100"
                onClick={() => onRestock?.(product)}
              >
                {t("dashboard.lowStock.restock")}
              </button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
