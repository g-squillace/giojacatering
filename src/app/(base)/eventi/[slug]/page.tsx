import fetchDato from "@/lib/fetchDato";
import { draftMode } from "next/headers";
import { PostDocument, SiteLocale } from "@/graphql/generated";
import { notFound } from "next/navigation";
import PostPage from "@/components/Templates/PostPage";
import getSeoMeta from "@/lib/seoUtils";
import config from "@/data/config";
import { pickHrefs } from "@/lib/pickPageData";
import { hrefsProp } from "@/_types";
import Wrapper from "@/components/Layout/Wrapper";
import JsonLd from "@/components/Seo/JsonLd";
import resolveLink from "@/lib/resolveLink";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/structuredData";

type Params = {
  params: {
    slug: string;
  };
};

const locale = "it";
const siteLocale = locale as SiteLocale;
const defaultLocale = config.defaultLocale as SiteLocale;

export async function generateMetadata({ params: { slug } }: Params) {
  const data = await fetchDato(
    PostDocument,
    { locale: siteLocale, fallbackLocale: [defaultLocale], slug },
    false
  );
  const page = data?.post || null;
  return getSeoMeta(page, locale);
}

export default async function Page({ params: { slug } }: Params) {
  const { isEnabled } = draftMode();
  const data = await fetchDato(
    PostDocument,
    { locale: siteLocale, fallbackLocale: [defaultLocale], slug },
    isEnabled
  );
  if (!data?.post) notFound();

  const hrefs: hrefsProp = pickHrefs(data.post);
  const path = resolveLink({
    slugs: data.post.slugs,
    _modelApiKey: data.post._modelApiKey,
    locale,
  });

  return (
    <Wrapper hrefs={hrefs} locale={locale}>
      <PostPage data={data} locale={siteLocale} />
      <JsonLd
        id="article-jsonld"
        data={buildArticleJsonLd({
          title: data.post.title || "",
          description: data.post.abstract,
          imageUrl: data.post.blogImage?.responsiveImage?.src,
          publishedAt: data.post._publishedAt,
          updatedAt: data.post.date,
          path,
          locale,
        })}
      />
      <JsonLd
        id="breadcrumb-jsonld"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: data.post.title || "", path },
        ])}
      />
    </Wrapper>
  );
}
