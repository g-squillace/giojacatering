import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { toNextMetadata } from "react-datocms";
import config from "@/data/config";
import "@/styles/globals.css";
import { FooterDocument, SiteLocale, LayoutDocument } from "@/graphql/generated";
import Footer from "@/components/Footer";
import fetchDato from "@/lib/fetchDato";
import SkipLinks from "@/components/Layout/SkipLinks";
import WhatsAppButton from "@/components/WhatsAppButton";
import JsonLd from "@/components/Seo/JsonLd";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/structuredData";
import { defaultRobots } from "@/lib/seoUtils";
import { siteUrl } from "@/lib/siteUrl";

const locale = "it";
const siteLocale = locale as SiteLocale;
const defaultLocale = config.defaultLocale as SiteLocale;

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchDato(LayoutDocument, { locale: siteLocale }, false);
  const globalSeo = data?._site?.globalSeo || null;
  const fallbackSeo = globalSeo?.fallbackSeo;
  const icon = toNextMetadata(data._site.faviconMetaTags);

  return {
    ...icon,
    metadataBase: new URL(siteUrl),
    title: fallbackSeo?.title,
    description: fallbackSeo?.description,
    robots: defaultRobots,
    alternates: {
      canonical: `${siteUrl}/`,
      languages: {
        it: `${siteUrl}/`,
        en: `${siteUrl}/en`,
        "x-default": `${siteUrl}/`,
      },
    },
    openGraph: {
      title: fallbackSeo?.title || undefined,
      description: fallbackSeo?.description || undefined,
      siteName: globalSeo?.siteName || undefined,
      images: fallbackSeo?.image?.url ? [fallbackSeo.image.url] : undefined,
      url: `${siteUrl}/`,
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fallbackSeo?.title || undefined,
      description: fallbackSeo?.description || undefined,
      images: fallbackSeo?.image?.url ? [fallbackSeo.image.url] : undefined,
    },
    verification: {
      other: {
        "facebook-domain-verification": "wmsy07pk585wh52j0ocsck94npupne",
      },
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled } = draftMode();

  const footerData = await fetchDato(
    FooterDocument,
    { locale: siteLocale, fallbackLocale: [defaultLocale] },
    isEnabled
  );
  const seoData = await fetchDato(
    LayoutDocument,
    { locale: siteLocale },
    false
  );

  const globalSeo = seoData?._site?.globalSeo || null;
  const organization = buildOrganizationJsonLd(footerData?.layout || {}, {
    siteName: globalSeo?.siteName,
    description: globalSeo?.fallbackSeo?.description,
    logoUrl: footerData?.layout?.footerLogo?.url,
    imageUrl: globalSeo?.fallbackSeo?.image?.url,
  });

  return (
    <html lang={locale} data-theme="custom">
      <body className={`md:min-h-screen relative`}>
        <div className="z-50 w-px bg-[#9E9A94]/40 xl:left-24 absolute left-3 top-0 bottom-0" />
        <div className="z-50 w-px bg-[#9E9A94]/40 absolute xl:right-24 right-3 left-auto top-0 bottom-0" />
        <SkipLinks locale={locale} />
        <main id="content">{children}</main>
        <Footer data={footerData} locale={siteLocale} />
        <WhatsAppButton />
        <JsonLd id="organization-jsonld" data={organization} />
        <JsonLd
          id="website-jsonld"
          data={buildWebSiteJsonLd(locale, globalSeo?.siteName)}
        />
      </body>
    </html>
  );
}
