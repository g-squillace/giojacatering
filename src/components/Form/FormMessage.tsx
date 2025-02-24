import { SiteLocale } from "@/graphql/generated";
import translate from "@/labels";

type PropsFormMessage = {
  status: string;
  locale: SiteLocale;
};

const FormMessage = ({ status, locale }: PropsFormMessage) => {
  const bannerClass = "mt-4 rounded-md p-5";
  const titleClass = "font-bold";
  const textClass = "text-sm mt-2";
  if (status === "sending") {
    return (
      <div className={`${bannerClass} bg-primary`}>
        <div className="">
          <div className={titleClass}>
            {translate("formSandingTitle", locale)}
          </div>
        </div>
      </div>
    );
  }
  if (status === "success") {
    return (
      <div className={`${bannerClass} bg-green-600`}>
        <div className="text-white">
          <div className={titleClass}>
            {translate("formSuccessTitle", locale)} 😃
          </div>
          <div className={textClass}>
            {translate("formSuccessText", locale)}
          </div>
        </div>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className={`${bannerClass} bg-red-600`}>
        <div className="text-white">
          <div className={titleClass}>
            {translate("formErrorTitle", locale)} 😔
          </div>
          <div className={textClass}>{translate("formErrorText", locale)}</div>
        </div>
      </div>
    );
  }
  return "";
};

export default FormMessage;
