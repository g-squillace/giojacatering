"use client";
import Sections from "@/components/Sections";
import {
  EventRecord,
  PageQuery,
  PostRecord,
  SiteLocale,
} from "@/graphql/generated";
import { useHits } from "react-instantsearch";
import WhichHero from "@/components/Hero/WichHero";
import { convertToSlug } from "@/lib/convertToSlug";
import EventsGridRendererSearch from "../Event/EventsGridRendererSearch";

type GenericPageProps = {
  locale: SiteLocale;
  data: PageQuery;
};

export default function EventsSearch({ data, locale }: GenericPageProps) {
  const { hits } = useHits();

  return (
    <div>
      {data.page?.hero && (
        <WhichHero hero={data.page?.hero as any} locale={locale} />
      )}
      {data.page?.sections?.map((section) => {
        const sectionSpacing =
          section.style !== "base-100 text-base-content" ||
          "bg-base-200 text-base-content"
            ? "xl:mx-5"
            : "";
        return (
          <section
            key={section.id}
            className={`${section.style} ${sectionSpacing} standard-vertical-p scroll-mt-24 lg:scroll-mt-30`}
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

      <EventsGridRendererSearch
        hits={hits as any}
        lng={locale}
        isSearchResult={true}
      />
    </div>
  );
}
