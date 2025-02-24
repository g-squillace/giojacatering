"use client";

import Sections from "@/components/Sections";
import {
  EventRecord,
  PageQuery,
  PostRecord,
  SectionWrapRecord,
  SiteLocale,
} from "@/graphql/generated";
import { convertToSlug } from "@/lib/convertToSlug";
import WhichHero from "@/components/Hero/WichHero";
import MenuInternal from "@/components/Page/MenuInternal";

type GenericPageProps = {
  locale: SiteLocale;
  data: PageQuery;
  page?: any;
};

export default function GenericPage({ data, page, locale }: GenericPageProps) {
  if (!page) return null;
  const navItems = [];
  const sections = page?.sections;

  if (sections?.length > 0 && !page.isHome && !page.isIndex) {
    sections.forEach((s: SectionWrapRecord) => {
      if (s.label) navItems.push(s.label);
    });
  }

  return (
    <div>
      {page?.hero && <WhichHero hero={page?.hero as any} locale={locale} />}
      {navItems.length > 0 && <MenuInternal navItems={navItems} />}
      {sections?.map((section: SectionWrapRecord) => {
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
    </div>
  );
}
