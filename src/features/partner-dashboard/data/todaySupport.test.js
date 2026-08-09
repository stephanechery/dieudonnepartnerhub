import assert from "node:assert/strict";
import test from "node:test";
import {
  buildTodaySupportCompletion,
  buildTodaySupportSelection,
  normalizeTodaySupport,
  selectTodaySupportPlan,
  todaySupportContexts,
} from "./todaySupport.js";

test("provides the eight approved Today support contexts", () => {
  assert.equal(todaySupportContexts.length, 8);
  assert.deepEqual(
    todaySupportContexts.map((context) => context.id),
    [
      "prenatal",
      "appointment",
      "labor-prep",
      "postpartum",
      "feeding",
      "mood",
      "home-setup",
      "urgent",
    ]
  );
  assert.equal(selectTodaySupportPlan("urgent", {}).id, "urgent-warning-signs");
});

test("normalizes Today state to allowlisted plans and valid timestamps", () => {
  const normalized = normalizeTodaySupport({
    selectedContext: "owner",
    currentPlanId: "javascript:alert(1)",
    lastViewedAt: "not-a-date",
    recentCompletions: [
      {
        planId: "postpartum-recovery-reset",
        context: "postpartum",
        completedAt: "2026-08-10T12:00:00.000Z",
      },
      {
        planId: "urgent-warning-signs",
        context: "prenatal",
        completedAt: "2026-08-10T12:00:00.000Z",
      },
    ],
  });

  assert.equal(normalized.selectedContext, "");
  assert.equal(normalized.currentPlanId, "");
  assert.equal(normalized.lastViewedAt, "");
  assert.deepEqual(normalized.recentCompletions, [
    {
      planId: "postpartum-recovery-reset",
      context: "postpartum",
      completedAt: "2026-08-10T12:00:00.000Z",
    },
  ]);
});

test("builds a persistent selection and a bounded completion record", () => {
  const selected = buildTodaySupportSelection({
    contextId: "postpartum",
    profile: {},
    viewedAt: "2026-08-10T13:00:00.000Z",
  });
  const completed = buildTodaySupportCompletion({
    profile: { todaySupport: selected },
    completedAt: "2026-08-10T13:05:00.000Z",
  });

  assert.equal(selected.currentPlanId, "postpartum-recovery-reset");
  assert.equal(completed.lastCompletedAt, "2026-08-10T13:05:00.000Z");
  assert.equal(completed.recentCompletions[0].context, "postpartum");
});
