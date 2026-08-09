import test from "node:test";
import assert from "node:assert/strict";
import {
  buildCompletedOnboarding,
  getOnboardingRecommendation,
  normalizeOnboarding,
  validateOnboardingStep,
} from "./onboarding.js";

test("normalizes onboarding choices without retaining unsupported values", () => {
  const normalized = normalizeOnboarding({
    stage: "pregnant",
    pregnancyWeek: "28",
    supportRole: "owner",
    priorities: ["labor-prep", "labor-prep", "unknown", "communication"],
    facilityName: "  Community Hospital  ",
  });

  assert.equal(normalized.pregnancyWeek, 28);
  assert.equal(normalized.supportRole, "");
  assert.deepEqual(normalized.priorities, ["labor-prep", "communication"]);
  assert.equal(normalized.facilityName, "Community Hospital");
});

test("validates only optional values that were entered", () => {
  assert.deepEqual(validateOnboardingStep(0, { stage: "pregnant", pregnancyWeek: "" }), {});
  assert.equal(
    validateOnboardingStep(0, { stage: "pregnant", pregnancyWeek: "43" }).pregnancyWeek,
    "Enter a whole number from 1 to 42, or skip this field."
  );
  assert.equal(
    validateOnboardingStep(2, { facilityName: "x".repeat(81) }).facilityName,
    "Use 80 characters or fewer, or skip this field."
  );
});

test("builds a completed record and timing-aware recommendation", () => {
  const completed = buildCompletedOnboarding(
    { stage: "pregnant", pregnancyWeek: 28, priorities: ["labor-prep"] },
    "2026-08-09T12:00:00.000Z"
  );
  const recommendation = getOnboardingRecommendation(completed);

  assert.equal(completed.status, "completed");
  assert.equal(completed.completedAt, "2026-08-09T12:00:00.000Z");
  assert.match(recommendation.startHere, /week 28/);
  assert.equal(recommendation.guideId, "partner-labor-guide");
});

