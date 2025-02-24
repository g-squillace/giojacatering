"use client";

import { HeroSectionRecord, SiteLocale } from "@/graphql/generated";
import RightImageHero from "./RightImageHero";
import BackgroundImageHero from "./BackgroundImage";
import Carousel from "@/components/Hero/Carousel";
import TextHero from "./TextHero";

type PropsWhichHero = {
  hero: HeroSectionRecord;
  locale: SiteLocale;
};

export default function WhichHero({ hero, locale }: PropsWhichHero) {
  // return hero.displayOptions;
  switch (hero.displayOptions) {
    case "hero_bg":
      return (
        <BackgroundImageHero
          heroTitle={hero.heroTitle}
          heroSubtitle={hero.heroSubtitle}
          image={hero.heroImage}
          link={hero.link}
          locale={locale}
        />
      );
    case "hero_image_txt":
      return (
        <RightImageHero
          heroTitle={hero.heroTitle}
          heroSubtitle={hero.heroSubtitle}
          image={hero.heroImage}
          link={hero.link}
          locale={locale}
        />
      );
    case "hero_slider":
      return <Carousel slides={hero.sliders} locale={locale} />;
    case "hero_text":
      return (
        <TextHero
          heroTitle={hero.heroTitle}
          heroSubtitle={hero.heroSubtitle}
          link={hero.link}
          locale={locale}
        />
      );
  }
}
