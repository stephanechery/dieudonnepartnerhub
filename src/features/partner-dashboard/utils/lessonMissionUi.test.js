import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dashboardRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readDashboardFile = (...parts) =>
  readFile(path.join(dashboardRoot, ...parts), "utf8");

test("lesson page uses the approved four-stage mission experience", async () => {
  const [lessonPage, experience] = await Promise.all([
    readDashboardFile("pages", "LessonPage.jsx"),
    readDashboardFile("components", "LessonMissionExperience.jsx"),
  ]);

  assert.match(lessonPage, /<LessonMissionExperience/);
  assert.match(experience, /Learn/);
  assert.match(experience, /Practice/);
  assert.match(experience, /Knowledge Check/);
  assert.match(experience, /Do This Today/);
  assert.match(experience, /This platform does not diagnose/);
  assert.match(experience, /role="checkbox"/);
});

test("mission persistence stores fixed indexes without changing access rules", async () => {
  const [context, profileService, router] = await Promise.all([
    readDashboardFile("state", "PartnerDashboardContext.jsx"),
    readDashboardFile("services", "profileService.js"),
    readDashboardFile("index.jsx"),
  ]);

  assert.match(context, /buildLessonMissionRecord/);
  assert.match(context, /lessonMissions/);
  assert.match(context, /lesson_mission_saved/);
  assert.doesNotMatch(context, /lesson_mission_saved[\s\S]{0,220}(?:symptom|diagnosis|note|responseText):/);
  assert.match(profileService, /normalizeLessonMissions/);
  assert.match(router, /showAdminDashboard\s*=\s*isConfiguredOwnerUser\(authUser, profile\)/);
  assert.equal((router.match(/isConfiguredOwnerUser\(authUser, profile\)/g) || []).length, 1);
});
