import transformDate from "./transformDate";

export function getDate(date: string, locale: string) {
  return transformDate(date, locale);
}
