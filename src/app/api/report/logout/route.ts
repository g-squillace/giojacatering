import { NextResponse } from "next/server";
import { PRIVATE_HEADERS, SESSION_COOKIE } from "@/report/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  const response = NextResponse.redirect(new URL("/report/login", request.url), {
    status: 303,
    headers: PRIVATE_HEADERS,
  });
  response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
