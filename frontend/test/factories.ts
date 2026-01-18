import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import type { DashboardSummary } from "@/types/dashboard";

export function createProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "prod-1",
    name: "Produto Teste",
    description: "Descrição do produto teste",
    price: 99.99,
    stock: 10,
    categoryId: "cat-1",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

export function createCategory(overrides: Partial<Category> = {}): Category {
  return {
    id: "cat-1",
    name: "Categoria Teste",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

export function createDashboardSummary(
  overrides: Partial<DashboardSummary> = {}
): DashboardSummary {
  return {
    totalProducts: 10,
    stockValue: 1000,
    lowStockCount: 2,
    lowStockItems: [],
    topProducts: [],
    recentProducts: [],
    categories: [],
    categoryChart: [],
    trend: [],
    ...overrides,
  };
}

export function createProducts(count: number): Product[] {
  return Array.from({ length: count }, (_, i) =>
    createProduct({
      id: `prod-${i + 1}`,
      name: `Produto ${i + 1}`,
      stock: i * 5,
    })
  );
}

export function createCategories(count: number): Category[] {
  return Array.from({ length: count }, (_, i) =>
    createCategory({
      id: `cat-${i + 1}`,
      name: `Categoria ${i + 1}`,
    })
  );
}
