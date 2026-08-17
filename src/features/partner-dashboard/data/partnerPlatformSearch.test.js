import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import { partnerCurriculum } from "./curriculum.js";
import {
  buildPartnerPlatformSearchIndex,
  getPartnerPlatformAskCandidateIds,
  localizePartnerPlatformSearchIndex,
  searchPartnerPlatform,
} from "./partnerPlatformSearch.js";

const index = buildPartnerPlatformSearchIndex(partnerCurriculum);

test("search index covers each Partner Platform content type", () => {
  const kinds = new Set(index.map((entry) => entry.kind));
  assert.deepEqual(kinds, new Set(["lesson", "guide", "video", "data"]));
});

test("safety intent ranks urgent content before general matches", () => {
  const results = searchPartnerPlatform(index, "urgent warning signs");
  assert.ok(results.length > 0);
  assert.equal(results[0].safety, true);
});

test("racial disparity and Indiana searches find maternal data", () => {
  const disparity = searchPartnerPlatform(index, "racial disparity");
  assert.ok(disparity.some((entry) => entry.id === "data:national-racial-disparity"));

  const indiana = searchPartnerPlatform(index, "Indiana data");
  assert.ok(indiana.some((entry) => entry.id === "data:indiana-overview"));
  assert.ok(indiana.some((entry) => entry.id === "data:indiana-racial-disparity"));
});

test("father impact searches find equipped-partner evidence", () => {
  const results = searchPartnerPlatform(index, "father impact");
  assert.ok(results.some((entry) => entry.id === "data:partner-breastfeeding"));
  assert.ok(results.some((entry) => entry.id === "data:partner-practical-help"));

  const labor = searchPartnerPlatform(index, "equipped labor support");
  assert.ok(labor.some((entry) => entry.id === "data:partner-labor-support"));
});

test("maternal disparity data is searchable in the selected language", () => {
  const catalogs = JSON.parse(
    fs.readFileSync(new URL("../../language/discovery-translations.json", import.meta.url), "utf8")
  );
  const tx = (value) => catalogs.ht[value] || value;
  const localizedIndex = localizePartnerPlatformSearchIndex(index, tx);
  const results = searchPartnerPlatform(localizedIndex, "disparite rasyal");
  assert.ok(results.some((entry) => entry.id === "data:national-racial-disparity"));
});

test("short or empty queries do not produce noisy results", () => {
  assert.deepEqual(searchPartnerPlatform(index, ""), []);
  assert.deepEqual(searchPartnerPlatform(index, "a"), []);
});

test("natural-language Ask hints are relaxed, bounded, and multilingual", () => {
  const english = getPartnerPlatformAskCandidateIds(
    index,
    "What can a father do to help during labor?"
  );
  assert.ok(english.some((id) => id.includes("labor")));
  assert.ok(english.length <= 6);

  const catalogs = JSON.parse(
    fs.readFileSync(new URL("../../language/discovery-translations.json", import.meta.url), "utf8")
  );
  const tx = (value) => catalogs.ht[value] || value;
  const localizedIndex = localizePartnerPlatformSearchIndex(index, tx);
  const haitianCreole = getPartnerPlatformAskCandidateIds(
    localizedIndex,
    "Kisa done yo di sou disparite rasyal?"
  );
  assert.ok(haitianCreole.some((id) => id === "data:national-racial-disparity"));
});
