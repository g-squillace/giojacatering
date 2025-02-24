import translate from "@/labels";
import CustomIcon from "../Blocks/CustomIcon";

export default function Pagination({
  handleChangePage,
  totals,
  pageSize,
  currentPage,
  locale,
  maxPageButtons = 2,
}) {
  let totalPages = Math.floor(totals / pageSize);
  if (totals % pageSize > 0) {
    totalPages += 1;
  }

  const pages = Array(totalPages)
    .fill(0)
    .map((_, i) => i);

  const handleClick = () => {
    const element = document.getElementById("targetElement");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const classNav =
    "relative z-0 flex justify-center items-center space-x-2 md:space-x-4 py-12 lg:col-start-2 lg:col-span-3 xl:pb-20";
  const disabled = "cursor-auto opacity-10";
  const classButton =
    "border group border-base-300 w-9 h-9 md:w-[60px] md:h-[60px] rounded-full relative duration-300";
  let dotsAdded = false;

  if (pages.length > 1) {
    return (
      <div className="my-20 flex gap-1 justify-center md:col-span-2 text-sm">
        <nav
          onClick={handleClick}
          className={classNav}
          role="navigation"
          aria-label={translate("pagination.title", locale)}
        >
          <button
            onClick={
              currentPage >= 1 ? () => handleChangePage(currentPage - 1) : null
            }
            aria-label={translate("pagination.pagePrev", locale)}
            className={`${
              currentPage >= 1 ? "hover:bg-primary" : disabled
            } ${classButton} bg-primary-content md:mr-6`}
          >
            <CustomIcon
              classes="bg-secondary-content group-hover:bg-primary-content w-20 h-20 absolute inset-1/2 -translate-x-1/2 -translate-y-1/2"
              fileName="chevron-left"
            />
          </button>

          {pages.map((p, index) => {
            if (
              index === 0 ||
              index === totalPages - 1 ||
              (index >= currentPage - Math.floor(maxPageButtons / 2) &&
                index <= currentPage + Math.floor(maxPageButtons / 2))
            ) {
              dotsAdded = false;
              return (
                <button
                  key={p}
                  className={`${
                    p == currentPage
                      ? "bg-primary text-primary-content border-base-200 "
                      : "bg-base-100 border-base-200 hover:bg-primary"
                  } ${classButton}`}
                  onClick={() => handleChangePage(p)}
                  aria-current={p == currentPage ? true : false}
                  aria-label={`${translate("pagination.pageGoTo", locale)} ${
                    p + 1
                  } ${translate("pagination.pageOf", locale)} ${totalPages}`}
                >
                  {p + 1}
                </button>
              );
            } else if (!dotsAdded) {
              dotsAdded = true;
              return (
                <button
                  key={index}
                  className="w-2"
                  disabled
                  aria-disabled="true"
                >
                  ...
                </button>
              );
            }
          })}

          <button
            onClick={
              Number(currentPage) < totalPages
                ? () => handleChangePage(Number(currentPage) + 1)
                : null
            }
            aria-label={translate("pagination.pageNext", locale)}
            className={`${
              Number(currentPage) < totalPages - 1
                ? "hover:bg-primary"
                : disabled
            } ${classButton} bg-primary-content md:!ml-10`}
          >
            <CustomIcon
              classes="bg-secondary-content group-hover:bg-primary-content w-20 h-20 absolute inset-1/2 -translate-x-1/2 -translate-y-1/2"
              fileName="chevron-right"
            />
          </button>
        </nav>
      </div>
    );
  }
}
