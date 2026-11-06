import { business } from "@/data/business";
import { absoluteUrl, siteUrl } from "@/lib/siteUrl";

export const ORGANIZATION_ID = `${siteUrl}/#organization`;
export const WEBSITE_ID = `${siteUrl}/#website`;

type LayoutContacts = {
  phone?: string | null;
  email?: string | null;
  googleMaps?: string | null;
  socialMediaLinks?: ReadonlyArray<{ url?: string | null }> | null;
};

type SeoDefaults = {
  siteName?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  imageUrl?: string | null;
};

const PLACEHOLDER_SOCIAL_HOSTS = [
  "https://www.facebook.com/DatoCMS",
  "https://www.facebook.com/",
  "https://www.instagram.com/",
];

function isMeaningfulUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  const normalized = url.trim().replace(/\/+$/, "");
  if (!/^https?:\/\//.test(normalized)) return false;
  return !PLACEHOLDER_SOCIAL_HOSTS.some(
    (placeholder) => normalized === placeholder.replace(/\/+$/, "")
  );
}

function isMeaningfulPhone(phone: string | null | undefined): phone is string {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 9) return false;
  return !/^(\d)\1+$/.test(digits.slice(1));
}

function compact(value: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => {
      if (entry === null || entry === undefined || entry === "") return false;
      if (Array.isArray(entry) && entry.length === 0) return false;
      return true;
    })
  );
}

export function buildOrganizationJsonLd(
  contacts: LayoutContacts,
  defaults: SeoDefaults
): Record<string, unknown> {
  const sameAs = (contacts.socialMediaLinks || [])
    .map((link) => link?.url)
    .filter(isMeaningfulUrl);

  if (isMeaningfulUrl(contacts.googleMaps)) sameAs.push(contacts.googleMaps);

  return compact({
    "@context": "https://schema.org",
    "@type": ["Caterer", "LocalBusiness", "Organization"],
    "@id": ORGANIZATION_ID,
    name: defaults.siteName || business.name,
    legalName: business.legalName,
    url: `${siteUrl}/`,
    description: defaults.description,
    logo: defaults.logoUrl,
    image: defaults.imageUrl || defaults.logoUrl,
    vatID: business.vatId,
    priceRange: business.priceRange,
    servesCuisine: [...business.servesCuisine],
    telephone: isMeaningfulPhone(contacts.phone) ? contacts.phone : undefined,
    email: contacts.email || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.streetAddress,
      addressLocality: business.addressLocality,
      addressRegion: business.addressRegion,
      postalCode: business.postalCode,
      addressCountry: business.addressCountry,
    },
    areaServed: business.areaServed.map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servizi di catering",
      itemListElement: business.services.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: service },
      })),
    },
    sameAs,
  });
}

export function buildWebSiteJsonLd(
  locale: string,
  siteName?: string | null
): Record<string, unknown> {
  return compact({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${siteUrl}/`,
    name: siteName || business.name,
    inLanguage: locale,
    publisher: { "@id": ORGANIZATION_ID },
  });
}

export function buildBreadcrumbJsonLd(
  items: ReadonlyArray<{ name: string; path: string }>
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

type ArticleInput = {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  path: string;
  locale: string;
};

export function buildArticleJsonLd(
  article: ArticleInput
): Record<string, unknown> {
  return compact({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.imageUrl,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    inLanguage: article.locale,
    mainEntityOfPage: absoluteUrl(article.path),
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
  });
}

type EventInput = {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  path: string;
};

export function buildEventJsonLd(event: EventInput): Record<string, unknown> {
  return compact({
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    image: event.imageUrl,
    startDate: event.startDate,
    endDate: event.endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: absoluteUrl(event.path),
    organizer: { "@id": ORGANIZATION_ID },
    location: {
      "@type": "Place",
      name: business.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: business.streetAddress,
        addressLocality: business.addressLocality,
        addressRegion: business.addressRegion,
        postalCode: business.postalCode,
        addressCountry: business.addressCountry,
      },
    },
  });
}
