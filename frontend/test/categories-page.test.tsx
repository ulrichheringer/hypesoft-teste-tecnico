import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";

// Mocks globais
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

vi.mock("@/components/categories/category-dialog", () => ({
  CategoryDialog: () => null,
}));

vi.mock("@/hooks/use-categories", () => ({
  useCategories: () => ({
    data: {
      items: [
        { id: "cat-1", name: "Eletrônicos", createdAt: new Date().toISOString() },
        { id: "cat-2", name: "Vestuário", createdAt: new Date().toISOString() },
      ],
      total: 2,
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

describe("CategoriesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Renderização inicial", () => {
    it("deve exibir o título da página de categorias", async () => {
      const { default: CategoriesPage } = await import("@/app/categories/page");
      renderWithQueryClient(<CategoriesPage />);

      expect(screen.getByText("categories.title")).toBeInTheDocument();
      expect(screen.getByText("categories.subtitle")).toBeInTheDocument();
    });

    it("deve exibir botão de nova categoria", async () => {
      const { default: CategoriesPage } = await import("@/app/categories/page");
      renderWithQueryClient(<CategoriesPage />);

      expect(screen.getByText("categories.new")).toBeInTheDocument();
    });

    it("deve exibir a lista de categorias", async () => {
      const { default: CategoriesPage } = await import("@/app/categories/page");
      renderWithQueryClient(<CategoriesPage />);

      expect(screen.getByText("Eletrônicos")).toBeInTheDocument();
      expect(screen.getByText("Vestuário")).toBeInTheDocument();
    });
  });

  describe("Funcionalidade de busca", () => {
    it("deve exibir campo de busca", async () => {
      const { default: CategoriesPage } = await import("@/app/categories/page");
      renderWithQueryClient(<CategoriesPage />);

      expect(screen.getByPlaceholderText("categories.searchPlaceholder")).toBeInTheDocument();
    });

    it("deve permitir digitar no campo de busca", async () => {
      const { default: CategoriesPage } = await import("@/app/categories/page");
      const user = userEvent.setup();
      renderWithQueryClient(<CategoriesPage />);

      const searchInput = screen.getByPlaceholderText("categories.searchPlaceholder");
      await user.type(searchInput, "Eletr");

      expect(searchInput).toHaveValue("Eletr");
    });
  });


});
