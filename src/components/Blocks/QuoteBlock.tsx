import { JSXElementConstructor, ReactElement } from "react";
import CustomIcon from "./CustomIcon";

type Props = {
  text:
    | (string | ReactElement<any, string | JSXElementConstructor<any>>)[]
    | undefined;
  author: string;
};

const QuoteBlock = ({ text, author }: Props) => {
  if (!text) return <></>;
  return (
    <div className="space-y-8 text-center my-12">
      <CustomIcon
        fileName="quote"
        classes="bg-base-100 size-12 mx-auto"
      />
      <div className="title-small mx-auto xl:max-w-3xl">
        {text}
      </div>
      {author && (
        <div className="text-xs uppercase text-base-100 tracking-widest">
          {author}
        </div>
      )}
    </div>
  );
};

export default QuoteBlock;
