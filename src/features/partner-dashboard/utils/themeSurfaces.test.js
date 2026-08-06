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
  const [router, shell, videoHub] = await Promise.all([
    readDashboardFile("index.jsx"),
    readDashboardFile("components", "DashboardShell.jsx"),
    readDashboardFile("pages", "VideoHubPage.jsx"),
  ]);

  assert.match(
    router,
    /showAdminDashboard\s*=\s*isConfiguredOwnerUser\(authUser, profile\)/
  );
  assert.match(shell, /showAdminDashboard\s*&&/);
  assert.match(videoHub, /showAdminDashboard\s*&&/);
  assert.equal((shell.match(/href="\/owner-admin"/g) || []).length, 1);
  assert.equal((videoHub.match(/href="\/owner-admin"/g) || []).length, 1);
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
