import Brands from "@/components/Blocks/Brands";
import Features from "@/components/Blocks/FeaturesList";
import Video from "@/components/Video";
import FAQAccordion from "@/components/Blocks/FAQAccordion";
import {
  AttachmentsBlockRecord,
  BannerCtaRecord,
  BrandSectionRecord,
  ElementsListRecord,
  EventRecord,
  FaqSectionRecord,
  FeaturedPagesSectionRecord,
  FeatureListSectionRecord,
  GallerySectionRecord,
  ImageBlockRecord,
  MapBlockRecord,
  MultipleCardRecord,
  PostRecord,
  SiteLocale,
  SlideshowRecord,
  TeamBlockRecord,
  TestimonialsBlockRecord,
  TextBlockRecord,
  VideoSectionRecord,
} from "@/graphql/generated";
import ImageBlock from "@/components/Blocks/ImageBlock";
import GalleryBlock from "@/components/Blocks/GalleryBlock";
import BannerCtaBlock from "@/components/Blocks/BannerCtaBlock";
import TextBlock from "@/components/Blocks/TextBlock";
import MultipleCardBlock from "@/components/Blocks/MultipleCardBlock";
import ProductDetailsBlock from "@/components/Blocks/ProductDetailsBlock";
import FormBlock from "@/components/Blocks/FormBlock";
import ContactTextBlock from "@/components/Blocks/ContactTextBlock";
import ElementListBlock from "@/components/Blocks/ElementListBlock";
import AttachmentsBlock from "@/components/Blocks/AttachmentsBlock";
import FeaturedPages from "../Blocks/FeaturedPages";
import TeamBlock from "../Blocks/TeamBlock";
import MapBlock from "../Map/MapBlock";
import TestimonialsBlock from "../Blocks/TestimonialsBlock";
import Slideshow from "../Blocks/Slideshow";

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
      case "attachments_block": {
        const attachmentsRecord = b as AttachmentsBlockRecord;
        content = (
          <AttachmentsBlock
            style={section.style}
            data={attachmentsRecord}
            locale={locale}
          />
        );
        break;
      }
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
      case "contact_text_block": {
        content = <ContactTextBlock data={b} locale={locale} />;
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
      case "faq_section": {
        const faqSectionRecord = b as FaqSectionRecord;
        content = (
          <FAQAccordion
            title={faqSectionRecord.title}
            subtitle={faqSectionRecord.subtitle}
            questions={faqSectionRecord.questions}
          />
        );
        break;
      }
      case "feature_list_section": {
        const featureListSectionRecord = b as FeatureListSectionRecord;
        content = (
          <Features
            features={featureListSectionRecord.feature}
            featuresHeader={featureListSectionRecord.featuresHeader}
            featuresSubheader={featureListSectionRecord.featuresSubheader}
          />
        );
        break;
      }
      case "featured_pages_section": {
        const featuredPages = b as FeaturedPagesSectionRecord;
        content = (
          <FeaturedPages
            title={featuredPages.featuredPagesHeader}
            subtitle={featuredPages.featuredPagesSubheader}
            pages={featuredPages.featuredPages}
            locale={locale}
          />
        );
        break;
      }
      case "form_block": {
        content = <FormBlock data={b} locale={locale} />;
        break;
      }
      case "gallery_section": {
        const gallerySection = b as GallerySectionRecord;
        content = <GalleryBlock data={gallerySection} locale={locale} />;
        break;
      }
      case "image_block": {
        const imageBlock = b as ImageBlockRecord;
        content = <ImageBlock data={imageBlock} locale={locale} />;
        break;
      }
      case "map_block": {
        const mapBlock = b as MapBlockRecord;
        content = <MapBlock content={mapBlock} locale={locale} />;
        break;
      }
      case "multiple_card": {
        const multipleCardSection = b as MultipleCardRecord;
        content = (
          <MultipleCardBlock data={multipleCardSection} locale={locale} />
        );
        break;
      }
      case "product_detail": {
        content = <ProductDetailsBlock data={b} locale={locale} />;
        break;
      }
      case "slideshow":
        const slideshow = b as SlideshowRecord;
        content = <Slideshow data={slideshow} locale={locale} />;
        break;
      case "team_block": {
        const teamBlock = b as TeamBlockRecord;
        content = (
          <TeamBlock
            content={teamBlock}
            locale={locale}
            colors={section.style}
          />
        );
        break;
      }
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
      case "video_section": {
        const videoSectionRecord = b as VideoSectionRecord;
        content = (
          <Video
            videoHeader={videoSectionRecord.videoHeader}
            videoSubheader={videoSectionRecord.videoSubheader}
            externalVideo={videoSectionRecord.externalVideo}
            internalVideo={videoSectionRecord.internalVideo}
          />
        );
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
