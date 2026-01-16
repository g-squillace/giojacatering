import {
  ElementsListRecord,
  EventRecord,
  PostRecord,
  SiteLocale,
} from "@/graphql/generated";
import { motion, Variants } from "framer-motion";
import InternalLink from "../Links/InternalLink";
import ButtonBlock from "./ButtonBlock";
import CardEventBlock from "../Event/CardEventBlock";
import CardBlogBlock from "../Blog/CardBlogBlock";

type PropsElementListBlock = {
  data: ElementsListRecord;
  locale: SiteLocale;
  lastPosts: PostRecord[];
  lastEvents: EventRecord[];
};

const ElementListBlock = ({
  data,
  locale,
  lastPosts,
  lastEvents,
}: PropsElementListBlock) => {
  const { itemsPrefix, itemsTitle, itemsButton, elements, automatic, model } =
    data;
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

  let results = automatic
    ? model === "post"
      ? [lastPosts]
      : [lastEvents]
    : [elements];

  const prefixClass = "prefix";
  const titleClass = "title";

  return (
    <div id="targetElement" className="grid gap-6 container">
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.1 }}
        variants={variants}
        className="grid gap-6"
      >
        {itemsPrefix && <div className={prefixClass}>{itemsPrefix}</div>}
        <h2
          className={titleClass}
          dangerouslySetInnerHTML={{ __html: itemsTitle }}
        />
        {itemsButton && (
          <InternalLink record={itemsButton?.page} locale={locale}>
            <ButtonBlock label={itemsButton?.label} />
          </InternalLink>
        )}
      </motion.div>
      <div className="md:grid-cols-2 lg:grid-cols-3 grid gap-6 xl:w-10/12 mx-auto">
        {results.flat().map((item, i: number) =>
          item._modelApiKey === "event" ? (
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: Math.min(0.1 * i, 1) }}
              variants={variants}
              key={item.id}
            >
              <CardEventBlock
                key={item.id}
                data={item as any}
                locale={locale}
                i={i}
              />
            </motion.div>
          ) : (
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: Math.min(0.1 * i, 1) }}
              variants={variants}
              key={item.id}
            >
              <CardBlogBlock data={item as PostRecord} locale={locale} i={i} />
            </motion.div>
          )
        )}
      </div>
    </div>
  );
};

export default ElementListBlock;
