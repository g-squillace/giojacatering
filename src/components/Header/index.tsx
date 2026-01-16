"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation"; // Importa il nuovo hook
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

const invertVariants = {
  open: { transition: { ease: "easeOut", duration: 0.25 } },
  closed: { transition: { ease: "easeOut", duration: 0.25 } },
};

const Header = ({ lng, hrefs, data, layout }: Props) => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const containerRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleStickyNavbar = () => setSticky(window.scrollY >= 80);
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
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

  return (
    <header className="header left-0 flex w-full items-center absolute top-0 z-20">
      <div
        className={`relative bg-transparent isolate z-20 w-full md:py-4 motion-safe:duration-300 ${
          layout === "dark" ? "text-white" : "text-secondary-content"
        }`}
      >
        <div className="container">
          <div className="lg:flex w-full justify-end flex-row-reverse items-center gap-x-8 z-[2]">
            {/* <div className="hidden lg:flex items-center justify-end">
              <LanguageSelector lng={lng} hrefs={hrefs} />
            </div> */}
            <div className="w-full flex justify-between items-center ">
              <motion.div
                className="w-16 h-[80px] lg:h-[140px] lg:w-[140px] max-w-full relative z-[11] lg:absolute lg:left-1/2 lg:-translate-x-1/2 top-2"
                animate={sticky || navbarOpen ? "open" : "closed"}
                variants={invertVariants}
              >
                <a
                  // href="/"
                  className="block w-full h-full relative cursor-pointer"
                  onClick={() => handleClickMenu("/")}
                >
                  <Image
                    src={
                      layout === "dark" || navbarOpen
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
              </motion.div>
              <ButtonMenu
                navbarToggleHandler={navbarToggleHandler}
                navbarOpen={navbarOpen}
                sticky={sticky}
                layout={layout}
              />
              <motion.nav
                initial={false}
                animate={isDropdownOpen ? "open" : "closed"}
                id="navbarCollapse"
                ref={containerRef}
                className={`absolute top-0 left-0 right-0 z-[-1] lg:z-10 motion-safe:duration-700 lg:visible lg:!bg-transparent grid lg:h-auto ${
                  navbarOpen ? "h-screen" : "h-0"
                }`}
              >
                <div
                  className={`${
                    navbarOpen
                      ? "overflow-hidden text-white touch-none overscroll-none"
                      : "overflow-auto"
                  } lg:overflow-visible w-full h-full bg-base-200 lg:bg-transparent`}
                >
                  <ul
                    className={`${
                      sticky ? "" : ""
                    } block items-center w-full lg:max-w-auto pt-32 lg:pt-14 pb-4 lg:pb-0 gap-x-8 lg:flex lg:w-[700px] lg:mx-auto lg:justify-between`}
                  >
                    <li>
                      <ul className="lg:flex gap-x-16">
                        <li
                          className={`py-3 relative has-[.activeClass]:bg-accent`}
                        >
                          {menuData[0].path ? (
                            <motion.div
                              animate={
                                sticky || isDropdownOpen || navbarOpen
                                  ? "open"
                                  : "closed"
                              }
                            >
                              <a
                                className={`${
                                  pathname === menuData[0].path
                                    ? activeClass
                                    : ""
                                } ${itemClass} cursor-pointer`}
                                onClick={() =>
                                  handleClickMenu(menuData[0].path)
                                }
                              >
                                {menuData[0].title}
                              </a>
                            </motion.div>
                          ) : (
                            <DropdownMenu
                              sticky={sticky}
                              navbarOpen={navbarOpen}
                              isMega={false}
                              handleClickAndClose={handleClickMenu}
                              menuItem={menuData[0]}
                              isDropdownOpen={isDropdownOpen}
                              setIsDropdownOpen={setIsDropdownOpen}
                              itemClass={itemClass}
                            />
                          )}
                        </li>
                        <li
                          className={`py-3 relative has-[.activeClass]:bg-accent`}
                        >
                          {menuData[1].path ? (
                            <motion.div
                              animate={
                                sticky || isDropdownOpen || navbarOpen
                                  ? "open"
                                  : "closed"
                              }
                            >
                              <a
                                className={`${
                                  pathname === menuData[1].path
                                    ? activeClass
                                    : ""
                                } ${itemClass} cursor-pointer`}
                                onClick={() =>
                                  handleClickMenu(menuData[1].path)
                                }
                              >
                                {menuData[1].title}
                              </a>
                            </motion.div>
                          ) : (
                            <DropdownMenu
                              sticky={sticky}
                              navbarOpen={navbarOpen}
                              isMega={false}
                              handleClickAndClose={handleClickMenu}
                              menuItem={menuData[1]}
                              isDropdownOpen={isDropdownOpen}
                              setIsDropdownOpen={setIsDropdownOpen}
                              itemClass={itemClass}
                            />
                          )}
                        </li>
                      </ul>
                    </li>
                    <li>
                      <ul className="lg:flex gap-x-16">
                        <li
                          className={`py-3 relative has-[.activeClass]:bg-accent`}
                        >
                          {menuData[2].path ? (
                            <motion.div
                              animate={
                                sticky || isDropdownOpen || navbarOpen
                                  ? "open"
                                  : "closed"
                              }
                            >
                              <a
                                className={`${
                                  pathname === menuData[2].path
                                    ? activeClass
                                    : ""
                                } ${itemClass} cursor-pointer`}
                                onClick={() =>
                                  handleClickMenu(menuData[2].path)
                                }
                              >
                                {menuData[2].title}
                              </a>
                            </motion.div>
                          ) : (
                            <DropdownMenu
                              sticky={sticky}
                              navbarOpen={navbarOpen}
                              isMega={false}
                              handleClickAndClose={handleClickMenu}
                              menuItem={menuData[2]}
                              isDropdownOpen={isDropdownOpen}
                              setIsDropdownOpen={setIsDropdownOpen}
                              itemClass={itemClass}
                            />
                          )}
                        </li>
                        <li
                          className={`py-3 relative has-[.activeClass]:bg-accent`}
                        >
                          {menuData[3].path ? (
                            <motion.div
                              animate={
                                sticky || isDropdownOpen || navbarOpen
                                  ? "open"
                                  : "closed"
                              }
                            >
                              <a
                                className={`${
                                  pathname === menuData[3].path
                                    ? activeClass
                                    : ""
                                } ${itemClass} cursor-pointer`}
                                onClick={() =>
                                  handleClickMenu(menuData[3].path)
                                }
                              >
                                {menuData[3].title}
                              </a>
                            </motion.div>
                          ) : (
                            <DropdownMenu
                              sticky={sticky}
                              navbarOpen={navbarOpen}
                              isMega={false}
                              handleClickAndClose={handleClickMenu}
                              menuItem={menuData[3]}
                              isDropdownOpen={isDropdownOpen}
                              setIsDropdownOpen={setIsDropdownOpen}
                              itemClass={itemClass}
                            />
                          )}
                        </li>
                      </ul>
                    </li>
                  </ul>
                  {/* <div className="lg:hidden mt-10 mb-4 container">
                    <LanguageSelector hrefs={hrefs} lng={lng} />
                  </div> */}
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
