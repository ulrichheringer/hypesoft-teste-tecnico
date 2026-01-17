"use client";

import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/components/i18n/i18n-provider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Product } from "@/types/product";

type RecentProductsTableProps = {
  products: Product[];
  categoryMap: Record<string, string>;
};

export function RecentProductsTable({ products, categoryMap }: RecentProductsTableProps) {
  const { locale, t } = useI18n();
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white/95 shadow-sm">
      <div className="flex items-center justify-between px-6 pt-5">
        <div>
          <p className="font-display text-base font-semibold text-foreground">
            {t("dashboard.recent.title")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("dashboard.recent.subtitle")}
          </p>
        </div>
        <Badge variant="secondary" className="rounded-full">
          {t("dashboard.recent.badge")}
        </Badge>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("dashboard.table.product")}</TableHead>
            <TableHead>{t("dashboard.table.category")}</TableHead>
            <TableHead>{t("dashboard.table.stock")}</TableHead>
            <TableHead className="text-right">{t("dashboard.table.value")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                {t("dashboard.table.empty")}
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                <TableCell>
                  {categoryMap[product.categoryId] || t("dashboard.table.category")}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      product.stock < 10
                        ? "rounded-full bg-amber-100 text-amber-700"
                        : "rounded-full bg-emerald-100 text-emerald-700"
                    }
                  >
                    {t("dashboard.units", { count: product.stock })}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-foreground">
                  {formatCurrency(product.price)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
