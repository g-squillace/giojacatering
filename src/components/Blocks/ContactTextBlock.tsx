import { ContactTextBlockRecord, SiteLocale } from "@/graphql/generated";
import { motion, Variants } from "framer-motion";

type PropsContactTextBlock = {
  data: ContactTextBlockRecord;
  locale: SiteLocale;
};

const ContactTextBlock = ({ data, locale }: PropsContactTextBlock) => {
  const { prefix, titleContactBlock, textContactBlock, blocks } = data;
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
      >
        <div className="grid gap-6">
          {prefix && <div className="prefix">{prefix}</div>}
          {titleContactBlock && (
            <h2
              className="title"
              dangerouslySetInnerHTML={{ __html: titleContactBlock }}
            />
          )}
          {textContactBlock && (
            <h3
              className=""
              dangerouslySetInnerHTML={{ __html: textContactBlock }}
            />
          )}
        </div>
        <div className="grid gap-10 mt-8 lg:grid-cols-3 items-start">
          {blocks.map((b) => (
            <div className="bg-secondary text-secondary-content p-8" key={b.id}>
              <strong dangerouslySetInnerHTML={{ __html: b.titleSimple }} />
              <div
                className=""
                dangerouslySetInnerHTML={{ __html: b.textSimple }}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ContactTextBlock;
