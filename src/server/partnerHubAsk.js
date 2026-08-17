import {
  normalizePartnerHubEvidenceText,
  retrievePartnerHubEvidence,
} from "../features/partner-dashboard/data/partnerHubEvidence.js";
import discoveryTranslations from "../features/language/discovery-translations.json" with { type: "json" };
import guideChromeTranslations from "../features/language/guide-chrome-translations.json" with { type: "json" };
import learningCardTranslations from "../features/language/learning-card-translations.json" with { type: "json" };
import mainGuideSpanishTranslations from "../features/language/main-guide-spanish-translations.json" with { type: "json" };
import mainGuideTranslations from "../features/language/main-guide-translations.json" with { type: "json" };
import partnerContentTranslations from "../features/language/partner-content-translations.json" with { type: "json" };
import partnerPlatformTranslations from "../features/language/partner-platform-translations.json" with { type: "json" };
import supplementalTranslations from "../features/language/supplemental-translations.json" with { type: "json" };

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-5.6-luna";
const MAX_QUESTION_LENGTH = 400;
const MAX_REQUEST_BYTES = 4_096;
const MAX_OUTPUT_TOKENS = 450;
const RATE_LIMIT_COUNT = 6;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000;
const CACHE_TTL_MS = 10 * 60 * 1_000;
const MAX_CACHE_ENTRIES = 100;
const MAX_APPROVED_CLAIMS = 30;
const MAX_CLAIMS_PER_SOURCE = 8;
const SUPPORTED_LANGUAGES = new Set(["en", "es", "fr", "ht"]);
const BLOCKED_SUPABASE_PROJECT_REFS = new Set(["dnpefwnzwzfqpnqyuiof"]);

const answerCache = new Map();
const rateLimitWindows = new Map();

const languageCopy = {
  en: {
    unsupported:
      "I could not find enough approved Partner Hub material to answer that safely. Try a more specific question or open one of the matching resources.",
    urgent:
      "This may be urgent. Contact the care team now. Call emergency services for immediate danger, including chest pain, trouble breathing, seizure, heavy bleeding, fainting, severe headache, vision changes, or thoughts of self-harm. Partner Hub cannot diagnose.",
  },
  es: {
    unsupported:
      "No encontré suficiente material aprobado de Partner Hub para responder de forma segura. Haz una pregunta más específica o abre uno de los recursos relacionados.",
    urgent:
      "Esto puede ser urgente. Comunícate ahora con el equipo de atención. Llama a los servicios de emergencia si hay peligro inmediato, incluido dolor de pecho, dificultad para respirar, convulsiones, sangrado abundante, desmayo, dolor de cabeza intenso, cambios en la visión o pensamientos de autolesión. Partner Hub no diagnostica.",
  },
  fr: {
    unsupported:
      "Je n’ai pas trouvé assez de contenu approuvé dans Partner Hub pour répondre en toute sécurité. Posez une question plus précise ou ouvrez l’une des ressources correspondantes.",
    urgent:
      "Cela peut être urgent. Contactez l’équipe soignante maintenant. Appelez les services d’urgence en cas de danger immédiat, notamment douleur thoracique, difficulté à respirer, convulsion, saignement abondant, évanouissement, mal de tête intense, changements de vision ou pensées d’automutilation. Partner Hub ne pose pas de diagnostic.",
  },
  ht: {
    unsupported:
      "Mwen pa jwenn ase materyèl Partner Hub ki apwouve pou reponn sa san danje. Eseye yon kesyon ki pi presi oswa ouvri youn nan resous ki koresponn yo.",
    urgent:
      "Sa ka ijan. Kontakte ekip swen an kounye a. Rele sèvis ijans pou danje imedya, tankou doulè nan pwatrin, pwoblèm pou respire, kriz, gwo senyen, endispoze, gwo maltèt, chanjman nan vizyon oswa panse pou fè tèt ou mal. Partner Hub pa bay dyagnostik.",
  },
};

const PROMPT_INJECTION_PATTERN =
  /(?:ignore|disregard|override|forget).{0,40}(?:instruction|prompt|policy|system|developer)|(?:reveal|show|print|repeat).{0,30}(?:prompt|secret|api key|system message)|(?:act as|developer mode|jailbreak)/i;
