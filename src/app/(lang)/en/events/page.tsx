import fetchDato from "@/lib/fetchDato";
import { draftMode } from "next/headers";
import { PageDocument, EventsDocument, SiteLocale } from "@/graphql/generated";
import { notFound } from "next/navigation";
import EventIndexPage from "@/components/Templates/EventsIndexPage";
import getSeoMeta from "@/lib/seoUtils";
import { pickHrefs } from "@/lib/pickPageData";
import { hrefsProp } from "@/_types";
import Wrapper from "@/components/Layout/Wrapper";

const locale = "en";
const siteLocale = locale as SiteLocale;
const slug = "events";

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
  let allEvents = [];
  let exitCondition = true;
  let page = 0;
  while (exitCondition) {
    const results = await fetchDato(
      EventsDocument,
      {
        locale: siteLocale,
        skip: page * 100,
      },
      isEnabled
    );
    if (results?.allEvents?.length > 0) {
      allEvents = [...allEvents, ...results.allEvents];
      page++;
    } else {
      exitCondition = false;
    }
  }
  list = allEvents;

  if (!data) notFound();

  const hrefs: hrefsProp = pickHrefs(data.page);
  return (
    <Wrapper hrefs={hrefs} locale={locale}>
      <EventIndexPage data={data} list={list} locale={siteLocale} />
    </Wrapper>
  );
}
