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
