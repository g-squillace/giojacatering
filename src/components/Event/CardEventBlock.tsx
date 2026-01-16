"use client";
import { SRCImage } from "react-datocms";
import InternalLink from "../Links/InternalLink";
import { EventRecord, SiteLocale } from "@/graphql/generated";
import translate from "@/labels";
import { getDate } from "@/lib/getDate";
import ButtonBlock from "@/components/Blocks/ButtonBlock";

type PropsCardEvent = {
  locale: SiteLocale;
  data: EventRecord;
  i: number;
  isSearchResult?: boolean;
};

const prefixClass = "prefix";
const titleClass = "title";

const CardEventBlock = ({ data, locale }: PropsCardEvent) => {
  const { eventImage, title, tags, dateEndEvent, dateStartEvent } = data || {};
  return;
  return (
    <InternalLink className="group" record={data} locale={locale} title={title}>
      <div className="p-4 bg-secondary text-secondary-content duration-300 relative">
        <SRCImage data={eventImage.responsiveImage} />
        <div className="text-center p-4 grid gap-6">
          <div className="font-serif uppercase"></div>
          {tags?.length > 0 && <div className={prefixClass}>{tags[0].tag}</div>}
          <h2 className={titleClass}>{title}</h2>
          <div className="inline-block">
            <ButtonBlock label={translate("read", locale)} />
          </div>
        </div>
      </div>
    </InternalLink>
  );
};

export default CardEventBlock;
