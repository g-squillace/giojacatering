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
        } h-full lg:flex space-y-10 xl:items-stretch`}
      >
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          variants={textVariants}
          viewport={{ once: true }}
          className="lg:w-1/2 grid gap-6"
        >
          <div className="grid gap-6 content-center lg:px-16">
            {label && <div className="prefix">{label}</div>}
            <h2 className="title-small">{title}</h2>
            <div className="text-base-100 mx-auto">
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
            viewport={{ once: true }}
            className="lg:w-2/3 flex items-center justify-center overflow-hidden"
          >
            <SRCImage
              data={bannerCtaImage.responsiveImage}
              className="mx-auto xl:mx-0 xl:!w-full group-hover:scale-105 transition-all duration-700"
            />
          </motion.div>
        )}
      </div>
    );
  }

  function RenderContentBanner({ title, label, text, coverImage }) {
    return (
      <div className="relative z-10 py-28 overflow-hidden -my-20 xl:-my-32">
        <span className="absolute inset-0 -z-10 bg-secondary text-secondary-content" />
        {coverImage && (
          <SRCImage
            data={coverImage.responsiveImage}
            className="object-cover w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        )}
        <div className="container relative z-20">
          <div className="mx-auto max-w-screen-md xl:max-w-screen-lg text-center space-y-6 lg:space-y-10">
            {label && (
              <div className="prefix mx-auto text-secondary-content">
                {label}
              </div>
            )}
            <h2 className="title text-secondary-content mx-auto">{title}</h2>
            {text && <CustomStructuredText record={text} locale={locale} />}
            {data.link && (
              <div className="inline-block">
                <ButtonBlock label={"Scrivici"} />
              </div>
            )}
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
