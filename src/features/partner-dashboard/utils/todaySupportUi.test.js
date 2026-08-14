import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dashboardRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readDashboardFile = (...parts) => readFile(path.join(dashboardRoot, ...parts), "utf8");

test("Today replaces the overview hero with the approved Situation Helper", async () => {
  const [overview, card] = await Promise.all([
    readDashboardFile("pages", "OverviewPage.jsx"),
    readDashboardFile("components", "TodaySupportCard.jsx"),
  ]);

  assert.match(overview, /<TodaySupportCard/);
  assert.doesNotMatch(overview, /A clear place to start today/);
  assert.match(card, /What kind of support is needed today\?/);
  assert.match(card, /No private notes or symptom details are collected\./);
  assert.match(card, /Change context/);
  assert.match(card, /Mark done/);
  assert.match(card, /completion\.planId === plan\.id/);
  assert.match(card, /This guide does not replace emergency or medical care\./);
});

test("Today is a compact action dashboard without duplicate tab content", async () => {
  const overview = await readDashboardFile("pages", "OverviewPage.jsx");

  assert.match(overview, /tx\("Continue learning"\)/);
  assert.match(overview, /onClick=\{onOpenTraining\}/);
  assert.match(overview, /onOpenLesson\(nextLesson\.moduleId, nextLesson\.lessonId\)/);
  assert.match(overview, /<PartnerPlatformDiscovery/);
  assert.match(overview, /tx\("Match mom with a doula"\)/);
  for (const duplicate of [
    "Organization or program",
    "Next Best Action",
    "Overall Progress",
    "Quiz Avg",
    "Recently Completed Lessons",
    "Module Progress",
    "Training Approach",
    "Interactive Guide Library",
    "Partner Video Hub",
  ]) {
    assert.doesNotMatch(overview, new RegExp(duplicate));
  }
  assert.doesNotMatch(overview, /<ModuleCard|partnerInteractiveGuides|onSaveProfileDetails/);
});

test("Today deep links use the existing Training, lesson, guide, and video routes", async () => {
  const router = await readDashboardFile("index.jsx");

  assert.match(router, /onOpenTraining=\{openTraining\}/);
  assert.match(router, /onOpenLesson=\{openLesson\}/);
  assert.match(router, /onOpenGuide=\{openGuide\}/);
  assert.match(router, /onOpenVideoHub=\{openVideoHub\}/);
  assert.match(router, /const openTraining = \(\) => navigate\(`\$\{BASE_PATH\}\/training`\)/);
});

test("Today persistence and analytics stay allowlisted and coarse", async () => {
  const [context, profileService, router] = await Promise.all([
    readDashboardFile("state", "PartnerDashboardContext.jsx"),
    readDashboardFile("services", "profileService.js"),
    readDashboardFile("index.jsx"),
  ]);

  assert.match(profileService, /todaySupport: normalizeTodaySupport\(profile\.todaySupport\)/);
  assert.match(context, /buildTodaySupportSelection\(\{ contextId, profile \}\)/);
  assert.match(context, /buildTodaySupportCompletion\(\{ profile \}\)/);
  assert.match(context, /eventName|today_support_selected/);
  assert.doesNotMatch(context, /today_support_(?:selected|completed)[\s\S]{0,250}(?:notes|symptoms|phrase|action):/);
  assert.match(router, /onSelectTodayContext=\{saveTodaySupportContext\}/);
  assert.match(router, /onMarkTodayDone=\{markTodaySupportDone\}/);
  assert.match(router, /trackTodaySupportResourceClick\(plan\)/);
});

test("Today routing does not change the owner-only admin presentation gate", async () => {
  const router = await readDashboardFile("index.jsx");

  assert.match(router, /showAdminDashboard\s*=\s*isConfiguredOwnerUser\(authUser, profile\)/);
  assert.equal((router.match(/isConfiguredOwnerUser\(authUser, profile\)/g) || []).length, 1);
  assert.doesNotMatch(router, /todaySupport[\s\S]{0,120}owner-admin/);
});
