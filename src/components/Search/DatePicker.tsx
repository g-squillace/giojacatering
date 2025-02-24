"use client";
import dayjs from "dayjs";

function createfilter(type: string, time: number) {
  let filter = "";
  if (type == "start") {
    filter = `dateEndEvent.value>=${time}`;
  } else {
    filter = `dateStartEvent.value<=${time}`;
  }
  return filter;
}

export default function DatePicker({ type, handleDateFilter, id }) {
  const operator = type == "end" ? "<=" : ">=";

  return (
    <input
      type="date"
      name="datepicker"
      id={id}
      className="bg-white border border-gray-200 w-full py-4 px-2 text-md lg:border lg:border-base-300"
      placeholder="Data inizio"
      onChange={(event) => {
        const { value } = event.target;
        if (value) {
          const time = dayjs(value).unix();
          const filter = createfilter(type, time);
          handleDateFilter({ operator, filter });
        }
      }}
    />
  );
}
