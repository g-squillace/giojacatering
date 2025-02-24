import { FeatureRecord } from "@/graphql/generated";
import SingleFeature from "@/components/Blocks/SingleFeature";
import { Maybe } from "graphql/jsutils/Maybe";
import { motion, Variants } from "framer-motion";

type Props = {
  features: FeatureRecord[];
  featuresHeader: string;
  featuresSubheader: Maybe<string>;
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

const FeaturesList = ({
  features,
  featuresHeader,
  featuresSubheader,
}: Props) => {
  return (
    <div className="container">
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.1 }}
        variants={variants}
        className="grid gap-6"
      >
        {featuresHeader && <h2 className="title">{featuresHeader}</h2>}
        {featuresSubheader && (
          <div
            className=""
            dangerouslySetInnerHTML={{ __html: featuresSubheader }}
          />
        )}
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {features.map((feature: FeatureRecord, i: number) => (
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: Math.min(0.1 * i, 1) }}
            variants={variants}
            key={i}
          >
            <SingleFeature feature={feature} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesList;
