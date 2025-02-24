import fetchDato from "@/lib/fetchDato";
import { draftMode } from "next/headers";
import { PostDocument, SiteLocale } from "@/graphql/generated";
import { notFound } from "next/navigation";
import PostPage from "@/components/Templates/PostPage";
import getSeoMeta from "@/lib/seoUtils";
import { pickHrefs } from "@/lib/pickPageData";
import { hrefsProp } from "@/_types";
import Wrapper from "@/components/Layout/Wrapper";

const locale = "it";
const siteLocale = locale as SiteLocale;
const slug = "##";

export async function generateMetadata() {
  const siteLocale = locale as SiteLocale;
  const data = await fetchDato(
    PostDocument,
    { locale: siteLocale, slug },
    false
  );
  const page: any = data?.post || null;
  const meta = getSeoMeta(page, locale);
  return meta;
}

export default async function Page() {
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
