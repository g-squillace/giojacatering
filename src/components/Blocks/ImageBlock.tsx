import { SRCImage } from "react-datocms";
import { motion, Variants } from "framer-motion";

export default function ImageBlock({ data, locale }) {
  const { imageAsset, imageDescription, tag } = data;
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
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.1 }}
      variants={variants}
      className="container"
    >
      {tag && (
        <div className="prefix mb-4 max-w-screen-md mx-auto">{tag.tag}</div>
      )}
      <SRCImage
        data={imageAsset.responsiveImage}
        className="w-full h-auto !max-w-screen-md mx-auto"
      />
      {imageDescription && (
        <div
          className="text-sm mt-4 max-w-screen-md mx-auto"
          dangerouslySetInnerHTML={{ __html: imageDescription }}
        />
      )}
    </motion.div>
  );
}
