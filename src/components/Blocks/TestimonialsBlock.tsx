import "swiper/css/bundle";
import {
  QuoteRecord,
  SiteLocale,
  TestimonialsBlockRecord,
} from "@/graphql/generated";
import { motion, Variants } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  A11y,
  Pagination,
  Navigation,
  Parallax,
} from "swiper/modules";
import "swiper/css/bundle";
import translate from "@/labels";
import CustomIcon from "./CustomIcon";

type PropsTestimonialsBlock = {
  data: TestimonialsBlockRecord;
  locale: SiteLocale;
};

const TestimonialsBlock = ({ data, locale }: PropsTestimonialsBlock) => {
  const { testimonials, textTestimonialsBlock, titleTestimonialsBlock } = data;
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
    <div className={`container`}>
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.1 }}
        variants={variants}
        className="grid gap-6"
      >
        {titleTestimonialsBlock && (
          <h2
            className="title"
            dangerouslySetInnerHTML={{ __html: titleTestimonialsBlock }}
          />
        )}

        {textTestimonialsBlock && (
          <div
            className=""
            dangerouslySetInnerHTML={{ __html: textTestimonialsBlock }}
          />
        )}
      </motion.div>
      <Swiper
        autoplay={{
          delay: 3000,
          disableOnInteraction: true,
        }}
        modules={[Autoplay, Pagination, Navigation, A11y, Parallax, A11y]}
        breakpoints={{
          1024: {
            spaceBetween: 40,
          },
        }}
        slidesPerView={"auto"}
        speed={1000}
        pagination={{
          clickable: true,
        }}
        rewind={true}
        spaceBetween={10}
        className="slideshow"
        keyboard={{
          enabled: true,
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
        {testimonials.map((t: QuoteRecord, i: number) => {
          const { textQuote, whoQuote, roleQuote } = t;
          return (
            <SwiperSlide key={i}>
              <div className="space-y-8 text-center">
                <CustomIcon
                  fileName="quote"
                  classes="bg-base-100 size-12 mx-auto"
                />
                {textQuote && (
                  <h2
                    dangerouslySetInnerHTML={{ __html: textQuote }}
                    className="title-small mx-auto xl:max-w-3xl"
                  />
                )}
                {whoQuote && (
                  <div className="text-xs justify-center uppercase text-base-100 flex flex-wrap tracking-widest">
                    <div className="">{whoQuote}</div>
                    {roleQuote && <div className="">, {roleQuote}</div>}
                  </div>
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default TestimonialsBlock;
