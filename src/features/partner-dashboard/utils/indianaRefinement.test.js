import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { maternalHealthGroups } from "../data/maternalHealthData.js";
const read = path => readFileSync(new URL(path, import.meta.url), "utf8");

test("Indiana keeps every finding and presents share comparisons without trend arrows", () => {
  assert.equal(maternalHealthGroups.indiana.length, 7);
  const page = read("../pages/MaternalDataPage.jsx");
  assert.match(page, /highlight.group === "indiana"/);
  assert.match(page, /\["13%", "21%"\]/);
  assert.match(page, /\["40%", "65%"\]/);
  assert.match(page, /tx\("Share of live births"\)/);
  assert.match(page, /tx\("Share of pregnancy-associated deaths"\)/);
  assert.match(page, /comparison &&.*tx\(highlight.unit\)/);
  assert.match(page, /tx\(highlight.detail\)/);
  assert.match(page, /tx\(evidenceLimit\(highlight\)\)/);
  assert.match(page, /href=\{highlight.source.href\}/);
});

test("share labels are translated and layout scope preserves other routes", () => {
  const translations = JSON.parse(read("../../language/support-translations.json"));
  for (const lang of ["es", "fr", "ht"]) for (const key of ["Share of live births", "Share of pregnancy-associated deaths"]) assert.ok(translations[lang][key]);
  const css = read("../../../index.css");
  assert.match(css, /min-width: min\(320px, 100%\)/);
  assert.match(css, /\.indiana-evidence-grid \{ grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.indiana-evidence-card.is-expanded \{ grid-column: 1 \/ -1/);
  assert.match(css, /\.maternal-data-shell \.training-progress-summary/);
});
