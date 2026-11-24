import { FooterQuery, SiteLocale } from "@/graphql/generated";
import Newsletter from "@/components/Footer/Newsletter";
import ExternalLink from "@/components/Links/ExternalLink";
import translate from "@/labels";
import CustomIcon from "@/components/Blocks/CustomIcon";
import Socials from "@/components/Footer/Socials";
import Iubenda from "@/components/Footer/ExternalServices/Iubenda";
import GoogleAnalytics from "@/components/Footer/ExternalServices/GoogleAnalytics";
import FacebookPixel from "@/components/Footer/ExternalServices/FacebookPixel";
import MenuFooter from "@/components/Footer/MenuFooter";
import LeadTracking from "@/components/Footer/ExternalServices/LeadTracking";

type Props = {
  data: any;
  lng: SiteLocale;
};

const year = new Date().getFullYear();

const ENV = process.env.DATO_ENV;

const Footer = ({ data, lng }: Props) => {
  if (!data?.layout) return null;
  const {
    rea,
    address,
    googleMaps,
    phone,
    footerMenu,
    email,
    iva,
    urlNewsletter,
    footerLogo,
    socialMediaLinks,
    titleNewsletter,
    textNewsletter,
    colorReverseBanner,
    iubendaPolicyId,
    iubendaSiteId,
  } = data?.layout;
  return (
    <>
      <footer>
        <div className="bg-primary text-primary-content xl:px-32">
          <div className="container px-6 mx-auto py-6">
            <div className="grid gap-2 md:flex md:justify-between xl:items-center ">
              <div className="text-xs xl:flex xl:justify-between xl:gap-2">
                <span className="">
                  © {year} {rea}
                </span>
                <span className="px-1 xl:px-0"> - </span>
                <span className="">P.IVA {iva}</span>
                <span className="px-1 xl:px-0 hidden xl:block"> - </span>
                <div className="">
                  <ExternalLink
                    url="https://www.guidosquillace.it"
                    title="Web designer web developer Guido Squillace info@guidosquillace.it"
                    locale={lng}
                    className="hover:underline hover:underline-offset-4"
                  >
                    Design & Dev Guido Squillace
                  </ExternalLink>
                </div>
              </div>
              <div className="text-xs">
                <a
                  href={`https://www.iubenda.com/privacy-policy/${iubendaPolicyId}`}
                  title={`Privacy Policy`}
                  className="iubenda-nostyle no-brand iubenda-noiframe iubenda-embed"
                >
                  <span className="hover:underline hover:underline-offset-4 ">
                    Privacy Policy
                  </span>
                </a>
                <span className="px-1"> - </span>
                <a
                  href={`https://www.iubenda.com/privacy-policy/${iubendaPolicyId}/cookie-policy`}
                  title={`Cookie Policy`}
                  className="iubenda-nostyle no-brand iubenda-noiframe iubenda-embed"
                >
                  <span className="hover:underline hover:underline-offset-4 ">
                    Cookie Policy
                  </span>
                </a>
                <span className="px-1"> - </span>
                <a
                  href="#"
                  title={`Cookie Policy`}
                  className="iubenda-cs-preferences-link"
                >
                  <span className="hover:underline hover:underline-offset-4 ">
                    {translate("preferencePolicy", lng)}
                  </span>
                </a>
                <a
                  href="/report"
                  rel="nofollow"
                  className="mt-2 inline-flex min-h-[44px] items-center gap-2 hover:underline hover:underline-offset-4 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent md:mt-0 md:ml-3"
                >
                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    focusable="false"
                    className="h-3.5 w-3.5 fill-current"
                  >
                    <rect x="1" y="9" width="3" height="6" />
                    <rect x="6.5" y="5" width="3" height="10" />
                    <rect x="12" y="1" width="3" height="14" />
                  </svg>
                  Andamento del sito
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {iubendaSiteId && iubendaPolicyId && ENV !== "develop" && (
        <Iubenda
          locale={lng}
          siteId={iubendaSiteId}
          policyId={iubendaPolicyId}
          colorRev={colorReverseBanner}
        />
      )}
      {ENV !== "develop" && (
        <>
          <GoogleAnalytics />
          <FacebookPixel />
          <LeadTracking />
        </>
      )}
    </>
  );
};

export default Footer;
