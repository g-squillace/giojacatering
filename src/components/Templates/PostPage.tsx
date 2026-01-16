"use client";
import { SRCImage } from "react-datocms";
import { PostQuery, SiteLocale } from "@/graphql/generated";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import CustomStructuredText from "../Layout/CustomStructuredText";
import { motion } from "framer-motion";
import { getDate } from "@/lib/getDate";

type Props = {
  data: PostQuery;
  locale: SiteLocale;
};

const PostPage = ({ data, locale }: Props) => {
  const { tags, date, title, abstract, blogImage } = data.post;
  if (!data.post) notFound();
  return (
    <section className="">
      <motion.div
        transition={{ duration: 0.75, delay: 0.5 }}
        className="w-full relative object-cover object-bottom"
      >
        <div className="relative pt-[120px]">
          <div className="container">
            <div className="space-y-12 lg:pt-12">
              <div className="w-full xl:h-80 h-40 px-4 relative mx-auto">
                {blogImage && blogImage.responsiveImage && (
                  <SRCImage
                    className="absolute !w-full !h-full object-cover inset-0 !max-w-none"
                    data={blogImage.responsiveImage}
                  />
                )}
              </div>
              {tags.map((tag, i) => (
                <div key={i} className="flex gap-4 flex-wrap justify-center">
                  <div className="px-4 py-2 border text-sm uppercase tracking-widest border-base-content/30  text-base-content inline-block">
                    {tag.tag}
                  </div>
                </div>
              ))}
              <div className="mx-auto text-xs uppercase tracking-widest text-base-content text-center">
                {getDate(date, locale)}
              </div>
              <div className="w-full lg:w-5/12 mx-auto">
                <div className="mb-14 lg:mb-0 grid gap-6 text-center">
                  {title && <h1 className="title xl:text-5xl">{title}</h1>}
                  {abstract && (
                    <div
                      dangerouslySetInnerHTML={{ __html: abstract }}
                      className="text xl:text-md"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="flex items-center overflow-hidden">
        <div className="formatted xl:w-10/12 standard-vertical-m container inline-block">
          <CustomStructuredText record={data.post.content} locale={locale} />
        </div>
      </div>
    </section>
  );
};

export default PostPage;
