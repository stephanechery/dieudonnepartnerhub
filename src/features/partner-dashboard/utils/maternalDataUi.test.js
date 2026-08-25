import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  maternalHealthHighlights,
  maternalHealthSources,
} from "../data/maternalHealthData.js";

const dashboardRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

const readDashboardFile = (...parts) =>
  readFile(path.join(dashboardRoot, ...parts), "utf8");

test("Maternal Data keeps one compact intro and places the guide map before evidence", async () => {
  const page = await readDashboardFile("pages", "MaternalDataPage.jsx");

  const introIndex = page.indexOf("Understand the data. Know how to help.");
  const mapIndex = page.indexOf("<MaternalDataMap");
  const evidenceIndex = page.indexOf('<section aria-labelledby="maternal-data-group-heading">');

  assert.ok(introIndex >= 0 && introIndex < mapIndex);
  assert.ok(mapIndex < evidenceIndex);
  assert.equal((page.match(/tx\("Maternal Data"\)/g) || []).length, 0);
  assert.match(page, /aria-label=\{tx\("Guide Map"\)\}/);
  assert.match(page, /aria-current=\{active \? "step" : undefined\}/);
  assert.match(page, /lg:hidden/);
  assert.match(page, /lg:grid/);

  const partnerIndex = page.indexOf('id: "partner"');
  const nationalIndex = page.indexOf('id: "national"');
  const indianaIndex = page.indexOf('id: "indiana"');
  assert.ok(partnerIndex < nationalIndex && nationalIndex < indianaIndex);
  assert.match(page, /const initialHighlight = firstHighlightForGroup\(initialGroup\)/);
});

test("Maternal Data sections are addressable and retain browser history navigation", async () => {
  const page = await readDashboardFile("pages", "MaternalDataPage.jsx");
  const router = await readDashboardFile("index.jsx");

  for (const routeId of ["your-impact", "united-states", "indiana"]) {
    assert.match(page, new RegExp(`routeId: "${routeId}"`));
  }
  assert.match(page, /groupForRoute\(routeSectionId\)/);
  assert.match(page, /onNavigateSection\(option\.routeId\)/);
  assert.match(router, /maternalDataMatch = subPath\.match\(\/\^\\\/maternal-data/);
  assert.match(router, /routeSectionId=\{maternalDataMatch\[1\] \|\| ""\}/);
  assert.match(router, /navigate\(`\$\{BASE_PATH\}\/maternal-data\/\$\{sectionId\}`\)/);
  assert.doesNotMatch(page, /localStorage|sessionStorage/);
});

test("expanded evidence spans the desktop grid while collapsed cards stay compact", async () => {
  const page = await readDashboardFile("pages", "MaternalDataPage.jsx");

  assert.match(page, /self-start[\s\S]*?expanded \? "lg:col-span-2" : ""/);
  assert.match(page, /className="block min-h-28 w-full/);
  assert.match(page, /allExpanded \? "Collapse all" : "Expand all"/);
  assert.match(page, /href=\{highlight\.source\.href\}/);
  assert.match(page, /rel="noopener noreferrer"/);
  assert.match(page, /disabled=\{!previousOption\}/);
  assert.match(page, /disabled=\{!nextOption\}/);
});

test("every Maternal Data finding remains bound to a secure official source link", () => {
  const sourceEntries = Object.values(maternalHealthSources);
  assert.ok(sourceEntries.length > 0);
  assert.ok(maternalHealthHighlights.length > 0);

  for (const source of sourceEntries) {
    assert.match(source.href, /^https:\/\//);
    assert.ok(source.label.trim().length > 0);
  }
  for (const highlight of maternalHealthHighlights) {
    assert.ok(sourceEntries.includes(highlight.source), `${highlight.id} must use a registered source`);
  }
});

test("Partner Platform tabs use the compact utility header and retain the existing owner gate", async () => {
  const shell = await readDashboardFile("components", "DashboardShell.jsx");

  assert.match(shell, /const useMaternalDataHeaderTreatment = !embedded/);
  assert.match(
    shell,
    /useMaternalDataHeaderTreatment \? \([\s\S]*?\{showMenuControl\}[\s\S]*?\{homeControl\}[\s\S]*?\{adminControl\}[\s\S]*?\{themeControl\}[\s\S]*?\{logoutControl\}[\s\S]*?\{identityBlock\}[\s\S]*?\{progressStatus\}/
  );
  assert.match(shell, /const adminControl = showAdminDashboard &&/);
  assert.equal((shell.match(/href="\/owner-admin"/g) || []).length, 1);
  assert.match(shell, /border-rose-200 bg-transparent text-rose-700/);
});
