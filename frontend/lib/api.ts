export type ApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  params?: Record<string, string | number | boolean | null | undefined>;
  token?: string | null;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

function normalizeParams(params?: ApiOptions["params"]) {
  const searchParams = new URLSearchParams();
  if (!params) {
    return searchParams;
  }

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }
    searchParams.set(key, String(value));
  }

  return searchParams;
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}) {
  const { params, token, body, headers, ...rest } = options;
  const url = new URL(path, API_URL);
  const searchParams = normalizeParams(params);
  const queryString = searchParams.toString();
  if (queryString) {
    url.search = queryString;
  }

  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");
  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
  }
  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url.toString(), {
    ...rest,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const payload = (await response.json()) as { message?: string };
      message = payload?.message ?? message;
    } catch {
      // Ignore parse errors and keep status text.
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}
