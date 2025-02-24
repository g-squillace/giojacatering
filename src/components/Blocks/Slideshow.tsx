import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  A11y,
  Pagination,
  Navigation,
  Parallax,
} from "swiper/modules";

import "swiper/css/bundle";
import { SiteLocale, SlideRecord, SlideshowRecord } from "@/graphql/generated";
import { SRCImage } from "react-datocms";
import translate from "@/labels";
import ButtonsSwiper from "./Swiper/ButtonsSwiper";

type PropsSlideshow = {
  data: SlideshowRecord;
  locale: SiteLocale;
};

const Slideshow = ({ data, locale }: PropsSlideshow) => {
  const classButton = "bg-accent";
  return (
    <div className="overflow-hidden w-screen">
      <div className={`relative xl:container xl:w-9/12`}>
        <div className="xl:mr-[calc(-50vw+50%)]">
          <Swiper
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
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
            spaceBetween={10}
            className="slideshow"
            navigation={{
              nextEl: "#nextButton",
              prevEl: "#prevButton",
            }}
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
            {data.slides.map((s: SlideRecord, i: number) => {
              const { text, title, image } = s;

              return (
                <SwiperSlide className="!w-[450px]" key={i}>
                  <div className="text-primary-content bg-primary">
                    <div className="p-10 gap-6 grid">
                      {image && (
                        <div className="w-full relative">
                          <SRCImage
                            data={image.responsiveImage}
                            className="w-full h-full !max-w-none !object-contain"
                          />
                        </div>
                      )}
                      <div
                        dangerouslySetInnerHTML={{ __html: text }}
                        className=""
                      />
                      {title && (
                        <h2
                          dangerouslySetInnerHTML={{ __html: title }}
                          className="title-small"
                        />
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <ButtonsSwiper classButton={classButton} />
      </div>
    </div>
  );
};

export default Slideshow;
