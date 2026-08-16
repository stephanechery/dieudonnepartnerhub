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
  assert.match(nav, /inset-x-4/);
  assert.match(nav, /rounded-\[2\.125rem\]/);
  assert.match(nav, /min-h-16/);
  assert.match(nav, /h-\[25px\] w-\[25px\]/);
  assert.match(nav, /0\.3\)\]/);
  assert.match(nav, /transform-gpu/);
  assert.match(nav, /will-change-transform/);
  assert.doesNotMatch(nav, /backdrop-blur/);
  assert.match(nav, /md:hidden/);
  assert.equal((router.match(/pb-28 md:pb-0/g) || []).length, 2);
  assert.match(router, /subPath === "\/training"/);
  assert.match(router, /subPath === "\/more"/);
  assert.match(router, /activePlatformItem === "data" \? "more"/);
  assert.match(router, /subPath\.startsWith\("\/module\/"\)[\s\S]*?"training"/);
});

test("mobile dashboard height follows the visible browser viewport", async () => {
  const shell = await readDashboardFile("components", "DashboardShell.jsx");

  assert.match(shell, /min-h-\[100dvh\]/);
  assert.match(shell, /md:min-h-screen/);
  assert.doesNotMatch(shell, /relative min-h-screen px-3 py-4/);
});

test("mobile More keeps owner admin navigation behind the existing owner result", async () => {
  const [router, morePage] = await Promise.all([
    readDashboardFile("index.jsx"),
    readDashboardFile("pages", "MorePage.jsx"),
  ]);

  assert.match(router, /showAdminDashboard\s*=\s*isConfiguredOwnerUser\(authUser, profile\)/);
  assert.match(router, /<MorePage[\s\S]*?showAdminDashboard=\{showAdminDashboard\}/);
  assert.match(morePage, /showAdminDashboard\s*&&\s*\(/);
  assert.match(morePage, /onOpenMaternalData/);
  assert.match(morePage, /tx\("Maternal Data"\)/);
  assert.equal((morePage.match(/href="\/owner-admin"/g) || []).length, 1);
});

test("mobile Today keeps one compact learning route and removes hidden duplicate panels", async () => {
  const overview = await readDashboardFile("pages", "OverviewPage.jsx");

  assert.doesNotMatch(overview, /Resume Training/);
  assert.match(overview, /tx\("Continue learning"\)/);
  assert.match(overview, /onClick=\{onOpenTraining\}/);
  assert.doesNotMatch(overview, /hidden rounded-\[1\.8rem\][\s\S]*?md:block/);
  assert.doesNotMatch(overview, /hidden grid-cols-1 gap-4 md:grid/);
});