const DIRECT_IDENTIFIER_PATTERN =
  /(?:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}|\b(?:\d[ -]*?){13,19}\b|https?:\/\/)/i;
const URGENT_PATTERN =
  /(?:chest pain|trouble breathing|can(?:not|'t) breathe|seizure|heavy bleeding|fainting|severe headache|vision changes|self[- ]harm|suicid|dolor de pecho|dificultad para respirar|convulsi|sangrado abundante|desmayo|dolor de cabeza intenso|cambios en la visi[oó]n|douleur thoracique|difficult[eé] [aà] respirer|saignement abondant|[eé]vanouissement|mal de t[eê]te intense|changements? de vision|doul[eè] nan pwatrin|pwobl[eè]m pou respire|gwo senyen|endispoze|gwo malt[eè]t|chanjman nan vizyon|f[eè] t[eè]t.*mal)/i;
const PERSONAL_CACHE_PATTERN =
  /\b(?:i|i'm|i’ve|me|my|mine|we|our|wife|girlfriend|partner|mom|mother|she|her|he|his|yo|mi|mis|nosotros|ma|mon|mes|nous|mwen|nou|madanm|manman)\b/i;
const PRIVATE_REQUEST_FIELDS = new Set([
  "admin",
  "email",
  "history",
  "membership",
  "owner",
  "profile",
  "progress",
  "role",
  "uid",
  "user",
]);
const CACHE_HELPER_WORDS = new Set([
  "about",
  "and",
  "can",
  "does",
  "during",
  "explain",
  "for",
  "from",
  "help",
  "how",
  "is",
  "should",
  "the",
  "what",
  "when",
  "why",
  "with",
]);
const CLAIM_FUNCTION_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "can",
  "for",
  "from",
  "has",
  "have",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "their",
  "this",
  "to",
  "with",
]);
const TRANSLATION_PACKS = [
  partnerContentTranslations,
  discoveryTranslations,
  supplementalTranslations,
  mainGuideTranslations,
  mainGuideSpanishTranslations,
  learningCardTranslations,
  guideChromeTranslations,
  partnerPlatformTranslations,
];
const committedTranslations = Object.freeze(
  ["es", "fr", "ht"].reduce((catalogs, language) => {
    catalogs[language] = Object.freeze(
      TRANSLATION_PACKS.reduce(
        (catalog, pack) => Object.assign(catalog, pack[language] || {}),
        {}
      )
    );
    return catalogs;
  }, {})
);
const EDUCATIONAL_INTENTS = Object.freeze([
  {
    id: "prenatal-support",
    labels: ["prenatal", "pregnancy", "appointment", "advocacy", "preeclampsia", "trimester", "embarazo", "cita", "preeclampsia", "grossesse", "rendez-vous", "preeclampsie", "gwoses", "randevou", "preeklanpsi"],
  },
  {
    id: "labor-delivery",
    labels: ["labor", "delivery", "birth", "parto", "nacimiento", "travail", "accouchement", "tranche", "akouchman"],
  },
  {
    id: "postpartum-recovery",
    labels: ["postpartum", "recovery", "posparto", "recuperacion", "retablissement", "rekiperasyon", "apre akouchman"],
  },
  {
    id: "warning-signs",
    labels: ["warning", "urgent", "bleeding", "headache", "senales", "urgente", "sangrado", "signes", "saignement", "siy", "senyen"],
  },
  {
    id: "feeding-support",
    labels: ["feeding", "breastfeeding", "newborn", "lactancia", "bebe", "allaitement", "nouveau-ne", "bay tete", "tibebe"],
  },
  {
    id: "partner-actions",
    labels: ["partner", "support", "father", "dad", "questions", "pareja", "apoyo", "padre", "preguntas", "partenaire", "soutien", "pere", "questions", "patne", "sipo", "papa", "kesyon"],
  },
  {
    id: "maternal-data",
    labels: ["maternal", "data", "mortality", "disparity", "materna", "datos", "mortalidad", "disparidad", "maternelle", "donnees", "mortalite", "inegalite", "matenel", "done", "motalite", "inegalite"],
  },
  {
    id: "care-navigation",
    labels: ["hospital", "provider", "doula", "care", "hospital", "proveedor", "atencion", "hopital", "soins", "lopital", "swen"],
  },
].map((intent) => ({
  ...intent,
  labels: intent.labels.map((label) => normalizePartnerHubEvidenceText(label)),
})));

const getHeader = (request, name) => {
  const direct = request?.headers?.[name];
  const lower = request?.headers?.[name.toLowerCase()];
  const value = direct ?? lower;
  return Array.isArray(value) ? value[0] : String(value || "");
};

const setSafeHeaders = (response) => {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("X-Content-Type-Options", "nosniff");
};

const sendJson = (response, status, payload, extraHeaders = {}) => {
  setSafeHeaders(response);
  Object.entries(extraHeaders).forEach(([name, value]) => response.setHeader(name, value));
  response.status(status).json(payload);
};

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  try {
    const url = new URL(origin);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:" && host !== "localhost" && host !== "127.0.0.1") return false;
    return (
      host === "dieudonnepartnerhub.org" ||
      host === "www.dieudonnepartnerhub.org" ||
      host === "localhost" ||
      host === "127.0.0.1" ||
      (host.endsWith(".vercel.app") && host.includes("dieudonnepartnerhub"))
    );
  } catch {
    return false;
  }
};

