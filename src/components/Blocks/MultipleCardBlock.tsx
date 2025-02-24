"use client";
import { SRCImage } from "react-datocms";
import { motion } from "framer-motion";
import { useRef } from "react";

export default function GalleryBlock({ data, locale }) {
  const scrollRef = useRef(null);

  const containerVariants = {
    offscreen: {
      transition: {
        ease: "easeOut",
        staggerChildren: 0,
        staggerDirection: -1,
      },
    },
    onscreen: {
      transition: {
        ease: "easeOut",
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const imageVariants = {
    offscreen: {
      bottom: "100%",
      transition: {
        ease: "easeOut",
        duration: 0.75,
      },
    },
    onscreen: {
      bottom: 0,
      transition: {
        ease: "easeOut",
        duration: 0.75,
      },
    },
  };

  return (
    <div className="container">
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        ref={scrollRef}
        variants={containerVariants}
      >
        <div
          className={`${
            data.multipleImages.length === 3
              ? "lg:grid-cols-3"
              : "lg:grid-cols-4"
          } gap-6 grid`}
        >
          {data.multipleImages.map((img: any, n: number) => {
            return (
              <div key={img.id} className={`relative block`}>
                <div className="relative aspect-[2/3] w-full bg-accent">
                  <motion.div
                    variants={imageVariants}
                    viewport={{ root: scrollRef, once: true, amount: 0.75 }}
                    className={`absolute top-0 overflow-hidden w-full`}
                  >
                    <SRCImage
                      data={img.imageAsset.responsiveImage}
                      className="object-cover absolute inset-0 !w-full !h-full"
                    />
                  </motion.div>
                </div>
                <div
                  className="mt-2"
                  dangerouslySetInnerHTML={{
                    __html: img.imageDescription,
                  }}
                />
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
