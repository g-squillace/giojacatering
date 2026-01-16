import "swiper/css/bundle";
import { useState, useRef, useEffect } from "react";
import { SiteLocale, SlideRecord, SlideshowRecord } from "@/graphql/generated";
import { SRCImage } from "react-datocms";

type PropsSlideshow = {
  data: SlideshowRecord;
  locale: SiteLocale;
};

const Slideshow = ({ data, locale }: PropsSlideshow) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveSlide(index);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "-20% 0px -20% 0px",
      }
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [data.slides]);

  return (
    <div className="relative container xl:w-10/12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
        {/* Left Column - Image (Sticky) */}
        <div className="hidden lg:block h-screen sticky top-0">
          <div className="absolute inset-0 flex items-center justify-center p-10 lg:aspect-[2/3]">
            {data.slides[activeSlide]?.image && (
              <div className="w-full h-full relative">
                <SRCImage
                  data={data.slides[activeSlide].image.responsiveImage}
                  className="!w-full !h-full !max-w-none !object-cover duration-300"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Timeline List */}
        <div className="flex flex-col justify-center space-y-20 lg:space-y-20 py-10 lg:py-40 xl:pr-20">
          {data.slides.map((s: SlideRecord, i: number) => {
            const { text, title, year, image } = s;
            const isActive = i === activeSlide;

            return (
              <div
                key={i}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                data-index={i}
                className={`transition-opacity duration-300 ${
                  isActive ? "opacity-100" : "opacity-40"
                } flex flex-col justify-center`}
              >
                {/* Mobile Image */}
                <div className="lg:hidden mb-6 h-[300px] relative">
                  {image && (
                    <SRCImage
                      data={image.responsiveImage}
                      className="w-full h-full !max-w-none !object-contain"
                    />
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  {year && (
                    <div className="text-base-100 text-sm tracking-wider">
                      {year}
                    </div>
                  )}
                  {title && (
                    <h2
                      dangerouslySetInnerHTML={{ __html: title }}
                      className="text-2xl lg:text-4xl font-serif italic"
                    />
                  )}
                  {text && (
                    <div
                      dangerouslySetInnerHTML={{ __html: text }}
                      className="text-sm lg:text-base mt-2 max-w-xl text-base-100"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Slideshow;
