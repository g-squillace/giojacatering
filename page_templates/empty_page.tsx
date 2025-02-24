import fetchDato from "@/lib/fetchDato";
import { draftMode } from "next/headers";
import { LegalDocument, SiteLocale } from "@/graphql/generated";
import { notFound } from "next/navigation";

const locale = "it";
const siteLocale = locale as SiteLocale;

export default async function EmptyPage() {
  let slug = "##";
  return <div>:D</div>;
}
