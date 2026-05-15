const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

const textModelFallbacks = (configuredModel) =>
  Array.from(new Set([configuredModel || "gemini-2.5-flash", "gemini-2.5-flash", "gemini-2.5-flash-lite"]));

const extractGeminiError = async (response) => {
  try {
    const payload = await response.json();
    return payload?.error?.message || `Gemini request failed with status ${response.status}.`;
  } catch {
    return `Gemini request failed with status ${response.status}.`;
  }
};

const extractGeminiText = (data) => {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return "";
  return parts
    .map((part) => part?.text || "")
    .filter(Boolean)
    .join("\n")
    .trim();
};

const extractAudioBase64 = (data) => data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";

const callGemini = async ({ model, apiKey, body }) => {
  const response = await fetch(`${GEMINI_BASE_URL}/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await extractGeminiError(response));
  }

  return response.json();
};

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    response.status(503).json({ error: "AI support is not configured." });
    return;
  }

  try {
    const payload = request.body || {};

    if (payload.type === "tts") {
      const text = String(payload.text || "").trim();
      if (!text) {
        response.status(400).json({ error: "Missing text." });
        return;
      }

      const model = process.env.GEMINI_TTS_MODEL || "gemini-2.5-flash-preview-tts";
      const data = await callGemini({
        model,
        apiKey,
        body: {
          contents: [{ parts: [{ text }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
            },
          },
        },
      });

      response.status(200).json({ audioBase64: extractAudioBase64(data) });
      return;
    }

    const prompt = String(payload.prompt || "").trim();
    if (!prompt) {
      response.status(400).json({ error: "Missing prompt." });
      return;
    }

    const systemInstruction = String(payload.systemInstruction || "").trim();
    const generationConfig =
      payload.generationConfig && typeof payload.generationConfig === "object"
        ? payload.generationConfig
        : {};
    let lastError = null;

    for (const model of textModelFallbacks(process.env.GEMINI_TEXT_MODEL)) {
      try {
        const data = await callGemini({
          model,
          apiKey,
          body: {
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: systemInstruction
              ? { parts: [{ text: systemInstruction }] }
              : undefined,
            generationConfig: Object.keys(generationConfig).length ? generationConfig : undefined,
          },
        });
        const text = extractGeminiText(data);
        if (!text) throw new Error(`Gemini returned an empty response. (model: ${model})`);
        response.status(200).json({ text });
        return;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error("Gemini text request failed.");
  } catch (error) {
    response.status(500).json({ error: error?.message || "Gemini request failed." });
  }
}
