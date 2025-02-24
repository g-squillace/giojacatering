import fetchDato from "@/lib/fetchDato";
import { draftMode } from "next/headers";
import { PostDocument, SiteLocale } from "@/graphql/generated";
import { notFound } from "next/navigation";
import PostPage from "@/components/Templates/PostPage";
import getSeoMeta from "@/lib/seoUtils";
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

export async function generateMetadata({ params }: Params) {
  const { slug } = params;
  const data = await fetchDato(
    PostDocument,
    { locale: siteLocale, slug },
    false
  );
  const page: any = data?.post || null;
  const meta = getSeoMeta(page, locale);
  return meta;
}

export default async function Page({ params: { slug } }: Params) {
  const { isEnabled } = draftMode();
  const data = await fetchDato(
    PostDocument,
    {
      locale: siteLocale,
      fallbackLocale: [siteLocale],
      slug,
    },
    isEnabled
  );
  if (!data) notFound();

  const hrefs: hrefsProp = pickHrefs(data.post);

  return (
    <Wrapper hrefs={hrefs} locale={locale}>
      <PostPage data={data} locale={siteLocale} />
    </Wrapper>
  );
}
