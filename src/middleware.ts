import { NextResponse } from "next/server";

export const config = {
  matcher: ["/report/:path*", "/api/report/:path*"],
};

export function middleware(): NextResponse {
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  response.headers.set("Vary", "Cookie");
  return response;
}
