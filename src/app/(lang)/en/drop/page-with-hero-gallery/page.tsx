import fetchDato from "@/lib/fetchDato";
import { draftMode } from "next/headers";
import { PageDocument, SiteLocale } from "@/graphql/generated";
import { notFound } from "next/navigation";
import GenericPage from "@/components/Templates/GenericPage";
import getSeoMeta from "@/lib/seoUtils";
import config from "@/data/config";
import { pickHrefs } from "@/lib/pickPageData";
import { hrefsProp } from "@/_types";
import Wrapper from "@/components/Layout/Wrapper";

const locale = "en";
const siteLocale = locale as SiteLocale;
const defaultLocale = config.defaultLocale as SiteLocale;
const pageSlug = "page-with-hero-gallery";

export async function generateMetadata() {
  const data = await fetchDato(
    PageDocument,
    {
      locale: siteLocale,
      fallbackLocale: [defaultLocale],
      slug: pageSlug,
    },
    false
  );
  const page: any = data?.page || null;
  const meta = getSeoMeta(page, locale);
  return meta;
}

export default async function Page() {
  const { isEnabled } = draftMode();
  const data = await fetchDato(
    PageDocument,
    {
      locale: siteLocale,
      fallbackLocale: [defaultLocale],
      slug: pageSlug,
    },
    isEnabled
  );
  if (!data?.page) {
    notFound();
  }
  const hrefs: hrefsProp = pickHrefs(data.page);

  return (
    <Wrapper hrefs={hrefs} locale={locale}>
      <GenericPage data={data} page={data.page} locale={siteLocale} />{" "}
    </Wrapper>
  );
}