const parseBody = (request) => {
  if (typeof request.body === "string") return JSON.parse(request.body);
  if (request.body && typeof request.body === "object" && !Array.isArray(request.body)) {
    return request.body;
  }
  return {};
};

const normalizeQuestion = (value) =>
  String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const normalizeCandidateIds = (value) =>
  Array.isArray(value)
    ? value
        .slice(0, 8)
        .map((id) => String(id || "").slice(0, 120))
        .filter(Boolean)
    : [];

const hasPrivateRequestFields = (payload) =>
  Object.keys(payload || {}).some((key) => PRIVATE_REQUEST_FIELDS.has(key));

const getSupabaseConfig = (env) => {
  const url = String(env.VITE_SUPABASE_URL || "").trim();
  const anonKey = String(env.VITE_SUPABASE_ANON_KEY || "").trim();
  if (!url || !anonKey) return null;

  try {
    const parsed = new URL(url);
    const projectRef = parsed.hostname.split(".")[0] || "";
    if (
      parsed.protocol !== "https:" ||
      !parsed.hostname.endsWith(".supabase.co") ||
      BLOCKED_SUPABASE_PROJECT_REFS.has(projectRef)
    ) {
      return null;
    }
    return { url: parsed.origin, anonKey };
  } catch {
    return null;
  }
};

const validateAccessToken = async ({ request, fetchImpl, env }) => {
  const authorization = getHeader(request, "authorization");
  const match = authorization.match(/^Bearer\s+([^\s]+)$/i);
  if (!match) return { ok: false, status: 401 };

  const supabase = getSupabaseConfig(env);
  if (!supabase) return { ok: false, status: 503 };

  try {
    const authResponse = await fetchImpl(`${supabase.url}/auth/v1/user`, {
      method: "GET",
      headers: {
        apikey: supabase.anonKey,
        Authorization: `Bearer ${match[1]}`,
      },
      signal: AbortSignal.timeout(4_000),
    });
    if (!authResponse.ok) return { ok: false, status: 401 };
    const user = await authResponse.json();
    if (!user?.id) return { ok: false, status: 401 };
    return { ok: true, userId: String(user.id) };
  } catch {
    return { ok: false, status: 503 };
  }
};

const takeRateLimit = ({ userId, now, store, count = RATE_LIMIT_COUNT }) => {
  const currentTime = now();
  const existing = store.get(userId);
  if (!existing || currentTime >= existing.resetAt) {
    store.set(userId, { count: 1, resetAt: currentTime + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  if (existing.count >= count) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((existing.resetAt - currentTime) / 1_000)),
    };
  }
  existing.count += 1;
  store.set(userId, existing);
  return { allowed: true, retryAfter: 0 };
};

const getQuestionTerms = (question) =>
  normalizePartnerHubEvidenceText(question)
    .split(" ")
    .filter((term) => term.length >= 3 && !CACHE_HELPER_WORDS.has(term));

const termsEquivalent = (left, right) =>
  left === right ||
  (left.length >= 4 && `${left}s` === right) ||
  (right.length >= 4 && `${right}s` === left);

const termMatchesEvidence = (term, evidence) =>
  evidence.some((entry) =>
    entry.searchText.split(" ").some((evidenceTerm) => termsEquivalent(term, evidenceTerm))
  );

