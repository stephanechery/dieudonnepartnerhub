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
  assert.match(source, /<div className="relative">\s*<Search/);
  assert.match(source, /className="absolute right-2 top-1\/2 flex h-10 w-10 -translate-y-1\/2/);
  assert.match(source, /event\.key === "Escape"/);
  assert.match(source, /role="status"/);
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /aria-pressed=\{activeFilter === filter\.id\}/);
  assert.match(source, /\[&::-webkit-search-cancel-button\]:appearance-none/);
  assert.match(source, /setShowAllMobileResults\(false\)/);
  assert.match(source, /mobileHidden=\{!showAllMobileResults && index >= 4\}/);
  assert.match(source, /Show more results/);
  assert.match(source, /result\.kind === "data"/);
  assert.match(source, /tx\(result\.unit\)/);
  assert.match(source, /tx\(result\.detail\)/);
  assert.match(source, /rel="noopener noreferrer"/);
  assert.doesNotMatch(source, /fetch\(|localStorage|sessionStorage|trackEvent|openai|gemini/i);
});

test("maternal data distinguishes partner impact, national, and Indiana evidence", () => {
  const source = read("../data/maternalHealthData.js");
  const component = read("../components/PartnerPlatformDiscovery.jsx");
  assert.match(source, /17\.9/);
  assert.match(source, /44\.8/);
  assert.match(source, /13% → 21%/);
  assert.match(source, /25% vs 15%/);
  assert.match(source, /91% vs 34%/);
  assert.match(source, /≈41 min/);
  assert.match(source, /pubmed\.ncbi\.nlm\.nih\.gov\/16199676/);
  assert.match(source, /who\.int\/publications\/i\/item\/9789241550215/);
  assert.match(source, /cdc\.gov\/nchs\/data\/hestat\/hestat113\.htm/);
  assert.match(source, /in\.gov\/health\/mch\/files\/MMRC/);
  assert.match(component, /should not be compared directly/);
  assert.match(component, /This platform does not diagnose/);
});

test("maternal data uses compact mobile accordions without changing the desktop grids", () => {
  const component = read("../components/PartnerPlatformDiscovery.jsx");
  assert.match(component, /activeMobileScope/);
  assert.match(component, /aria-pressed=\{activeMobileScope === scope\.id\}/);
  assert.match(component, /function MobileDataCard/);
  assert.match(component, /aria-expanded=\{expanded\}/);
  assert.match(component, /expandedMobileHighlights/);
  assert.match(component, /allMobileHighlightsExpanded/);
  assert.match(component, /Choose maternal data view/);
  assert.match(component, /Your impact/);
  assert.match(component, /Open only what you need/);
  assert.match(component, /Collapse all/);
  assert.doesNotMatch(component, /Swipe for more/);
  assert.doesNotMatch(component, /snap-x snap-mandatory/);
  assert.match(component, /className="hidden md:block"/);
  assert.match(component, /<details className="group .*md:hidden/);
});

test("discovery appearance follows the persisted Partner Platform theme selector", () => {
  const tailwind = read("../../../../tailwind.config.js");
  assert.match(tailwind, /darkMode:\s*\["selector", '\[data-theme="dark"\]'\]/);
});
