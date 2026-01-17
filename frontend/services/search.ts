import { apiFetch } from "@/lib/api";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

type ApiProduct = {
  id?: string;
  Id?: string;
  name?: string;
  Name?: string;
  description?: string;
  Description?: string;
  price?: number;
  Price?: number;
  stock?: number;
  Stock?: number;
  categoryId?: string;
  CategoryId?: string;
  createdAt?: string;
  CreatedAt?: string;
};

type ApiCategory = {
  id?: string;
  Id?: string;
  name?: string;
  Name?: string;
};

type ApiCatalogSearchResponse = {
  products?: ApiProduct[];
  Products?: ApiProduct[];
  productsTotal?: number;
  ProductsTotal?: number;
  categories?: ApiCategory[];
  Categories?: ApiCategory[];
  categoriesTotal?: number;
  CategoriesTotal?: number;
  query?: string;
  Query?: string;
};

export type CatalogSearchResponse = {
  products: Product[];
  productsTotal: number;
  categories: Category[];
  categoriesTotal: number;
  query: string;
};

const normalizeProduct = (product: ApiProduct): Product => ({
  id: product.id ?? product.Id ?? "",
  name: product.name ?? product.Name ?? "",
  description: product.description ?? product.Description ?? "",
  price: product.price ?? product.Price ?? 0,
  stock: product.stock ?? product.Stock ?? 0,
  categoryId: product.categoryId ?? product.CategoryId ?? "",
  createdAt: product.createdAt ?? product.CreatedAt ?? new Date(0).toISOString(),
});

const normalizeCategory = (category: ApiCategory): Category => ({
  id: category.id ?? category.Id ?? "",
  name: category.name ?? category.Name ?? "",
});

export function searchCatalog(term: string, token: string | null, take = 5) {
  return apiFetch<ApiCatalogSearchResponse>("/api/search", {
    params: { term, take },
    token,
  }).then((response) => {
    const productsRaw = response.products ?? response.Products ?? [];
    const categoriesRaw = response.categories ?? response.Categories ?? [];
    return {
      products: productsRaw.map((item) => normalizeProduct(item as ApiProduct)),
      productsTotal: response.productsTotal ?? response.ProductsTotal ?? 0,
      categories: categoriesRaw.map((item) => normalizeCategory(item as ApiCategory)),
      categoriesTotal: response.categoriesTotal ?? response.CategoriesTotal ?? 0,
      query: response.query ?? response.Query ?? term,
    } satisfies CatalogSearchResponse;
  });
}
