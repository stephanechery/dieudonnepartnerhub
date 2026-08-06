import assert from "node:assert/strict";
import test from "node:test";
import {
  buildAdminTrend,
  filterEventsForAdminRange,
  getAdminRangeCutoff,
  getProfileCompletionEvents,
  getProfileProgressTotals,
  mergeProfileCompletionEvents,
  normalizeAdminRange,
} from "./adminAnalytics.js";

const now = new Date("2026-08-05T12:00:00.000Z");

test("admin ranges normalize and filter real activity", () => {
  const events = [
    { id: "recent", eventName: "guide_open", occurredAt: "2026-08-03T12:00:00.000Z" },
    { id: "june", eventName: "lesson_completed", occurredAt: "2026-06-09T12:00:00.000Z" },
  ];

  assert.equal(normalizeAdminRange("unknown"), "7d");
  assert.equal(getAdminRangeCutoff("all", now), null);
  assert.deepEqual(filterEventsForAdminRange(events, "7d", now).map((event) => event.id), ["recent"]);
  assert.equal(filterEventsForAdminRange(events, "all", now).length, 2);
});

test("persisted profile completions fill the trend without double counting tracked events", () => {
  const profiles = [{
    uid: "owner",
    recentlyCompleted: [
      { moduleId: "prenatal", lessonId: "lesson-1", completedAt: "2026-06-08T12:00:00.000Z" },
      { moduleId: "prenatal", lessonId: "lesson-2", completedAt: "2026-06-09T12:00:00.000Z" },
    ],
  }];
  const events = [{
    id: "tracked-completion",
    eventName: "lesson_completed",
    occurredAt: "2026-06-08T12:00:00.000Z",
    uid: "owner",
    moduleId: "prenatal",
    lessonId: "lesson-1",
  }];

  assert.equal(getProfileCompletionEvents(profiles).length, 2);
  const merged = mergeProfileCompletionEvents(events, profiles);
  assert.equal(merged.filter((event) => event.eventName === "lesson_completed").length, 2);
  assert.equal(buildAdminTrend(merged, "7d", now).reduce((sum, row) => sum + row.lessons, 0), 0);
  assert.equal(buildAdminTrend(merged, "all", now).reduce((sum, row) => sum + row.lessons, 0), 2);
});

test("persisted profile totals drive the admin completion metric", () => {
  const profiles = [{
    modules: {
      prenatal: {
        completedLessons: ["one", "two", "three", "four", "five"],
        quizScores: { one: 80, two: 90, three: 70, four: 100, five: 80 },
      },
    },
  }];

  assert.deepEqual(getProfileProgressTotals(profiles), {
    lessonCompletions: 5,
    quizResults: 5,
  });
});
