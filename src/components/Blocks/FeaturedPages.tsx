import { PageRecord, SiteLocale } from "@/graphql/generated";
import { Maybe } from "graphql/jsutils/Maybe";
import { motion, Variants } from "framer-motion";
import CardPageBlock from "./CardPageBlock";

type Props = {
  title?: string;
  subtitle?: Maybe<string>;
  locale: SiteLocale;
  pages: PageRecord[];
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

const titleClass = "title";

const FeaturedPages = ({ title, subtitle, pages, locale }: Props) => {
  return (
    <div className="container">
      {(title || subtitle) && (
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.1 }}
          variants={variants}
        >
          {" "}
          {title && (
            <h2
              className={titleClass}
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}
          {subtitle && (
            <div className="" dangerouslySetInnerHTML={{ __html: subtitle }} />
          )}
        </motion.div>
      )}
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.1 }}
        variants={variants}
        className=""
      >
        {pages?.map((p: PageRecord, i: number) => (
          <div key={p.id} className="sticky top-0">
            <CardPageBlock i={i} data={p} locale={locale} />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default FeaturedPages;
