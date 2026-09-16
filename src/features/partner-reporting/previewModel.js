// Synthetic-only view model. Not authorization and never a source of real reports.
export const periods = ["2026-07", "2026-08"];
export const cohorts = [
  { id: "sample-a", label: "Sample cohort A", enrolled: 12, periods: {
    "2026-07": { active: 8, completions: 6, kickoff: 1, checkIns: 2, respondents: 6, useful: 5, confident: 4 },
    "2026-08": { active: 9, completions: 7, kickoff: 0, checkIns: 3, respondents: 7, useful: 6, confident: 5 },
  } },
  { id: "sample-small", label: "Sample small cohort", enrolled: 3, periods: {
    "2026-07": { active: 2, completions: 1, kickoff: 1, checkIns: 1, respondents: 2, useful: 2, confident: 1 },
    "2026-08": { active: 3, completions: 2, kickoff: 0, checkIns: 1, respondents: 3, useful: 2, confident: 2 },
  } },
];

export function previewReport(cohortId, period) {
  const cohort = cohorts.find(({ id }) => id === cohortId);
  if (!cohort || !periods.includes(period)) throw new Error("Unknown synthetic selection");
  const value = cohort.periods[period];
  const suppressed = cohort.enrolled < 5 || value.active < 5;
  // Suppress complementary feedback cells too, not just the small numerator.
  const feedbackSuppressed = suppressed || value.respondents < 5 ||
    [value.useful, value.confident, value.respondents - value.useful, value.respondents - value.confident].some((n) => n < 5);
  return {
    synthetic: true, cohort: cohort.label, period,
    enrolled: suppressed ? null : cohort.enrolled,
    active: suppressed ? null : value.active,
    completions: suppressed ? null : value.completions,
    kickoff: suppressed ? null : value.kickoff,
    checkIns: suppressed ? null : value.checkIns,
    guideCompletion: null,
    feedback: feedbackSuppressed ? null : { respondents: value.respondents, useful: value.useful, confident: value.confident },
    suppressed,
  };
}

export function previewCsv(report) {
  const cell = (value) => `"${String(value ?? "Not reported").replace(/"/g, '""')}"`;
  return [
    ["SYNTHETIC PREVIEW ONLY", "No real participant data"],
    ["Cohort", report.cohort], ["Period", report.period],
    ["Enrolled", report.enrolled], ["Active participants", report.active],
    ["Participants completing a lesson", report.completions],
    ["Kickoff sessions", report.kickoff], ["Check-in sessions", report.checkIns],
    ["Guide completion", "Unavailable: device-only"],
    ["Feedback", report.feedback ? "Available in preview" : "Suppressed"],
  ].map((row) => row.map(cell).join(",")).join("\r\n");
}
