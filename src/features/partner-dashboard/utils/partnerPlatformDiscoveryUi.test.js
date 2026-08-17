import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");

test("Today keeps compact local search and sends maternal results to the dedicated route", () => {
  const overview = read("../pages/OverviewPage.jsx");
  const discovery = read("../components/PartnerPlatformDiscovery.jsx");

  assert.match(overview, /<PartnerPlatformDiscovery/);
  assert.match(overview, /onOpenLesson=\{onOpenLesson\}/);
  assert.match(overview, /onOpenGuide=\{onOpenGuide\}/);
  assert.match(overview, /onOpenVideoHub=\{onOpenVideoHub\}/);
  assert.match(overview, /onOpenMaternalData=\{onOpenMaternalData\}/);
  assert.doesNotMatch(discovery, /maternalHealthHighlights|Recent maternal health data/);
  assert.match(discovery, /result\.kind === "data"\) onOpenMaternalData\(result\.highlightId\)/);
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
  assert.doesNotMatch(source, /fetch\(|localStorage|sessionStorage|trackEvent|openai|gemini/i);
});

test("Ask Partner Hub is explicit, bounded, and leaves local search as the default", () => {
  const source = read("../components/PartnerPlatformDiscovery.jsx");
  const service = read("../services/askPartnerHubService.js");
  const route = read("../../../../api/ask-partner-hub.js");
  const server = read("../../../server/partnerHubAsk.js");

  assert.match(source, /onClick=\{handleAsk\}/);
  assert.match(source, /Ask Partner Hub/);
  assert.match(source, /getPartnerPlatformAskCandidateIds/);
  assert.doesNotMatch(source, /useEffect\([^)]*askPartnerHub/);
  assert.match(service, /candidateIds: candidateIds\.slice\(0, 8\)/);
  assert.match(service, /Authorization: `Bearer \$\{accessToken\}`/);
  assert.match(route, /partnerHubAskHandler/);
  assert.match(server, /PARTNER_HUB_OPENAI_API_KEY/);
  assert.doesNotMatch(server, /process\.env\.OPENAI_API_KEY/);
  assert.match(server, /store: false/);
  assert.match(server, /MAX_OUTPUT_TOKENS = 450/);
});

test("maternal data uses the latest verified national, access, and Indiana evidence", () => {
  const source = read("../data/maternalHealthData.js");
  const page = read("../pages/MaternalDataPage.jsx");

  for (const expected of [
    "17.9",
    "44.8 vs 14.2",
    "62.3",
    "35.1%",
    "2.3M + 150K",
    "2.6×",
    "+13%",
    "1 in 5",
    "21.9% vs 11.1%",
    "13% → 21%",
    "40% → 65%",
    "31.4",
    "16.1%",
  ]) {
    assert.match(source, new RegExp(expected.replace(/[+.*?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(source, /2024 Nowhere to Go report/);
  assert.match(source, /2025 Annual Report/);
  assert.match(source, /2025 Indiana Report Card/);
  assert.match(page, /We do not label it as a 2026 report/);
  assert.match(page, /should not be compared directly/);
  assert.match(page, /This platform does not diagnose/);
});

test("maternal data page uses accessible disclosure and compact responsive controls", () => {
  const page = read("../pages/MaternalDataPage.jsx");
  assert.match(page, /aria-expanded=\{expanded\}/);
  assert.match(page, /aria-controls=\{panelId\}/);
  assert.match(page, /aria-pressed=\{active\}/);
  assert.match(page, /grid grid-cols-1 gap-2 sm:grid-cols-3/);
  assert.match(page, /grid gap-3 lg:grid-cols-2/);
  assert.match(page, /focus-visible:outline/);
  assert.match(page, /rel="noopener noreferrer"/);
  assert.doesNotMatch(page, /overflow-x-auto|snap-x|min-w-\[/);
});

test("discovery and maternal data follow the persisted Partner Platform theme selector", () => {
  const tailwind = read("../../../../tailwind.config.js");
  const page = read("../pages/MaternalDataPage.jsx");
  assert.match(tailwind, /darkMode:\s*\["selector", '\[data-theme="dark"\]'\]/);
  assert.match(page, /dark:bg-slate-950/);
});
