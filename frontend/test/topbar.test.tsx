import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, waitFor, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";

// Mock de todos os hooks necessários antes dos imports
vi.mock("@/components/auth/auth-provider", () => ({
  useAuth: () => ({
    profile: { firstName: "Ana", lastName: "Silva" },
    logout: vi.fn(),
    roles: ["admin"],
    token: "mock-token",
    hasRole: vi.fn().mockReturnValue(true),
  }),
}));

vi.mock("@/components/i18n/i18n-provider", () => ({
  useI18n: () => ({
    locale: "pt-BR",
    setLocale: vi.fn(),
    t: (key: string, params?: Record<string, number>) =>
      key === "topbar.updatedAt"
        ? `atualizado há ${params?.minutes ?? 0} min`
        : key,
  }),
}));

vi.mock("@/hooks/use-debounced-value", () => ({
  useDebouncedValue: (value: string) => value,
}));

vi.mock("@/hooks/use-catalog-search", () => ({
  useCatalogSearch: (query: string) => ({
    data: query.length >= 2 ? {
      products: [{ id: "p-1", name: "Mouse Gamer", stock: 25, price: 150, categoryId: "c-1" }],
      categories: [{ id: "c-1", name: "Periféricos" }],
      productsTotal: 1,
      categoriesTotal: 1,
      query,
    } : undefined,
    isFetching: false,
  }),
}));

function renderWithQueryClient(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("Topbar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Busca global", () => {
    it("deve renderizar campo de busca com label acessível", async () => {
      const { Topbar } = await import("@/components/layout/topbar");
      renderWithQueryClient(<Topbar />);

      const searchInput = screen.getByLabelText("search.label");
      expect(searchInput).toBeInTheDocument();
    });

    it("deve exibir resultados de busca ao digitar", async () => {
      const { Topbar } = await import("@/components/layout/topbar");
      const user = userEvent.setup();
      renderWithQueryClient(<Topbar />);

      const searchInput = screen.getByLabelText("search.label");
      await user.type(searchInput, "mo");

      await waitFor(() => {
        expect(screen.getByText("Mouse Gamer")).toBeInTheDocument();
        expect(screen.getByText("Periféricos")).toBeInTheDocument();
      });
    });

  });
});
