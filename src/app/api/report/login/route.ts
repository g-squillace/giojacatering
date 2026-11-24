import { NextResponse } from "next/server";
import {
  PRIVATE_HEADERS,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  credentialsConfigured,
  resolveRole,
} from "@/report/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const attempts = new Map<string, { count: number; firstAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded !== null) return forwarded.split(",")[0].trim();
  return request.headers.get("x-nf-client-connection-ip") ?? "unknown";
}

function rateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (entry === undefined || now - entry.firstAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAt: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

function redirectTo(request: Request, path: string): NextResponse {
  return NextResponse.redirect(new URL(path, request.url), {
    status: 303,
    headers: PRIVATE_HEADERS,
  });
}

export async function POST(request: Request): Promise<NextResponse> {
  if (!credentialsConfigured()) {
    return redirectTo(request, "/report/login?errore=configurazione");
  }
  if (rateLimited(clientKey(request))) {
    return redirectTo(request, "/report/login?errore=troppi-tentativi");
  }

  const form = await request.formData();
  const user = String(form.get("utente") ?? "");
  const password = String(form.get("password") ?? "");
  const role = resolveRole(user, password);

  if (role === null) {
    return redirectTo(request, "/report/login?errore=credenziali");
  }

  const token = await createSessionToken(user.trim().toLowerCase(), role);
  const response = redirectTo(request, "/report");
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: new URL(request.url).protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}
