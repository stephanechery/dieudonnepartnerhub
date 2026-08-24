import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  getGuideCompletionPercent,
  getGuideProgressStorageKey,
  readGuideRecord,
  toggleGuideSectionComplete,
  writeGuideRecord,
} from "./guideProgress.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const dashboardRoot = path.resolve(currentDir, "..");

const memoryStorage = () => {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
};

test("guide progress is isolated between learner and demo storage", () => {
  const storage = memoryStorage();
  const sections = ["one", "two", "three", "four", "five", "six", "seven", "eight"];

  writeGuideRecord("learner", "guide-a", { completed: ["one"], lastSection: "two" }, storage);
  writeGuideRecord("demo", "guide-a", { completed: ["three"], lastSection: "three" }, storage);

  assert.notEqual(getGuideProgressStorageKey("learner"), getGuideProgressStorageKey("demo"));
  assert.deepEqual(readGuideRecord("learner", "guide-a", sections, storage), {
    completed: ["one"],
    lastSection: "two",
  });
  assert.deepEqual(readGuideRecord("demo", "guide-a", sections, storage), {
    completed: ["three"],
    lastSection: "three",
  });
});

test("a guide reaches 100 percent only after all eight sections are complete", () => {
  const completed = ["one", "two", "three", "four", "five", "six", "seven"];
  assert.equal(getGuideCompletionPercent(completed, 8), 88);
  assert.equal(getGuideCompletionPercent([...completed, "eight"], 8), 100);
});

test("mark complete is explicit and reversible", () => {
  const started = { completed: [], lastSection: "one" };
  const completed = toggleGuideSectionComplete(started, "one");
  assert.deepEqual(completed.completed, ["one"]);
  assert.deepEqual(toggleGuideSectionComplete(completed, "one").completed, []);
});

test("stored records discard unknown sections", () => {
  const storage = memoryStorage();
  writeGuideRecord("learner", "guide-a", { completed: ["one", "unknown"], lastSection: "unknown" }, storage);
  assert.deepEqual(readGuideRecord("learner", "guide-a", ["one", "two"], storage), {
    completed: ["one"],
    lastSection: "one",
  });
});

test("guide navigation stays usable when device storage is unavailable", () => {
  const blockedStorage = {
    getItem: () => null,
    setItem: () => { throw new Error("blocked"); },
  };
  assert.deepEqual(
    writeGuideRecord("learner", "guide-a", { completed: ["one"], lastSection: "one" }, blockedStorage),
    { completed: ["one"], lastSection: "one" }
  );
});

test("guide routes include addressable section history and device-only scope", async () => {
  const source = await readFile(path.join(dashboardRoot, "index.jsx"), "utf8");
  assert.match(source, /guides\/\$\{guideId\}\/\$\{sectionId\}/);
  assert.match(source, /navigate\(`\$\{BASE_PATH\}\/guides\/\$\{guideId\}\/\$\{sectionId\}`, replace\)/);
  assert.match(source, /progressScope=\{authUser\?\.provider === "demo-org" \? "demo" : "learner"\}/);
});

test("all ten guide components use the shared controlled section shell", async () => {
  const guideDir = path.join(dashboardRoot, "interactive-guides");
  const guideNames = [
    "PartnerAnatomyGuide",
    "PartnerCommunicationGuide",
    "PartnerComplicationsGuide",
    "PartnerFeedingGuide",
    "PartnerFinanceGuide",
    "PartnerLaborGuide",
    "PartnerMentalHealthGuide",
    "PartnerPostpartumGuide",
    "PartnerTrimesterGuide",
    "PartnerVillageGuide",
  ];

  for (const guideName of guideNames) {
    const source = await readFile(path.join(guideDir, `${guideName}.jsx`), "utf8");
    assert.match(source, /activeSection = 0/);
    assert.match(source, /setSection\(activeSection\)/);
    assert.match(source, /onSectionLabelsChange\?\.\(navLabels\)/);
    assert.match(source, /display:embedded\?"none":"block"/);
  }
});

test("the shared shell exposes accessible map and completion controls", async () => {
  const source = await readFile(path.join(dashboardRoot, "components", "GuideShell.jsx"), "utf8");
  assert.match(source, /aria-current=\{isCurrent \? "step"/);
  assert.match(source, /role="progressbar"/);
  assert.match(source, /aria-pressed=\{isCurrentComplete\}/);
  assert.match(source, /aria-label=\{tx\("Select language"\)\}/);
  assert.match(source, /min-h-11/);
  assert.match(source, /motion-reduce/);
});
