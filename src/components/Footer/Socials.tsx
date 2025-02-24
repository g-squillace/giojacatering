import { SiteLocale } from "@/graphql/generated";
import ExternalLink from "../Links/ExternalLink";
import Image from "next/image";

type PropsSocials = {
  socials: any;
  locale: SiteLocale;
};

export default function Socials({ socials, locale }: PropsSocials) {
  return (
    <>
      <div className="pt-12 flex gap-6 justify-center xl:justify-end md:pt-0 md:col-span-2 xl:col-span-3 xl:pt-12">
        {socials.map((s: any) => (
          <ExternalLink
            url={s.url}
            locale={locale}
            title={s.title}
            key={s.id}
            className="group"
          >
            <div className="w-[60px] h-[60px] border rounded-full border-secondary/10 relative duration-300 group-hover:bg-neutral-content">
              <Image
                src={s.icon.url}
                width={25}
                height={25}
                alt="Picture of the author"
                className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-auto h-auto"
              />
            </div>
          </ExternalLink>
        ))}
      </div>
    </>
  );
}
