"use client";
import { EventRecord, SiteLocale } from "@/graphql/generated";
import { SearchBox, Configure, RefinementList } from "react-instantsearch";
// import Pagination from "./Pagination";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Pagination } from "react-instantsearch";
import { useState } from "react";
import CardEventBlock from "../Event/CardEventBlock";
import { FacetDropdown } from "../Search/FacetDropdown";
import DatePicker from "../Search/DatePicker";
import translate from "@/labels";
import CustomIcon from "../Blocks/CustomIcon";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type Props = {
  hits: any;
  lng: SiteLocale;
  isSearchResult?: boolean;
  results?: any;
  uiState?: any;
  items?: any;
  use?: any;
};

const EventGridRendererSearch = ({
  hits,
  lng,
  isSearchResult = false,
}: Props) => {
  const pageSize = 11;
  const [currentPage, setCurrentPage] = useState(0);

  let s = currentPage * pageSize;
  let end = s + pageSize;
  const pageList = hits.length > pageSize ? hits.slice(s, end) : hits;

  const [numericFilters, setNumericFilters] = useState<string[]>([]);

  const handleDateFilter = ({
    operator,
    filter,
  }: {
    operator: string;
    filter: string;
  }) => {
    const newFilters = numericFilters.filter((f) => !f.includes(operator));
    newFilters.push(filter);
    setNumericFilters(newFilters);
  };

  const [filterOpen, setFilterOpen] = useState(false);
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  return (
    <section className="container">
      <Configure hitsPerPage={pageSize} numericFilters={numericFilters} />
      <button
        onClick={toggleFilter}
        className="bg-base-200 w-full mt-6 p-3 py-5 flex gap-2 items-center font-bold uppercase text-base font-serif lg:hidden"
      >
        <CustomIcon fileName="filter" classes="w-4 h-4 bg-base-content" />
        <span>{translate("openFilter", lng)}</span>
      </button>
      <div
        className={`${
          filterOpen ? "h-auto" : "h-0"
        } motion-safe:duration-[.75s] lg:!h-auto overflow-hidden lg:overflow-visible border-b lg:border-none lg:my-6 lg:bg-base-200 lg:px-24 lg:py-12`}
      >
        <div className="uppercase md:mb-0 font-serif font-bold tracking-wider hidden lg:block pb-8">
          {translate("search.search_for", lng)}
        </div>
        <div className="lg:grid-cols-3 xl:grid-cols-4 lg:grid lg:gap-3">
          <div className="flex gap-2 border-x border-gray-200 px-3 items-center lg:px-4 lg:border lg:border-base-300 lg:bg-base-100">
            <MagnifyingGlassIcon className="h-6 w-6 text-accent" />
            <SearchBox
              placeholder={translate(`search.search_name`, lng)}
              classNames={{
                root: "",
                input:
                  "placeholder-black bg-white text-md focus:ring-gray py-4 w-full px-2",
                submit: "hidden",
                resetIcon: "hidden",
              }}
            />
          </div>
          <div className="relative">
            <label
              htmlFor="startDate"
              className="font-bold text-sm absolute lg:right-auto right-9 lg:-top-6 top-5 left-auto"
            >
              {translate("filters.startDate", lng)}
            </label>
            <DatePicker
              id="startDate"
              type="start"
              handleDateFilter={handleDateFilter}
            />
          </div>
          <div className="relative">
            <label
              htmlFor="endDate"
              className="font-bold text-sm absolute lg:right-auto right-9 lg:-top-6 top-5 left-auto"
            >
              {translate("filters.endDate", lng)}
            </label>
            <DatePicker
              id="endDate"
              type="end"
              handleDateFilter={handleDateFilter}
            />
          </div>
          <div>
            <FacetDropdown attribute="category" locale={lng} />
          </div>
          <div>
            <FacetDropdown attribute="target" locale={lng} />
          </div>
          <div>
            <FacetDropdown attribute="place" locale={lng} />
          </div>
        </div>
        {/* </div> */}
      </div>
      <div
        id="items"
        className="container max-w-auto py-6 lg:py-10 scroll-mt-[80px] md:scroll-mt-[90px]"
      >
        <div
          id="targetElement"
          className="grid gap-6 md:gap-y-32 lg:grid-cols-12 xl:gap-10 scroll-mt-32"
        >
          {pageList.length > 0 &&
            pageList.map((event, i: number) => (
              <div
                key={event.objectID}
                className={`${i < 2 ? "lg:col-span-6" : "lg:col-span-4"}`}
              >
                <CardEventBlock
                  data={event as EventRecord & any}
                  locale={lng}
                  isSearchResult={isSearchResult}
                  i={i}
                />
              </div>
            ))}
        </div>
        <Pagination
          onClick={() => {
            const windowWidth = window.innerWidth;
            let scrollTop = 0;
            if (windowWidth >= 1024) {
              scrollTop = 700;
            } else {
              scrollTop = 400;
            }
            scrollTo(0, scrollTop);
          }}
          showFirst={false}
          showPrevious={true}
          showNext={true}
          showLast={false}
          totalPages={4}
          classNames={{
            root: "py-10 md:pb-20",
            noRefinementRoot: "",
            list: "flex gap-2 justify-center",
            selectedItem: "bg-secondary",
            disabledItem: "opacity-20",
            nextPageItem: "",
            lastPageItem: "",
            link: "",
          }}
          translations={{
            previousPageItemText: (
              <div className="bg-primary w-10 h-10 flex items-center justify-center border border-primary">
                <ArrowLeftIcon className="text-secondary w-5 h-5" />
              </div>
            ) as any,
            nextPageItemText: (
              <div className="bg-primary w-10 h-10 flex items-center justify-center border border-primary">
                <ArrowRightIcon className="text-secondary w-5 h-5" />
              </div>
            ) as any,
            pageItemText: ({ currentPage }) =>
              (
                <div className="border-black relative w-10 h-10 text-center border flex items-center justify-center">
                  {currentPage}
                </div>
              ) as any,
            previousPageItemAriaLabel: translate("pagePrev", lng),
            nextPageItemAriaLabel: translate("pageNext", lng),
            pageItemAriaLabel: ({ currentPage, nbPages }) =>
              `${translate("pageGoTo", lng)} ${currentPage} ${translate(
                "pageOf",
                lng
              )} ${nbPages}`,
          }}
        />
      </div>
    </section>
  );
};

export default EventGridRendererSearch;
