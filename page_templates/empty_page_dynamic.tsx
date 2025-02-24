import fetchDato from "@/lib/fetchDato";
import { draftMode } from "next/headers";
import { SiteLocale } from "@/graphql/generated";
import { notFound } from "next/navigation";

type Params = {
  params: {
    slug: string;
  };
};

const locale = "it";
const siteLocale = locale as SiteLocale;

export default async function EmptyPage({ params: { slug } }: Params) {
  const { isEnabled } = draftMode();

  return <div>SLUG = {slug}</div>;
}
