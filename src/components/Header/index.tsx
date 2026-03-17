"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import LanguageSelector from "./LanguageSelector";
import {
  MenuDropdownRecord,
  MenuItemRecord,
  MenuQuery,
  SiteLocale,
} from "@/graphql/generated";
import { Menu } from "./HeaderRenderer";
import resolveLink from "@/lib/resolveLink";
import { motion } from "framer-motion";
import DropdownMenu from "./DropdownMenu";
import ButtonMenu from "./ButtonMenu";

import { useRouter } from "next/navigation";
import { animatePageOut } from "../../../animations";

type Props = {
  lng: SiteLocale;
  data: MenuQuery;
  hrefs?: any;
  layout?: string;
};

const activeClass = "underline underline-offset-4";
const itemClass =
  "lg:px-0 hover:underline whitespace-nowrap lg:text-sm duration-200 px-6 flex items-center gap-1 text-lg lg:uppercase lg:font-semibold lg:tracking-wider";

const Header = ({ lng, hrefs, data, layout }: Props) => {
  const isHome = layout === "dark";
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const containerRef = useRef(null);
  const headerRef = useRef<HTMLElement>(null);
  const scrolledRef = useRef(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const was = scrolledRef.current;
      if (!was && y >= 80) scrolledRef.current = true;
      else if (was && y <= 20) scrolledRef.current = false;
      else return;
      setScrolled(scrolledRef.current);
      if (headerRef.current) {
        headerRef.current.dataset.scrolled = String(scrolledRef.current);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (navbarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [navbarOpen]);

  const handleClick = (item: any) => {
    if (item !== pathname) {
      animatePageOut(item, router);
    }
  };
  const handleClickMenu = (item: any) => {
    handleClick(item);
    handleClickAndClose;
  };

  const handleClickAndClose = () => {
    setNavbarOpen(false);
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  const navbarToggleHandler = () => setNavbarOpen(!navbarOpen);

  if (!data) return null;

  const menuData: Menu[] = data.layout.menu.map((item) => {
    if (item._modelApiKey === "menu_dropdown") {
      const dropdownItem = item as MenuDropdownRecord;
      const subItems =
        dropdownItem.dropdownType === "text_image"
          ? dropdownItem.megaItems
          : dropdownItem.items;

      return {
        id: item.id,
        title: dropdownItem.title || "Other Items",
        newTab: false,
        submenu: subItems.map((subItem: any) => ({
          id: subItem.id,
          title: subItem.title,
          menuImage:
            dropdownItem.dropdownType === "text_image"
              ? subItem.menuImage
              : undefined,
          path: resolveLink({
            ...subItem.page,
            locale: lng,
            modelRelated: null,
          }),
          newTab: true,
        })),
      };
    } else {
      const menuItem = item as MenuItemRecord;
      return {
        id: menuItem.id,
        title: menuItem.title,
        path: resolveLink({
          ...menuItem.page,
          locale: lng,
          modelRelated: null,
        }),
        newTab: false,
      };
    }
  });

  const renderMenuItem = (item: Menu, index: number) => (
    <li key={index} className="py-3 relative has-[.activeClass]:bg-accent">
      {item.path ? (
        <a
          className={`${
            pathname === item.path ? activeClass : ""
          } ${itemClass} cursor-pointer`}
          onClick={() => handleClickMenu(item.path)}
        >
          {item.title}
        </a>
      ) : (
        <DropdownMenu
          sticky={false}
          navbarOpen={navbarOpen}
          isMega={false}
          handleClickAndClose={handleClickMenu}
          menuItem={item}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          itemClass={itemClass}
        />
      )}
    </li>
  );

  return (
    <header
      ref={headerRef}
      data-home={isHome || undefined}
      data-scrolled="false"
      className={`header-main left-0 flex w-full items-center z-20 fixed top-0 ${
        isHome ? "" : "text-secondary-content"
      }`}
    >
      <div className={`relative isolate z-20 w-full transition-all duration-300 ${scrolled && !isHome ? "py-1" : "py-2"}`}>
        <div className="container">
          <div className={`lg:flex w-full items-center gap-x-8 z-[2] ${isHome || scrolled ? "lg:justify-center" : "justify-end flex-row-reverse"}`}>
            <div className={`w-full flex items-center ${isHome || scrolled ? "lg:justify-center" : "justify-between"}`}>
              {!isHome && (
                <div
                  className={`header-logo max-w-full relative z-[11] lg:absolute lg:left-1/2 lg:-translate-x-1/2 transition-all duration-300 ${
                    scrolled ? "w-0 h-0 opacity-0 pointer-events-none overflow-hidden" : "w-16 h-[80px] lg:h-[140px] lg:w-[140px] top-2 opacity-100 scale-100"
                  }`}
                >
                  <a
                    className="block w-full h-full relative cursor-pointer"
                    onClick={() => handleClickMenu("/")}
                  >
                    <Image
                      src={
                        navbarOpen
                          ? data.layout.logoAlt.url
                          : data.layout.logoDark.url
                      }
                      alt="logo"
                      className="w-full h-full absolute inset-0 object-center object-contain"
                      priority
                      width={100}
                      height={100}
                    />
                  </a>
                </div>
              )}
              <ButtonMenu
                navbarToggleHandler={navbarToggleHandler}
                navbarOpen={navbarOpen}
                sticky={false}
                layout={layout}
              />
              <motion.nav
                initial={false}
                animate={isDropdownOpen ? "open" : "closed"}
                id="navbarCollapse"
                ref={containerRef}
                className={`fixed top-0 left-0 right-0 z-[-1] lg:z-10 lg:visible grid lg:h-auto transition-[height] motion-safe:duration-700 ${
                  isHome || scrolled ? "lg:relative lg:inset-auto" : "lg:absolute lg:top-0 lg:left-0 lg:right-0"
                } ${navbarOpen ? "h-screen" : "h-0"}`}
              >
                <div
                  className={`${
                    navbarOpen
                      ? "overflow-hidden text-white touch-none overscroll-none"
                      : "overflow-auto"
                  } lg:overflow-visible w-full h-full bg-base-200 lg:bg-transparent`}
                >
                  {isHome ? (
                    <ul className="block items-center w-full pt-32 lg:pt-0 pb-4 lg:pb-0 lg:flex lg:justify-center lg:gap-x-12 lg:mx-auto">
                      {menuData.map((item, i) => renderMenuItem(item, i))}
                    </ul>
                  ) : (
                    <div className={`relative transition-all duration-300 ${scrolled ? "lg:min-h-0" : "lg:min-h-[140px]"}`}>
                      {/* Layout standard — due gruppi con spazio per il logo */}
                      <ul className={`block lg:items-center w-full lg:max-w-auto lg:flex lg:w-[700px] lg:mx-auto lg:justify-between transition-all duration-300 ${
                        scrolled ? "lg:hidden pt-32 pb-4" : "lg:opacity-100 lg:min-h-[140px] pt-32 lg:pt-0 pb-4 lg:pb-0"
                      }`}>
                        <li>
                          <ul className="lg:flex gap-x-10">
                            {renderMenuItem(menuData[0], 0)}
                            {renderMenuItem(menuData[1], 1)}
                          </ul>
                        </li>
                        <li>
                          <ul className="lg:flex gap-x-10">
                            {renderMenuItem(menuData[2], 2)}
                            {renderMenuItem(menuData[3], 3)}
                          </ul>
                        </li>
                      </ul>
                      {/* Layout scrolled — voci in fila come home */}
                      <ul className={`hidden lg:flex items-center w-full py-3 lg:justify-center lg:gap-x-12 lg:mx-auto transition-opacity duration-300 delay-150 ${
                        scrolled ? "lg:opacity-100" : "lg:opacity-0 lg:pointer-events-none lg:absolute lg:inset-0"
                      }`}>
                        {menuData.map((item, i) => renderMenuItem(item, i))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
