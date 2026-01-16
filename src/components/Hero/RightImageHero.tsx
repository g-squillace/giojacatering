"use client";

import { HeroSectionModelLinkField, SiteLocale } from "@/graphql/generated";
import { Maybe } from "graphql/jsutils/Maybe";
import { SRCImage } from "react-datocms";
import { motion } from "framer-motion";
import DynamicLink from "@/components/Links/DynamicLink";
import ButtonBlock from "@/components/Blocks/ButtonBlock";

type Props = {
  heroTitle: string;
  heroSubtitle: Maybe<string>;
  image: any;
  link: Maybe<HeroSectionModelLinkField> | undefined;
  locale: SiteLocale;
};

const RightImageHero = ({
  heroTitle,
  heroSubtitle,
  image,
  link,
  locale,
}: Props) => {
  return (
    <motion.div
      transition={{ duration: 0.75, delay: 0.5 }}
      className="w-full relative object-cover object-bottom"
    >
      <div className="relative pt-[120px]">
        <div className="container">
          <div className="space-y-12 lg:pt-12">
            <div className="w-full h-80 px-4 relative mx-auto">
              {image && image.responsiveImage && (
                <SRCImage
                  className="absolute !w-full !h-full object-cover inset-0 !max-w-none"
                  data={image.responsiveImage}
                />
              )}
            </div>
            <div className="w-full lg:w-5/12 mx-auto">
              <div className="mb-14 lg:mb-0 grid gap-6 text-center">
                {heroTitle && (
                  <h1 className="title xl:text-5xl">{heroTitle}</h1>
                )}
                {heroSubtitle && (
                  <div
                    dangerouslySetInnerHTML={{ __html: heroSubtitle }}
                    className="text xl:text-md"
                  />
                )}
                {link && (
                  <DynamicLink className={`group`} link={link} locale={locale}>
                    <ButtonBlock label={link.label} />
                  </DynamicLink>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RightImageHero;
