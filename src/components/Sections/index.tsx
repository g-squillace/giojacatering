import Brands from "@/components/Blocks/Brands";
import {
  BannerCtaRecord,
  BrandSectionRecord,
  ElementsListRecord,
  EventRecord,
  PostRecord,
  SiteLocale,
  SlideshowRecord,
  TestimonialsBlockRecord,
  TextBlockRecord,
} from "@/graphql/generated";
import BannerCtaBlock from "@/components/Blocks/BannerCtaBlock";
import TextBlock from "@/components/Blocks/TextBlock";
import FormBlock from "@/components/Blocks/FormBlock";
import ElementListBlock from "@/components/Blocks/ElementListBlock";
import TestimonialsBlock from "../Blocks/TestimonialsBlock";
import Slideshow from "../Blocks/Slideshow";
import ImageBlock from "../Blocks/ImageBlock";
import GalleryBlock from "../Blocks/GalleryBlock";
import MasonryBlock from "../Blocks/MasonryBlock";

type Props = {
  section: any;
  locale: SiteLocale;
  lastPosts?: PostRecord[];
  lastEvents?: EventRecord[];
};

export default function Sections({
  section,
  locale,
  lastPosts,
  lastEvents,
}: Props) {
  const numBlocks = section.blocks.length;
  const bg =
    section.style.includes("neutral") | section.style.includes("base")
      ? "light"
      : "dark";

  return section?.blocks?.map((b: any) => {
    let content: any;
    switch (b._modelApiKey) {
      case "banner_cta": {
        const bannerCtaSection = b as BannerCtaRecord;
        content = <BannerCtaBlock data={bannerCtaSection} locale={locale} />;
        break;
      }
      case "brand_section": {
        const brandSectionRecord = b as BrandSectionRecord;
        content = (
          <Brands
            brandShowcase={brandSectionRecord.brands}
            title={brandSectionRecord.titleBrand}
            text={brandSectionRecord.textBrand}
            locale={locale}
          />
        );
        break;
      }
      case "elements_list": {
        const elementsListRecord = b as ElementsListRecord;
        content = (
          <ElementListBlock
            data={elementsListRecord}
            locale={locale}
            lastPosts={lastPosts}
            lastEvents={lastEvents}
          />
        );
        break;
      }
      case "form_block": {
        content = <FormBlock data={b} locale={locale} />;
        break;
      }
      case "slideshow":
        const slideshow = b as SlideshowRecord;
        content = <Slideshow data={slideshow} locale={locale} />;
        break;
      case "testimonials_block":
        const testimonialsBlock = b as TestimonialsBlockRecord;
        content = (
          <TestimonialsBlock data={testimonialsBlock} locale={locale} />
        );
        break;
      case "text_block": {
        const textBlockSection = b as TextBlockRecord;
        content = <TextBlock data={textBlockSection} locale={locale} bg={bg} />;
        break;
      }
      case "image_block": {
        content = <ImageBlock data={b} locale={locale} />;
        break;
      }
      case "gallery_section": {
        content = <GalleryBlock data={b} locale={locale} />;
        break;
      }
      case "masonry": {
        content = <MasonryBlock data={b} locale={locale} />;
        break;
      }
      default: {
        content = (
          <div className="p-8 bg-red-500 text-white">
            <div className="title">{`Manca questo blocco ${b._modelApiKey}`}</div>
          </div>
        );
        break;
      }
    }

    return (
      <div key={b.id} className="standard-vertical-m relative z-10">
        {content}
      </div>
    );
  });
}
