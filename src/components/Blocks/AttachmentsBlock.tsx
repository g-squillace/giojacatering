import CustomIcon from "@/components/Blocks/CustomIcon";
import {
  AttachmentRecord,
  AttachmentsBlockRecord,
  SiteLocale,
} from "@/graphql/generated";
import ExternalLink from "../Links/ExternalLink";
import { motion, Variants } from "framer-motion";

type PropsAttachmentsBlock = {
  data: AttachmentsBlockRecord;
  locale: SiteLocale;
  style: string;
};

const AttachmentsBlock = ({ data, style, locale }: PropsAttachmentsBlock) => {
  const { attachments, attachmentPrefix, attachmentText, attachmentTitle } =
    data;
  const bg =
    style === "bg-secondary text-secondary-content"
      ? "bg-primary text-primary-content"
      : "bg-secondary text-secondary-content";

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
    <div className="container">
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.1 }}
        variants={variants}
      >
        <div className={`grid items-start gap-8 p-8 ${bg}`}>
          {attachmentPrefix && <div className="prefix">{attachmentPrefix}</div>}
          {attachmentTitle && <h2 className="title">{attachmentTitle}</h2>}
          {attachmentText && (
            <div
              className=""
              dangerouslySetInnerHTML={{ __html: attachmentText }}
            />
          )}
          <div className="grid max-w-screen-sm gap-4">
            {attachments.map((a: AttachmentRecord) => {
              return (
                <ExternalLink
                  key={a.id}
                  url={a.file.url}
                  title={a.title}
                  locale={locale}
                  className="group cursor-pointer"
                >
                  <div className="bg-white text-base-content flex items-center gap-4 rounded-md p-3">
                    <CustomIcon
                      classes="bg-base-content size-6"
                      fileName="download"
                    />
                    <div className="">{a.title}</div>
                  </div>
                </ExternalLink>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AttachmentsBlock;
