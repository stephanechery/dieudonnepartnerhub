import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { searchResources, normalizeResourceQuery } from "./resourceSearch.js";
import { resourceSections, resourceRegion } from "../data/resourcesDashboard.js";
import { maternalHealthHighlights } from "../data/maternalHealthData.js";

test("resource search normalizes accents and matches all words without mutating the catalog", () => {
  const before = JSON.stringify(resourceSections);
  assert.equal(normalizeResourceQuery("  Santé, MANJE! "), "sante manje");
  assert.ok(searchResources(resourceSections, {query: "food bank"}).length);
  assert.ok(searchResources(resourceSections, {query: "health center"}).length);
  assert.equal(searchResources(resourceSections, {query: "zzzznonexistent"}).length, 0);
  assert.equal(JSON.stringify(resourceSections), before);
});

test("search respects need and region filters and does not duplicate resources", () => {
  const results = searchResources(resourceSections, {region: "Indiana"});
  assert.ok(results.length);
  assert.ok(results.every(({resource}) => resourceRegion(resource) === "Indiana"));
  const section = resourceSections[0];
  assert.ok(searchResources(resourceSections, {need: section.id}).every(result => result.section.id === section.id));
  const all = searchResources([...resourceSections, ...resourceSections]);
  assert.equal(all.length, new Set(all.map(({resource}) => resource.id)).size);
});

test("translated search indexes translated copy and English fallback", () => {
  for (const translated of ["alimentation", "alimentación", "manje"]) {
    const translateText = value => value === resourceSections[0].resources[0].title ? translated : value;
    assert.ok(searchResources(resourceSections, {query: translated, translateText}).length);
  }
});

test("search is local, bounded, accessible and progressively disclosed", () => {
  const source = readFileSync(new URL("../components/ResourceSearch.jsx", import.meta.url), "utf8");
  assert.match(source, /maxLength=\{160\}/);
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /results\.slice\(0, 4\)/);
  assert.match(source, /<details>/);
  assert.doesNotMatch(source, /fetch\(|localStorage|sessionStorage|sendBeacon|URLSearchParams/);
});

test("Phase 5 evidence preserves survey limitations and complete translations", () => {
  const catalog = JSON.parse(readFileSync(new URL("../../language/support-translations.json", import.meta.url), "utf8"));
  const evidence = maternalHealthHighlights.filter(item => ["national-unspoken-concerns", "national-care-discrimination"].includes(item.id));
  assert.equal(evidence.length, 2);
  for (const item of evidence) {
    assert.equal(item.source.href, "https://www.cdc.gov/mmwr/volumes/72/wr/mm7235e1.htm");
    assert.match(item.scope, /April 2023 survey/);
    assert.match(item.limitation, /not nationally representative/);
    for (const lang of ["es", "fr", "ht"]) for (const text of [item.title, item.scope, item.unit, item.detail, item.supportAction, item.limitation, item.source.label]) {
      assert.ok(catalog[lang][text]?.trim(), `${lang}: ${text}`);
    }
  }
  for (const lang of ["es", "fr", "ht"]) for (const text of ["Search resources", "Clear search", "Refine results", "Search results", "Understand this finding", "One next step"]) assert.ok(catalog[lang][text]);
});
