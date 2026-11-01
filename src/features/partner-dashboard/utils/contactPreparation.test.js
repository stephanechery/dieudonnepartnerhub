import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import { maternalHealthHighlights } from "../data/maternalHealthData.js";
import { resourceSections } from "../data/resourcesDashboard.js";
import { evidenceResourcePaths, evidenceResourceTargets } from "../data/evidenceResourcePaths.js";
import { resourceContactDetails } from "../data/resourceContactDetails.js";

test("every finding has an explicit matching resource without fallback", () => {
  assert.deepEqual(Object.keys(evidenceResourceTargets).sort(), maternalHealthHighlights.map(x => x.id).sort());
  for (const finding of maternalHealthHighlights) {
    const section = resourceSections.find(x => x.id === evidenceResourcePaths[finding.id]);
    assert.ok(section.resources.some(x => x.id === evidenceResourceTargets[finding.id]), finding.id);
  }
});

test("contact preparation is bound to the existing provider and translated", () => {
  const translations = JSON.parse(fs.readFileSync(new URL("../../language/support-translations.json", import.meta.url)));
  const strings = ["Before you contact", "Who it supports", "What to expect"];
  for (const [id, details] of Object.entries(resourceContactDetails)) {
    const resource = resourceSections.flatMap(x => x.resources).find(x => x.id === id);
    assert.equal(details.source, resource.source.href);
    assert.ok(details.checkedOn);
    strings.push(details.audience, details.expectation);
  }
  for (const lang of ["es", "fr", "ht"]) for (const text of strings) assert.ok(translations[lang][text]?.trim(), lang + ": " + text);
});

test("contact details start collapsed and never hide direct contact actions", () => {
  const page = fs.readFileSync(new URL("../pages/ResourcesDashboardPage.jsx", import.meta.url), "utf8");
  assert.ok(page.indexOf("<ActionLink") < page.indexOf("{contact && <details"));
  assert.ok(page.includes('tx("Before you contact")'));
  assert.ok(page.includes("<dl"));
});
