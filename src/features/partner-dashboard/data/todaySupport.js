const MAX_RECENT_COMPLETIONS = 8;

export const todaySupportContexts = [
  {
    id: "prenatal",
    label: "Prenatal support",
    helper: "Lower the physical load and support daily comfort.",
    icon: "heart",
  },
  {
    id: "appointment",
    label: "Appointment prep",
    helper: "Bring clear questions and calm advocacy to the visit.",
    icon: "calendar",
  },
  {
    id: "labor-prep",
    label: "Labor prep",
    helper: "Practice comfort and communication before labor.",
    icon: "activity",
  },
  {
    id: "postpartum",
    label: "Postpartum recovery",
    helper: "Protect rest, healing, and the household load.",
    icon: "baby",
  },
  {
    id: "feeding",
    label: "Feeding support",
    helper: "Reduce pressure around feeding and setup.",
    icon: "milk",
  },
  {
    id: "mood",
    label: "Mood or stress",
    helper: "Listen well and connect to help early.",
    icon: "message",
  },
  {
    id: "home-setup",
    label: "Home setup",
    helper: "Make one recovery or newborn-care zone easier.",
    icon: "home",
  },
  {
    id: "urgent",
    label: "Urgent concern",
    helper: "Take warning signs seriously and get help quickly.",
    icon: "shield",
  },
];

export const todaySupportPlans = [
  {
    id: "prenatal-comfort-check",
    context: "prenatal",
    title: "Lower the load today",
    action:
      "Take over one physical task before she has to ask, then bring water and a snack she can tolerate.",
    watchPoint:
      "If headache, vision changes, severe pain, bleeding, or sudden swelling appears, contact the care team promptly.",
    phrase:
      "I can handle this part. Tell me what feels hardest right now, and I will help lower the load.",
    resource: {
      type: "lesson",
      moduleId: "prenatal",
      lessonId: "prenatal-foundations",
      label: "Open Prenatal Foundations",
    },
  },
  {
    id: "appointment-question-list",
    context: "appointment",
    title: "Bring one clear question",
    action:
      "Write down one change, one concern, and one question before the appointment or call.",
    watchPoint:
      "Ask the care team which warning signs should trigger a same-day call before the next visit.",
    phrase:
      "Before we leave, can we make sure we understand what to watch for and when to call?",
    resource: {
      type: "guide",
      guideId: "partner-communication-guide",
      label: "Open Communication Guide",
    },
  },
  {
    id: "labor-calm-practice",
    context: "labor-prep",
    title: "Practice calm support",
    action:
      "Practice one minute of slow breathing and choose two comfort actions you can use during contractions.",
    watchPoint:
      "If labor signs feel confusing, call the care team for guidance instead of guessing.",
    phrase:
      "I am with you. Let us take this one contraction, one breath, and one decision at a time.",
    resource: {
      type: "guide",
      guideId: "partner-labor-guide",
      label: "Open Labor Readiness Guide",
    },
  },
  {
    id: "postpartum-recovery-reset",
    context: "postpartum",
    title: "Protect one recovery block",
    action:
      "Create one protected rest block today by handling baby care, dishes, laundry, or visitor boundaries.",
    watchPoint:
      "Heavy bleeding, large clots, chest pain, trouble breathing, fever, severe headache, or thoughts of self-harm need urgent care.",
    phrase:
      "You do not have to manage everyone right now. I will protect this rest block.",
    resource: {
      type: "guide",
      guideId: "partner-postpartum-guide",
      label: "Open Postpartum Recovery Guide",
    },
  },
  {
    id: "feeding-pressure-reducer",
    context: "feeding",
    title: "Make feeding less heavy",
    action:
      "Set up water, food, burp cloths, a phone charger, and a clean surface before the next feeding window.",
    watchPoint:
      "Call for feeding help if pain, fever, red breast streaks, poor diaper output, or ongoing latch problems appear.",
    phrase:
      "You are not failing. I will handle the setup so you can focus on feeding and recovering.",
    resource: {
      type: "guide",
      guideId: "partner-feeding-guide",
      label: "Open Feeding Support Guide",
    },
  },
  {
    id: "mood-listen-first",
    context: "mood",
    title: "Listen before fixing",
    action:
      "Ask one calm check-in question, then listen without correcting, rushing, or turning it into advice.",
    watchPoint:
      "Hopelessness, panic, intrusive thoughts, or any safety concern needs professional help now.",
    phrase: "I am listening. You do not have to make this sound smaller for me.",
    resource: {
      type: "guide",
      guideId: "partner-mentalhealth-guide",
      label: "Open Mental Health Support Guide",
    },
  },
  {
    id: "home-setup-one-zone",
    context: "home-setup",
    title: "Reset one recovery zone",
    action:
      "Restock one area she uses often: the bed, bathroom, feeding chair, kitchen, or baby station.",
    watchPoint:
      "Keep pathways clear and supplies within reach so she does not have to lift, bend, or walk more than needed.",
    phrase: "I set this up so you do not have to keep asking for the same things.",
    resource: {
      type: "guide",
      guideId: "partner-village-guide",
      label: "Open Support Village Guide",
    },
  },
  {
    id: "urgent-warning-signs",
    context: "urgent",
    title: "Take the concern seriously",
    action:
      "Call the care team now, or use emergency care if warning signs are severe or fast-moving.",
    watchPoint:
      "Do not wait with chest pain, trouble breathing, seizure, severe headache, vision changes, heavy bleeding, fainting, or thoughts of self-harm.",
    phrase: "I believe you. We are going to get help now and explain clearly what changed.",
    resource: {
      type: "guide",
      guideId: "partner-complications-guide",
      label: "Open Warning Signs Guide",
    },
    urgent: true,
  },
];

