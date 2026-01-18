"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Boxes, CircleDollarSign, PackageCheck } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { LowStockCard } from "@/components/dashboard/low-stock-card";
import { RecentProductsTable } from "@/components/dashboard/recent-products-table";
import { CategoryChartCard } from "@/components/dashboard/category-chart-card";
import { InsightsCard } from "@/components/dashboard/insights-card";
import { Button } from "@/components/ui/button";
import {
  useDashboardSummary,
  useKpiTotalProducts,
  useKpiStockValue,
  useKpiLowStockCount,
  useKpiCategoryChart,
} from "@/hooks/use-dashboard-summary";
import { useI18n } from "@/components/i18n/i18n-provider";
import { useAuth } from "@/components/auth/auth-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { exportInventoryReport } from "@/services/reports";
import { updateProductStock } from "@/services/products";
import { StockDialog } from "@/components/products/stock-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Product } from "@/types/product";

const SalesLineChart = dynamic(
  () => import("@/components/charts/sales-line-chart").then((mod) => mod.SalesLineChart),
  {
    ssr: false,
    loading: () => <div className="h-[220px] w-full animate-pulse rounded-2xl bg-muted" />,
  },
);

const CategoryBarChart = dynamic(
  () => import("@/components/charts/category-bar-chart").then((mod) => mod.CategoryBarChart),
  {
    ssr: false,
    loading: () => <div className="h-[220px] w-full animate-pulse rounded-2xl bg-muted" />,
  },
);

const formatCurrency = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
  }).format(value);

export default function DashboardPage() {
  const summaryQuery = useDashboardSummary();
  const summary = summaryQuery.data;

  // Use dedicated KPI endpoints for accurate counts
  const totalProductsQuery = useKpiTotalProducts();
  const stockValueQuery = useKpiStockValue();
  const lowStockCountQuery = useKpiLowStockCount();
  const categoryChartQuery = useKpiCategoryChart();

  const { locale, t } = useI18n();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [exporting, setExporting] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const dateRangeLabel = useMemo(() => {
    const now = new Date();
    const start = new Date();
    start.setDate(now.getDate() - 29);
    const formatter = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" });
    return `${formatter.format(start)} - ${formatter.format(now)}`;
  }, [locale]);

  const categoryMap = useMemo(() => {
    const categories = summary?.categories ?? [];
    return categories.reduce<Record<string, string>>((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});
  }, [summary?.categories]);

  // Use KPI endpoints for accurate values, fallback to summary
  const totalProducts = totalProductsQuery.data ?? summary?.totalProducts ?? 0;
  const stockValue = stockValueQuery.data ?? summary?.stockValue ?? 0;
  const lowStockCount = lowStockCountQuery.data ?? summary?.lowStockCount ?? summary?.lowStockItems.length ?? 0;
  const lowStock = summary?.lowStockItems ?? [];
  const recentProducts = summary?.recentProducts ?? [];
  const categoryChart = categoryChartQuery.data ?? summary?.categoryChart ?? [];
  const insightData = summary?.trend ?? [];

  const isLoading = summaryQuery.isLoading && totalProductsQuery.isLoading;
  const stockValueLabel = isLoading ? "--" : formatCurrency(stockValue, locale);

  const stockMutation = useMutation({
    mutationFn: (values: Parameters<typeof updateProductStock>[1]) => {
      if (!activeProduct) {
        return Promise.resolve(null);
      }
      return updateProductStock(activeProduct.id, values, token);
    },
    onSuccess: () => {
      toast.success("Estoque atualizado.");
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["kpi-total-products"] });
      queryClient.invalidateQueries({ queryKey: ["kpi-stock-value"] });
      queryClient.invalidateQueries({ queryKey: ["kpi-low-stock-count"] });
      queryClient.invalidateQueries({ queryKey: ["kpi-category-chart"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setStockOpen(false);
      setActiveProduct(null);
    },
    onError: () => toast.error("Nao foi possivel atualizar o estoque."),
  });

  const handleExport = async () => {
    try {
      setExporting(true);
      const { blob, fileName } = await exportInventoryReport(token);
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download =
        fileName ?? `relatorio-estoque-${new Date().toISOString().slice(0, 10)}.pdf`;
      anchor.click();
      window.URL.revokeObjectURL(url);
      toast.success("Relatorio exportado.");
    } catch {
      toast.error("Nao foi possivel exportar o relatorio.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-display text-2xl font-semibold text-foreground">
            {t("dashboard.title")}
          </p>
          <p className="text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" className="rounded-xl">
            {dateRangeLabel}
          </Button>
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={handleExport}
            disabled={exporting}
          >
            {t("dashboard.exportPdf")}
          </Button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <StatCard
            title={t("dashboard.stat.totalProducts")}
            value={isLoading ? "--" : totalProducts.toString()}
            delta="+12%"
            tone="primary"
          />
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
          <StatCard
            title={t("dashboard.stat.stockValue")}
            value={stockValueLabel}
            delta="+6%"
            tone="success"
          />
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
          <StatCard
            title={t("dashboard.stat.lowStock")}
            value={isLoading ? "--" : lowStockCount.toString()}
            delta="-3%"
            tone="warning"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="grid gap-4">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
            <InsightsCard>
              <SalesLineChart data={insightData} />
            </InsightsCard>
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <RecentProductsTable products={recentProducts} categoryMap={categoryMap} />
          </div>
        </div>
        <div className="grid gap-4">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <LowStockCard
              products={lowStock}
              onRestock={(product) => {
                setActiveProduct(product);
                setStockOpen(true);
              }}
            />
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <CategoryChartCard>
              <div className={cn(isLoading && "opacity-60")}>
                <CategoryBarChart data={categoryChart} />
              </div>
            </CategoryChartCard>
          </div>
        </div>
      </div>

      {activeProduct ? (
        <StockDialog
          open={stockOpen}
          onOpenChange={(open) => {
            setStockOpen(open);
            if (!open) {
              setActiveProduct(null);
            }
          }}
          defaultStock={activeProduct.stock}
          onSubmit={async (values) => {
            await stockMutation.mutateAsync(values);
          }}
        />
      ) : null}
    </section>
  );
}
