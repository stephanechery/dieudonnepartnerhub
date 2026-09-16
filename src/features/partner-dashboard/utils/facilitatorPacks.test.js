import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import { facilitatorPacks, evidenceForPack, sessionPackText } from "../data/facilitatorPacks.js";
import { resourceSections, resourceSources } from "../data/resourcesDashboard.js";

const read = (file) => fs.readFileSync(new URL(file, import.meta.url), "utf8");
const catalogs = ["resources", "discovery", "partner-platform", "supplemental"].map((name) => JSON.parse(read(`../../language/${name}-translations.json`)));

test("session packs reuse existing evidence and valid guide/resource destinations", () => {
  const guides = read("../data/interactiveGuides.js");
  for (const pack of facilitatorPacks) {
    const evidence = evidenceForPack(pack);
    assert.ok(evidence?.source.href.startsWith("https://"));
    assert.ok(resourceSections.some(({ id }) => id === pack.resourceSection));
    assert.ok(guides.includes(pack.guideHref.split("/")[3]));
    const text = sessionPackText(pack);
    assert.ok(text.includes(evidence.source.href));
    assert.ok(text.includes(evidence.detail));
    assert.ok(text.includes("Practice scenarios only"));
    assert.ok(text.includes("does not diagnose"));
  }
});

test("every new pack prompt and interface string has three translations", () => {
  const component = read("../components/FacilitatorPacks.jsx");
  const labels = [...component.matchAll(/tx\("([^"]+)"\)/g)].map((m) => m[1]);
  for (const locale of ["es", "fr", "ht"]) {
    const catalog = Object.assign({}, ...catalogs.map((item) => item[locale]));
    for (const label of [...labels, ...facilitatorPacks.flatMap(({ title, scenario, prompt, activity, context }) => [title, scenario, prompt, activity, context])]) {
      assert.ok(catalog[label]?.trim(), `${locale}: ${label}`);
    }
  }
});

test("new Indiana contacts are checked and source-bound with no new account collection", () => {
  for (const key of ["indiana211", "indianaWic"]) {
    assert.equal(new URL(resourceSources[key].href).hostname, "www.in.gov");
    assert.equal(resourceSources[key].checkedOn, "2026-09-16");
  }
  const component = read("../components/FacilitatorPacks.jsx");
  assert.doesNotMatch(component, /fetch\(|localStorage|sessionStorage|<input|<textarea|supabase/i);
  assert.match(component, /URL\.revokeObjectURL/);
  assert.match(component, /text\/plain;charset=utf-8/);
});
