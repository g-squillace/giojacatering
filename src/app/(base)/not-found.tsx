"use client";

import ButtonBlock from "@/components/Blocks/ButtonBlock";
import translate from "@/labels";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [locale, setLocale] = useState<string>("");

  useEffect(() => {
    const lang = () =>
      navigator.languages && navigator.languages.length
        ? navigator.languages[0]
        : navigator.language || "en";
    if (lang().indexOf("it") !== -1) {
      setLocale("it");
    } else {
      setLocale("en");
    }
  }, []);

  return (
    <div className="relative z-0 flex items-center h-full mt-16 xl:mt-32 bg-primary py-20 md:py-48">
      <div className="absolute inset-0 bg-logo-sm opacity-10 bg-[length:150px_120px] lg:top-10" />
      <div className="container z-20">
        <div className="grid gap-5 text-center flex-wrap justify-center md:gap-8 lg:gap-12">
          <div className="md:text-md max-w-prose text-base text-base-100 font-serif">
            {translate("404.text", locale)}
          </div>
          <h1 className="md:text-4xl text-2xl font-bold uppercase font-serif text-secondary">
            {translate("404.title", locale)} 🚩
          </h1>
          <Link href="/">
            <ButtonBlock
              label={translate("404.button", locale)}
              color="light"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
