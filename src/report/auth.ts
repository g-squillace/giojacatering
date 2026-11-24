import { readEnv } from "@/report/env";
import { REPORT } from "@/report/config";

export const SESSION_COOKIE = "gioja_report_session";

const SESSION_HOURS = 12;
const encoder = new TextEncoder();

export type Role = "client" | "agency";

export interface SessionPayload {
  user: string;
  role: Role;
  exp: number;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function constantTimeEquals(left: string, right: string): boolean {
  const leftBytes = encoder.encode(left);
  const rightBytes = encoder.encode(right);
  const length = Math.max(leftBytes.length, rightBytes.length);
  let difference = leftBytes.length ^ rightBytes.length;
  for (let index = 0; index < length; index += 1) {
    difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }
  return difference === 0;
}

function sessionSecret(): string {
  const explicit = readEnv("REPORT_SESSION_SECRET");
  if (explicit !== null) return explicit;
  return `fallback:${REPORT.reportUser}:${readEnv("REPORT_PASSWORD") ?? ""}`;
}

async function sign(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(sessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(value)
  );
  return base64UrlEncode(new Uint8Array(signature));
}

function isSessionPayload(value: unknown): value is SessionPayload {
  if (typeof value !== "object" || value === null) return false;
  const user: unknown = Reflect.get(value, "user");
  const role: unknown = Reflect.get(value, "role");
  const exp: unknown = Reflect.get(value, "exp");
  return (
    typeof user === "string" &&
    (role === "client" || role === "agency") &&
    typeof exp === "number"
  );
}

export function missingCredentialVars(): string[] {
  return ["REPORT_PASSWORD", "REPORT_SESSION_SECRET"].filter(
    (name) => readEnv(name) === null
  );
}

export function credentialsConfigured(): boolean {
  return readEnv("REPORT_PASSWORD") !== null;
}

export function resolveRole(user: string, password: string): Role | null {
  const normalisedUser = user.trim().toLowerCase();
  const agencyPassword = readEnv("REPORT_AGENCY_PASSWORD");
  if (
    agencyPassword !== null &&
    constantTimeEquals(normalisedUser, REPORT.agencyUser) &&
    constantTimeEquals(password, agencyPassword)
  ) {
    return "agency";
  }
  const clientPassword = readEnv("REPORT_PASSWORD");
  if (
    clientPassword !== null &&
    constantTimeEquals(normalisedUser, REPORT.reportUser) &&
    constantTimeEquals(password, clientPassword)
  ) {
    return "client";
  }
  return null;
}

export async function createSessionToken(
  user: string,
  role: Role
): Promise<string> {
  const payload: SessionPayload = {
    user,
    role,
    exp: Date.now() + SESSION_HOURS * 60 * 60 * 1000,
  };
  const body = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  const signature = await sign(body);
  return `${body}.${signature}`;
}

export async function readSession(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (typeof token !== "string" || !token.includes(".")) return null;
  const separator = token.lastIndexOf(".");
  const body = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expected = await sign(body);
  if (!constantTimeEquals(signature, expected)) return null;
  try {
    const parsed: unknown = JSON.parse(
      new TextDecoder().decode(base64UrlDecode(body))
    );
    if (!isSessionPayload(parsed)) return null;
    if (parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE = SESSION_HOURS * 60 * 60;

export const PRIVATE_HEADERS: Record<string, string> = {
  "Cache-Control": "no-store, max-age=0",
};
