import {
  HeroSectionModelLinkField,
  ImageAltTitleFileField,
  SiteLocale,
} from "@/graphql/generated";
import { Maybe } from "graphql/jsutils/Maybe";
import { SRCImage } from "react-datocms";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import DynamicLink from "@/components/Links/DynamicLink";
import ButtonBlock from "@/components/Blocks/ButtonBlock";

type Props = {
  heroTitle: string;
  heroSubtitle: Maybe<string>;
  image: Maybe<ImageAltTitleFileField> | undefined;
  link: Maybe<HeroSectionModelLinkField> | undefined;
  locale: SiteLocale;
};

const BackgroundImageHero = ({
  heroTitle,
  heroSubtitle,
  image,
  link,
  locale,
}: Props) => {
  const { scrollY } = useScroll();
  const logoY = useTransform(scrollY, [0, 800], [0, 200]);
  const logoScale = useTransform(scrollY, [0, 800], [1, 1.8]);

  return (
    <motion.div
      initial={{ height: "100vh" }}
      animate={{ height: "90vh" }}
      transition={{ duration: 0.75, delay: 0.5 }}
      className="w-full relative object-cover object-bottom h-[70vh] xl:h-[600px] 2xl:h-[700px] 3xl:h-[900px]"
    >
      <SRCImage
        data={image?.responsiveImage}
        className="object-cover object-center absolute inset-0 !w-full !h-full !max-w-none"
        priority={true}
      />
      <div className="bg-primary-content/80 absolute inset-0" />
      <div className="relative z-0 flex items-center h-full">
        <div className="container">
          <div className="flex flex-wrap justify-center">
            <div className="w-full px-4 lg:pt-36">
              <div className="text-white font-serif grid gap-6 mx-auto max-w-[900px] 2xl:max-w-[1200px] lg:py-12 text-center py-8">
                {heroTitle && (
                  <h1 className="sr-only">
                    {heroTitle}
                  </h1>
                )}
                {heroSubtitle && (
                  <h2
                    dangerouslySetInnerHTML={{ __html: heroSubtitle }}
                    className="sr-only"
                  />
                )}
                <motion.div
                  style={{ y: logoY, scale: logoScale }}
                  className="mx-auto w-52 mt-12 lg:w-72 2xl:w-80"
                >
                  <Image
                    src="/assets/verticalLogo.svg"
                    alt="Gioja Catering"
                    width={300}
                    height={300}
                    className="w-full h-auto"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BackgroundImageHero;
