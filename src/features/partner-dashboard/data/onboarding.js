export const ONBOARDING_VERSION = 1;

export const onboardingStages = [
  {
    id: "pregnant",
    label: "Mom is pregnant",
    description: "Tailor lessons by pregnancy timing.",
  },
  {
    id: "recently-delivered",
    label: "Recently delivered",
    description: "Focus on recovery and newborn support.",
  },
  {
    id: "planning-ahead",
    label: "Planning ahead",
    description: "Build a foundation before pregnancy.",
  },
  {
    id: "skip",
    label: "Prefer to skip",
    description: "Keep recommendations general.",
  },
];

export const onboardingRoles = [
  { id: "father-dad", label: "Father or dad", description: "Support tailored to your role." },
  { id: "partner", label: "Partner", description: "Practical ways to share the load." },
  { id: "family-member", label: "Family member", description: "Help without overstepping." },
  {
    id: "trusted-support",
    label: "Trusted support person",
    description: "Clear actions for dependable support.",
  },
];

export const onboardingDeliverySettings = [
  { id: "hospital", label: "Hospital", description: "Facility can be added below." },
  {
    id: "birth-center",
    label: "Birth center",
    description: "Show setting-specific preparation.",
  },
  { id: "home", label: "Home", description: "Keep planning prompts setting-aware." },
  { id: "unsure", label: "Not sure", description: "Keep recommendations flexible." },
];

export const onboardingPriorities = [
  {
    id: "labor-prep",
    label: "Prepare for labor",
    description: "Positions, comfort, timing, and what to bring.",
  },
  {
    id: "communication",
    label: "Communication and advocacy",
    description: "Questions, preferences, and speaking up together.",
  },
  {
    id: "recovery",
    label: "Postpartum recovery",
    description: "Rest, warning signs, and practical care at home.",
  },
  {
    id: "newborn",
    label: "Newborn care",
    description: "Feeding, safe sleep, and shared routines.",
  },
  {
    id: "mental-health",
    label: "Mental health and stress",
    description: "Notice changes and respond with steady support.",
  },
];

const allowedIds = (options) => new Set(options.map((option) => option.id));
const stageIds = allowedIds(onboardingStages);
const roleIds = allowedIds(onboardingRoles);
const deliveryIds = allowedIds(onboardingDeliverySettings);
const priorityIds = allowedIds(onboardingPriorities);

const normalizeChoice = (value, choices) => (choices.has(value) ? value : "");

const normalizeWeek = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const week = Number(value);
  return Number.isInteger(week) && week >= 1 && week <= 42 ? week : null;
};

export const createEmptyOnboarding = () => ({
  version: ONBOARDING_VERSION,
  status: "",
  stage: "",
  pregnancyWeek: null,
  supportRole: "",
  deliverySetting: "",
  facilityName: "",
  priorities: [],
  completedAt: null,
  skippedAt: null,
  updatedAt: null,
});

export const normalizeOnboarding = (value = {}) => {
  const status = value.status === "completed" || value.status === "skipped" ? value.status : "";
  const priorities = Array.isArray(value.priorities)
    ? Array.from(new Set(value.priorities.filter((item) => priorityIds.has(item)))).slice(0, 2)
    : [];

  return {
    ...createEmptyOnboarding(),
    version: ONBOARDING_VERSION,
    status,
    stage: normalizeChoice(value.stage, stageIds),
    pregnancyWeek: normalizeWeek(value.pregnancyWeek),
    supportRole: normalizeChoice(value.supportRole, roleIds),
    deliverySetting: normalizeChoice(value.deliverySetting, deliveryIds),
    facilityName: String(value.facilityName || "").trim().slice(0, 80),
    priorities,
    completedAt: typeof value.completedAt === "string" ? value.completedAt : null,
    skippedAt: typeof value.skippedAt === "string" ? value.skippedAt : null,
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : null,
  };
};

