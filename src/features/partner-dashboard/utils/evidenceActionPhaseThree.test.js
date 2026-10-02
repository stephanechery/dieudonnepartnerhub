import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import { maternalHealthHighlights } from "../data/maternalHealthData.js";
import { evidenceTopics, filterEvidence } from "../data/evidenceTopics.js";
import { evidenceResourcePaths, evidenceResourceTargets } from "../data/evidenceResourcePaths.js";
import { resourceSections, resourceRegion, filterResources, findResourceTarget } from "../data/resourcesDashboard.js";
import { partnerInteractiveGuides } from "../data/interactiveGuides.js";

test("every finding has one editorial topic and every precise destination exists", () => {
  assert.deepEqual(Object.values(evidenceTopics).flat().sort(), maternalHealthHighlights.map(x => x.id).sort());
  for (const [id, target] of Object.entries(evidenceResourceTargets)) {
    assert.equal(findResourceTarget(evidenceResourcePaths[id], target).id, target, id);
  }
  assert.equal(filterEvidence(maternalHealthHighlights, "All topics").length, maternalHealthHighlights.length);
  assert.equal(filterEvidence(maternalHealthHighlights, "Mental health").length, 2);
  assert.deepEqual(filterEvidence(maternalHealthHighlights, "unknown"), []);
});

test("resource filters distinguish Indiana, national services and internal learning tools", () => {
  const all = resourceSections.flatMap(section => section.resources);
  for (const region of ["Indiana", "United States", "Partner Hub guide"]) {
    const filtered = filterResources(all, region);
    assert.ok(filtered.length);
    assert.ok(filtered.every(item => resourceRegion(item) === region));
  }
  assert.equal(filterResources(all).length, all.length);
  for (const item of all) for (const action of item.actions) {
    if (!action.href.startsWith("/partner-dashboard/guides/")) continue;
    const [, guideId, sectionId] = action.href.match(/guides\/([^/]+)(?:\/([^/]+))?/);
    const guide = partnerInteractiveGuides.find(item => item.id === guideId);
    assert.ok(guide, action.href);
    if (sectionId) assert.ok(guide.sectionIds.includes(sectionId), action.href);
  }
});

test("precise resource navigation is read-only, validates target and responds to history updates", () => {
  const page = fs.readFileSync(new URL("../pages/ResourcesDashboardPage.jsx", import.meta.url), "utf8");
  assert.match(page, /resources.find\(item => item.id === initialResourceId\)/);
  assert.match(page, /\[routeSectionId, targetId\]/);
  assert.match(page, /focus\(\{ preventScroll: true \}\)/);
  assert.match(page, /resourceSections.find/);
  assert.doesNotMatch(page, /localStorage|sessionStorage|fetch\(|supabase|owner-admin/);
});

test("new filters and nonnumeric guidance values are localized", () => {
  const data = JSON.parse(fs.readFileSync(new URL("../../language/resources-translations.json", import.meta.url)));
  for (const lang of ["es", "fr", "ht"]) for (const text of ["All topics", "Evidence topic", "Listen first", "Follow through", "Your support", "Access to care", "Outcomes and disparities", "All resources", "Show resources"]) assert.ok(data[lang][text]?.trim(), `${lang}: ${text}`);
});
