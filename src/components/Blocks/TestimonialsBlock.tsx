import "swiper/css/bundle";
import {
  QuoteRecord,
  SiteLocale,
  TestimonialsBlockRecord,
} from "@/graphql/generated";
import { motion, Variants } from "framer-motion";

type PropsTestimonialsBlock = {
  data: TestimonialsBlockRecord;
  locale: SiteLocale;
};

const TestimonialsBlock = ({ data, locale }: PropsTestimonialsBlock) => {
  const { testimonials, textTestimonialsBlock, titleTestimonialsBlock } = data;
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
  return (
    <div className={`container`}>
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.1 }}
        variants={variants}
        className="grid gap-6"
      >
        {titleTestimonialsBlock && (
          <h2
            className="title"
            dangerouslySetInnerHTML={{ __html: titleTestimonialsBlock }}
          />
        )}

        {textTestimonialsBlock && (
          <div
            className=""
            dangerouslySetInnerHTML={{ __html: textTestimonialsBlock }}
          />
        )}
      </motion.div>
      <div className="grid gap-6 lg:grid-cols-3 mt-8">
        {testimonials.map((t: QuoteRecord, i: number) => {
          const { textQuote, whoQuote, roleQuote } = t;
          return (
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: Math.min(0.1 * i, 1) }}
              variants={variants}
              key={i}
            >
              <div className="grid gap-6 p-6 bg-secondary text-secondary-content">
                {textQuote && (
                  <h2
                    dangerouslySetInnerHTML={{ __html: textQuote }}
                    className="title-small"
                  />
                )}
                {whoQuote && (
                  <div className="grid gap-2 text-sm">
                    <div className="">{whoQuote}</div>
                    {roleQuote && <div className="">{roleQuote}</div>}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TestimonialsBlock;
