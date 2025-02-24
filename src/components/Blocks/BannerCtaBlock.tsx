import StructuredContent from "../Layout/StructuredContent";
import { SRCImage } from "react-datocms";
import ButtonBlock from "./ButtonBlock";
import DynamicLink from "../Links/DynamicLink";
import { motion } from "framer-motion";
import CustomStructuredText from "../Layout/CustomStructuredText";

export default function BanneCtaBlock({ data, locale }) {
  const {
    displayOptions,
    bannerCtaImage,
    coverImage,
    label,
    title,
    text,
    link,
  } = data;

  const imageVariants = {
    offscreen: {
      bottom: "100%",
      transition: {
        ease: "easeOut",
        duration: 1,
      },
    },
    onscreen: {
      bottom: 0,
      transition: {
        ease: "easeOut",
        duration: 1,
      },
    },
  };
  const textVariants = {
    offscreen: {
      opacity: 0,
      translateY: 50,
      transition: {
        ease: "easeOut",
        duration: 0.5,
      },
    },
    onscreen: {
      opacity: 100,
      translateY: 0,
      transition: {
        ease: "easeOut",
        duration: 0.5,
      },
    },
  };

  const containerClass = "group container grid items-start";

  function RenderContent({
    title,
    label,
    text,
    bannerCtaImage,
    displayOptions,
  }) {
    return (
      <div
        className={`${
          displayOptions === "text-right" ? "lg:flex-row-reverse" : ""
        } h-full lg:flex xl:items-stretch`}
      >
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          variants={textVariants}
          viewport={{ once: true, amount: 0.75 }}
          className="lg:w-1/2 grid gap-6"
        >
          <div className="grid gap-6 content-center">
            {label && <div className="prefix">{label}</div>}
            <h2 className="title">{title}</h2>
            <div className="text">
              <CustomStructuredText record={text} locale={locale} />
            </div>
            {link && (
              <div className="inline-block">
                <ButtonBlock label={link.label} />
              </div>
            )}
          </div>
        </motion.div>
        {bannerCtaImage && (
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            variants={imageVariants}
            viewport={{ once: true, amount: 0.75 }}
            className="lg:w-1/2 flex items-center justify-center"
          >
            <SRCImage
              data={bannerCtaImage.responsiveImage}
              className="mx-auto xl:mx-0 xl:!w-full"
            />
          </motion.div>
        )}
      </div>
    );
  }

  function RenderContentBanner({ title, label, text, coverImage }) {
    return (
      <div>
        <div className="relative z-10 py-20 overflow-hidden">
          <span className="absolute inset-0 -z-10 bg-black/80"></span>
          {coverImage && (
            <SRCImage
              data={coverImage.responsiveImage}
              className="object-cover w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          )}
          <div className="container relative z-20">
            <div className="mx-auto max-w-screen-sm text-center grid gap-6">
              {label && <div className="prefix mx-auto">{label}</div>}
              <h2 className="title">{title}</h2>
              {text && <CustomStructuredText record={text} locale={locale} />}
              {data.link && (
                <div className="inline-block">
                  <ButtonBlock label={"Vai"} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  switch (displayOptions) {
    case "text-center":
      return (
        <div className="">
          {link ? (
            <div
              className={`group duration-700 my-10 relative z-0 text-center`}
            >
              <DynamicLink className={``} link={link} locale={locale}>
                <RenderContentBanner
                  title={title}
                  label={label}
                  text={text}
                  coverImage={coverImage}
                />
              </DynamicLink>
            </div>
          ) : (
            <div
              className={`group duration-700 container py-10 relative z-0 text-center`}
            >
              <RenderContentBanner
                title={title}
                label={label}
                text={text}
                coverImage={coverImage}
              />
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className="">
          {link ? (
            <div className={containerClass}>
              <DynamicLink link={link} locale={locale} className={``}>
                <RenderContent
                  title={title}
                  label={label}
                  text={text}
                  bannerCtaImage={bannerCtaImage}
                  displayOptions={displayOptions}
                />
              </DynamicLink>
            </div>
          ) : (
            <div className={containerClass}>
              <RenderContent
                title={title}
                label={label}
                text={text}
                bannerCtaImage={bannerCtaImage}
                displayOptions={displayOptions}
              />
            </div>
          )}
        </div>
      );
  }
}
