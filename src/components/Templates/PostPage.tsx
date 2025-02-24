"use client";
import { SRCImage } from "react-datocms";
import { PostQuery, SiteLocale } from "@/graphql/generated";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import CustomStructuredText from "../Layout/CustomStructuredText";

type Props = {
  data: PostQuery;
  locale: SiteLocale;
};

const PostPage = ({ data, locale }: Props) => {
  const { tags, title, abstract, blogImage } = data.post;
  if (!data.post) notFound();
  return (
    <section className="">
      <div className="">
        <div className="standard-vertical-m container">
          <div className="mb-5 xl:col-span-2 xl:col-start-2">
            {tags.length > 0 &&
              tags
                .map((t) => (
                  <div className="prefix" key={t.id} id={t.id}>
                    {t.tag}
                  </div>
                ))
                .map((element, index, array) => {
                  return (
                    <Fragment key={element.key}>
                      {element}
                      {index !== array.length - 1 && ", "}
                    </Fragment>
                  );
                })}
          </div>
          <h1 className="title">{title}</h1>
          {abstract && (
            <h2
              dangerouslySetInnerHTML={{ __html: abstract }}
              className="pt-4 md:text-md md:pt-6"
            />
          )}
          <div className="aspect-square mt-8 xl:col-start-2 xl:col-span-10 relative md:aspect-[2/1] md:mt-20">
            <SRCImage
              className="absolute w-full h-full object-cover inset-0"
              data={blogImage.responsiveImage}
            />
          </div>
        </div>
        <div className="flex items-center overflow-hidden">
          <div className="formatted standard-vertical-m container inline-block w-auto">
            <CustomStructuredText record={data.post.content} locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostPage;
