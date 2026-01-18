import { afterEach, beforeAll, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// Mock do Next.js navigation
const routerPushMock = vi.fn();
let searchParamValue = "";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: routerPushMock,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: (key: string) => (key === "q" ? searchParamValue : null),
    toString: () => (searchParamValue ? `q=${searchParamValue}` : ""),
  }),
  usePathname: () => "/",
}));

// Mock do ResizeObserver (necessário para componentes Radix)
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // Mock do matchMedia
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

// Limpa após cada teste
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Helpers para uso nos testes
export const setMockSearchParam = (value: string) => {
  searchParamValue = value;
};

export const resetMockSearchParam = () => {
  searchParamValue = "";
};

export { routerPushMock };
