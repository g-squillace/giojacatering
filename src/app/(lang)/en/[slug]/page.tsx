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

type Params = {
  params: {
    slug: string;
  };
};

const locale = "en";
const siteLocale = locale as SiteLocale;
const defaultLocale = config.defaultLocale as SiteLocale;

export async function generateMetadata({ params }: any) {
  const { slug } = params;
  const data = await fetchDato(
    PageDocument,
    {
      locale: siteLocale,
      fallbackLocale: [defaultLocale],
      slug,
    },
    false
  );
  const page: any = data?.page || null;
  const meta = getSeoMeta(page, locale);
  return meta;
}

export default async function Page({ params: { slug } }: Params) {
  const { isEnabled } = draftMode();
  const data = await fetchDato(
    PageDocument,
    {
      locale: siteLocale,
      fallbackLocale: [defaultLocale],
      slug,
    },
    isEnabled
  );
  if (!data?.page) notFound();

  const hrefs: hrefsProp = pickHrefs(data.page);

  return (
    <Wrapper hrefs={hrefs} locale={locale}>
      <GenericPage data={data} page={data.page} locale={siteLocale} />
    </Wrapper>
  );
}
