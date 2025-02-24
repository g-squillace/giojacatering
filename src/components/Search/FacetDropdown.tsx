import { useRef, useState, useEffect } from "react";
import { RefinementList, useCurrentRefinements } from "react-instantsearch";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import translate from "@/labels";

export function FacetDropdown({
  attribute,
  locale,
}: {
  attribute: string;
  locale: string;
}) {
  const [display, setDisplay] = useState<boolean>(false);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const { items } = useCurrentRefinements();

  function getAttributeRefinements(attribute, items) {
    const item = items.find((item) => item.attribute === attribute);
    return item?.refinements || [];
  }

  const refinements = getAttributeRefinements(attribute, items);

  const handleOutsideClick = (e) => {
    if (
      !buttonRef.current?.contains(e.target) &&
      !panelRef.current.contains(e.target)
    ) {
      setDisplay(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative">
      <button
        className="border-x border-t border-gray-200 w-full py-4 px-2 text-md lg:border lg:border-base-300 lg:bg-base-100"
        ref={buttonRef}
        onClick={() => setDisplay((prev) => !prev)}
      >
        <div className="px-2 flex items-center justify-between">
          <div className="text-gray-medium">
            {translate(`search.${attribute}`, locale)}
            {/* {refinements && refinements.length > 0 && `(${refinements.length})`} */}
          </div>
          {display ? (
            <ChevronUpIcon
              className="block h-6 w-6 text-accent"
              aria-hidden="true"
            />
          ) : (
            <ChevronDownIcon
              className="block h-6 w-6 text-accent"
              aria-hidden="true"
            />
          )}
        </div>
      </button>
      <div
        ref={panelRef}
        style={
          !display ? { display: "none" } : { zIndex: "80", display: "block" }
        }
        className=" border-x border-gray-200 w-full p-4 lg:bg-base-100 lg:border-base-300 lg:border-b lg:absolute z-30"
      >
        <RefinementList
          classNames={{
            root: "text-base",
            list: "space-y-4",
            item: "cursor-pointer hover:font-bold",
            checkbox:
              "relative mr-2 h-5 w-5 peer appearance-none checked:bg-border before:z-[1] before:block before:w-5 before:h-5 before:border before:border-neutral after:bg-accent after:w-5 after:h-5 checked:after:scale-[.6] after:scale-[0] after:duration-300 after:absolute after:lef-0 after:top-0 before:mr-2",
            label: "cursor-pointer relative flex items-start ",
            count:
              "ml-2 px-[3px] bg-border rounded-md text-sm font-bold translate-y-px",
            selectedItem: "font-bold",
            searchBox: "my-2 p-2 rounded ",
          }}
          attribute={attribute}
        />
      </div>
    </div>
  );
}
