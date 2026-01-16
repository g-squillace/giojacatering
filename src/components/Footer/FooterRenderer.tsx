import { FooterQuery, SiteLocale } from "@/graphql/generated";
import Newsletter from "@/components/Footer/Newsletter";
import ExternalLink from "@/components/Links/ExternalLink";
import translate from "@/labels";
import CustomIcon from "@/components/Blocks/CustomIcon";
import Socials from "@/components/Footer/Socials";
import Iubenda from "@/components/Footer/ExternalServices/Iubenda";
import GoogleAnalytics from "@/components/Footer/ExternalServices/GoogleAnalytics";
import MenuFooter from "@/components/Footer/MenuFooter";

type Props = {
  data: any;
  lng: SiteLocale;
};

const year = new Date().getFullYear();

const ENV = process.env.DATO_ENV;

const Footer = ({ data, lng }: Props) => {
  console.log("data.layout:", data?.layout);
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
    googleAnalyticsId,
  } = data?.layout;
  return (
    <>
      <footer>
        <div className="bg-primary text-primary-content/60 xl:px-32">
          <div className="container px-6 mx-auto py-6">
            <div className="grid gap-2 md:flex md:justify-between xl:items-center ">
              <div className="text-xs text-gray-light xl:flex xl:justify-between xl:gap-2">
                <span className="">
                  © {year} {rea}
                </span>
                <span className="px-1 xl:px-0"> - </span>
                <span className="">P.IVA {iva}</span>
                <span className="px-1 xl:px-0 hidden xl:block"> - </span>
                <div className="">
                  <ExternalLink
                    url="https//www.guidosquillace.it"
                    title="Web designer web developer Guido Squillace info@guidosquillace.it"
                    locale={lng}
                    className="hover:underline hover:underline-offset-4"
                  >
                    Design & Dev Guido Squillace
                  </ExternalLink>
                </div>
              </div>
              <div className="text-xs text-gray-light">
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
      {googleAnalyticsId && ENV !== "develop" && (
        <GoogleAnalytics id={googleAnalyticsId} />
      )}
    </>
  );
};

export default Footer;
