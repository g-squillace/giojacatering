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
      // initial={{ height: "100vh" }}
      // animate={{ height: "90vh" }}
      transition={{ duration: 0.75, delay: 0.5 }}
      className="w-full mt-[72px] relative object-cover object-bottom"
    >
      <div className="relative bg-secondary text-secondary-content py-[120px]">
        <div className="container">
          <div className="lg:flex items-center">
            <div className="w-full lg:w-5/12">
              <div className="mb-14 lg:mb-0 grid gap-6">
                {heroTitle && <h1 className="title">{heroTitle}</h1>}
                {heroSubtitle && (
                  <div
                    dangerouslySetInnerHTML={{ __html: heroSubtitle }}
                    className="text"
                  />
                )}
                {link && (
                  <DynamicLink className={`group`} link={link} locale={locale}>
                    <ButtonBlock label={link.label} />
                  </DynamicLink>
                )}
              </div>
            </div>
            <div className="w-full h-80 px-4 lg:w-7/12 relative">
              {image && image.responsiveImage && (
                <SRCImage
                  className="absolute !w-full !h-full object-cover inset-0"
                  data={image.responsiveImage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RightImageHero;
