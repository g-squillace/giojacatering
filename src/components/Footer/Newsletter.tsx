import CustomIcon from "@/components/Blocks/CustomIcon";
import translate from "@/labels";
import { SiteLocale } from "@/graphql/generated";
import CheckboxCustom from "../Form/CheckboxCustom";

type PropsNewsletter = {
  title: string;
  subtitle: string;
  url: string;
  locale: SiteLocale;
};

export default function Newsletter({
  title,
  subtitle,
  url,
  locale,
}: PropsNewsletter) {
  return (
    <>
      <section className="container">
        <div className="py-12 md:flex md:gap-12 xl:w-10/12 mx-auto">
          <div className="xl:w-1/2">
            {title && <h2 className="font-serif text-lg xl:pr-40">{title}</h2>}
            {subtitle && (
              <div
                className="text-sm text-gray-light mt-4"
                dangerouslySetInnerHTML={{ __html: `${subtitle}` }}
              />
            )}
          </div>
          <div id="mc_embed_signup" className="xl:w-1/2">
            <form
              action={url}
              method="post"
              id="mc-embedded-subscribe-form"
              name="mc-embedded-subscribe-form"
              className="validate"
              target="_blank"
            >
              <div className="py-4 md:pt-0" id="mc_embed_signup_scroll">
                <div className="mc-field-group">
                  <label
                    htmlFor="mce-EMAIL"
                    className="text-xs mb-2 mt-1 block"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    required={true}
                    defaultValue=""
                    name="EMAIL"
                    placeholder="Inserisci la tua email *"
                    className="block w-full bg-white rounded-lg py-3 px-3 text-xs text-base-content placeholder:text-base-content lg:py-4 max-w-[560px]"
                    id="mce-EMAIL"
                  />
                </div>

                <div id="mce-responses" className="clear foot">
                  <div className="hidden" id="mce-error-response"></div>
                  <div className="hidden" id="mce-success-response"></div>
                </div>
                <div className="sr-only" aria-hidden="true">
                  <label htmlFor="b_b43a7bd9734c7124b3be52921_1911023b36">
                    b_b43a7bd9734c7124b3be52921_1911023b36
                  </label>
                  <input
                    type="text"
                    name="b_b43a7bd9734c7124b3be52921_1911023b36"
                    tabIndex={-1}
                    defaultValue=""
                    id="b_b43a7bd9734c7124b3be52921_1911023b36"
                  />
                </div>
                <div id="mergeRow-gdpr">
                  <div className="mb-2 mt-4">
                    <fieldset
                      className="flex items-start gap-2"
                      name="interestgroup_field"
                      role="group"
                      aria-label={translate(
                        "newsletter.privacyFieldsetLabel",
                        locale
                      )}
                    >
                      <legend className="hidden">
                        {translate("newsletter.privacyFieldsetLabel", locale)}
                      </legend>
                      <input
                        type="checkbox"
                        className="checkbox-custom"
                        defaultValue="Y"
                        name="gdpr[150837]"
                        id="gdpr_150837"
                        required
                      />
                      <CheckboxCustom />
                      <label
                        className="cursor-pointer text-xs text-gray-light"
                        htmlFor="gdpr_150837"
                      >
                        {translate("newsletter.accept", locale)}
                        <a
                          href="https://mailchimp.com/legal/privacy"
                          title={`Privacy Policy ${translate(
                            "externaLink",
                            locale
                          )}`}
                          target="_blank"
                          className="mx-1 underline"
                          rel="noreferrer noopener"
                        >
                          {translate("newsletter.policy", locale)}
                        </a>
                        {translate("newsletter.authorize", locale)}
                      </label>
                    </fieldset>
                  </div>
                </div>
                <div className="optionalParent inline-block mt-2">
                  <div className="bg-accent flex items-center text-sm font-bold rounded-full text-secondary py-2 px-6 group">
                    <input
                      aria-label="undefined"
                      type="submit"
                      defaultValue={translate("newsletter.subscribe", locale)}
                      name="subscribe"
                      id="mc-embedded-subscribe"
                    />
                    <CustomIcon
                      classes="size-4 bg-primary ml-2 group-hover:ml-6 inline-block motion-safe:duration-300"
                      fileName="arrow-right"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
