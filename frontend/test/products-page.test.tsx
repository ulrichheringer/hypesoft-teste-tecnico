import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import ProductsPage from "@/app/products/page";

vi.mock("@/components/auth/auth-provider", () => ({
  useAuth: () => ({
    token: "token",
    hasRole: () => true,
  }),
}));

vi.mock("@/components/i18n/i18n-provider", () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@/hooks/use-products", () => ({
  useProducts: () => ({
    data: {
      items: [
        {
          id: "prod-1",
          name: "Notebook",
          description: "Desc",
          price: 100,
          stock: 2,
          categoryId: "cat-1",
          createdAt: new Date().toISOString(),
        },
      ],
      total: 1,
    },
    isLoading: false,
  }),
}));

vi.mock("@/hooks/use-categories", () => ({
  useCategories: () => ({
    data: {
      items: [{ id: "cat-1", name: "Informatica" }],
      total: 1,
    },
    isLoading: false,
  }),
}));

vi.mock("@/components/products/product-dialog", () => ({
  ProductDialog: () => null,
}));

vi.mock("@/components/products/stock-dialog", () => ({
  StockDialog: () => null,
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: () => "note",
  }),
}));

describe("ProductsPage", () => {
  it("renders products and syncs search param", async () => {
    const client = new QueryClient();
    render(
      <QueryClientProvider client={client}>
        <ProductsPage />
      </QueryClientProvider>,
    );

    expect(screen.getByText("Notebook")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByPlaceholderText("products.searchPlaceholder")).toHaveValue("note");
    });
  });
});
