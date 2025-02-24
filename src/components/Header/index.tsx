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
};

const activeClass = "bg-accent";
const itemClass =
  "lg:px-0 hover:underline whitespace-nowrap duration-200 px-6 flex items-center gap-1";

const invertVariants = {
  open: { transition: { ease: "easeOut", duration: 0.25 } },
  closed: { transition: { ease: "easeOut", duration: 0.25 } },
};

const Header = ({ lng, hrefs, data }: Props) => {
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
    <header className="header left-0 flex w-full items-center fixed top-0 z-20">
      <div
        className={`relative isolate z-20 w-full md:py-4 motion-safe:duration-300 ${
          sticky
            ? "bg-primary text-primary-content"
            : "bg-secondary text-secondary-content"
        }`}
      >
        <div className="container">
          <div className="lg:flex w-full justify-end flex-row-reverse items-center gap-x-8 relative z-[2]">
            <div className="hidden lg:flex items-center justify-end">
              <LanguageSelector lng={lng} hrefs={hrefs} />
            </div>
            <div className="w-full flex justify-between items-center pt-5 lg:pt-0">
              <motion.div
                className="w-28 xl:w-[180px] max-w-full  z-10"
                animate={sticky || navbarOpen ? "open" : "closed"}
                variants={invertVariants}
              >
                <a
                  // href="/"
                  className="block w-full py-9 relative cursor-pointer"
                  onClick={() => handleClickMenu("/")}
                >
                  {data.layout.logo.url && (
                    <Image
                      src={
                        !sticky ? data.layout.logoAlt.url : data.layout.logo.url
                      }
                      alt="logo"
                      className="w-full h-full absolute inset-0 object-left object-contain"
                      priority
                      width={100}
                      height={100}
                    />
                  )}
                </a>
              </motion.div>
              <ButtonMenu
                navbarToggleHandler={navbarToggleHandler}
                navbarOpen={navbarOpen}
                sticky={sticky}
              />
              <motion.nav
                initial={false}
                animate={isDropdownOpen ? "open" : "closed"}
                id="navbarCollapse"
                ref={containerRef}
                className={`absolute top-0 right-0 z-[-1] lg:z-30  bg-primary text-primary-content motion-safe:duration-700 lg:visible lg:static  lg:!bg-transparent grid lg:h-auto ${
                  navbarOpen ? "h-screen" : "h-0"
                }`}
              >
                <div className="overflow-auto lg:overflow-visible w-full h-full">
                  <ul
                    className={`${
                      sticky
                        ? "lg:text-primary-content"
                        : "lg:text-base-content"
                    }  block text-primary-content items-center w-full lg:max-w-auto pt-28 lg:pt-0 pb-4 lg:pb-0 lg:flex gap-x-8`}
                  >
                    {menuData.map((menuItem, i) => {
                      const isMega = menuItem.submenu?.some((i) => i.menuImage);

                      return (
                        <li
                          key={menuItem.id}
                          className={`py-4 ${
                            isMega ? "" : "relative"
                          } has-[.activeClass]:bg-accent
                              ${i == 4 ? "lg:justify-start lg:ml-auto" : ""}
                              `}
                        >
                          {menuItem.path ? (
                            <motion.div
                              animate={
                                sticky || isDropdownOpen || navbarOpen
                                  ? "open"
                                  : "closed"
                              }
                            >
                              <a
                                // href={menuItem.path}
                                className={`${
                                  pathname === menuItem.path ? activeClass : ""
                                } ${itemClass} cursor-pointer`}
                                onClick={() => handleClickMenu(menuItem.path)}
                              >
                                {menuItem.title}
                              </a>
                            </motion.div>
                          ) : (
                            <DropdownMenu
                              sticky={sticky}
                              navbarOpen={navbarOpen}
                              isMega={isMega}
                              // handleClickAndClose={handleClickAndClose}
                              handleClickAndClose={handleClickMenu}
                              menuItem={menuItem}
                              isDropdownOpen={isDropdownOpen}
                              setIsDropdownOpen={setIsDropdownOpen}
                              itemClass={itemClass}
                            />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  <div className="lg:hidden mt-10 mb-4 container">
                    <LanguageSelector hrefs={hrefs} lng={lng} />
                  </div>
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
