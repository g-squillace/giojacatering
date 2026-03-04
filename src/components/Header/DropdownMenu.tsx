import SubMenuItems from "./SubMenuItems";
import CustomIcon from "@/components/Blocks/CustomIcon";
import { motion, useCycle } from "framer-motion";
import { useRef, useEffect } from "react";
export default function DropdownMenu({
  sticky,
  navbarOpen,
  menuItem,
  isMega,
  handleClickAndClose,
  isDropdownOpen,
  setIsDropdownOpen,
  itemClass,
}) {
  const [dropdownOpen, toggleOpen] = useCycle(false, true);
  // const containerRef = useRef(null);

  const dropdownVariants = {
    open: {
      gridTemplateRows: "1fr",
      transition: {
        ease: "easeOut",
        duration: 0.5,
      },
    },
    closed: {
      gridTemplateRows: "0fr",
      transition: {
        ease: "easeOut",
        duration: 0.35,
      },
    },
  };
  const colorVariants = {
    open: {
      transition: {
        ease: "easeOut",
        duration: 0.25,
      },
    },
    closed: {
      transition: {
        ease: "easeOut",
        duration: 0.25,
      },
    },
  };
  const invertVariants = {
    open: {
      transition: {
        ease: "easeOut",
        duration: 0.25,
      },
    },
    closed: {
      transition: {
        ease: "easeOut",
        duration: 0.25,
      },
    },
  };
  const handleSubmenu = () => {
    if (!isDropdownOpen) {
      setIsDropdownOpen(!isDropdownOpen);
    }
    toggleOpen();
  };
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleHideDropdown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (dropdownOpen) {
          toggleOpen();
        }
        if (isDropdownOpen) {
          setIsDropdownOpen(false);
        }
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !(wrapperRef.current as HTMLElement).contains(event.target as Node) &&
        dropdownOpen
      ) {
        toggleOpen();
      }
      if (isDropdownOpen) {
        setIsDropdownOpen(!isDropdownOpen);
      }
    };

    document.addEventListener("keydown", handleHideDropdown, true);
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownOpen, isDropdownOpen, setIsDropdownOpen, toggleOpen]);

  return (
    <>
      <motion.button
        animate={sticky || dropdownOpen || navbarOpen ? "open" : "closed"}
        onClick={() => handleSubmenu()}
        variants={colorVariants}
        className=""
      >
        <span ref={wrapperRef} className={itemClass}>
          {menuItem.title}
          <motion.span
            animate={sticky || navbarOpen ? "open" : "closed"}
            variants={invertVariants}
          >
            <CustomIcon
              classes={`w-3 h-3 bg-primary`}
              fileName="chevron-down"
            />
          </motion.span>
        </span>
      </motion.button>

      <motion.div
        animate={dropdownOpen ? "open" : "closed"}
        variants={dropdownVariants}
        className={`submenu relative grid grid-rows-[0fr] ${
          isMega
            ? "top-0 lg:w-screen left-0"
            : `${sticky ? "drop-shadow-md" : ""} min-w-[260px] lg:mt-[40px]`
        } px-6 lg:px-2 lg:absolute lg:z-[-1] lg:left-1/2 lg:-translate-x-1/2 bg-base-100`}
      >
        <div className="overflow-hidden h-full">
          {menuItem.submenu && (
            <SubMenuItems
              items={menuItem.submenu}
              isMega={isMega}
              handleClickAndClose={handleClickAndClose}
              dropdownOpen={dropdownOpen}
              itemClass={itemClass}
            />
          )}
        </div>
      </motion.div>
    </>
  );
}
