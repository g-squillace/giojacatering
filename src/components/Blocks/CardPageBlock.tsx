"use client";
import { SRCImage } from "react-datocms";
import { PageRecord, SiteLocale } from "@/graphql/generated";
import InternalLink from "../Links/InternalLink";
import ButtonBlock from "./ButtonBlock";
import translate from "@/labels";

type PropsCardPost = {
  locale: SiteLocale;
  data: PageRecord;
  i: number;
};

const CardPageBlock = ({ data, locale, i }: PropsCardPost) => {
  const { previewImage, label, abstract } = data;
  // const titleClass = "title-small";
  const titleClass = "text-white text-2xl font-serif";

  return (
    <InternalLink className="group" record={data} locale={locale} title={label}>
      <div className="duration-300 relative">
        <SRCImage data={previewImage.responsiveImage} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center p-4 grid gap-6">
          <h2 className={titleClass}>{label}</h2>
          {abstract && (
            <div dangerouslySetInnerHTML={{ __html: abstract }} className="" />
          )}
          <div className="inline-block">
            <ButtonBlock label={translate("read", locale)} />
          </div>
        </div>
      </div>
    </InternalLink>
  );
};

export default CardPageBlock;
