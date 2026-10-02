import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  getResourceSection,
  resourceSections,
  resourceSources,
  filterResources,
  resourceRegion,
  findResourceTarget,
} from "../data/resourcesDashboard.js";

const dashboardRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readDashboardFile = (...parts) => readFile(path.join(dashboardRoot, ...parts), "utf8");

test("Resources Dashboard has five practical sections and a stable default", () => {
  assert.deepEqual(resourceSections.map(({ id }) => id), [
    "urgent-help",
    "warning-signs",
    "mental-health",
    "practical-support",
    "benefits-planning",
  ]);
  assert.equal(getResourceSection().id, "urgent-help");
  assert.equal(getResourceSection("unknown").id, "urgent-help");
  for (const section of resourceSections) {
    assert.ok(section.resources.length >= 2, `${section.id} needs useful content`);
  }
});

test("Resources navigation follows Maternal Data and keeps stable section routes", async () => {
  const [nav, router, shell, more] = await Promise.all([
    readDashboardFile("components", "DesktopPlatformNav.jsx"),
    readDashboardFile("index.jsx"),
    readDashboardFile("components", "DashboardShell.jsx"),
    readDashboardFile("pages", "MorePage.jsx"),
  ]);

  assert.match(nav, /label: "Maternal Data"[\s\S]*?label: "Resources"[\s\S]*?label: "Videos"/);
  assert.match(router, /resourcesMatch = subPath\.match\(\/\^\\\/resources/);
  assert.match(router, /else if \(resourcesMatch\)[\s\S]*?<ResourcesDashboardPage/);
  assert.match(router, /sectionId \? `\$\{BASE_PATH\}\/resources\/\$\{sectionId\}` : `\$\{BASE_PATH\}\/resources`/);
  assert.match(router, /subPath\.startsWith\("\/resources"\)[\s\S]*?"resources"/);
  assert.match(shell, /resources: "Resources"/);
  assert.match(more, /onOpenResources/);
  assert.match(more, /tx\("Maternal Data"\)[\s\S]*?tx\("Resources"\)/);
});

test("Resources mobile entry stays inside More and owner controls remain isolated", async () => {
  const [router, mobile, more] = await Promise.all([
    readDashboardFile("index.jsx"),
    readDashboardFile("components", "MobilePlatformNav.jsx"),
    readDashboardFile("pages", "MorePage.jsx"),
  ]);

  assert.match(router, /\["data", "resources"\]\.includes\(activePlatformItem\) \? "more"/);
  assert.equal((mobile.match(/label: "/g) || []).length, 5);
  assert.doesNotMatch(mobile, /label: "Resources"/);
  assert.match(more, /showAdminDashboard\s*&&\s*\(/);
  assert.equal((more.match(/href="\/owner-admin"/g) || []).length, 1);
});

test("resource contact paths are source-bound and limited to approved destinations", () => {
  const sourceValues = Object.values(resourceSources);
  const allowedExternalHosts = new Set(["www.cdc.gov", "dieudonnematch.org", "www.in.gov", "mchb.hrsa.gov", "postpartum.net", "www.feedingamerica.org", "findahealthcenter.hrsa.gov"]);
  const allowedInternalPrefix = "/partner-dashboard/guides/";

  for (const source of sourceValues) {
    assert.ok(source.label.trim());
    if (source.kind === "external") {
      const url = new URL(source.href);
      assert.equal(url.protocol, "https:");
      assert.ok(allowedExternalHosts.has(url.hostname), `unexpected resource host: ${url.hostname}`);
    } else {
      assert.ok(source.href.startsWith(allowedInternalPrefix));
    }
  }

  for (const section of resourceSections) {
    for (const item of section.resources) {
      assert.ok(sourceValues.includes(item.source), `${item.id} must use a registered source`);
      for (const action of item.actions) {
        if (action.href.startsWith("tel:") || action.href.startsWith("sms:")) {
          if (item.id === "maternal-mental-health-hotline") {
            assert.match(action.href, /^(tel|sms):18338526262$/);
            assert.equal(item.source, resourceSources.maternalMentalHealth);
            continue;
          }
          if (item.id === "indiana-moms-helpline") {
            assert.equal(action.href, "tel:18446246667");
            assert.equal(item.source, resourceSources.indianaMoms);
            continue;
          }
          if (item.id === "indiana-211") {
            assert.equal(action.href, "tel:8662119966");
            assert.equal(item.source, resourceSources.indiana211);
            assert.equal(item.source.checkedOn, "2026-10-02");
            continue;
          }
          assert.match(action.href, /^(?:tel|sms):(911|988)$/);
          continue;
        }
        if (action.href.startsWith("/")) {
          assert.ok(action.href.startsWith(allowedInternalPrefix));
          continue;
        }
        assert.ok(allowedExternalHosts.has(new URL(action.href).hostname));
      }
    }
  }
});

test("Resources Dashboard uses accessible progressive disclosure and mobile-safe layout", async () => {
  const page = await readDashboardFile("pages", "ResourcesDashboardPage.jsx");

  assert.match(page, /aria-current=\{activeSection.id === section.id \? "page" : undefined\}/);
  assert.match(page, /<details[\s\S]*?<summary/);
  assert.match(page, /min-h-11/);
  assert.match(page, /xl:hidden/);
  assert.match(page, /hidden space-y-1 xl:block/);
  assert.match(page, /<select aria-label=\{tx\("What help do you need\?"\)\} value=\{activeSection.id\}/);
  assert.doesNotMatch(page, /overflow-x-auto|whitespace-nowrap|min-w-max/);
  assert.doesNotMatch(page, /onNavigateSection\(next\.id\)|tx\("Previous"\)|tx\("Next"\)/);
  assert.match(page, /window\.scrollTo\(\{ top: 0, behavior: "auto" \}\)/);
  assert.doesNotMatch(page, /!routeSectionId\s*\|\|\s*next\.id === activeSectionId/);
});
