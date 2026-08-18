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

test("Maternal Data keeps one compact intro and places scope controls before evidence", async () => {
  const page = await readDashboardFile("pages", "MaternalDataPage.jsx");

  const introIndex = page.indexOf("Understand the data. Know how to help.");
  const scopeIndex = page.indexOf('aria-label={tx("Choose maternal data view")}');
  const evidenceIndex = page.indexOf('<section aria-labelledby="maternal-data-group-heading">');

  assert.ok(introIndex >= 0 && introIndex < scopeIndex);
  assert.ok(scopeIndex < evidenceIndex);
  assert.equal((page.match(/tx\("Maternal Data"\)/g) || []).length, 0);
  assert.match(page, /min-\[360px\]:grid-cols-3/);

  const partnerIndex = page.indexOf('id: "partner"');
  const nationalIndex = page.indexOf('id: "national"');
  const indianaIndex = page.indexOf('id: "indiana"');
  assert.ok(partnerIndex < nationalIndex && nationalIndex < indianaIndex);
  assert.match(
    page,
    /initialHighlightId \? \[initialHighlightId\] : \["national-preventability"\]/
  );
});

test("expanded evidence spans the desktop grid while collapsed cards stay compact", async () => {
  const page = await readDashboardFile("pages", "MaternalDataPage.jsx");

  assert.match(page, /self-start[\s\S]*?expanded \? "lg:col-span-2" : ""/);
  assert.match(page, /className="block min-h-28 w-full/);
  assert.match(page, /allExpanded \? "Collapse all" : "Expand all"/);
  assert.match(page, /href=\{highlight\.source\.href\}/);
  assert.match(page, /rel="noopener noreferrer"/);
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
