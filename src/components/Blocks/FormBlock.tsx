import { FormBlockRecord, SiteLocale } from "@/graphql/generated";
import Form from "@/components/Form/Form";
import { motion, Variants } from "framer-motion";

type PropsFormBlock = {
  data: FormBlockRecord;
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

const FormBlock = ({ data, locale }: PropsFormBlock) => {
  const { titleForm, textForm } = data;
  return (
    <>
      <div className="container">
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.1 }}
          variants={variants}
        >
          <div className="grid gap-6">
            {titleForm && <div className="title">{titleForm}</div>}
            {textForm && (
              <div
                className="text"
                dangerouslySetInnerHTML={{ __html: textForm }}
              />
            )}
            <Form locale={locale} />
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default FormBlock;
