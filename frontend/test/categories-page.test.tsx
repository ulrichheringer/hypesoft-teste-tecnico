import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import CategoriesPage from "@/app/categories/page";

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

vi.mock("@/hooks/use-categories", () => ({
  useCategories: () => ({
    data: {
      items: [{ id: "cat-1", name: "Acessorios" }],
      total: 1,
    },
    isLoading: false,
  }),
}));

vi.mock("@/components/categories/category-dialog", () => ({
  CategoryDialog: () => null,
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: () => "aces",
  }),
}));

describe("CategoriesPage", () => {
  it("renders categories and syncs search param", async () => {
    const client = new QueryClient();
    render(
      <QueryClientProvider client={client}>
        <CategoriesPage />
      </QueryClientProvider>,
    );

    expect(screen.getByText("Acessorios")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByPlaceholderText("categories.searchPlaceholder")).toHaveValue("aces");
    });
  });
});
