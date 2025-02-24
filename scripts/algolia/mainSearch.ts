import { sendIndex } from "./algolia-utils";

const indexName = ""; // index name
const query = ``;
export default async function search(
  defaultLocale: string,
  locales: string[],
  indexes: string[]
) {
  const data: any = [];
  for (const locale of locales) {
    const isDefaultLocale = defaultLocale == locale;

    let items: any[] = [];
    console.info(indexName, locale);
    //  for (const key of Object.keys(queries)) {
    //    const query = queries[key];
    //    const results = await getCollections(query, { locale }, "items");
    //    console.log(key, results.length);
    //    items = [...items, ...results];
    //  }
    //  items = items.filter(Boolean);
    //  console.info("TOTAL", locale, " = ", items.length);
    //  for (let i = 0; i < items.length; i++) {
    //    const item: any = items[i];
    //    const formatted = await formatItem({ ...item, locale, isDefaultLocale });
    //    data.push(formatted);
    //  }
  }

  // const indexName = `${NAME}_${locale}`;
  const searchableAttributes: any = [];
  const attributesForFaceting: any = [];
  const customRanking: string[] = [];

  let replace = false;
  if (indexes.includes(indexName)) {
    replace = true;
  }

  try {
    const indexData = {
      indexName,
      data,
      searchableAttributes,
      attributesForFaceting,
      indexLanguages: locales,
      customRanking,
      hitsPerPage: 12,
      replace,
    };
    await sendIndex(indexData as any);
  } catch (error) {
    console.error(error);
  }
}
