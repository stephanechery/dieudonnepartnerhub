import assert from "node:assert/strict";
import test from "node:test";
import { askPartnerHub, PartnerHubAskError } from "./askPartnerHubService.js";

test("Ask client sends only the bounded question, language, and public candidate ids", async () => {
  let request = null;
  const result = await askPartnerHub({
    question: "  How can I support prenatal appointments?  ",
    language: "es",
    candidateIds: Array.from({ length: 10 }, (_, index) => `lesson:test:${index}`),
    accessToken: "synthetic-access-token",
    fetchImpl: async (url, options) => {
      request = { url, options };
      return {
        ok: true,
        status: 200,
        json: async () => ({
          supported: true,
          urgent: false,
          answer: "Respuesta sintética.",
          citations: [],
        }),
      };
    },
  });

  assert.equal(result.answer, "Respuesta sintética.");
  assert.equal(request.url, "/api/ask-partner-hub");
  assert.equal(request.options.headers.Authorization, "Bearer synthetic-access-token");
  const body = JSON.parse(request.options.body);
  assert.deepEqual(Object.keys(body).sort(), ["candidateIds", "language", "question"]);
  assert.equal(body.question, "How can I support prenatal appointments?");
  assert.equal(body.language, "es");
  assert.equal(body.candidateIds.length, 8);
  assert.doesNotMatch(request.options.body, /membership|owner|profile|progress|role|uid/i);
});

test("Ask client refuses to call the API without a secure access token", async () => {
  let called = false;
  await assert.rejects(
    askPartnerHub({
      question: "What is preeclampsia?",
      fetchImpl: async () => {
        called = true;
      },
    }),
    (error) => error instanceof PartnerHubAskError && error.code === "AUTH_REQUIRED"
  );
  assert.equal(called, false);
});
