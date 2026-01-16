"use client";

import Sections from "@/components/Sections";
import {
  EventRecord,
  PageQuery,
  PostRecord,
  SectionWrapRecord,
  SiteLocale,
} from "@/graphql/generated";
import { convertToSlug } from "@/lib/convertToSlug";
import WhichHero from "@/components/Hero/WichHero";
import MenuInternal from "@/components/Page/MenuInternal";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

type GenericPageProps = {
  locale: SiteLocale;
  data: PageQuery;
  page?: any;
};

export default function GenericPage({ data, page, locale }: GenericPageProps) {
  const { scrollY } = useScroll();
  const logoY = useTransform(scrollY, [0, 2000], [0, 250]);

  if (!page) return null;
  const navItems = [];
  const sections = page?.sections;

  if (sections?.length > 0 && !page.isHome && !page.isIndex) {
    sections.forEach((s: SectionWrapRecord) => {
      if (s.label) navItems.push(s.label);
    });
  }

  return (
    <div>
      {page?.hero && <WhichHero hero={page?.hero as any} locale={locale} />}
      {navItems.length > 0 && <MenuInternal navItems={navItems} />}
      {sections?.map((section: SectionWrapRecord, index: number) => {
        return (
          <section
            key={section.id}
            className={`${section.style} py-px -mt-[2px] relative`}
            id={section.label ? convertToSlug(section.label) : null}
          >
            {index === 0 && (
              <motion.div
                style={{
                  y: logoY,
                  x: "-50%",
                }}
                className="absolute z-0 top-20 left-1/2 w-[80vw] h-[80vw]"
              >
                <Image
                  src="/assets/logo.svg"
                  alt="Gioja Catering"
                  width={200}
                  height={200}
                  className="w-full h-full"
                />
              </motion.div>
            )}
            {section.blocks && (
              <Sections
                section={section}
                locale={locale}
                lastPosts={data.allPosts as PostRecord[]}
                lastEvents={data.allEvents as EventRecord[]}
              />
            )}
          </section>
        );
      })}
    </div>
  );
}
