import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dashboardRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

const readDashboardFile = (...parts) =>
  readFile(path.join(dashboardRoot, ...parts), "utf8");

test("owner admin navigation stays behind the existing admin check", async () => {
  const [router, shell, videoHub, morePage] = await Promise.all([
    readDashboardFile("index.jsx"),
    readDashboardFile("components", "DashboardShell.jsx"),
    readDashboardFile("pages", "VideoHubPage.jsx"),
    readDashboardFile("pages", "MorePage.jsx"),
  ]);

  assert.match(
    router,
    /showAdminDashboard\s*=\s*isConfiguredOwnerUser\(authUser, profile\)/
  );
  assert.match(shell, /showAdminDashboard\s*&&/);
  assert.match(videoHub, /showAdminDashboard\s*&&/);
  assert.match(morePage, /showAdminDashboard\s*&&/);
  assert.equal((shell.match(/href="\/owner-admin"/g) || []).length, 1);
  assert.equal((videoHub.match(/href="\/owner-admin"/g) || []).length, 1);
  assert.equal((morePage.match(/href="\/owner-admin"/g) || []).length, 1);
  assert.doesNotMatch(videoHub, /<Settings\b/);
});

test("guide library and every interactive guide follow the Partner Platform theme", async () => {
  const library = await readDashboardFile("pages", "InteractiveGuidesPage.jsx");
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

  assert.match(library, /<GuideCard[\s\S]*?darkMode=\{darkMode\}/);
  assert.match(
    library,
    /<SelectedGuideComponent darkMode=\{darkMode\} onToggleTheme=\{onToggleTheme\}/
  );

  for (const guideName of guideNames) {
    const source = await readDashboardFile(
      "interactive-guides",
      `${guideName}.jsx`
    );
    assert.match(source, /usePartnerGuideTheme\(darkMode,\s*onToggleTheme\)/);
    assert.doesNotMatch(source, /localStorage\.getItem\("dph-guide-theme"\)/);
  }
});

test("Video Hub receives the shared theme controls", async () => {
  const [router, videoHub] = await Promise.all([
    readDashboardFile("index.jsx"),
    readDashboardFile("pages", "VideoHubPage.jsx"),
  ]);

  assert.match(
    router,
    /<VideoHubPage[\s\S]*?darkMode=\{darkMode\}[\s\S]*?onToggleTheme=\{onToggleTheme\}/
  );
  assert.match(videoHub, /<ThemeToggle[\s\S]*?darkMode=\{darkMode\}/);
  assert.match(videoHub, /darkMode \? "bg-\[#050914\] text-slate-100" : "bg-slate-50 text-slate-900"/);
});

test("compact Today surfaces preserve explicit light and dark theme pairs", async () => {
  const [overview, discovery] = await Promise.all([
    readDashboardFile("pages", "OverviewPage.jsx"),
    readDashboardFile("components", "PartnerPlatformDiscovery.jsx"),
  ]);

  assert.match(overview, /darkMode[\s\S]*?border-slate-800 bg-gradient-to-br from-slate-900 to-cyan-950\/25 shadow-xl/);
  assert.match(overview, /border-slate-200 bg-gradient-to-br from-white to-cyan-50\/60/);
  assert.match(overview, /darkMode \? "text-white" : "text-slate-950"/);
  assert.match(overview, /darkMode \? "text-slate-400" : "text-slate-600"/);
  assert.match(discovery, /dark:border-slate-800 dark:bg-slate-950/);
  assert.match(discovery, /dark:from-slate-950 dark:via-slate-950 dark:to-cyan-950\/30/);
});

test("admin dashboard applies the selected range and reports persisted completions", async () => {
  const [admin, analytics] = await Promise.all([
    readFile(path.join(dashboardRoot, "..", "admin-dashboard", "index.jsx"), "utf8"),
    readDashboardFile("services", "analyticsService.js"),
  ]);

  assert.match(admin, /\["7d", "14d", "30d", "all"\]/);
  assert.match(admin, /getAdminDashboardDataAsync\(range\)/);
  assert.match(admin, /label="Lesson completions"/);
  assert.match(admin, /value=\{formatNumber\(data\.totals\.lessonCompletions\)\}/);
  assert.match(analytics, /events: localEvents,/);
  assert.doesNotMatch(analytics, /events: localEvents\.length \? localEvents : makeMockEvents\(\)/);
});
