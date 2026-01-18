import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("X-Request-Time", Date.now().toString());
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/metrics).*)"],
};
