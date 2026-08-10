import assert from "node:assert/strict";
import test from "node:test";
import {
  buildLessonMissionRecord,
  getLessonMission,
  normalizeLessonMissions,
} from "./lessonMission.js";

test("lesson mission uses bounded, practical defaults", () => {
  const mission = getLessonMission({ summary: "Practice useful support." });

  assert.equal(mission.durationMinutes, 8);
  assert.equal(mission.required, true);
  assert.equal(mission.checklist.length, 3);
  assert.match(mission.sayThis, /What feels hardest/);
});

test("mission records keep only allowlisted checklist indexes", () => {
  const record = buildLessonMissionRecord({
    completedItems: [2, 1, 2, -1, 9, "0", "private note"],
    checklistLength: 3,
    completedAt: "2026-08-09T20:00:00.000Z",
  });

  assert.deepEqual(record.completedItems, [0, 1, 2]);
  assert.equal(record.completedAt, "2026-08-09T20:00:00.000Z");
  assert.equal(JSON.stringify(record).includes("private note"), false);
});

test("mission normalization drops unknown lesson ids and invalid timestamps", () => {
  const lessons = [{ id: "known", summary: "Known lesson" }];
  const normalized = normalizeLessonMissions(
    {
      known: { completedItems: [0, 4], completedAt: "invalid" },
      unknown: { completedItems: [0], completedAt: "2026-08-09T20:00:00.000Z" },
    },
    lessons
  );

  assert.deepEqual(normalized, {
    known: { completedItems: [0], completedAt: null },
  });
});
