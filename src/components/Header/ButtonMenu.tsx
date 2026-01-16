"use client";

import React from "react";

type Props = {
  navbarToggleHandler: any;
  navbarOpen: Boolean;
  sticky: Boolean;
  layout: string;
};

const ButtonMenu = ({
  navbarToggleHandler,
  navbarOpen,
  sticky,
  layout,
}: Props) => {
  return (
    <button
      onClick={navbarToggleHandler}
      id="navbarToggler"
      aria-label="Mobile Menu"
      className={`flex text-xs items-center lg:hidden justify-center ${
        layout === "dark" || navbarOpen ? "text-white" : "text-black"
      }`}
    >
      <span className="pr-2">{navbarOpen ? "close" : "menu"}</span>
      <div>
        <span
          className={`relative my-1 block h-0.5 w-[20px] transition-all motion-safe:duration-300 ${
            layout === "dark" || navbarOpen ? "bg-white" : "bg-black"
          } ${navbarOpen ? " top-[6px] rotate-45" : ""}`}
        />
        <span
          className={`relative my-1 block h-0.5 w-[20px] transition-all motion-safe:duration-300 ${
            layout === "dark" || navbarOpen ? "bg-white" : "bg-black"
          } ${navbarOpen ? " opacity-0" : ""}`}
        />
        <span
          className={`relative my-1 block h-0.5 w-[20px] transition-all motion-safe:duration-300 ${
            layout === "dark" || navbarOpen ? "bg-white" : "bg-black"
          }${navbarOpen ? " top-[-6px] -rotate-45" : ""}`}
        />
      </div>
    </button>
  );
};

export default ButtonMenu;
