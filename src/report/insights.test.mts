import assert from "node:assert/strict";
import test from "node:test";
import { portfolioMatcher, isBranded } from "./insights.ts";

const POST_TITLES = [
  "matrimonio di eva e marco",
  "matrimonio di carlo e federica",
  "matrimonio di anna e mirko",
  "cena di gala al castello",
];

const PROPER_NAME_QUERIES = [
  "matrimonio di eva e marco",
  "eva e marco matrimonio",
  "matrimonio carlo e federica gioja",
  "anna e mirko siena",
];

const COMMERCIAL_QUERIES = [
  "catering siena",
  "catering matrimonio siena",
  "catering matrimonio toscana",
  "catering aziendale siena",
  "banqueting siena",
  "cena di gala catering",
  "chef a domicilio siena",
  "catering val d'orcia",
  "catering per congressi",
  "catering compleanno siena",
  "coffee break congressi siena",
  "catering matrimonio castello",
];

test("riconosce le ricerche sui nomi degli eventi pubblicati", () => {
  const isPortfolio = portfolioMatcher(POST_TITLES);
  for (const query of PROPER_NAME_QUERIES) {
    assert.equal(
      isPortfolio(query),
      true,
      `doveva essere nome proprio: ${query}`
    );
  }
});

test("non scarta le ricerche commerciali", () => {
  const isPortfolio = portfolioMatcher(POST_TITLES);
  for (const query of COMMERCIAL_QUERIES) {
    assert.equal(
      isPortfolio(query),
      false,
      `non doveva essere nome proprio: ${query}`
    );
  }
});

test("riconosce il brand e non lo confonde con il generico", () => {
  assert.equal(isBranded("gioja catering"), true);
  assert.equal(isBranded("gioja catering siena"), true);
  assert.equal(isBranded("giojacatering"), true);
  assert.equal(isBranded("catering siena"), false);
  assert.equal(isBranded("catering matrimonio toscana"), false);
});
