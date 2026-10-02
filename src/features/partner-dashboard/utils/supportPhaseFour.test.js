import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { readSavedResources, writeSavedResources, savedResourcesKey } from "./savedResources.js";
import { supportPathways, evidenceLimit } from "../data/supportPathways.js";
import { maternalHealthHighlights } from "../data/maternalHealthData.js";
import { resourceSections } from "../data/resourcesDashboard.js";
const read = relative => fs.readFileSync(new URL(relative, import.meta.url), "utf8");
const storage = () => { const data = new Map(); return { getItem: key => data.get(key), setItem: (key,value) => data.set(key,value) }; };

test("device saves survive reload, reject unknown payloads and remain separate from demo", () => {
  const store = storage(), allowed = ["food-bank", "feeding-support"];
  assert.notEqual(savedResourcesKey("demo"), savedResourcesKey("device"));
  assert.equal(writeSavedResources(store, "device", ["food-bank", "food-bank", "private narrative"], allowed), true);
  assert.deepEqual(readSavedResources(store, "device", allowed).ids, ["food-bank"]);
  assert.deepEqual(readSavedResources(store, "demo", allowed).ids, []);
  writeSavedResources(store, "demo", ["feeding-support"], allowed);
  assert.deepEqual(readSavedResources(store, "device", allowed).ids, ["food-bank"]);
  writeSavedResources(store, "device", [], allowed);
  assert.deepEqual(readSavedResources(store, "device", allowed).ids, []);
  store.setItem(savedResourcesKey("device"), JSON.stringify({ notes: "must not render" }));
  assert.deepEqual(readSavedResources(store, "device", allowed).ids, []);
  store.setItem(savedResourcesKey("device"), "invalid");
  assert.equal(readSavedResources(store, "device", allowed).available, false);
});

test("blocked browser storage reports failure, never pretends to save", () => {
  const blocked = { getItem() { throw Error(); }, setItem() { throw Error(); } };
  assert.equal(readSavedResources(blocked, "demo", []).available, false);
  assert.equal(writeSavedResources(blocked, "device", [], []).valueOf(), false);
});

test("every pathway has approved evidence and exact existing resource destinations", () => {
  const all = resourceSections.flatMap(section => section.resources);
  for (const path of supportPathways) {
    assert.ok(maternalHealthHighlights.some(item => item.id === path.evidenceId));
    assert.equal(path.steps.length, 3);
    for (const id of path.resources) assert.ok(all.some(item => item.id === id), id);
  }
  assert.match(evidenceLimit(maternalHealthHighlights.find(x => x.id === "partner-labor-support")), /not only fathers/);
  assert.match(evidenceLimit(maternalHealthHighlights.find(x => x.id === "partner-listening")), /not a measured reduction/);
});

test("phase four catalog covers dynamic content and all literal new interface strings", () => {
  const catalog = JSON.parse(read("../../language/support-translations.json"));
  const keys = Object.keys(catalog.es);
  for (const lang of ["fr", "ht"]) assert.deepEqual(Object.keys(catalog[lang]).sort(), keys.slice().sort());
  const dynamic = supportPathways.flatMap(path => [path.title, ...path.steps]);
  dynamic.push(...maternalHealthHighlights.map(evidenceLimit));
  for (const lang of ["es", "fr", "ht"]) for (const text of dynamic) assert.ok(catalog[lang][text]?.trim(), `${lang}: ${text}`);
  const app = read("../../../App.jsx");
  assert.match(app, /support: supportTranslationPack/);
  assert.ok(app.includes("...(LOCAL_LANGUAGE_PACKS.support?.[locale] || {})"));
});

test("saved and pathway routes use existing router, semantic controls and demo boundary", () => {
  const router = read("../index.jsx"), page = read("../pages/ResourcesDashboardPage.jsx"), paths = read("../components/SupportPathways.jsx");
  assert.match(router, /savedScope=\{authUser\?\.provider === "demo-org" \? "demo" : "device"\}/);
  assert.match(page, /routeSectionId === "saved"/);
  assert.match(page, /aria-pressed=\{saved\}/);
  assert.match(paths, /aria-current/);
  assert.match(paths, /lg:grid-cols-\[15rem_minmax\(0,1fr\)\]/);
  assert.doesNotMatch(paths, /supabase|fetch\(|saveProfile|quiz|setInterval/);
});
