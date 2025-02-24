import { listIndexes } from "./algolia-utils";
import config from "../../src/data/config.json";

(async () => {
  const start = Date.now();
  const indexes = await listIndexes();
  const defaultLocale = "it";
  const { locales } = config;
  console.info("INDEXES", indexes);

  // SEARCH
  // await mainSearch(defaultLocale, locales, indexes);

  const elapsed = Date.now() - start;
  console.info("ELAPSED", elapsed / 1000, "seconds");
})();
