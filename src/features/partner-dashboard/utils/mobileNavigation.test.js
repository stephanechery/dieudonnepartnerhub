import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dashboardRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readDashboardFile = (...parts) => readFile(path.join(dashboardRoot, ...parts), "utf8");

test("mobile navigation exposes the five approved destinations", async () => {
  const [nav, router] = await Promise.all([
    readDashboardFile("components", "MobilePlatformNav.jsx"),
    readDashboardFile("index.jsx"),
  ]);

  for (const label of ["Today", "Training", "Guides", "Videos", "More"]) {
    assert.match(nav, new RegExp(`label: "${label}"`));
  }

  assert.match(nav, /aria-current=\{active \? "page" : undefined\}/);
  assert.match(nav, /env\(safe-area-inset-bottom\)/);
  assert.match(nav, /md:hidden/);
  assert.match(router, /subPath === "\/training"/);
  assert.match(router, /subPath === "\/more"/);
  assert.match(router, /subPath\.startsWith\("\/module\/"\)[\s\S]*?"training"/);
});

test("mobile More keeps owner admin navigation behind the existing owner result", async () => {
  const [router, morePage] = await Promise.all([
    readDashboardFile("index.jsx"),
    readDashboardFile("pages", "MorePage.jsx"),
  ]);

  assert.match(router, /showAdminDashboard\s*=\s*isConfiguredOwnerUser\(authUser, profile\)/);
  assert.match(router, /<MorePage[\s\S]*?showAdminDashboard=\{showAdminDashboard\}/);
  assert.match(morePage, /showAdminDashboard\s*&&\s*\(/);
  assert.equal((morePage.match(/href="\/owner-admin"/g) || []).length, 1);
});

test("mobile Today removes the old resume overlay and routes detailed content to tabs", async () => {
  const overview = await readDashboardFile("pages", "OverviewPage.jsx");

  assert.doesNotMatch(overview, /Resume Training/);
  assert.match(overview, /hidden rounded-\[1\.8rem\][\s\S]*?md:block/);
  assert.match(overview, /hidden grid-cols-1 gap-4 md:grid/);
});
