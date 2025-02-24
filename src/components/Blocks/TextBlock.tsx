"use client";
import { motion, Variants } from "framer-motion";
import StructuredContent from "../Layout/StructuredContent";
import ButtonBlock from "./ButtonBlock";
import DynamicLink from "../Links/DynamicLink";
import { TextBlockRecord, SiteLocale } from "../../graphql/generated";

type Props = {
  data: TextBlockRecord;
  locale: SiteLocale;
  bg: string;
};

export default function TextBlock({ data, locale, bg }: Props) {
  const {
    displayOptions,
    labelTextBlock,
    titleTextBlock,
    textTextBlock,
    linkTextBlock,
  } = data;

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

  const classPrefix = displayOptions.includes("center")
    ? "mx-auto prefix"
    : "prefix";
  const classTitle = "title max-w-screen-md";

  return (
    <div className={`text-${displayOptions}`}>
      <div className={`container`}>
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.1 }}
          variants={variants}
          className={`${
            displayOptions.includes("center")
              ? "justify-center"
              : displayOptions.includes("right")
              ? "justify-end"
              : ""
          } grid gap-6`}
        >
          {labelTextBlock && (
            <div className={classPrefix}>{labelTextBlock}</div>
          )}
          <h2
            className={classTitle}
            dangerouslySetInnerHTML={{ __html: titleTextBlock }}
          />
          {textTextBlock && (
            <div
              className={`max-w-prose ${
                displayOptions.includes("center") ? "mx-auto" : ""
              }`}
            >
              <StructuredContent data={textTextBlock} locale={locale} />
            </div>
          )}
          {linkTextBlock && (
            <DynamicLink
              link={linkTextBlock}
              locale={locale}
              className={`block group`}
            >
              <ButtonBlock label={linkTextBlock.label} />
            </DynamicLink>
          )}
        </motion.div>
      </div>
    </div>
  );
}
