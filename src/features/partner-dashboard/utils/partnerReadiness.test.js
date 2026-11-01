import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { preparationPacks, preparationForContext, supportPathways, pathwayForEvidence } from "../data/supportPathways.js";
import { resourceSections, resourceSources, findResourceTarget } from "../data/resourcesDashboard.js";
import { evidenceResourcePaths, evidenceResourceTargets } from "../data/evidenceResourcePaths.js";
import { searchResources } from "./resourceSearch.js";
const read = path => fs.readFileSync(new URL(path, import.meta.url), "utf8");

test("three preparation packs reuse valid paths without replacing existing plans", () => {
  assert.deepEqual(Object.keys(preparationPacks), ["appointment", "birth", "postpartum"]);
  for (const [id, pack] of Object.entries(preparationPacks)) {
    const path = supportPathways.find(item => item.id === id);
    assert.ok(path);
    assert.equal(pack.checklist.length, 3);
    assert.equal(new Set(pack.checklist).size, 3);
    assert.ok(pack.intro && pack.prompt);
  }
  assert.ok(supportPathways.some(path => path.id === "feeding"));
  assert.ok(supportPathways.some(path => path.id === "advocacy"));
});

test("Today recommendations follow the existing situation and never distract from urgent help", () => {
  assert.equal(preparationForContext("urgent"), null);
  assert.equal(preparationForContext("labor-prep").id, "birth");
  for (const context of ["postpartum", "feeding", "home-setup", "mood"]) assert.equal(preparationForContext(context).id, "postpartum");
  assert.equal(preparationForContext("appointment").id, "appointment");
  assert.equal(preparationForContext(undefined).id, "appointment");
});

test("care access findings link to care finding rather than generic insurance or warning signs", () => {
  for (const id of ["national-care-deserts", "national-desert-population", "national-travel-time", "national-access-preterm", "national-indigenous-access", "national-prenatal-disparity"]) {
    assert.equal(findResourceTarget(evidenceResourcePaths[id], evidenceResourceTargets[id]).id, "health-center");
  }
  assert.equal(pathwayForEvidence("partner-labor-support").id, "birth");
  assert.equal(pathwayForEvidence("partner-practical-help").id, "postpartum");
});

test("new external resources remain searchable, dated and source-bound", () => {
  assert.ok(searchResources(resourceSections, { query: "grief" }).some(result => result.resource.id === "loss-grief"));
  assert.ok(searchResources(resourceSections, { query: "4Kira4Dads" }).length);
  for (const id of ["loss-grief", "father-education"]) {
    const item = resourceSections.flatMap(section => section.resources).find(item => item.id === id);
    assert.equal(item.actions[0].href, item.source.href);
    assert.equal(item.source.checkedOn, "2026-11-01");
  }
  assert.ok(resourceSources.psiLoss.href.startsWith("https://postpartum.net/"));
});

test("pack text and external resources have all three translations", () => {
  const catalog = JSON.parse(read("../../language/support-translations.json"));
  const component = read("../components/SupportPathways.jsx");
  const strings = [...component.matchAll(/tx\("([^"]+)"\)/g)].map(match => match[1]);
  for (const pack of Object.values(preparationPacks)) strings.push(pack.intro, pack.prompt, ...pack.checklist);
  for (const item of resourceSections.flatMap(section => section.resources).filter(item => ["loss-grief", "father-education"].includes(item.id))) strings.push(item.title, item.description, item.source.label, ...item.actions.map(action => action.label));
  const resources = JSON.parse(read("../../language/resources-translations.json"));
  for (const lang of ["es", "fr", "ht"]) for (const text of strings) assert.ok((catalog[lang][text] || resources[lang][text])?.trim(), `${lang}: ${text}`);
});

test("checklists are temporary native controls with no new data or progress writes", () => {
  const component = read("../components/SupportPathways.jsx");
  assert.match(component, /<details/);
  assert.match(component, /<label/);
  assert.match(component, /type="checkbox"/);
  assert.match(component, /key=\{active.id\}/);
  assert.match(component, /min-h-12/);
  assert.doesNotMatch(component, /localStorage|sessionStorage|fetch\(|saveProfile|supabase/);
});
