"use client";

import { useEffect } from "react";
import { animatePageIn } from "../../../animations";
import Image from "next/image";
export default function Template({
  logo,
  children,
}: {
  logo: any;
  children: React.ReactNode;
}) {
  useEffect(() => {
    animatePageIn();
  }, []);
  return (
    <>
      <div
        id="transition-element"
        className="w-screen h-[100vh] bg-secondary z-[100] fixed top-0 left-0 text-white font-bold text-6xl flex justify-center items-center"
      >
        <Image src={logo.url} width="200" height="200" alt={logo.url} />
      </div>
      {children}
    </>
  );
}
