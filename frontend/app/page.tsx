"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Boxes, CircleDollarSign, PackageCheck } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { TopProductsCard } from "@/components/dashboard/top-products-card";
import { LowStockCard } from "@/components/dashboard/low-stock-card";
import { RecentProductsTable } from "@/components/dashboard/recent-products-table";
import { CategoryChartCard } from "@/components/dashboard/category-chart-card";
import { InsightsCard } from "@/components/dashboard/insights-card";
import { Button } from "@/components/ui/button";
import { useDashboardSummary } from "@/hooks/use-dashboard-summary";
import { useI18n } from "@/components/i18n/i18n-provider";
import { useAuth } from "@/components/auth/auth-provider";
import { exportInventoryReport } from "@/services/reports";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  const { locale, t } = useI18n();
  const { token } = useAuth();
  const [exporting, setExporting] = useState(false);

  const categoryMap = useMemo(() => {
    const categories = summary?.categories ?? [];
    return categories.reduce<Record<string, string>>((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});
  }, [summary?.categories]);

  const totalProducts = summary?.totalProducts ?? 0;
  const stockValue = summary?.stockValue ?? 0;
  const lowStockCount = summary?.lowStockCount ?? summary?.lowStockItems.length ?? 0;
  const lowStock = summary?.lowStockItems ?? [];
  const topProducts = summary?.topProducts ?? [];
  const recentProducts = summary?.recentProducts ?? [];
  const categoryChart = summary?.categoryChart ?? [];
  const insightData = summary?.trend ?? [];

  const isLoading = summaryQuery.isLoading;
  const stockValueLabel = isLoading ? "--" : formatCurrency(stockValue, locale);

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
            {t("dashboard.dateRange")}
          </Button>
          <Button className="rounded-xl">{t("dashboard.filter")}</Button>
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
            title="Total de produtos"
            value={isLoading ? "--" : totalProducts.toString()}
            delta="+12%"
            icon={Boxes}
            tone="primary"
          />
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
          <StatCard
            title="Valor do estoque"
            value={stockValueLabel}
            delta="+6%"
            icon={CircleDollarSign}
            tone="success"
          />
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
          <StatCard
            title="Itens com estoque baixo"
            value={isLoading ? "--" : lowStockCount.toString()}
            delta="-3%"
            icon={PackageCheck}
            tone="warning"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          <InsightsCard>
            <SalesLineChart data={insightData} />
          </InsightsCard>
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <TopProductsCard products={topProducts} categoryMap={categoryMap} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          <RecentProductsTable products={recentProducts} categoryMap={categoryMap} />
        </div>
        <div className="grid gap-4">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <LowStockCard products={lowStock} />
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
    </section>
  );
}
