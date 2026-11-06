import type { MetadataRoute } from "next";
import { SitemapDocument } from "@/graphql/generated";
import fetchDato from "@/lib/fetchDato";
import resolveLink from "@/lib/resolveLink";
import config from "@/data/config";
import { absoluteUrl, isIndexableDeploy } from "@/lib/siteUrl";

export const revalidate = 3600;

type SlugLocale = {
  locale?: string | null;
  value?: string | null;
};

type SitemapRecord = {
  _modelApiKey: string;
  _updatedAt: string;
  isHome?: boolean | null;
  slugs?: SlugLocale[] | null;
};

const PRIORITY_BY_MODEL: Record<string, number> = {
  page: 0.8,
  post: 0.6,
  event: 0.6,
};

function toEntry(record: SitemapRecord): MetadataRoute.Sitemap[number] | null {
  const slugs = (record.slugs || []).filter(
    (slug): slug is { locale: string; value: string } =>
      Boolean(slug?.locale) && Boolean(slug?.value)
  );
  if (slugs.length === 0) return null;

  const languages: Record<string, string> = {};
  slugs.forEach((slug) => {
    languages[slug.locale] = absoluteUrl(
      resolveLink({
        slugs,
        _modelApiKey: record._modelApiKey,
        locale: slug.locale,
      })
    );
  });

  const primaryLocale = languages[config.defaultLocale]
    ? config.defaultLocale
    : slugs[0].locale;

  languages["x-default"] = languages[primaryLocale];

  return {
    url: languages[primaryLocale],
    lastModified: new Date(record._updatedAt),
    changeFrequency: record.isHome ? "weekly" : "monthly",
    priority: record.isHome ? 1 : PRIORITY_BY_MODEL[record._modelApiKey] ?? 0.5,
    alternates: { languages },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isIndexableDeploy) return [];

  const data = await fetchDato(SitemapDocument, {}, false);
  const records: SitemapRecord[] = [
    ...(data?.allPages || []),
    ...(data?.allPosts || []),
  ];

  const entries = records
    .map(toEntry)
    .filter((entry): entry is MetadataRoute.Sitemap[number] => entry !== null);

  const unique = new Map<string, MetadataRoute.Sitemap[number]>();
  entries.forEach((entry) => {
    if (!unique.has(entry.url)) unique.set(entry.url, entry);
  });

  return Array.from(unique.values());
}
