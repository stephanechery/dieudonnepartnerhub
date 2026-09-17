import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import { maternalHealthHighlights } from "../data/maternalHealthData.js";
import { resourceSections } from "../data/resourcesDashboard.js";
import { evidenceResourcePaths } from "../data/evidenceResourcePaths.js";

test("every evidence finding leads to an existing resource section", () => {
  assert.deepEqual(Object.keys(evidenceResourcePaths).sort(), maternalHealthHighlights.map(({ id }) => id).sort());
  for (const section of Object.values(evidenceResourcePaths)) {
    assert.ok(resourceSections.some(({ id }) => id === section));
  }
});

test("help destinations vary with the need instead of defaulting to warning signs", () => {
  assert.equal(evidenceResourcePaths["national-postpartum-depression"], "mental-health");
  assert.equal(evidenceResourcePaths["national-care-deserts"], "benefits-planning");
  assert.equal(evidenceResourcePaths["national-racial-disparity"], "practical-support");
  assert.equal(evidenceResourcePaths["national-preventability"], "warning-signs");
  const page = fs.readFileSync(new URL("../pages/MaternalDataPage.jsx", import.meta.url), "utf8");
  assert.ok(page.indexOf('tx("Find help")') < page.indexOf("{expanded &&"));
  assert.match(page, /showMore \? highlights : highlights.slice\(0, 3\)/);
});

test("new evidence and contacts have complete translations and explicit reporting years", () => {
  const catalog = JSON.parse(fs.readFileSync(new URL("../../language/resources-translations.json", import.meta.url)));
  const newData = maternalHealthHighlights.filter(item => item.source.label.includes("2018 PRAMS"));
  assert.equal(newData.length, 2);
  const strings = ["More evidence", "Show less"];
  for (const item of newData) {
    assert.match(item.scope, /2018/);
    strings.push(item.scope, item.title, item.unit, item.detail, item.supportAction, item.source.label);
  }
  for (const section of resourceSections) for (const item of section.resources) {
    if (!["maternal-mental-health-hotline", "indiana-moms-helpline"].includes(item.id)) continue;
    strings.push(item.title, item.description, item.source.label, ...item.actions.map(action => action.label));
  }
  for (const lang of ["es", "fr", "ht"]) for (const value of strings) assert.ok(catalog[lang][value]?.trim(), `${lang}: ${value}`);
});

test("phase two interface labels are complete in every supported translation", () => {
  const catalog = JSON.parse(fs.readFileSync(new URL("../../language/resources-translations.json", import.meta.url)));
  for (const language of ["es", "fr", "ht"]) {
    for (const label of ["What it means", "Find help", "Source details", "View details", "Hide details", "Partner Hub guide", "External resource", "What help do you need?"]) {
      assert.ok(catalog[language][label]?.trim(), `${language}: ${label}`);
    }
  }
});

test("contact actions are outside disclosure and urgent help is available in other sections", () => {
  const page = fs.readFileSync(new URL("../pages/ResourcesDashboardPage.jsx", import.meta.url), "utf8");
  const regularCard = page.slice(page.indexOf('return (\n    <article className={`self-start'));
  assert.ok(regularCard.indexOf("<ActionLink") < regularCard.indexOf("{expanded &&"));
  assert.match(page, /activeSection.id !== "urgent-help"[\s\S]*?selectSection\("urgent-help"\)/);
  assert.doesNotMatch(page, /truncate|overflow-x-auto/);
});
