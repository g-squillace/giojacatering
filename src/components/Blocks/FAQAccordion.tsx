"use client";

import { useState } from "react";
import { StructuredText } from "react-datocms/structured-text";
import { motion, Variants } from "framer-motion";
import { QuestionRecord } from "@/graphql/generated";
import { Maybe } from "graphql/jsutils/Maybe";
import Highlighter from "./Highlighter";

const closeIcon = (
  <span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 md:h-12 md:w-12"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth=".8"
        d="M18 12H6"
      />
    </svg>
  </span>
);

const openIcon = (
  <span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 md:h-12 md:w-12"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="0.8"
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  </span>
);

type Props = {
  title: Maybe<string>;
  subtitle: Maybe<string>;
  questions: Array<QuestionRecord>;
};

const FAQAccordion = ({ title, subtitle, questions }: Props) => {
  const [openQuestions, setOpenQuestions] = useState<string[]>([]);

  function toggleQuestion(id: string) {
    if (openQuestions.includes(id)) {
      setOpenQuestions((openQuestions) => {
        return [...openQuestions.filter((qID) => qID !== id)];
      });
    } else {
      setOpenQuestions((openQuestions) => [...openQuestions, id]);
    }
  }

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
        <div className="grid gap-6">
          {title && <h2 className="title">{title}</h2>}
          {subtitle && (
            <h3
              className="text"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          )}
          <div className="mt-12 border-t border-primary-content/20">
            {questions.map((question, n: number) => {
              const isOpen = openQuestions.includes(question.id);
              return (
                <motion.div
                  layout="position"
                  key={question.id}
                  className={"py-6 border-b border-primary-content/20"}
                  onClick={() => {
                    toggleQuestion(question.id);
                  }}
                >
                  <button className="flex w-full items-center justify-between">
                    <div className="">{question.question}</div>
                    {isOpen ? closeIcon : openIcon}
                  </button>

                  <motion.div
                    animate={isOpen ? "open" : "closed"}
                    variants={{
                      open: { opacity: 1 },
                      closed: { opacity: 0 },
                    }}
                    transition={{ duration: 0.5 }}
                    className={"mt-6 text-sm" + (isOpen ? "" : " hidden")}
                  >
                    <StructuredText
                      data={question.answer.value as any}
                      renderNode={Highlighter}
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FAQAccordion;
