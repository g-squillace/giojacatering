import fetchDato from "@/lib/fetchDato";
import { draftMode } from "next/headers";
import {
  PageDocument,
  SiteLocale,
  PostsDocument,
  TagRecord,
} from "@/graphql/generated";
import { notFound } from "next/navigation";
import getSeoMeta from "@/lib/seoUtils";
import PostsIndexPage from "@/components/Templates/PostsIndexPage";
import { pickHrefs } from "@/lib/pickPageData";
import { hrefsProp } from "@/_types";
import Wrapper from "@/components/Layout/Wrapper";

const locale = "it";
const siteLocale = locale as SiteLocale;
const slug = "##";

export async function generateMetadata() {
  const siteLocale = locale as SiteLocale;
  const data = await fetchDato(
    PageDocument,
    { locale: siteLocale, slug },
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
      fallbackLocale: [siteLocale],
      slug,
    },
    isEnabled
  );

  let list = [];
  let allPosts = [];
  let exitCondition = true;
  let page = 0;
  while (exitCondition) {
    const results = await fetchDato(
      PostsDocument,
      {
        locale: siteLocale,
        skip: page * 100,
      },
      isEnabled
    );
    if (results?.allPosts?.length > 0) {
      allPosts = [...allPosts, ...results.allPosts];
      page++;
    } else {
      exitCondition = false;
    }
  }
  list = allPosts;

  if (!data) notFound();

  const hrefs: hrefsProp = pickHrefs(data.page);
  return (
    <Wrapper hrefs={hrefs} locale={locale}>
      <PostsIndexPage data={data} list={list} locale={siteLocale} />
    </Wrapper>
  );
}
