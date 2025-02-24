"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { SRCImage } from "react-datocms";
import Image from "next/image";

import { Autoplay, A11y, Navigation } from "swiper/modules";
import "swiper/css/a11y";
import { motion, Variants } from "framer-motion";

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

import "swiper/css/bundle";
import translate from "@/labels";
import ButtonsSwiper from "./Swiper/ButtonsSwiper";

export default function GalleryBlock({
  data,
  locale,
}: {
  data: any;
  locale: string;
}) {
  const classButton = "bg-accent";
  return (
    <div className="overflow-hidden max-w-[100vw]">
      <div className="container relative gallery">
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.1 }}
          variants={variants}
        >
          {data.typeGallery === "carousel" ? (
            <>
              <Swiper
                keyboard={true}
                modules={[A11y, Autoplay, Navigation]}
                slidesPerView={"auto"}
                spaceBetween={30}
                autoplay={true}
                speed={1000}
                className="slider-auto-width"
                navigation={{
                  nextEl: "#nextButton",
                  prevEl: "#prevButton",
                }}
                a11y={{
                  firstSlideMessage: translate("firstSlideMessage", locale),
                  lastSlideMessage: translate("This is the last slide", locale),
                  nextSlideMessage: translate("Next slide", locale),
                  prevSlideMessage: translate("Previous slide", locale),
                  paginationBulletMessage:
                    translate("Go to slide", locale) + "{{index}}",
                }}
              >
                {data.galleryImages &&
                  Object.values(data.galleryImages).map((img: any) => (
                    <SwiperSlide key={img.id}>
                      <Image
                        src={img.imageAssetCarousel.responsiveImage}
                        alt={img.imageAssetCarousel.responsiveImage.alt}
                        title={img.imageAssetCarousel.responsiveImage.title}
                      />
                    </SwiperSlide>
                  ))}
              </Swiper>
              <ButtonsSwiper classButton={classButton} />
            </>
          ) : (
            <>
              <Swiper
                speed={1000}
                spaceBetween={30}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                keyboard={true}
                modules={[A11y, Autoplay, Navigation]}
                navigation={{
                  nextEl: "#nextButton",
                  prevEl: "#prevButton",
                }}
                a11y={{
                  firstSlideMessage: translate("firstSlideMessage", locale),
                  lastSlideMessage: translate("This is the last slide", locale),
                  nextSlideMessage: translate("Next slide", locale),
                  prevSlideMessage: translate("Previous slide", locale),
                  paginationBulletMessage:
                    translate("Go to slide", locale) + "{{index}}",
                }}
              >
                {data.galleryImages.map((img: any) => {
                  return (
                    <SwiperSlide key={img.id}>
                      <div className="relative aspect-video flex items-center justify-center">
                        <SRCImage
                          data={img.imageAsset.responsiveImage}
                          className={`object-${data.typeGallery} absolute !w-full !h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
                        />
                      </div>
                      {img.imageDescription && (
                        <div
                          className="text-sm text-neutral/80 mt-3"
                          dangerouslySetInnerHTML={{
                            __html: img.imageDescription,
                          }}
                        />
                      )}
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              <ButtonsSwiper classButton={classButton} />
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
