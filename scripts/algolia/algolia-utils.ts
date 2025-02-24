import dotenv from "dotenv";
import algoliasearch from "algoliasearch";

dotenv.config({ path: ".env.local" });

export const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "",
  process.env.ALGOLIA_ADMIN_KEY || ""
);

/**
 * List all current index
 */
export const listIndexes = async () => {
  const list = await client.listIndices();
  return list?.items?.map((i) => i.name);
};

/**
 * Function to create or update an Index with data on Algolia
 * @param {String} indexName - The name of the index
 * @param {Object} settings - settings regarding searching the index
 * @param {Array} data - the array of porperties to upload on the index
 * @param {Boolean} replace - whether to replace or create the current index data
 */
export const createObjects = async (
  indexName: string,
  settings: any,
  data: any[],
  replace: boolean = false
) => {
  console.info("INDEX ", indexName, replace);
  const index = client.initIndex(indexName);
  await index.setSettings(settings);
  let results = null;
  if (replace) {
    results = await index.replaceAllObjects(data);
  } else {
    results = await index.saveObjects(data);
  }
  return results;
};

type SendIndexProps = {
  data: any;
  indexName: string;
  searchableAttributes: string[];
  attributesForFaceting: string[];
  indexLanguages: string[];
  customRanking?: string[] | undefined;
  hitsPerPage?: number | undefined;
  replace?: boolean | undefined;
  typoTolerance?: boolean | undefined;
};
export async function sendIndex({
  data = [],
  indexName,
  searchableAttributes = [],
  attributesForFaceting = [],
  indexLanguages,
  customRanking = [],
  hitsPerPage = 12,
  replace,
  typoTolerance = false,
}: SendIndexProps) {
  const settings = {
    hitsPerPage,
    customRanking,
    searchableAttributes,
    attributesForFaceting,
    indexLanguages,
    typoTolerance,
  };
  console.info("INDEX", indexName);
  console.info("DATA", data.length);
  console.info("DATA", data.length);
  console.info("REPLACE OR SAVE ? ", replace ? "REPLACE" : "SAVE");
  await createObjects(indexName, settings, data, replace);
}
