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
    ? "mx-auto prefix xl:max-w-[650px]"
    : "prefix";
  const classTitle = displayOptions.includes("center")
    ? "title max-w-screen-md mx-auto"
    : "title max-w-screen-md";

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
              : "lg:flex lg:gap-12 xl:w-10/12 lg:mx-auto"
          } space-y-6 xl:space-y-10`}
        >
          <div className="space-y-6 xl:space-y-10">
            {labelTextBlock && (
              <div className={classPrefix}>{labelTextBlock}</div>
            )}
            <h2
              className={classTitle}
              dangerouslySetInnerHTML={{ __html: titleTextBlock }}
            />
          </div>
          <div className="space-y-6 xl:space-y-10">
            {textTextBlock && (
              <div
                className={`max-w-prose xl:text-md text-base-100 ${
                  displayOptions.includes("center") ? "mx-auto" : "lg:pt-9"
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
          </div>
        </motion.div>
      </div>
    </div>
  );
}
