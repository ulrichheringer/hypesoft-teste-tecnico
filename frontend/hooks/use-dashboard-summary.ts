import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/auth/auth-provider";
import {
  getDashboardSummary,
  getKpiTotalProducts,
  getKpiStockValue,
  getKpiLowStockCount,
  getKpiCategoryChart,
} from "@/services/dashboard";

export function useDashboardSummary() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => getDashboardSummary(token),
    enabled: Boolean(token),
    placeholderData: (previous) => previous,
  });
}

export function useKpiTotalProducts() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["kpi-total-products"],
    queryFn: () => getKpiTotalProducts(token),
    enabled: Boolean(token),
    staleTime: 30_000,
  });
}

export function useKpiStockValue() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["kpi-stock-value"],
    queryFn: () => getKpiStockValue(token),
    enabled: Boolean(token),
    staleTime: 30_000,
  });
}

export function useKpiLowStockCount(threshold = 10) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["kpi-low-stock-count", threshold],
    queryFn: () => getKpiLowStockCount(token, threshold),
    enabled: Boolean(token),
    staleTime: 30_000,
  });
}

export function useKpiCategoryChart() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["kpi-category-chart"],
    queryFn: () => getKpiCategoryChart(token),
    enabled: Boolean(token),
    staleTime: 30_000,
  });
}
