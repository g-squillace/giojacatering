"use client";
import { SRCImage } from "react-datocms";
import { SiteLocale, EventQuery } from "@/graphql/generated";
import { notFound } from "next/navigation";
import CustomIcon from "../Blocks/CustomIcon";
import { getDate } from "@/lib/getDate";
import CustomStructuredText from "../Layout/CustomStructuredText";
import { Fragment } from "react";

type Props = {
  data: EventQuery;
  locale: SiteLocale;
};

const EventPage = ({ data, locale }: Props) => {
  const {
    tags,
    date,
    title,
    abstract,
    eventImage,
    dateEndEvent,
    dateStartEvent,
  } = data.event;
  if (!data.event) notFound();
  return;
  return (
    <section className="">
      <div className="">
        <div className="standard-vertical-m container">
          <div className="mb-5 xl:col-span-2 xl:col-start-2">
            {tags.length > 0 &&
              tags
                .map((t) => (
                  <div className="prefix" key={t.id} id={t.id}>
                    {t.tag}
                  </div>
                ))
                .map((element, index, array) => {
                  return (
                    <Fragment key={element.key}>
                      {element}
                      {index !== array.length - 1 && ", "}
                    </Fragment>
                  );
                })}
          </div>
          <h1 className="title">{title}</h1>
          {abstract && (
            <h2
              dangerouslySetInnerHTML={{ __html: abstract }}
              className="pt-4 md:text-md md:pt-6"
            />
          )}
          <div className="flex items-center gap-3 text-sm px-2">
            <CustomIcon classes="h-5 w-5 bg-accent" fileName="calendar" />
          </div>
          <div className="aspect-square mt-8 xl:col-start-2 xl:col-span-10 relative md:aspect-[2/1] md:mt-20">
            <SRCImage
              className="object-cover absolute inset-0"
              data={eventImage.responsiveImage}
            />
          </div>
        </div>
        <div className="flex items-center overflow-hidden">
          <div className="formatted standard-vertical-m container inline-block w-auto">
            <CustomStructuredText record={data.event.content} locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventPage;
