import { apiFetch } from "@/lib/api";
import type { PagedResponse } from "@/types/pagination";
import type {
  CreateProductInput,
  Product,
  UpdateProductInput,
  UpdateStockInput,
} from "@/types/product";
import { normalizePagedResponse, type ApiPagedResponse } from "@/services/normalize";

export type ListProductsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string | null;
};

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

const normalizeProduct = (product: ApiProduct): Product => ({
  id: product.id ?? product.Id ?? "",
  name: product.name ?? product.Name ?? "",
  description: product.description ?? product.Description ?? "",
  price: product.price ?? product.Price ?? 0,
  stock: product.stock ?? product.Stock ?? 0,
  categoryId: product.categoryId ?? product.CategoryId ?? "",
  createdAt:
    product.createdAt ?? product.CreatedAt ?? new Date(0).toISOString(),
});

export function listProducts(params: ListProductsParams, token: string | null) {
  return apiFetch<ApiPagedResponse<ApiProduct>>("/api/products", {
    params,
    token,
  }).then((response) => {
    const normalized = normalizePagedResponse(response);
    return {
      ...normalized,
      items: normalized.items.map((item) => normalizeProduct(item as ApiProduct)),
    } satisfies PagedResponse<Product>;
  });
}

export function getProduct(id: string, token: string | null) {
  return apiFetch<ApiProduct>(`/api/products/${id}`, { token }).then(normalizeProduct);
}

export function createProduct(input: CreateProductInput, token: string | null) {
  return apiFetch<ApiProduct>("/api/products", {
    method: "POST",
    token,
    body: input,
  }).then(normalizeProduct);
}

export function updateProduct(
  id: string,
  input: UpdateProductInput,
  token: string | null,
) {
  return apiFetch<ApiProduct>(`/api/products/${id}`, {
    method: "PUT",
    token,
    body: input,
  }).then(normalizeProduct);
}

export function updateProductStock(
  id: string,
  input: UpdateStockInput,
  token: string | null,
) {
  return apiFetch<ApiProduct>(`/api/products/${id}/stock`, {
    method: "PATCH",
    token,
    body: input,
  }).then(normalizeProduct);
}

export function deleteProduct(id: string, token: string | null) {
  return apiFetch<void>(`/api/products/${id}`, {
    method: "DELETE",
    token,
  });
}
