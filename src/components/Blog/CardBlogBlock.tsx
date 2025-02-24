"use client";
import { SRCImage } from "react-datocms";
import translate from "@/labels";
import InternalLink from "../Links/InternalLink";
import { PostRecord, SiteLocale } from "@/graphql/generated";
import ButtonBlock from "../Blocks/ButtonBlock";

type PropsCardBlog = {
  locale: SiteLocale;
  data: PostRecord;
  i: number;
};

const CardBlogBlock = ({ data, locale, i }: PropsCardBlog) => {
  const { blogImage, title, tags } = data;

  const titleClass = "title-small";

  return (
    <InternalLink className="group" record={data} locale={locale} title={title}>
      <div className="p-4 bg-secondary text-secondary-content duration-300 relative">
        <SRCImage data={blogImage.responsiveImage} />
        <div className="text-center p-4 grid gap-6">
          {tags?.length > 0 && <div className="prefix">{tags[0].tag}</div>}
          <h2 className={titleClass}>{title}</h2>
          <div className="inline-block">
            <ButtonBlock label={translate("read", locale)} />
          </div>
        </div>
      </div>
    </InternalLink>
  );
};

export default CardBlogBlock;
