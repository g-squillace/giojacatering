import { draftMode } from "next/headers";
import config from "@/data/config";
import "@/styles/globals.css";
import { SiteLocale, MenuDocument, LayoutDocument } from "@/graphql/generated";
import HeaderRenderer from "@/components/Header/HeaderRenderer";
import fetchDato from "@/lib/fetchDato";
import resolveLink from "@/lib/resolveLink";
import Template from "./Template";

export default async function Wrapper({
  hrefs,
  locale,
  children,
  layout,
}: any) {
  const siteLocale = locale as SiteLocale;
  const defaultLocale = config.defaultLocale as SiteLocale;
  const { isEnabled } = draftMode();
  const menuData = await fetchDato(
    MenuDocument,
    {
      locale: siteLocale,
      fallbackLocale: [defaultLocale],
    },
    isEnabled
  );

  return (
    <>
      <HeaderRenderer
        layout={layout}
        hrefs={hrefs}
        data={menuData}
        locale={siteLocale}
      />
      <Template logo={menuData.layout.logoDark}>{children}</Template>
    </>
  );
}
