import assert from "node:assert/strict";
import test from "node:test";
import {
  partnerHubEvidence,
  retrievePartnerHubEvidence,
  toPartnerHubEvidencePacket,
} from "./partnerHubEvidence.js";

test("Partner Hub evidence contains only approved public resource kinds and internal links", () => {
  assert.ok(partnerHubEvidence.length > 20);
  for (const entry of partnerHubEvidence) {
    assert.ok(["lesson", "guide", "video", "data"].includes(entry.kind));
    assert.match(entry.href, /^\/partner-dashboard\//);
    assert.ok(entry.title);
    assert.ok(entry.excerpt);
    for (const privateKey of ["email", "membership", "owner", "profile", "progress", "role", "uid", "user"]) {
      assert.equal(Object.prototype.hasOwnProperty.call(entry, privateKey), false);
    }
  }
});

test("retrieval accepts only allowlisted candidate ids and stays bounded", () => {
  const results = retrievePartnerHubEvidence({
    question: "support during labor",
    candidateIds: [
      "guide:partner-labor-guide",
      "owner:admin-dashboard",
      "lesson:missing:missing",
      "guide:partner-labor-guide",
    ],
    limit: 3,
  });

  assert.equal(results[0].id, "guide:partner-labor-guide");
  assert.ok(results.length <= 3);
  assert.ok(results.every((entry) => entry.id !== "owner:admin-dashboard"));
});

test("evidence packets exclude ranking internals and keep source-bound ids", () => {
  const evidence = retrievePartnerHubEvidence({
    question: "maternal mortality in Indiana",
    candidateIds: ["data:indiana-maternal-mortality"],
  });
  const packet = toPartnerHubEvidencePacket(evidence);

  assert.equal(packet[0].id, "data:indiana-maternal-mortality");
  assert.equal(packet[0].kind, "data");
  assert.ok(packet[0].sourceLabel);
  assert.ok(packet[0].sourceHref);
  assert.equal("searchText" in packet[0], false);
});
