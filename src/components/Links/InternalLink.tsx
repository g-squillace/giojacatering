"use client";

import Link from "next/link";
import resolveLink from "@/lib/resolveLink";
import { useRouter } from "next/navigation";
import { animatePageOut } from "../../../animations";
import { usePathname } from "next/navigation";

type InternalinkProps = {
  record: any;
  locale: string;
  children?: any;
  title?: string;
  className?: any;
};

export default function InternalLink({
  record,
  locale,
  title,
  className,
  children,
}: InternalinkProps) {
  const router = useRouter();
  const path = usePathname();

  const handleClick = () => {
    if (resolveLink({ ...record, locale }) !== path) {
      animatePageOut(resolveLink({ ...record, locale }), router);
    }
  };

  return (
    <>
      <a
        className={`${className} cursor-pointer`}
        // href={resolveLink({ ...record, locale })}
        title={`${title ? title : record.title}`}
        onClick={handleClick}
      >
        {children}
      </a>
    </>
  );
}
