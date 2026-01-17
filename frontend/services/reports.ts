import { ApiError } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

function parseFileName(disposition: string | null) {
  if (!disposition) {
    return null;
  }
  const match = /filename="?([^"]+)"?/i.exec(disposition);
  return match?.[1] ?? null;
}

export async function exportInventoryReport(token: string | null) {
  const url = new URL("/api/reports/inventory", API_URL);
  const headers = new Headers();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url.toString(), { headers });
  if (!response.ok) {
    throw new ApiError(response.statusText, response.status);
  }

  const blob = await response.blob();
  const fileName = parseFileName(response.headers.get("content-disposition"));
  return { blob, fileName };
}