const termMatchesIntent = (term) =>
  EDUCATIONAL_INTENTS.some((intent) =>
    intent.labels.some((label) => label.split(" ").some((labelTerm) => termsEquivalent(term, labelTerm)))
  );

const includesNormalizedPhrase = (text, phrase) =>
  ` ${text} `.includes(` ${phrase} `);

const matchesIntentLabel = (normalizedQuestion, label) =>
  label.includes(" ")
    ? includesNormalizedPhrase(normalizedQuestion, label)
    : normalizedQuestion.split(" ").some((term) => termsEquivalent(term, label));

const deriveApprovedIntent = ({ question, evidence }) => {
  const normalizedQuestion = normalizePartnerHubEvidenceText(question);
  const intentIds = EDUCATIONAL_INTENTS
    .filter((intent) => intent.labels.some((label) => matchesIntentLabel(normalizedQuestion, label)))
    .map((intent) => intent.id);

  if (!intentIds.length) return null;

  return {
    intentIds: [...new Set(intentIds)].slice(0, 4),
    sourceIds: evidence.map((entry) => entry.id),
    topics: evidence.map(({ title, category }) => ({ title, category })),
  };
};

const isCacheSafeQuestion = (question, approvedIntent, evidence) => {
  if (
    PERSONAL_CACHE_PATTERN.test(question) ||
    DIRECT_IDENTIFIER_PATTERN.test(question) ||
    URGENT_PATTERN.test(question)
  ) {
    return false;
  }
  const terms = getQuestionTerms(question);
  return (
    Boolean(approvedIntent?.intentIds.length || approvedIntent?.sourceIds.length) &&
    terms.length > 0 &&
    terms.every((term) => termMatchesIntent(term) || termMatchesEvidence(term, evidence))
  );
};

const getCacheKey = ({ language, approvedIntent, evidence }) =>
  `${language}:${approvedIntent.intentIds.join(",")}:${evidence.map((item) => item.id).join(",")}`;

const getCachedAnswer = ({ key, now, store }) => {
  const cached = store.get(key);
  if (!cached) return null;
  if (cached.expiresAt <= now()) {
    store.delete(key);
    return null;
  }
  return cached.value;
};

const putCachedAnswer = ({ key, value, now, store }) => {
  if (store.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = store.keys().next().value;
    if (oldestKey) store.delete(oldestKey);
  }
  store.set(key, { value, expiresAt: now() + CACHE_TTL_MS });
};

const toCitations = (evidence, citationIds) => {
  const allowed = new Map(evidence.map((entry) => [entry.id, entry]));
  return [...new Set(citationIds)]
    .slice(0, 4)
    .map((id) => allowed.get(String(id)))
    .filter(Boolean)
    .map(({ id, kind, title, category, href, sourceLabel, sourceHref }) => ({
      id,
      kind,
      title,
      category,
      href,
      ...(sourceLabel ? { sourceLabel } : {}),
      ...(sourceHref ? { sourceHref } : {}),
    }));
};

const normalizeClaimText = (value, maxLength = 900) =>
  String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

const claimTerms = (value) =>
  normalizePartnerHubEvidenceText(value)
    .split(" ")
    .filter((term) => term.length >= 3 && !CLAIM_FUNCTION_WORDS.has(term));

const buildApprovedClaims = (evidence) => {
  const claims = [];

  for (const source of evidence) {
    let sourceClaimCount = 0;
    for (const fragment of source.fragments || []) {
      const text = normalizeClaimText(fragment, 420);
      if (
        text.length < 18 ||
        claimTerms(text).length < 2 ||
        text === source.title ||
        text === source.category ||
        text === source.sourceLabel
      ) {
        continue;
      }

      const translations = {
        es: normalizeClaimText(committedTranslations.es[text], 420),
        fr: normalizeClaimText(committedTranslations.fr[text], 420),
        ht: normalizeClaimText(committedTranslations.ht[text], 420),
      };
      if (!translations.es || !translations.fr || !translations.ht) continue;

      claims.push({
        id: `${source.id}:claim:${sourceClaimCount + 1}`,
        evidenceId: source.id,
        text,
        translations,
      });
      sourceClaimCount += 1;
      if (sourceClaimCount >= MAX_CLAIMS_PER_SOURCE || claims.length >= MAX_APPROVED_CLAIMS) break;
    }
    if (claims.length >= MAX_APPROVED_CLAIMS) break;
  }

  return claims;
};

