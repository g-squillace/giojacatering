import Image from "next/image";
import InternalLink from "../Links/InternalLink";
import { PageRecord, SiteLocale } from "@/graphql/generated";

type Props = {
  data: any;
  logo: string;
  locale: SiteLocale;
};

export default function MenuFooter({ data, logo, locale }: Props) {
  const titleClass =
    "uppercase font-bold font-serif text-primary text-sm xl:text-base mb-2";
  const itemClass =
    "text-sm xl:text-base group-hover:underline underline-offset-4";

  return (
    <div className="lg:flex lg:justify-between lg:gap-x-16">
      <div className="relative aspect-[3/1] w-[200px] grayscale">
        <Image
          src={logo}
          fill
          alt="Logo Forte dei Marmi"
          title="Logo Forte dei Marmi"
          className="object-left object-contain"
        />
      </div>
      <div className="lg: flex-1 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mt-8 md:mt-12 lg:mt-0 gap-8 md:gap-y-12 items-start">
        {data.map((d: any) => (
          <div key={d.id} className="grid gap-2">
            {d.label && <div className={titleClass}>{d.label}</div>}
            {d.page.map((p: PageRecord) => (
              <InternalLink
                key={p.id}
                className="group"
                locale={locale}
                record={p}
              >
                <div className={d.label ? itemClass : titleClass} key={p.id}>
                  {p.label}
                </div>
              </InternalLink>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
