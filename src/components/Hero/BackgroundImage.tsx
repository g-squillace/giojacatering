import {
  HeroSectionModelLinkField,
  ImageAltTitleFileField,
  SiteLocale,
} from "@/graphql/generated";
import { Maybe } from "graphql/jsutils/Maybe";
import { SRCImage } from "react-datocms";
import { motion } from "framer-motion";
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
      <div className="relative z-0 flex items-center h-full mt-[72px] md:mt-[104px]">
        <div className="container">
          <div className="flex flex-wrap justify-center">
            <div className="w-full px-4">
              <div className="grid gap-6 mx-auto lg:mx-0 max-w-[570px] lg:p-12 lg:py-16 text-center md:text-left bg-primary/80 p-8 text-base-100 xl:pb-20">
                {heroTitle && <h1 className="title">{heroTitle}</h1>}
                {heroSubtitle && (
                  <h2
                    dangerouslySetInnerHTML={{ __html: heroSubtitle }}
                    className=""
                  />
                )}
                {link && (
                  <DynamicLink className={`group`} link={link} locale={locale}>
                    <ButtonBlock label={link.label} />
                  </DynamicLink>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BackgroundImageHero;