const verifyGeneratedClaims = ({ generated, approvedClaims, language }) => {
  if (
    generated?.supported !== true ||
    !Array.isArray(generated.claim_ids) ||
    generated.claim_ids.length < 1 ||
    generated.claim_ids.length > 3
  ) {
    return [];
  }
  const approvedById = new Map(approvedClaims.map((claim) => [claim.id, claim]));
  const seen = new Set();
  const verified = [];

  for (const rawClaimId of generated.claim_ids) {
    const claimId = String(rawClaimId || "");
    const claim = approvedById.get(claimId);
    if (!claim || seen.has(claimId)) return [];
    seen.add(claimId);
    verified.push({
      text: language === "en" ? claim.text : claim.translations[language],
      citationId: claim.evidenceId,
      evidenceQuote: claim.text,
    });
  }

  return verified;
};

const unsupportedAnswer = ({ language, evidence = [] }) => ({
  supported: false,
  urgent: false,
  answer: languageCopy[language].unsupported,
  citations: toCitations(evidence, evidence.slice(0, 2).map((item) => item.id)),
});

const urgentAnswer = ({ language, evidence }) => ({
  supported: true,
  urgent: true,
  answer: languageCopy[language].urgent,
  citations: toCitations(evidence, evidence.slice(0, 3).map((item) => item.id)),
});

const buildOpenAiBody = ({ approvedIntent, approvedClaims, model }) => ({
  model,
  store: false,
  reasoning: { effort: "low" },
  max_output_tokens: MAX_OUTPUT_TOKENS,
  instructions:
    "You are Ask Partner Hub, a read-only educational selector for fathers and support people. The raw user question is intentionally withheld. Select at most three complete claims that best answer the approved educational intent. Return only claim IDs exactly as supplied. Do not write, edit, translate, combine, negate, or reinterpret any claim. If the approved claims do not support an answer, set supported to false and return no claim IDs.",
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: JSON.stringify({
            approvedIntent,
            approvedClaims: approvedClaims.map(({ id, evidenceId, text }) => ({
              id,
              evidence_id: evidenceId,
              text,
            })),
          }),
        },
      ],
    },
  ],
  text: {
    verbosity: "low",
    format: {
      type: "json_schema",
      name: "partner_hub_answer",
      strict: true,
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          supported: { type: "boolean" },
          claim_ids: {
            type: "array",
            maxItems: 3,
            items: { type: "string", maxLength: 180 },
          },
        },
        required: ["supported", "claim_ids"],
      },
    },
  },
});

const extractOutputText = (payload) => {
  if (typeof payload?.output_text === "string") return payload.output_text.trim();
  return (payload?.output || [])
    .filter((item) => item?.type === "message")
    .flatMap((item) => item.content || [])
    .filter((content) => content?.type === "output_text")
    .map((content) => content.text || "")
    .join("")
    .trim();
};

const callOpenAi = async ({ fetchImpl, env, approvedIntent, approvedClaims }) => {
  const apiKey = String(env.PARTNER_HUB_OPENAI_API_KEY || "").trim();
  if (!apiKey) throw new Error("not_configured");

  const response = await fetchImpl(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      buildOpenAiBody({
        approvedIntent,
        approvedClaims,
        model: DEFAULT_MODEL,
      })
    ),
    signal: AbortSignal.timeout(9_000),
  });

  if (!response.ok) throw new Error("upstream_failed");
  const payload = await response.json();
  const text = extractOutputText(payload);
  if (!text) throw new Error("empty_response");

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("invalid_response");
  }
};

