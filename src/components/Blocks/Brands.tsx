import { BrandRecord, SiteLocale } from "@/graphql/generated";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import StructuredContent from "../Layout/StructuredContent";

type Props = {
  brandShowcase: BrandRecord[];
  title: string;
  text: string;
  locale: SiteLocale;
};

const Brands = ({ brandShowcase, title, text, locale }: Props) => {
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
    <div className="container">
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.1 }}
        variants={variants}
        className="justify-center space-y-6 xl:space-y-10"
      >
        <div className="space-y-6 xl:space-y-10">
          <h2
            className="title lg:text-center max-w-screen-md mx-auto"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </div>
        <div className="space-y-6 xl:space-y-10">
          {text && (
            <div
              className="lg:text-center max-w-prose xl:text-md text-base-100 mx-auto"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}
        </div>
      </motion.div>
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.1 }}
        variants={variants}
        className="grid grid-cols-2 gap-2 lg:grid-cols-6 items-center justify-center mt-12 xl:mt-20 lg:w-10/12 lg:mx-auto"
      >
        {brandShowcase.map((brand) => (
          <SingleBrand key={brand.id} brand={brand} />
        ))}
      </motion.div>
    </div>
  );
};

export default Brands;

const SingleBrand = ({ brand }: { brand: BrandRecord }) => {
  const { brandUrl, brandLogo, brandName } = brand;

  return (
    <div className="relative h-32 w-full">
      <Image
        src={brandLogo.url}
        alt={brandName}
        fill
        className="!object-contain !w-[90%] !h-[90%] absolute !left-1/2 !top-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
};
