import { FormBlockRecord, SiteLocale } from "@/graphql/generated";
import Form from "@/components/Form/Form";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import type { SectionContacts } from "@/components/Sections";

type PropsFormBlock = {
  data: FormBlockRecord;
  locale: SiteLocale;
  contacts?: SectionContacts;
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

const FormBlock = ({ data, locale, contacts }: PropsFormBlock) => {
  const { titleForm, textForm } = data;
  const address = contacts?.address;
  const email = contacts?.email;
  const phone = contacts?.phone;
  const telHref = phone ? `tel:${phone.replace(/[^+\d]/g, "")}` : null;
  const linkClass = "hover:underline underline-offset-4";
  return (
    <>
      <div className="container relative xl:w-10/12">
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.1 }}
          variants={variants}
          className="lg:grid lg:grid-cols-2"
        >
          <div className="">
            <div className="grid relative gap-6 bg-secondary xl:px-12 xl:py-12 p-4 py-8 after:absolute after:w-full after:h-full after:bg-secondary after:translate-x-full after:z-0">
              {titleForm && <div className="prefix">{titleForm}</div>}
              {textForm && (
                <div
                  className="title"
                  dangerouslySetInnerHTML={{ __html: textForm }}
                />
              )}
            </div>
            {address && (
              <div className="gap-6 m-4 pt-4">
                <div className="flex gap-4 items-start">
                  <Image
                    src="assets/pin.svg"
                    width="20"
                    height="20"
                    alt=""
                    aria-hidden="true"
                    className="size-10"
                  />
                  <div className="">
                    <div className="title-small">Indirizzo</div>
                    <address className="not-italic">{address}</address>
                  </div>
                </div>
              </div>
            )}
            {email && (
              <div className="gap-6 m-4 pt-4">
                <div className="flex gap-4 items-start">
                  <Image
                    src="assets/mail.svg"
                    width="20"
                    height="20"
                    alt=""
                    aria-hidden="true"
                    className="size-9"
                  />
                  <div className="">
                    <div className="title-small">Email</div>
                    <a href={`mailto:${email}`} className={linkClass}>
                      {email}
                    </a>
                  </div>
                </div>
              </div>
            )}
            {phone && telHref && (
              <div className="gap-6 m-4 pt-4">
                <div className="flex gap-4 items-start">
                  <Image
                    src="assets/call.svg"
                    width="20"
                    height="20"
                    alt=""
                    aria-hidden="true"
                    className="size-9"
                  />
                  <div className="">
                    <div className="title-small">Telefono</div>
                    <a href={telHref} className={linkClass}>
                      {phone}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Form locale={locale} />
        </motion.div>
      </div>
    </>
  );
};

export default FormBlock;
