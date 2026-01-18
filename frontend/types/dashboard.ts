import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

export type DashboardChartItem = {
  label: string;
  value: number;
};

export type DashboardTrendPoint = {
  label: string;
  value: number;
  benchmark: number;
};

export type DashboardSummary = {
  totalProducts: number;
  stockValue: number;
  lowStockCount: number;
  lowStockItems: Product[];
  topProducts: Product[];
  recentProducts: Product[];
  products: Product[];
  categories: Category[];
  categoryChart: DashboardChartItem[];
  trend: DashboardTrendPoint[];
};
