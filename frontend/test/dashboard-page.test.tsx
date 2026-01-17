import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import DashboardPage from "@/app/page";

vi.mock("@/components/auth/auth-provider", () => ({
  useAuth: () => ({
    token: "token",
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
      totalProducts: 1,
      stockValue: 100,
      lowStockCount: 0,
      lowStockItems: [],
      topProducts: [],
      recentProducts: [],
      categories: [],
      categoryChart: [],
      trend: [],
    },
    isLoading: false,
  }),
}));

describe("DashboardPage", () => {
  it("renders header and export action", () => {
    render(<DashboardPage />);

    expect(screen.getByText("dashboard.title")).toBeInTheDocument();
    expect(screen.getByText("dashboard.exportPdf")).toBeInTheDocument();
  });
});
