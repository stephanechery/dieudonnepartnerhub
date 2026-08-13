import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");

test("overview includes the approved search and maternal data discovery surface", () => {
  const overview = read("../pages/OverviewPage.jsx");
  assert.match(overview, /<PartnerPlatformDiscovery/);
  assert.match(overview, /onOpenLesson=\{onOpenLesson\}/);
  assert.match(overview, /onOpenGuide=\{onOpenGuide\}/);
  assert.match(overview, /onOpenVideoHub=\{onOpenVideoHub\}/);
});

test("discovery search is local, keyboard accessible, and does not persist queries", () => {
  const source = read("../components/PartnerPlatformDiscovery.jsx");
  assert.match(source, /type="search"/);
  assert.match(source, /event\.key === "Escape"/);
  assert.match(source, /role="status"/);
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /aria-pressed=\{activeFilter === filter\.id\}/);
  assert.match(source, /result\.kind === "data"/);
  assert.match(source, /tx\(result\.unit\)/);
  assert.match(source, /tx\(result\.detail\)/);
  assert.match(source, /rel="noopener noreferrer"/);
  assert.doesNotMatch(source, /fetch\(|localStorage|sessionStorage|trackEvent|openai|gemini/i);
});

test("maternal data distinguishes national and Indiana definitions and sources", () => {
  const source = read("../data/maternalHealthData.js");
  const component = read("../components/PartnerPlatformDiscovery.jsx");
  assert.match(source, /17\.9/);
  assert.match(source, /44\.8/);
  assert.match(source, /13% → 21%/);
  assert.match(source, /cdc\.gov\/nchs\/data\/hestat\/hestat113\.htm/);
  assert.match(source, /in\.gov\/health\/mch\/files\/MMRC/);
  assert.match(component, /should not be compared directly/);
  assert.match(component, /This platform does not diagnose/);
});

test("discovery appearance follows the persisted Partner Platform theme selector", () => {
  const tailwind = read("../../../../tailwind.config.js");
  assert.match(tailwind, /darkMode:\s*\["selector", '\[data-theme="dark"\]'\]/);
});
