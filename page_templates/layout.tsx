import { draftMode } from "next/headers";
import { toNextMetadata } from "react-datocms";
import config from "@/data/config";
import "@/styles/globals.css";
import {
  FooterDocument,
  SiteLocale,
  MenuDocument,
  LayoutDocument,
} from "@/graphql/generated";
import Footer from "@/components/Footer";
import fetchDato from "@/lib/fetchDato";
import myFont from "@/lib/loadCustomFont";
import SkipLinks from "@/components/Layout/SkipLinks";

const locale = "it";
const siteLocale = locale as SiteLocale;
const defaultLocale = config.defaultLocale as SiteLocale;

export async function generateMetadata() {
  const siteLocale = locale as SiteLocale;
  const data = await fetchDato(LayoutDocument, { locale: siteLocale }, false);
  const globalSeo = data?._site?.globalSeo || null;
  const fallbackSeo = globalSeo?.fallbackSeo;
  const icon = toNextMetadata(data._site.faviconMetaTags);
  const metaObject = {
    ...icon,
    title: fallbackSeo?.title,
    description: fallbackSeo?.description,
    openGraph: {
      title: fallbackSeo?.title,
      description: fallbackSeo?.description,
      siteName: globalSeo?.siteName,
      images: fallbackSeo?.image,
      locale,
      type: "website",
    },
  };
  return metaObject;
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
  const menuData = await fetchDato(
    MenuDocument,
    {
      locale: siteLocale,
      fallbackLocale: [defaultLocale],
    },
    isEnabled
  );

  return (
    <html lang={locale} data-theme="custom">
      <body className={`md:min-h-screen relative`}>
        <div className="z-50 w-px bg-[#9E9A94]/40 xl:left-24 absolute left-3 top-0 bottom-0" />
        <div className="z-50 w-px bg-[#9E9A94]/40 absolute xl:right-24 right-3 left-auto top-0 bottom-0" />
        <SkipLinks locale={locale} />
        <main id="content">{children}</main>
        <Footer data={footerData} locale={siteLocale} />
      </body>
    </html>
  );
}
