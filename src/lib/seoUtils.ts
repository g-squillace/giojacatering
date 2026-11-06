import type { Metadata } from "next";
import { toNextMetadata } from "react-datocms";
import { LocaleValue, PageSeoProps } from "@/_types";
import resolveLink from "@/lib/resolveLink";
import config from "@/data/config";
import { absoluteUrl, isIndexableDeploy, siteUrl } from "@/lib/siteUrl";

type AlternateEntry = {
  locale: string;
  path: string;
};

const DATOCMS_PLACEHOLDER_TWITTER_ACCOUNT = "@datocms";

function withoutPlaceholderTwitterAccount(
  twitter: Metadata["twitter"]
): Metadata["twitter"] {
  if (!twitter || !("site" in twitter)) return twitter;
  if (twitter.site?.toLowerCase() !== DATOCMS_PLACEHOLDER_TWITTER_ACCOUNT) {
    return twitter;
  }
  return { ...twitter, site: undefined, siteId: undefined };
}

export const noIndexRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

export const indexableRobots: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export const defaultRobots: Metadata["robots"] = isIndexableDeploy
  ? indexableRobots
  : noIndexRobots;

export function getAlternateEntries(page: PageSeoProps): AlternateEntry[] {
  if (!page?.slugs) return [];
  return page.slugs
    .filter((item: LocaleValue) => Boolean(item?.value))
    .map((item: LocaleValue) => ({
      locale: item.locale,
      path: resolveLink({
        slugs: page.slugs,
        _modelApiKey: page._modelApiKey || "",
        locale: item.locale,
        modelRelated: null,
      }),
    }));
}

export function getAlts(page: PageSeoProps) {
  if (!page) return [];
  return (page?.slugs || []).map((item: LocaleValue) => ({
    slugs: page?.slugs,
    locale: item.locale,
    _modelApiKey: page?._modelApiKey || "",
  }));
}

export function buildAlternates(
  page: PageSeoProps,
  currentLocale: string
): Metadata["alternates"] {
  const entries = getAlternateEntries(page);
  if (entries.length === 0) return { canonical: siteUrl };

  const languages: Record<string, string> = {};
  entries.forEach((entry) => {
    languages[entry.locale] = absoluteUrl(entry.path);
    if (entry.locale === config.defaultLocale) {
      languages["x-default"] = absoluteUrl(entry.path);
    }
  });

  const current =
    entries.find((entry) => entry.locale === currentLocale) || entries[0];

  return {
    canonical: absoluteUrl(current.path),
    languages,
  };
}

export default function getSeoMeta(
  page: PageSeoProps,
  currentLocale: string
): Metadata | null {
  if (!page) return null;

  const nextTags = toNextMetadata([...(page?.seo || [])]);
  const alternates = buildAlternates(page, currentLocale);
  const canonical = alternates && "canonical" in alternates
    ? alternates.canonical
    : undefined;

  return {
    ...nextTags,
    metadataBase: new URL(siteUrl),
    alternates,
    robots: defaultRobots,
    twitter: withoutPlaceholderTwitterAccount(nextTags.twitter),
    openGraph: {
      ...nextTags.openGraph,
      url: typeof canonical === "string" ? canonical : siteUrl,
      locale: currentLocale,
      type: page._modelApiKey === "page" ? "website" : "article",
    },
  };
}
