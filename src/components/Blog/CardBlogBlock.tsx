"use client";
import { SRCImage } from "react-datocms";
import translate from "@/labels";
import InternalLink from "../Links/InternalLink";
import { PostRecord, SiteLocale } from "@/graphql/generated";
import ButtonBlock from "../Blocks/ButtonBlock";
import { getDate } from "@/lib/getDate";

type PropsCardBlog = {
  locale: SiteLocale;
  data: PostRecord;
  i: number;
};

const CardBlogBlock = ({ data, locale, i }: PropsCardBlog) => {
  const { blogImage, title, tags, date } = data;

  const titleClass = "title-small xl:text-2xl";

  return (
    <InternalLink className="group" record={data} locale={locale} title={title}>
      <div className="bg-secondary text-secondary-content duration-300 relative">
        <SRCImage data={blogImage.responsiveImage} />
        <div className="p-6 space-y-4 2xl:p-12">
          {tags?.length > 0 && (
            <div className="prefix flex gap-1 flex-wrap">
              {getDate(date, locale)} <span className="text-base-200">/</span>
              {tags[0].tag}
            </div>
          )}
          <h2 className={titleClass}>{title}</h2>
          <div className="pt-6">
            <ButtonBlock label={translate("read", locale)} />
          </div>
        </div>
      </div>
    </InternalLink>
  );
};

export default CardBlogBlock;