export const validateOnboardingStep = (step, answers) => {
  if (step === 0 && answers.stage === "pregnant") {
    const rawWeek = String(answers.pregnancyWeek ?? "").trim();
    if (rawWeek) {
      const week = Number(rawWeek);
      if (!Number.isInteger(week) || week < 1 || week > 42) {
        return { pregnancyWeek: "Enter a whole number from 1 to 42, or skip this field." };
      }
    }
  }

  if (step === 2 && String(answers.facilityName || "").trim().length > 80) {
    return { facilityName: "Use 80 characters or fewer, or skip this field." };
  }

  return {};
};

const getLabel = (options, id, fallback = "Skipped") =>
  options.find((option) => option.id === id)?.label || fallback;

export const getOnboardingSummary = (answers = {}) => {
  const week = normalizeWeek(answers.pregnancyWeek);
  const stage = getLabel(onboardingStages, answers.stage);
  return {
    stage: week && answers.stage === "pregnant" ? `${stage} · ${week} weeks` : stage,
    role: getLabel(onboardingRoles, answers.supportRole),
    delivery: `${getLabel(onboardingDeliverySettings, answers.deliverySetting)} · ${
      String(answers.facilityName || "").trim() || "Facility name skipped"
    }`,
    mainFocus: getLabel(onboardingPriorities, answers.priorities?.[0]),
    alsoUseful: getLabel(onboardingPriorities, answers.priorities?.[1]),
  };
};

const recommendations = {
  "labor-prep": {
    startHere: "Practice three labor-support positions",
    sayThis: "What would help you feel more supported today?",
    watchFor: "Know when contractions and warning signs need a call.",
    guideId: "partner-labor-guide",
    guideTitle: "Labor Readiness Guide",
  },
  communication: {
    startHere: "Choose one question to bring to the next appointment",
    sayThis: "Would you like help, listening, or quiet right now?",
    watchFor: "Notice when a preference needs to be repeated or clarified.",
    guideId: "partner-communication-guide",
    guideTitle: "Communication and Advocacy Guide",
  },
  recovery: {
    startHere: "Create one protected rest block for today",
    sayThis: "What can I fully take off your plate today?",
    watchFor: "Review postpartum warning signs and when to call for help.",
    guideId: "partner-postpartum-guide",
    guideTitle: "Postpartum Recovery Guide",
  },
  newborn: {
    startHere: "Choose one newborn-care task you can fully own",
    sayThis: "Which feeding or sleep shift would help you rest most?",
    watchFor: "Keep safe-sleep basics visible for every caregiver.",
    guideId: "partner-feeding-guide",
    guideTitle: "Feeding Support Guide",
  },
  "mental-health": {
    startHere: "Make space for a calm two-minute check-in",
    sayThis: "What feels heaviest today, and how can I help?",
    watchFor: "Take lasting mood or behavior changes seriously.",
    guideId: "partner-mentalhealth-guide",
    guideTitle: "Mental Health Support Guide",
  },
};

export const getOnboardingRecommendation = (answers = {}) => {
  const inferredPriority =
    answers.stage === "recently-delivered"
      ? "recovery"
      : answers.stage === "pregnant"
        ? "labor-prep"
        : "communication";
  const priority = answers.priorities?.[0] || inferredPriority;
  const base = recommendations[priority] || recommendations.communication;
  const week = normalizeWeek(answers.pregnancyWeek);

  return {
    ...base,
    startHere:
      week && priority === "labor-prep" ? `${base.startHere} for week ${week}.` : `${base.startHere}.`,
  };
};

export const buildCompletedOnboarding = (answers, now = new Date().toISOString()) => ({
  ...normalizeOnboarding(answers),
  status: "completed",
  completedAt: now,
  skippedAt: null,
  updatedAt: now,
});

export const buildSkippedOnboarding = (answers, now = new Date().toISOString()) => ({
  ...normalizeOnboarding(answers),
  status: "skipped",
  completedAt: null,
  skippedAt: now,
  updatedAt: now,
});

