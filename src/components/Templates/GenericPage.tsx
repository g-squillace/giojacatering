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
  const logoLeftY = useTransform(scrollY, [0, 4000], [0, -1200]);
  const logoLeftRotate = useTransform(scrollY, [0, 4000], [0, -15]);
  const logoRightY = useTransform(scrollY, [0, 4000], [200, -800]);
  const logoRightRotate = useTransform(scrollY, [0, 4000], [0, 20]);

  if (!page) return null;
  const navItems = [];
  const sections = page?.sections;

  if (sections?.length > 0 && !page.isHome && !page.isIndex) {
    sections.forEach((s: SectionWrapRecord) => {
      if (s.label) navItems.push(s.label);
    });
  }

  return (
    <div className="relative overflow-hidden">
      {page?.hero && <WhichHero hero={page?.hero as any} locale={locale} />}
      {navItems.length > 0 && <MenuInternal navItems={navItems} />}

      {/* Logo decorativi che si ripetono lungo tutta la pagina */}
      <div
        className="absolute inset-x-0 top-[90vh] bottom-0 z-[2] pointer-events-none overflow-hidden"
        aria-hidden
      >
        <motion.div
          style={{ y: logoLeftY, rotate: logoLeftRotate }}
          className="absolute top-[0%] left-[3%] flex flex-col gap-[80vh]"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <Image
              key={`left-${i}`}
              src="/assets/logo.svg"
              alt=""
              width={200}
              height={200}
              className="w-[45vw] h-[45vw] opacity-[0.6]"
            />
          ))}
        </motion.div>
        <motion.div
          style={{ y: logoRightY, rotate: logoRightRotate }}
          className="absolute top-[60vh] right-[3%] flex flex-col gap-[80vh]"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <Image
              key={`right-${i}`}
              src="/assets/logo.svg"
              alt=""
              width={200}
              height={200}
              className="w-[45vw] h-[45vw] opacity-[0.6]"
            />
          ))}
        </motion.div>
      </div>

      {sections?.map((section: SectionWrapRecord) => {
        return (
          <section
            key={section.id}
            className={`${section.style} py-px -mt-[2px] relative`}
            id={section.label ? convertToSlug(section.label) : null}
          >
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
