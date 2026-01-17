import type { PagedResponse } from "@/types/pagination";

export type ApiPagedResponse<T> =
  | PagedResponse<T>
  | {
      Items?: T[];
      Total?: number;
      Page?: number;
      PageSize?: number;
    };

export function normalizePagedResponse<T>(payload: ApiPagedResponse<T>): PagedResponse<T> {
  const normalized = payload as {
    items?: T[];
    Items?: T[];
    total?: number;
    Total?: number;
    page?: number;
    Page?: number;
    pageSize?: number;
    PageSize?: number;
  };

  const items = normalized.items ?? normalized.Items ?? [];

  return {
    items,
    total: normalized.total ?? normalized.Total ?? 0,
    page: normalized.page ?? normalized.Page ?? 1,
    pageSize: normalized.pageSize ?? normalized.PageSize ?? items.length,
  };
}
