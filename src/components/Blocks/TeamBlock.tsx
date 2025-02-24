"use client";
import { motion, Variants } from "framer-motion";
import { SRCImage } from "react-datocms";
import {
  SiteLocale,
  TeamBlockRecord,
  TeamMemberRecord,
} from "@/graphql/generated";

interface TeamBlockProps {
  content: TeamBlockRecord;
  locale: SiteLocale;
  colors: String;
}

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

export default function TeamBlock({ content, locale, colors }: TeamBlockProps) {
  const { title, subtitle, teamMembers } = content;
  return (
    <div className="container">
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.1 }}
        variants={variants}
        className="grid gap-6"
      >
        {title && <h2 className="title">{title}</h2>}
        {subtitle && (
          <div className="" dangerouslySetInnerHTML={{ __html: subtitle }} />
        )}
      </motion.div>
      <div className="gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid mt-12">
        {teamMembers.map((tm: TeamMemberRecord, i: number) => (
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: Math.min(Math.min(0.1 * i, 1), 1) }}
            variants={variants}
            key={tm.id}
            className="gap-6 grid"
          >
            <div className="bg-secondary text-secondary-content">
              <div className="relative h-[300px]">
                <SRCImage
                  data={tm.imageMember.responsiveImage}
                  className="!max-w-none !w-full !h-full absolute inset-0 object-cover"
                />
              </div>
              <div className="grid gap-2 p-6">
                <div className="title-small">{tm.nameMember}</div>
                <div className="prefix">{tm.descriptionMember}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
