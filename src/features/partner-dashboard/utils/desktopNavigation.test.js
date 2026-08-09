import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  DESKTOP_SIDEBAR_STORAGE_KEY,
  getInitialDesktopSidebarVisibility,
  persistDesktopSidebarVisibility,
} from "./desktopSidebar.js";

const dashboardRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readDashboardFile = (...parts) => readFile(path.join(dashboardRoot, ...parts), "utf8");

const makeWindow = (initialValue = null) => {
  let storedValue = initialValue;
  return {
    localStorage: {
      getItem: (key) => key === DESKTOP_SIDEBAR_STORAGE_KEY ? storedValue : null,
      setItem: (key, value) => {
        if (key === DESKTOP_SIDEBAR_STORAGE_KEY) storedValue = value;
      },
    },
    read: () => storedValue,
  };
};

test("desktop navigation exposes the approved workspace destinations", async () => {
  const [nav, router] = await Promise.all([
    readDashboardFile("components", "DesktopPlatformNav.jsx"),
    readDashboardFile("index.jsx"),
  ]);

  for (const label of ["Today", "Training", "Guides", "Videos", "More"]) {
    assert.match(nav, new RegExp(`label: "${label}"`));
  }

  assert.match(nav, /w-\[272px\]/);
  assert.match(nav, /md:flex/);
  assert.match(nav, /aria-current=\{active \? "page" : undefined\}/);
  assert.match(router, /<DashboardShell[\s\S]*?activeItem=\{activePlatformItem\}/);
  assert.match(router, /onNavigatePlatform=\{\(item\) =>/);
});

test("desktop sidebar visibility defaults on and persists both choices", () => {
  const storageWindow = makeWindow();
  assert.equal(getInitialDesktopSidebarVisibility(storageWindow), true);

  persistDesktopSidebarVisibility(false, storageWindow);
  assert.equal(storageWindow.read(), "hidden");
  assert.equal(getInitialDesktopSidebarVisibility(storageWindow), false);

  persistDesktopSidebarVisibility(true, storageWindow);
  assert.equal(storageWindow.read(), "shown");
  assert.equal(getInitialDesktopSidebarVisibility(storageWindow), true);
});

test("desktop shell has accessible show and hide controls without moving the owner gate", async () => {
  const [shell, nav, mobile] = await Promise.all([
    readDashboardFile("components", "DashboardShell.jsx"),
    readDashboardFile("components", "DesktopPlatformNav.jsx"),
    readDashboardFile("components", "MobilePlatformNav.jsx"),
  ]);

  assert.match(shell, /getInitialDesktopSidebarVisibility/);
  assert.match(shell, /persistDesktopSidebarVisibility/);
  assert.match(shell, /aria-controls="partner-platform-sidebar"/);
  assert.match(shell, /tx\("Show menu"\)/);
  assert.match(nav, /tx\("Hide menu"\)/);
  assert.match(shell, /showAdminDashboard\s*&&/);
  assert.equal((shell.match(/href="\/owner-admin"/g) || []).length, 1);
  assert.match(mobile, /md:hidden/);
});
