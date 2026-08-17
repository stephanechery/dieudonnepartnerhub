export class PartnerHubAskError extends Error {
  constructor(code, status = 0) {
    super(code);
    this.name = "PartnerHubAskError";
    this.code = code;
    this.status = status;
  }
}

export const askPartnerHub = async ({
  question,
  language = "en",
  candidateIds = [],
  accessToken,
  fetchImpl = fetch,
}) => {
  if (!accessToken) throw new PartnerHubAskError("AUTH_REQUIRED", 401);

  let response;
  try {
    response = await fetchImpl("/api/ask-partner-hub", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: String(question || "").trim(),
        language,
        candidateIds: candidateIds.slice(0, 8),
      }),
    });
  } catch {
    throw new PartnerHubAskError("ASK_UNAVAILABLE", 0);
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new PartnerHubAskError(payload?.error?.code || "ASK_UNAVAILABLE", response.status);
  }

  if (!payload || typeof payload.answer !== "string" || !Array.isArray(payload.citations)) {
    throw new PartnerHubAskError("ASK_UNAVAILABLE", response.status);
  }

  return payload;
};
