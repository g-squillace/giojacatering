"use client";
import Sections from "@/components/Sections";
import {
  EventRecord,
  PageQuery,
  PostRecord,
  ProductRecord,
  SiteLocale,
} from "@/graphql/generated";
import ProductGridRenderer from "@/components/Product/ProductGridRenderer";
import WhichHero from "@/components/Hero/WichHero";
import { convertToSlug } from "@/lib/convertToSlug";

type GenericPageProps = {
  locale: SiteLocale;
  data: PageQuery;
  list: ProductRecord[];
};

export default function ProductsIndexPage({
  data,
  list,
  locale,
}: GenericPageProps) {
  const page = data?.page;
  if (!page) return null;

  return (
    <div>
      {page?.hero && <WhichHero hero={page?.hero as any} locale={locale} />}
      {data.page?.sections?.map((section) => {
        return (
          <section
            key={section.id}
            className={`${section.style} standard-vertical-p scroll-mt-24 lg:scroll-mt-30 standard-vertical-gap`}
            id={section.label ? convertToSlug(section.label) : null}
          >
            {section.blocks && (
              <Sections
                section={section}
                locale={locale}
                lastPosts={data.allPosts as PostRecord[]}
                lastEvents={data.allEvents as EventRecord[]}
              />
            )}
          </section>
        );
      })}
      <ProductGridRenderer data={list} locale={locale} />
    </div>
  );
}
