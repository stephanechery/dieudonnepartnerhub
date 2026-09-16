import test from "node:test";
import assert from "node:assert/strict";
import { previewReport, previewCsv } from "./previewModel.js";

test("synthetic metrics respect selected cohort and reporting month", () => {
  assert.equal(previewReport("sample-a", "2026-07").active, 8);
  assert.equal(previewReport("sample-a", "2026-08").active, 9);
  assert.throws(() => previewReport("real-org", "2026-07"));
  assert.throws(() => previewReport("sample-a", "all-time"));
});
test("small-cohort and complementary feedback suppression survives export", () => {
  const report = previewReport("sample-small", "2026-07");
  assert.equal(report.active, null); assert.equal(report.enrolled, null);
  assert.equal(report.feedback, null); assert.equal(report.guideCompletion, null);
  assert.equal(previewReport("sample-a", "2026-07").feedback, null);
  const csv = previewCsv(report);
  assert.ok(csv.includes("SYNTHETIC PREVIEW ONLY"));
  assert.ok(csv.includes('"Active participants","Not reported"'));
});
