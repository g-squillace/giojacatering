"use client";

import { HeroSectionModelLinkField, SiteLocale } from "@/graphql/generated";
import { Maybe } from "graphql/jsutils/Maybe";
import { motion, Variants } from "framer-motion";
import DynamicLink from "@/components/Links/DynamicLink";
import ButtonBlock from "@/components/Blocks/ButtonBlock";

type Props = {
  heroTitle: string;
  heroSubtitle: Maybe<string>;
  link: Maybe<HeroSectionModelLinkField> | undefined;
  locale: SiteLocale;
};

const variants: Variants = {
  offscreen: {
    opacity: 0,
    y: 100,
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
    },
  },
};

const TextHero = ({ heroTitle, heroSubtitle, link, locale }: Props) => {
  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.1 }}
      variants={variants}
      className=""
    >
      <div className="bg-secondary text-secondary-content py-40 mt-[72px] md:mt-[104px]">
        <div className="container">
          <div className="grid gap-8 lg:w-5/12">
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
      </div>
    </motion.div>
  );
};

export default TextHero;
