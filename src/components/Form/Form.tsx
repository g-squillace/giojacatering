import React from "react";
import { useForm } from "react-hook-form";
import { SiteLocale } from "@/graphql/generated";
import translate from "@/labels";
import ExternalLink from "@/components/Links/ExternalLink";
import FormMessage from "@/components/Form/FormMessage";
import CheckboxCustom from "@/components/Form/CheckboxCustom";
import CustomIcon from "@/components/Blocks/CustomIcon";
import { motion, Variants } from "framer-motion";
import ButtonBlock from "../Blocks/ButtonBlock";

type PropsContactForm = {
  locale: SiteLocale;
};

const ContactForm = ({ locale }: PropsContactForm) => {
  const formWebhook = process.env.NEXT_PUBLIC_FORM;
  const labelClass = "text-sm block mb-1.5 font-bold";
  const inputClass =
    "w-full px-2 md:px-4 placeholder:text-gray-dark text-black bg-white placeholder:text-sm py-3 border border-primary-content rounded-md";
  const checkboxClass =
    "h-4 w-4 shrink-0 rounded-full bg-white text-black accent-black";

  const { register, handleSubmit } = useForm();
  const [result, setResult] = React.useState("");

  const onSubmit = async (data: any) => {
    if (data.antiSpam !== "") {
      return;
    }
    setResult("sending");
    const formData = new FormData();
    formData.append("From", "---");

    for (const key in data) {
      formData.append(key, data[key]);
    }

    const res = await fetch(formWebhook, {
      method: "POST",
      body: formData,
    }).then((res) => res.json());

    if (res.status == "success") {
      setResult("success");
    } else {
      setResult("error");
    }
  };

  const variants: Variants = {
    offscreen: {
      opacity: 0,
      y: 100,
    },
    onscreen: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
      },
    },
  };

  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.1 }}
      variants={variants}
    >
      <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
        <div aria-hidden="true" className="hidden">
          <label htmlFor="antiSpam">AntiSpam</label>
          <input
            type="text"
            name="antiSpam"
            id="antiSpam"
            required={false}
            {...register("antiSpam")}
          />
        </div>
        <div className="grid gap-6">
          <div>
            <label htmlFor="fullName" className={labelClass}>
              {translate("formFullName", locale)}
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              autoComplete="given-name"
              placeholder={translate("formFullName", locale)}
              required={true}
              className={inputClass}
              {...register("Nome")}
            />
          </div>
          <div>
            <label htmlFor="lastName" className={labelClass}>
              {translate("formLastName", locale)}
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              autoComplete="family-name"
              placeholder={translate("formLastName", locale)}
              required={true}
              className={inputClass}
              {...register("Cognome")}
            />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              autoComplete="email"
              required={true}
              className={inputClass}
              {...register("Email")}
            />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>
              {translate("formPhoneNumber", locale)}
            </label>
            <input
              type="number"
              name="phone"
              id="phone"
              autoComplete="tel"
              placeholder={translate("formPhoneNumber", locale)}
              required={true}
              className={inputClass}
              {...register("Telefono")}
            />
          </div>
          <div>
            <label htmlFor="message" className={`${labelClass}`}>
              {translate("formMessage", locale)}
            </label>
            <textarea
              name="message"
              id="message"
              placeholder={translate("formMessage", locale)}
              required={true}
              className={`${inputClass} h-24 border-b border-pink`}
              {...register("Messaggio")}
            />
          </div>
          <fieldset
            className="mt-3 flex items-center"
            role="group"
            aria-label={translate("formPrivacyFieldsetLabel", locale)}
          >
            <legend className="sr-only">
              {translate("formPrivacyFieldsetLabel", locale)}
            </legend>
            <input
              id="privacyCheckbox"
              type="checkbox"
              value=""
              required={true}
              className="checkbox-custom"
            />
            <CheckboxCustom />
            <label htmlFor="privacyCheckbox" className="ml-2 text-xs">
              {translate("formPrivacyPre", locale)}
              <ExternalLink
                label={"Privacy Policy"}
                url={`//www.iubenda.com/privacy-policy/${translate(
                  "cookiePolicyId",
                  locale
                )}`}
                className="iubenda-nostyle no-brand iubenda-embed iubenda-noiframe underline font-extra-bold"
              >
                {"Privacy Policy"}
              </ExternalLink>
              {translate("formPrivacyAfter", locale)}
            </label>
          </fieldset>
          <FormMessage status={result} locale={locale} />
          <div className="mt-6">
            <button className="group" type="submit">
              <ButtonBlock label={translate("formSend", locale)} />
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default ContactForm;
