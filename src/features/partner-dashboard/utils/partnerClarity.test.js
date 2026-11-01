import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { searchResources } from "./resourceSearch.js";
import { resourceSections } from "../data/resourcesDashboard.js";
const read = path => readFileSync(new URL(path, import.meta.url), "utf8");

test("contact filters use supported actions and combine with region, topic and query", () => {
  for (const contact of ["call", "text", "external", "internal"]) {
    const results = searchResources(resourceSections, {contact});
    assert.ok(results.length);
    assert.ok(results.every(({resource}) => resource.actions.some(action => action.kind === contact)));
  }
  const results = searchResources(resourceSections, {contact:"call", region:"Indiana", need:"practical-support"});
  assert.ok(results.length);
  assert.ok(results.every(({section}) => section.id === "practical-support"));
  assert.equal(searchResources(resourceSections, {contact:"text", query:"zzzzmissing"}).length, 0);
});

test("filters stay scoped to the category and have removable accessible selections", () => {
  const component = read("../components/ResourceSearch.jsx");
  assert.match(component, /useState\(scopeNeed\)/);
  assert.match(component, /setNeed\(scopeNeed\)/);
  assert.match(component, /tx\("Remove filter"\)/);
  assert.match(component, /flex flex-wrap gap-2/);
  assert.match(read("../pages/ResourcesDashboardPage.jsx"), /scopeNeed=\{activeSection\?\.id \|\| ""\}/);
});

test("print sheets contain only public plan content with dialog and print isolation", () => {
  const sheet = read("../components/PreparationSheet.jsx");
  assert.match(sheet, /showModal\(\)/);
  assert.match(sheet, /onCancel=\{onClose\}/);
  assert.match(sheet, /aria-labelledby="preparation-sheet-title"/);
  assert.match(sheet, /window.print\(\)/);
  assert.match(sheet, /pack.checklist.map/);
  assert.match(sheet, /evidence.source.href/);
  assert.doesNotMatch(sheet, /localStorage|sessionStorage|fetch\(|dangerouslySetInnerHTML|profile\./);
  const css = read("../../../index.css");
  assert.match(css, /@media print/);
  assert.match(css, /body:has\(\.preparation-print-root\) > :not\(\.preparation-print-root\)/);
  assert.match(css, /break-inside: avoid/);
});

test("new interface text is translated in every supported language", () => {
  const catalog = JSON.parse(read("../../language/support-translations.json"));
  const keys = ["Start with three findings. Open one for context and a practical next step.", "Contact method", "Any contact method", "Phone", "Text message", "Website", "Active filters", "Remove filter", "Printable preparation sheet", "Print or save PDF", "Close preview", "Use this sheet for a conversation, not as a medical readiness score."];
  for (const lang of ["es", "fr", "ht"]) for (const key of keys) assert.ok(catalog[lang][key]?.trim(), `${lang}: ${key}`);
});
