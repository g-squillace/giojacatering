"use client";

import React from "react";

type Props = {
  navbarToggleHandler: any;
  navbarOpen: Boolean;
  sticky: Boolean;
  scrolled?: boolean;
  layout: string;
};

const ButtonMenu = ({
  navbarToggleHandler,
  navbarOpen,
  sticky,
  scrolled,
  layout,
}: Props) => {
  const isLight = navbarOpen ? false : (layout !== "dark" || scrolled);
  const textColor = isLight ? "text-black" : "text-white";
  const bgColor = isLight ? "bg-black" : "bg-white";

  return (
    <button
      onClick={navbarToggleHandler}
      id="navbarToggler"
      aria-label="Mobile Menu"
      className={`flex text-xs items-center lg:hidden justify-center ${textColor}`}
    >
      <span className="pr-2">{navbarOpen ? "close" : "menu"}</span>
      <div>
        <span
          className={`relative my-1 block h-0.5 w-[20px] transition-all motion-safe:duration-300 ${bgColor} ${navbarOpen ? " top-[6px] rotate-45" : ""}`}
        />
        <span
          className={`relative my-1 block h-0.5 w-[20px] transition-all motion-safe:duration-300 ${bgColor} ${navbarOpen ? " opacity-0" : ""}`}
        />
        <span
          className={`relative my-1 block h-0.5 w-[20px] transition-all motion-safe:duration-300 ${bgColor}${navbarOpen ? " top-[-6px] -rotate-45" : ""}`}
        />
      </div>
    </button>
  );
};

export default ButtonMenu;
