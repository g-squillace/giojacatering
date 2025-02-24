"use client";
import { PageQuery, SiteLocale, EventRecord } from "@/graphql/generated";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch";
import EventsSearch from "../Search/EventsSearch";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "",
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || ""
);

type GenericPageProps = {
  locale: SiteLocale;
  data: PageQuery;
  list?: EventRecord[];
};

export default function EventIndexPage({ data, locale }: GenericPageProps) {
  return (
    <InstantSearch searchClient={searchClient} indexName={`events_${locale}`}>
      <EventsSearch data={data} locale={locale} />
    </InstantSearch>
  );
}