export const TODAY_SUPPORT_DEFAULT_CONTEXT = "prenatal";

const contextIds = new Set(todaySupportContexts.map((context) => context.id));
const plansById = new Map(todaySupportPlans.map((plan) => [plan.id, plan]));

const normalizeTimestamp = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
};

export const getTodaySupportContext = (contextId) =>
  todaySupportContexts.find((context) => context.id === contextId) ||
  todaySupportContexts[0];

export const getTodaySupportPlan = (planId) => plansById.get(planId) || null;

export const normalizeTodaySupport = (value = {}) => {
  const selectedContext = contextIds.has(value.selectedContext)
    ? value.selectedContext
    : "";
  const selectedPlan = getTodaySupportPlan(value.currentPlanId);
  const currentPlanId =
    selectedPlan && (!selectedContext || selectedPlan.context === selectedContext)
      ? selectedPlan.id
      : "";
  const recentCompletions = Array.isArray(value.recentCompletions)
    ? value.recentCompletions
        .map((item) => {
          const plan = getTodaySupportPlan(item?.planId);
          const completedAt = normalizeTimestamp(item?.completedAt);
          if (!plan || !completedAt || item?.context !== plan.context) return null;
          return {
            planId: plan.id,
            context: plan.context,
            completedAt,
          };
        })
        .filter(Boolean)
        .slice(0, MAX_RECENT_COMPLETIONS)
    : [];

  return {
    selectedContext,
    currentPlanId,
    lastViewedAt: normalizeTimestamp(value.lastViewedAt),
    lastCompletedAt: normalizeTimestamp(value.lastCompletedAt),
    recentCompletions,
  };
};

export const selectTodaySupportPlan = (contextId, profile = {}) => {
  const resolvedContext = getTodaySupportContext(contextId).id;
  const existingPlan = getTodaySupportPlan(profile.todaySupport?.currentPlanId);

  if (existingPlan?.context === resolvedContext) {
    return existingPlan;
  }

  return (
    todaySupportPlans.find((plan) => plan.context === resolvedContext) ||
    todaySupportPlans.find((plan) => plan.context === TODAY_SUPPORT_DEFAULT_CONTEXT)
  );
};

export const buildTodaySupportSelection = ({
  contextId,
  profile = {},
  viewedAt = new Date().toISOString(),
}) => {
  const plan = selectTodaySupportPlan(contextId, profile);
  const current = normalizeTodaySupport(profile.todaySupport);
  return {
    ...current,
    selectedContext: plan.context,
    currentPlanId: plan.id,
    lastViewedAt: normalizeTimestamp(viewedAt),
  };
};

export const buildTodaySupportCompletion = ({
  profile = {},
  completedAt = new Date().toISOString(),
}) => {
  const current = normalizeTodaySupport(profile.todaySupport);
  const plan = selectTodaySupportPlan(current.selectedContext, {
    ...profile,
    todaySupport: current,
  });
  const completionTime = normalizeTimestamp(completedAt);
  const nextCompletion = {
    planId: plan.id,
    context: plan.context,
    completedAt: completionTime,
  };

  return {
    ...current,
    selectedContext: plan.context,
    currentPlanId: plan.id,
    lastCompletedAt: completionTime,
    recentCompletions: [nextCompletion, ...current.recentCompletions].slice(
      0,
      MAX_RECENT_COMPLETIONS
    ),
  };
};
