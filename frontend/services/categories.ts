import { apiFetch } from "@/lib/api";
import type { Category, CreateCategoryInput, UpdateCategoryInput } from "@/types/category";
import type { PagedResponse } from "@/types/pagination";
import { normalizePagedResponse, type ApiPagedResponse } from "@/services/normalize";

export type ListCategoriesParams = {
  page?: number;
  pageSize?: number;
  search?: string;
};

type ApiCategory = {
  id?: string;
  Id?: string;
  name?: string;
  Name?: string;
};

const normalizeCategory = (category: ApiCategory): Category => ({
  id: category.id ?? category.Id ?? "",
  name: category.name ?? category.Name ?? "",
});

export function listCategories(params: ListCategoriesParams, token: string | null) {
  return apiFetch<ApiPagedResponse<ApiCategory>>("/api/categories", {
    params,
    token,
  }).then((response) => {
    const normalized = normalizePagedResponse(response);
    return {
      ...normalized,
      items: normalized.items.map((item) => normalizeCategory(item as ApiCategory)),
    } satisfies PagedResponse<Category>;
  });
}

export function getCategory(id: string, token: string | null) {
  return apiFetch<ApiCategory>(`/api/categories/${id}`, { token }).then(normalizeCategory);
}

export function createCategory(input: CreateCategoryInput, token: string | null) {
  return apiFetch<ApiCategory>("/api/categories", {
    method: "POST",
    token,
    body: input,
  }).then(normalizeCategory);
}

export function updateCategory(
  id: string,
  input: UpdateCategoryInput,
  token: string | null,
) {
  return apiFetch<ApiCategory>(`/api/categories/${id}`, {
    method: "PUT",
    token,
    body: input,
  }).then(normalizeCategory);
}

export function deleteCategory(id: string, token: string | null) {
  return apiFetch<void>(`/api/categories/${id}`, {
    method: "DELETE",
    token,
  });
}
