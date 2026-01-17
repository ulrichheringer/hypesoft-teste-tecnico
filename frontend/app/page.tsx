"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Boxes, CircleDollarSign, PackageCheck } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { TopProductsCard } from "@/components/dashboard/top-products-card";
import { LowStockCard } from "@/components/dashboard/low-stock-card";
import { RecentProductsTable } from "@/components/dashboard/recent-products-table";
import { CategoryChartCard } from "@/components/dashboard/category-chart-card";
import { InsightsCard } from "@/components/dashboard/insights-card";
import { Button } from "@/components/ui/button";
import { useDashboardSummary } from "@/hooks/use-dashboard-summary";
import { cn } from "@/lib/utils";

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

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export default function DashboardPage() {
  const summaryQuery = useDashboardSummary();
  const summary = summaryQuery.data;

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

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-display text-2xl font-semibold text-foreground">Dashboard</p>
          <p className="text-sm text-muted-foreground">
            Acompanhe indicadores e mantenha o estoque sob controle.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" className="rounded-2xl">
            Maio 6 - Junho 6
          </Button>
          <Button className="rounded-2xl">Filtrar</Button>
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
            value={isLoading ? "--" : formatCurrency(stockValue)}
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
