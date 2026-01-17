import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { Topbar } from "@/components/layout/topbar";

vi.mock("@/components/auth/auth-provider", () => ({
  useAuth: () => ({
    profile: { firstName: "Ana", lastName: "Silva" },
    logout: vi.fn(),
    roles: ["admin"],
  }),
}));

vi.mock("@/components/i18n/i18n-provider", () => ({
  useI18n: () => ({
    locale: "pt-BR",
    setLocale: vi.fn(),
    t: (key: string, params?: Record<string, number>) =>
      key === "topbar.updatedAt"
        ? `updated ${params?.minutes ?? 0}`
        : key,
  }),
}));

vi.mock("@/hooks/use-catalog-search", () => ({
  useCatalogSearch: () => ({
    data: {
      products: [{ id: "p-1", name: "Mouse", stock: 3 }],
      categories: [{ id: "c-1", name: "Perifericos" }],
      productsTotal: 1,
      categoriesTotal: 1,
      query: "mo",
    },
    isFetching: false,
  }),
}));

vi.mock("@/hooks/use-debounced-value", () => ({
  useDebouncedValue: (value: string) => value,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("Topbar", () => {
  it("shows search results when typing", () => {
    render(<Topbar />);

    const input = screen.getByLabelText("search.label");
    fireEvent.change(input, { target: { value: "mo" } });

    expect(screen.getByText("Mouse")).toBeInTheDocument();
    expect(screen.getByText("Perifericos")).toBeInTheDocument();
  });
});