export const createPartnerHubAskHandler = ({
  fetchImpl = fetch,
  env = process.env,
  now = Date.now,
  cacheStore = answerCache,
  rateStore = rateLimitWindows,
  rateLimitCount = RATE_LIMIT_COUNT,
} = {}) =>
  async function partnerHubAskHandler(request, response) {
    if (request.method !== "POST") {
      response.setHeader("Allow", "POST");
      sendJson(response, 405, { error: { code: "METHOD_NOT_ALLOWED" } });
      return;
    }

    if (!isAllowedOrigin(getHeader(request, "origin"))) {
      sendJson(response, 403, { error: { code: "ORIGIN_DENIED" } });
      return;
    }

    const contentLength = Number(getHeader(request, "content-length") || 0);
    if (contentLength > MAX_REQUEST_BYTES) {
      sendJson(response, 413, { error: { code: "REQUEST_TOO_LARGE" } });
      return;
    }

    let payload;
    try {
      payload = parseBody(request);
    } catch {
      sendJson(response, 400, { error: { code: "INVALID_REQUEST" } });
      return;
    }

    if (Buffer.byteLength(JSON.stringify(payload), "utf8") > MAX_REQUEST_BYTES || hasPrivateRequestFields(payload)) {
      sendJson(response, 400, { error: { code: "PRIVATE_DATA_BLOCKED" } });
      return;
    }

    const question = normalizeQuestion(payload.question);
    const language = SUPPORTED_LANGUAGES.has(payload.language) ? payload.language : "en";
    const candidateIds = normalizeCandidateIds(payload.candidateIds);

    if (question.length < 4 || question.length > MAX_QUESTION_LENGTH) {
      sendJson(response, 400, { error: { code: "INVALID_QUESTION" } });
      return;
    }
    if (DIRECT_IDENTIFIER_PATTERN.test(question)) {
      sendJson(response, 422, { error: { code: "PRIVATE_INPUT" } });
      return;
    }
    if (PROMPT_INJECTION_PATTERN.test(question)) {
      sendJson(response, 422, { error: { code: "UNSUPPORTED_REQUEST" } });
      return;
    }

    const auth = await validateAccessToken({ request, fetchImpl, env });
    if (!auth.ok) {
      sendJson(response, auth.status, {
        error: { code: auth.status === 401 ? "AUTH_REQUIRED" : "AUTH_UNAVAILABLE" },
      });
      return;
    }

    const urgent = URGENT_PATTERN.test(question);
    const safetyIds = urgent
      ? ["guide:partner-complications-guide", "video:urgent-maternal-warning-signs"]
      : [];
    const evidence = retrievePartnerHubEvidence({
      question,
      candidateIds: [...safetyIds, ...candidateIds],
    });

    if (urgent) {
      sendJson(response, 200, urgentAnswer({ language, evidence }));
      return;
    }
    if (!evidence.length) {
      sendJson(response, 200, unsupportedAnswer({ language }));
      return;
    }

    const approvedIntent = deriveApprovedIntent({ question, evidence });
    if (!approvedIntent) {
      sendJson(response, 200, unsupportedAnswer({ language, evidence }));
      return;
    }

    const approvedClaims = buildApprovedClaims(evidence);
    if (!approvedClaims.length) {
      sendJson(response, 200, unsupportedAnswer({ language, evidence }));
      return;
    }

    const rateLimit = takeRateLimit({
      userId: auth.userId,
      now,
      store: rateStore,
      count: rateLimitCount,
    });
    if (!rateLimit.allowed) {
      sendJson(
        response,
        429,
        { error: { code: "RATE_LIMITED" } },
        { "Retry-After": String(rateLimit.retryAfter) }
      );
      return;
    }

    const cacheable = isCacheSafeQuestion(question, approvedIntent, evidence);
    const cacheKey = cacheable ? getCacheKey({ language, approvedIntent, evidence }) : "";
    if (cacheable) {
      const cached = getCachedAnswer({ key: cacheKey, now, store: cacheStore });
      if (cached) {
        sendJson(response, 200, { ...cached, cached: true });
        return;
      }
    }

    try {
      const generated = await callOpenAi({ fetchImpl, env, approvedIntent, approvedClaims });
      const claims = verifyGeneratedClaims({ generated, approvedClaims, language });
      const citations = toCitations(evidence, claims.map((claim) => claim.citationId));
      const answer = claims.map((claim) => claim.text).join(" ").slice(0, 900);
      const result =
        claims.length && answer && citations.length
          ? { supported: true, urgent: false, answer, claims, citations }
          : unsupportedAnswer({ language, evidence });

      if (cacheable && result.supported) {
        putCachedAnswer({ key: cacheKey, value: result, now, store: cacheStore });
      }
      sendJson(response, 200, result);
    } catch {
      sendJson(response, 503, { error: { code: "ASK_UNAVAILABLE" } });
    }
  };

export const partnerHubAskHandler = createPartnerHubAskHandler();
