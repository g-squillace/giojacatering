const CANONICAL_SITE_URL = "https://giojacatering.it";

function normalize(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, "");
  if (!trimmed) return CANONICAL_SITE_URL;
  if (/^https?:\/\//.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export const siteUrl = normalize(
  process.env.NEXT_PUBLIC_SITE_URL || CANONICAL_SITE_URL
);

export const deployContext = process.env.CONTEXT || "production";

export const isIndexableDeploy = deployContext === "production";

export function absoluteUrl(path: string): string {
  if (!path || path === "/") return `${siteUrl}/`;
  if (/^https?:\/\//.test(path)) return path;
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${withLeadingSlash.replace(/\/+$/, "")}`;
}
