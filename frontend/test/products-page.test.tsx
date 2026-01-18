import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";

// Mocks globais que devem estar no topo
vi.mock("@/components/auth/auth-provider", () => ({
  useAuth: () => ({
    token: "mock-jwt-token",
    hasRole: vi.fn().mockReturnValue(true),
    profile: { firstName: "Test", lastName: "User" },
  }),
}));

vi.mock("@/components/i18n/i18n-provider", () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: "pt-BR",
  }),
}));

vi.mock("@/components/products/product-dialog", () => ({
  ProductDialog: () => null,
}));

vi.mock("@/components/products/stock-dialog", () => ({
  StockDialog: () => null,
}));

vi.mock("@/hooks/use-products", () => ({
  useProducts: () => ({
    data: {
      items: [
        {
          id: "p1",
          name: "Notebook Dell",
          description: "Laptop",
          price: 3500,
          stock: 15,
          categoryId: "cat-1",
          createdAt: new Date().toISOString(),
        },
        {
          id: "p2",
          name: "Mouse Logitech",
          description: "Mouse",
          price: 150,
          stock: 50,
          categoryId: "cat-1",
          createdAt: new Date().toISOString(),
        },
      ],
      total: 2,
    },
    isLoading: false,
  }),
}));

vi.mock("@/hooks/use-categories", () => ({
  useCategories: () => ({
    data: {
      items: [{ id: "cat-1", name: "Informática", createdAt: new Date().toISOString() }],
      total: 1,
    },
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

describe("ProductsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Renderização de produtos", () => {
    it("deve exibir o título da página de produtos", async () => {
      const { default: ProductsPage } = await import("@/app/products/page");
      renderWithQueryClient(<ProductsPage />);

      expect(screen.getByText("products.title")).toBeInTheDocument();
      expect(screen.getByText("products.subtitle")).toBeInTheDocument();
    });

    it("deve exibir botão de novo produto", async () => {
      const { default: ProductsPage } = await import("@/app/products/page");
      renderWithQueryClient(<ProductsPage />);

      expect(screen.getByText("products.new")).toBeInTheDocument();
    });

    it("deve exibir campo de busca", async () => {
      const { default: ProductsPage } = await import("@/app/products/page");
      renderWithQueryClient(<ProductsPage />);

      expect(screen.getByPlaceholderText("products.searchPlaceholder")).toBeInTheDocument();
    });

    it("deve exibir lista de produtos", async () => {
      const { default: ProductsPage } = await import("@/app/products/page");
      renderWithQueryClient(<ProductsPage />);

      expect(screen.getByText("Notebook Dell")).toBeInTheDocument();
      expect(screen.getByText("Mouse Logitech")).toBeInTheDocument();
    });
  });

  describe("Funcionalidade de busca", () => {
    it("deve permitir digitar no campo de busca", async () => {
      const { default: ProductsPage } = await import("@/app/products/page");
      const user = userEvent.setup();
      renderWithQueryClient(<ProductsPage />);

      const searchInput = screen.getByPlaceholderText("products.searchPlaceholder");
      await user.type(searchInput, "Notebook");

      expect(searchInput).toHaveValue("Notebook");
    });
  });


});
