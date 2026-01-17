import { apiFetch } from "@/lib/api";
import type { DashboardSummary } from "@/types/dashboard";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

type ApiDashboardSummary = {
  totalProducts?: number;
  TotalProducts?: number;
  stockValue?: number;
  StockValue?: number;
  lowStockCount?: number;
  LowStockCount?: number;
  lowStockItems?: ApiProduct[];
  LowStockItems?: ApiProduct[];
  topProducts?: ApiProduct[];
  TopProducts?: ApiProduct[];
  recentProducts?: ApiProduct[];
  RecentProducts?: ApiProduct[];
  categories?: ApiCategory[];
  Categories?: ApiCategory[];
  categoryChart?: ApiChartItem[];
  CategoryChart?: ApiChartItem[];
  trend?: ApiTrendPoint[];
  Trend?: ApiTrendPoint[];
};

type ApiProduct = {
  id?: string;
  Id?: string;
  name?: string;
  Name?: string;
  description?: string;
  Description?: string;
  price?: number;
  Price?: number;
  stock?: number;
  Stock?: number;
  categoryId?: string;
  CategoryId?: string;
  createdAt?: string;
  CreatedAt?: string;
};

type ApiCategory = {
  id?: string;
  Id?: string;
  name?: string;
  Name?: string;
};

type ApiChartItem = {
  label?: string;
  Label?: string;
  value?: number;
  Value?: number;
};

type ApiTrendPoint = {
  label?: string;
  Label?: string;
  value?: number;
  Value?: number;
  benchmark?: number;
  Benchmark?: number;
};

const normalizeProduct = (product: ApiProduct): Product => ({
  id: product.id ?? product.Id ?? "",
  name: product.name ?? product.Name ?? "",
  description: product.description ?? product.Description ?? "",
  price: product.price ?? product.Price ?? 0,
  stock: product.stock ?? product.Stock ?? 0,
  categoryId: product.categoryId ?? product.CategoryId ?? "",
  createdAt: product.createdAt ?? product.CreatedAt ?? new Date(0).toISOString(),
});

const normalizeCategory = (category: ApiCategory): Category => ({
  id: category.id ?? category.Id ?? "",
  name: category.name ?? category.Name ?? "",
});

const normalizeChartItem = (item: ApiChartItem) => ({
  label: item.label ?? item.Label ?? "",
  value: item.value ?? item.Value ?? 0,
});

const normalizeTrendPoint = (point: ApiTrendPoint) => ({
  label: point.label ?? point.Label ?? "",
  value: point.value ?? point.Value ?? 0,
  benchmark: point.benchmark ?? point.Benchmark ?? 0,
});

export function getDashboardSummary(token: string | null) {
  return apiFetch<ApiDashboardSummary>("/api/dashboard", { token }).then((response) => {
    const payload = response ?? {};
    const summary: DashboardSummary = {
      totalProducts: payload.totalProducts ?? payload.TotalProducts ?? 0,
      stockValue: payload.stockValue ?? payload.StockValue ?? 0,
      lowStockCount: payload.lowStockCount ?? payload.LowStockCount ?? 0,
      lowStockItems: (payload.lowStockItems ?? payload.LowStockItems ?? []).map(
        normalizeProduct,
      ),
      topProducts: (payload.topProducts ?? payload.TopProducts ?? []).map(normalizeProduct),
      recentProducts: (payload.recentProducts ?? payload.RecentProducts ?? []).map(
        normalizeProduct,
      ),
      categories: (payload.categories ?? payload.Categories ?? []).map(normalizeCategory),
      categoryChart: (payload.categoryChart ?? payload.CategoryChart ?? []).map(
        normalizeChartItem,
      ),
      trend: (payload.trend ?? payload.Trend ?? []).map(normalizeTrendPoint),
    };

    return summary;
  });
}
