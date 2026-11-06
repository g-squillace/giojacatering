"use client";

import type { MouseEvent, ReactNode } from "react";
import resolveLink from "@/lib/resolveLink";
import { useRouter, usePathname } from "next/navigation";
import { animatePageOut } from "../../../animations";
import isModifiedClick from "@/lib/isModifiedClick";

type InternalinkProps = {
  record: {
    slugs?: { locale: string; value: string | null }[] | null;
    _modelApiKey: string;
    title?: string | null;
  };
  locale: string;
  children?: ReactNode;
  title?: string;
  className?: string;
};

export default function InternalLink({
  record,
  locale,
  title,
  className,
  children,
}: InternalinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const href = resolveLink({ ...record, locale });

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isModifiedClick(event)) return;
    event.preventDefault();
    if (href !== pathname) animatePageOut(href, router);
  };

  return (
    <a
      className={`${className} cursor-pointer`}
      href={href}
      title={title || record.title || undefined}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
