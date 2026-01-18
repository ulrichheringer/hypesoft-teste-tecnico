import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";

// Mocks globais
vi.mock("@/components/auth/auth-provider", () => ({
  useAuth: () => ({
    token: "mock-jwt-token",
    hasRole: vi.fn().mockReturnValue(true),
    profile: { firstName: "Admin", lastName: "User" },
  }),
}));

vi.mock("@/components/i18n/i18n-provider", () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: "pt-BR",
  }),
}));

vi.mock("@/hooks/use-dashboard-summary", () => ({
  useDashboardSummary: () => ({
    data: {
      totalProducts: 100,
      stockValue: 50000,
      lowStockCount: 5,
      lowStockItems: [],
      topProducts: [],
      recentProducts: [],
      categories: [],
      categoryChart: [
        { name: "Eletrônicos", count: 30 },
        { name: "Vestuário", count: 20 },
      ],
      trend: [],
    },
    isLoading: false,
  }),
  useKpiTotalProducts: () => ({ data: 100, isLoading: false }),
  useKpiStockValue: () => ({ data: 50000, isLoading: false }),
  useKpiLowStockCount: () => ({ data: 5, isLoading: false }),
  useKpiCategoryChart: () => ({
    data: [
      { name: "Eletrônicos", count: 30 },
      { name: "Vestuário", count: 20 },
    ],
    isLoading: false,
  }),
}));

function renderWithQueryClient(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Renderização de KPIs", () => {
    it("deve exibir o título do dashboard", async () => {
      const { default: DashboardPage } = await import("@/app/page");
      renderWithQueryClient(<DashboardPage />);

      expect(screen.getByText("dashboard.title")).toBeInTheDocument();
    });

    it("deve exibir botão de exportar PDF", async () => {
      const { default: DashboardPage } = await import("@/app/page");
      renderWithQueryClient(<DashboardPage />);

      expect(screen.getByText("dashboard.exportPdf")).toBeInTheDocument();
    });

  });

  describe("Ação de exportar PDF", () => {
    it("botão de exportar não deve estar desabilitado", async () => {
      const { default: DashboardPage } = await import("@/app/page");
      renderWithQueryClient(<DashboardPage />);

      const exportButton = screen.getByText("dashboard.exportPdf");
      expect(exportButton.closest("button")).not.toBeDisabled();
    });
  });


});
