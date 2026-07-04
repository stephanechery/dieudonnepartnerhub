# Today Support Plan Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a signed-in dashboard Today Support Plan with a guided Situation Helper, practical actions, safety-aware language, resource links, and one-tap completion.

**Architecture:** Add static Today plan data and pure selection helpers first, then extend the existing partner profile state with a small `todaySupport` object. Render a focused dashboard card that calls existing context callbacks for persistence, navigation, and analytics, with no direct Supabase/Auth calls from the UI component.

**Tech Stack:** Vite, React 18, Tailwind CSS, lucide-react, local profile storage with optional existing Supabase profile persistence.

---

## File Structure

- Create `src/features/partner-dashboard/data/todaySupport.js`: stores context options, plan content, resource labels, pure plan-selection helpers, and small state builders.
- Create `src/features/partner-dashboard/components/TodaySupportCard.jsx`: owns the guided context picker, plan rendering, resource button, save feedback, and Mark done button.
- Modify `src/features/partner-dashboard/services/profileService.js`: normalizes `todaySupport` into every profile.
- Modify `src/features/partner-dashboard/state/PartnerDashboardContext.jsx`: saves Today state and emits coarse analytics events.
- Modify `src/features/partner-dashboard/pages/OverviewPage.jsx`: places the Today card at the top of the signed-in dashboard and wires callbacks.
- Modify `src/features/partner-dashboard/index.jsx`: passes Today callbacks and resource navigation from the router into the overview page.
- Do not modify `src/features/partner-dashboard/services/authService.js`, `supabase/schema.sql`, `.env.local`, Vercel settings, or admin access rules.

## Task 1: Static Today Support Data And Pure Helpers

**Files:**
- Create: `src/features/partner-dashboard/data/todaySupport.js`

- [ ] **Step 1: Create the Today support data file**

Use `apply_patch` to add:

```js
export const todaySupportContexts = [
  {
    id: "prenatal",
    label: "Prenatal support",
    helper: "Daily comfort, symptoms, and appointment follow-through.",
  },
  {
    id: "appointment",
    label: "Appointment prep",
    helper: "Questions, notes, and calm advocacy before a visit.",
  },
  {
    id: "labor-prep",
    label: "Labor prep",
    helper: "Practice support before contractions or a birth plan change.",
  },
  {
    id: "postpartum",
    label: "Postpartum recovery",
    helper: "Protect rest, healing, feeding, and household load.",
  },
  {
    id: "feeding",
    label: "Feeding support",
    helper: "Reduce pressure around breastfeeding, pumping, or formula.",
  },
  {
    id: "mood",
    label: "Mood or stress",
    helper: "Support emotions without fixing, blaming, or dismissing.",
  },
  {
    id: "home-setup",
    label: "Home setup",
    helper: "Make the space easier for recovery and newborn care.",
  },
  {
    id: "urgent",
    label: "Urgent concern",
    helper: "Use safety language and connect to care quickly.",
  },
];

export const todaySupportPlans = [
  {
    id: "prenatal-comfort-check",
    context: "prenatal",
    title: "Lower the load today",
    action: "Take over one physical task before she has to ask, then bring water and a snack she can tolerate.",
    watchPoint: "If headache, vision changes, severe pain, bleeding, or sudden swelling appears, contact the care team promptly.",
    phrase: "I can handle this part. Tell me what feels hardest right now, and I will help lower the load.",
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
    action: "Write down one symptom, one change, and one question before the appointment or call.",
    watchPoint: "Ask the care team which symptoms should trigger a same-day call before the next visit.",
    phrase: "Before we leave, can we make sure we understand what to watch for and when to call?",
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
    action: "Practice one minute of slow breathing and choose two comfort actions you can use during contractions.",
    watchPoint: "If labor signs feel confusing, call the care team for guidance instead of guessing.",
    phrase: "I am with you. Let us take this one contraction, one breath, and one decision at a time.",
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
    action: "Create one protected rest block today by handling baby care, dishes, laundry, or visitor boundaries.",
    watchPoint: "Heavy bleeding, large clots, chest pain, trouble breathing, fever, severe headache, or thoughts of self-harm need urgent care.",
    phrase: "You do not have to manage everyone right now. I will protect this rest block.",
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
    action: "Set up water, food, burp cloths, phone charger, and a clean surface before the next feeding window.",
    watchPoint: "Call for feeding help if pain, fever, red breast streaks, poor diaper output, or ongoing latch problems show up.",
    phrase: "You are not failing. I will handle the setup so you can focus on feeding and recovering.",
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
    action: "Ask one calm check-in question, then listen without correcting, rushing, or turning it into advice.",
    watchPoint: "Hopelessness, panic, intrusive thoughts, or any safety concern needs professional help now.",
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
    action: "Restock one area she uses often: bed, bathroom, feeding chair, kitchen, or baby station.",
    watchPoint: "Keep pathways clear and supplies within reach so she does not have to lift, bend, or walk more than needed.",
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
    action: "Call the care team now, or use emergency care if symptoms feel severe or fast-moving.",
    watchPoint: "Do not wait with chest pain, trouble breathing, seizure, severe headache, vision changes, heavy bleeding, fainting, or thoughts of self-harm.",
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

export const getTodaySupportContext = (contextId) =>
  todaySupportContexts.find((context) => context.id === contextId) ||
  todaySupportContexts[0];

export const getTodaySupportPlan = (planId) =>
  todaySupportPlans.find((plan) => plan.id === planId) || null;

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
  return {
    ...(profile.todaySupport || {}),
    selectedContext: plan.context,
    currentPlanId: plan.id,
    lastViewedAt: viewedAt,
  };
};

export const buildTodaySupportCompletion = ({
  profile = {},
  completedAt = new Date().toISOString(),
}) => {
  const current = profile.todaySupport || {};
  const plan = selectTodaySupportPlan(current.selectedContext, profile);
  const nextCompletion = {
    planId: plan.id,
    context: plan.context,
    completedAt,
  };

  return {
    ...current,
    selectedContext: plan.context,
    currentPlanId: plan.id,
    lastCompletedAt: completedAt,
    recentCompletions: [
      nextCompletion,
      ...(Array.isArray(current.recentCompletions) ? current.recentCompletions : []),
    ].slice(0, 8),
  };
};
```

- [ ] **Step 2: Verify the helper exports load**

Run:

```bash
node --input-type=module -e "import('./src/features/partner-dashboard/data/todaySupport.js').then((m) => { const plan = m.selectTodaySupportPlan('urgent', {}); if (plan.id !== 'urgent-warning-signs') throw new Error(plan.id); console.log(plan.title); })"
```

Expected:

```text
Take the concern seriously
```

- [ ] **Step 3: Commit Task 1**

Run:

```bash
git add src/features/partner-dashboard/data/todaySupport.js
git commit -m "feat: add today support plan data"
```

Expected: commit succeeds with only `todaySupport.js` staged.

## Task 2: Profile Normalization For Today State

**Files:**
- Modify: `src/features/partner-dashboard/services/profileService.js`

- [ ] **Step 1: Add Today support normalization**

Patch `src/features/partner-dashboard/services/profileService.js` near the existing `normalizeOrganizationName` and `extendProfileVideoHub` helpers:

```diff
 const normalizeOrganizationName = (value) => String(value || "").trim();
 
+const normalizeTodaySupportCompletion = (value) => ({
+  planId: String(value?.planId || "").trim(),
+  context: String(value?.context || "").trim(),
+  completedAt: String(value?.completedAt || "").trim(),
+});
+
+const normalizeTodaySupport = (value = {}) => {
+  const recentCompletions = Array.isArray(value.recentCompletions)
+    ? value.recentCompletions
+        .map(normalizeTodaySupportCompletion)
+        .filter((item) => item.planId && item.context && item.completedAt)
+        .slice(0, 8)
+    : [];
+
+  return {
+    selectedContext: String(value.selectedContext || "").trim(),
+    currentPlanId: String(value.currentPlanId || "").trim(),
+    lastViewedAt: String(value.lastViewedAt || "").trim(),
+    lastCompletedAt: String(value.lastCompletedAt || "").trim(),
+    recentCompletions,
+  };
+};
+
 const extendProfileVideoHub = (profile) => ({
   ...profile,
   videoHub: {
     savedVideoIds: normalizeIdList(profile.videoHub?.savedVideoIds),
     watchLaterIds: normalizeIdList(profile.videoHub?.watchLaterIds),
   },
+  todaySupport: normalizeTodaySupport(profile.todaySupport),
 });
```

- [ ] **Step 2: Ensure new profiles start with empty Today state**

Patch `createBaseProfile` in the same file:

```diff
   videoHub: {
     savedVideoIds: [],
     watchLaterIds: [],
   },
+  todaySupport: normalizeTodaySupport(),
 });
```

- [ ] **Step 3: Run the build to verify profile normalization**

Run:

```bash
npm run build
```

Expected: Vite build completes. This is safer than a direct Node import because the profile service reads Vite environment variables.

- [ ] **Step 4: Commit Task 2**

Run:

```bash
git add src/features/partner-dashboard/services/profileService.js
git commit -m "feat: normalize today support profile state"
```

Expected: commit succeeds with only `profileService.js` staged.

## Task 3: Dashboard Context Save Actions And Analytics

**Files:**
- Modify: `src/features/partner-dashboard/state/PartnerDashboardContext.jsx`

- [ ] **Step 1: Import Today state builders**

Patch the imports:

```diff
 import { partnerCurriculum } from "../data/curriculum";
 import { partnerInteractiveGuides } from "../data/interactiveGuides";
+import {
+  buildTodaySupportCompletion,
+  buildTodaySupportSelection,
+} from "../data/todaySupport";
 import { videoHubVideos } from "../data/videoHub";
```

- [ ] **Step 2: Add save handlers inside `PartnerDashboardProvider`**

Place these functions after `saveProfileDetails`:

```js
  const saveTodaySupportContext = async (contextId) => {
    if (!profile) return null;

    const nextTodaySupport = buildTodaySupportSelection({
      contextId,
      profile,
    });
    const nextProfile = {
      ...profile,
      todaySupport: nextTodaySupport,
    };

    const saved = await persistProfile(nextProfile);
    trackPartnerEvent("today_context_selected", {
      uid: profile.uid,
      email: profile.email,
      category: nextTodaySupport.selectedContext,
    });
    trackPartnerEvent("today_plan_viewed", {
      uid: profile.uid,
      email: profile.email,
      category: nextTodaySupport.currentPlanId,
    });
    return saved.todaySupport;
  };

  const markTodaySupportDone = async () => {
    if (!profile) return null;

    const nextTodaySupport = buildTodaySupportCompletion({ profile });
    const nextProfile = {
      ...profile,
      todaySupport: nextTodaySupport,
    };

    const saved = await persistProfile(nextProfile);
    trackPartnerEvent("today_action_completed", {
      uid: profile.uid,
      email: profile.email,
      category: nextTodaySupport.selectedContext,
    });
    return saved.todaySupport;
  };

  const trackTodaySupportResourceClick = (plan) => {
    if (!profile || !plan) return;

    trackPartnerEvent("today_resource_clicked", {
      uid: profile.uid,
      email: profile.email,
      category: plan.id,
      moduleId: plan.resource?.moduleId,
      lessonId: plan.resource?.lessonId,
      guideId: plan.resource?.guideId,
      videoId: plan.resource?.videoId,
    });
  };
```

- [ ] **Step 3: Expose the handlers from context**

Patch the `value` object:

```diff
     saveVideoHubPreferences,
     saveProfileDetails,
+    saveTodaySupportContext,
+    markTodaySupportDone,
+    trackTodaySupportResourceClick,
   };
```

- [ ] **Step 4: Run the build to catch syntax errors**

Run:

```bash
npm run build
```

Expected: Vite build completes. If the local Node version causes a hang, switch to Node 22 before retrying because this repo has known Node 22 local runtime notes.

- [ ] **Step 5: Commit Task 3**

Run:

```bash
git add src/features/partner-dashboard/state/PartnerDashboardContext.jsx
git commit -m "feat: save today support dashboard state"
```

Expected: commit succeeds with only `PartnerDashboardContext.jsx` staged.

## Task 4: Today Support Card UI

**Files:**
- Create: `src/features/partner-dashboard/components/TodaySupportCard.jsx`

- [ ] **Step 1: Create the focused card component**

Use `apply_patch` to add:

```jsx
import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  RefreshCcw,
  ShieldAlert,
} from "lucide-react";
import {
  getTodaySupportContext,
  selectTodaySupportPlan,
  todaySupportContexts,
} from "../data/todaySupport";

export default function TodaySupportCard({
  profile,
  onSelectContext,
  onMarkDone,
  onOpenResource,
  darkMode = false,
  translateText = (value) => value,
}) {
  const tx = translateText;
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const selectedContext = profile?.todaySupport?.selectedContext || "";
  const plan = useMemo(
    () => (selectedContext ? selectTodaySupportPlan(selectedContext, profile) : null),
    [profile, selectedContext]
  );
  const context = selectedContext ? getTodaySupportContext(selectedContext) : null;
  const pickerOpen = showPicker || !plan;
  const completedToday = Boolean(
    plan?.id &&
      (profile?.todaySupport?.recentCompletions || []).some(
        (item) =>
          item.planId === plan.id &&
          new Date(item.completedAt).toDateString() === new Date().toDateString()
      )
  );

  const runAction = async (action, successText) => {
    setPending(true);
    setError("");
    setMessage("");
    try {
      await action();
      setMessage(successText);
    } catch {
      setError(tx("Could not save yet. You can still use this plan."));
    } finally {
      setPending(false);
    }
  };

  const chooseContext = (contextId) =>
    runAction(
      async () => {
        await onSelectContext(contextId);
        setShowPicker(false);
      },
      tx("Today's plan is ready.")
    );

  const markDone = () =>
    runAction(
      () => onMarkDone(),
      tx("Marked done for today.")
    );

  return (
    <section
      className={`overflow-hidden rounded-[1.8rem] border p-4 sm:p-5 ${
        darkMode
          ? "border-cyan-400/20 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/35 shadow-xl"
          : "border-cyan-200 bg-gradient-to-br from-white via-cyan-50/70 to-emerald-50 shadow-sm"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p
            className={`flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] ${
              darkMode ? "text-cyan-300" : "text-cyan-700"
            }`}
          >
            <HeartHandshake className="h-4 w-4" /> {tx("Today")}
          </p>
          <h2
            className={`mt-2 text-2xl font-black tracking-tight sm:text-3xl ${
              darkMode ? "text-white" : "text-slate-950"
            }`}
          >
            {pickerOpen ? tx("What kind of support is needed today?") : tx(plan.title)}
          </h2>
          <p className={`mt-2 max-w-2xl text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
            {pickerOpen
              ? tx("Pick the closest situation. Partner Hub will give one action, one watch point, one phrase, and one useful resource.")
              : tx(context?.helper || "Use this plan for one useful support action today.")}
          </p>
        </div>
        {plan && (
          <button
            type="button"
            onClick={() => {
              setMessage("");
              setError("");
              setShowPicker(true);
            }}
            className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-black transition ${
              darkMode
                ? "border-white/10 bg-white/[0.04] text-slate-100 hover:bg-white/[0.08]"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            <RefreshCcw className="h-4 w-4" />
            {tx("Change context")}
          </button>
        )}
      </div>

      {error && (
        <p className={`mt-4 rounded-xl border px-3 py-2 text-sm font-semibold ${darkMode ? "border-amber-300/20 bg-amber-300/10 text-amber-100" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
          {error}
        </p>
      )}
      {message && (
        <p className={`mt-4 rounded-xl border px-3 py-2 text-sm font-semibold ${darkMode ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
          {message}
        </p>
      )}

      {pickerOpen ? (
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {todaySupportContexts.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => chooseContext(item.id)}
              disabled={pending}
              className={`rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
                darkMode
                  ? "border-white/10 bg-white/[0.045] text-slate-100 hover:border-cyan-300/40 hover:bg-white/[0.07]"
                  : "border-slate-200 bg-white/80 text-slate-900 hover:border-cyan-300 hover:bg-white"
              }`}
            >
              <p className="text-sm font-black">{tx(item.label)}</p>
              <p className={`mt-1 text-xs font-semibold leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                {tx(item.helper)}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
          <article className={`rounded-2xl border p-4 ${darkMode ? "border-white/10 bg-white/[0.045]" : "border-slate-200 bg-white/84"}`}>
            <p className={`text-[11px] font-black uppercase tracking-[0.16em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
              {tx("Action")}
            </p>
            <p className={`mt-2 text-sm font-bold leading-relaxed ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
              {tx(plan.action)}
            </p>
          </article>

          <article className={`rounded-2xl border p-4 ${plan.urgent ? "border-rose-300/30 bg-rose-500/10" : darkMode ? "border-white/10 bg-white/[0.045]" : "border-slate-200 bg-white/84"}`}>
            <p className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] ${plan.urgent ? "text-rose-200" : darkMode ? "text-amber-200" : "text-amber-700"}`}>
              {plan.urgent ? <ShieldAlert className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              {tx("Watch point")}
            </p>
            <p className={`mt-2 text-sm font-bold leading-relaxed ${darkMode || plan.urgent ? "text-slate-100" : "text-slate-900"}`}>
              {tx(plan.watchPoint)}
            </p>
          </article>

          <article className={`rounded-2xl border p-4 ${darkMode ? "border-white/10 bg-white/[0.045]" : "border-slate-200 bg-white/84"}`}>
            <p className={`text-[11px] font-black uppercase tracking-[0.16em] ${darkMode ? "text-emerald-300" : "text-emerald-700"}`}>
              {tx("Say this")}
            </p>
            <p className={`mt-2 text-sm font-bold leading-relaxed ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
              "{tx(plan.phrase)}"
            </p>
          </article>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => onOpenResource(plan)}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black text-white transition ${
                darkMode ? "bg-cyan-600 hover:bg-cyan-500" : "bg-slate-900 hover:bg-slate-800"
              }`}
            >
              {tx(plan.resource.label)}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={markDone}
              disabled={pending || completedToday}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${
                completedToday
                  ? darkMode
                    ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
                    : "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : darkMode
                    ? "border-white/10 bg-white/[0.04] text-slate-100 hover:bg-white/[0.08]"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              {completedToday ? tx("Done today") : tx("Mark done")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Run the build**

Run:

```bash
npm run build
```

Expected: build completes. Any JSX or import errors from the new component must be fixed before continuing.

- [ ] **Step 3: Commit Task 4**

Run:

```bash
git add src/features/partner-dashboard/components/TodaySupportCard.jsx
git commit -m "feat: add today support dashboard card"
```

Expected: commit succeeds with only `TodaySupportCard.jsx` staged.

## Task 5: Wire Today Card Into The Dashboard

**Files:**
- Modify: `src/features/partner-dashboard/pages/OverviewPage.jsx`
- Modify: `src/features/partner-dashboard/index.jsx`

- [ ] **Step 1: Import and render the Today card in `OverviewPage.jsx`**

Patch the imports:

```diff
 import ModuleCard from "../components/ModuleCard";
 import ProgressBar from "../components/ProgressBar";
+import TodaySupportCard from "../components/TodaySupportCard";
 import { partnerInteractiveGuides } from "../data/interactiveGuides";
```

Patch the component signature:

```diff
-export default function OverviewPage({ metrics, profile, curriculum, onOpenModule, onOpenLesson, onOpenGuides, onOpenGuide = onOpenGuides, onOpenVideoHub, onRecommendationClick = () => {}, onSaveProfileDetails = () => {}, darkMode = false, translateText = (value) => value }) {
+export default function OverviewPage({ metrics, profile, curriculum, onOpenModule, onOpenLesson, onOpenGuides, onOpenGuide = onOpenGuides, onOpenVideoHub, onRecommendationClick = () => {}, onSaveProfileDetails = () => {}, onSelectTodayContext = () => {}, onMarkTodayDone = () => {}, onOpenTodayResource = () => {}, darkMode = false, translateText = (value) => value }) {
```

Place the Today card as the first child inside the top-level `<div className="space-y-5 ...">`:

```jsx
      <TodaySupportCard
        profile={profile}
        onSelectContext={onSelectTodayContext}
        onMarkDone={onMarkTodayDone}
        onOpenResource={onOpenTodayResource}
        darkMode={darkMode}
        translateText={translateText}
      />
```

- [ ] **Step 2: Read Today handlers from context in `index.jsx`**

Patch the `usePartnerDashboard()` destructuring:

```diff
     markLessonCompleted,
     saveProfileDetails,
+    saveTodaySupportContext,
+    markTodaySupportDone,
+    trackTodaySupportResourceClick,
   } = usePartnerDashboard();
```

- [ ] **Step 3: Add the Today resource router in `index.jsx`**

Place this function after `trackRecommendationClick`:

```js
  const openTodayResource = (plan) => {
    if (!plan?.resource) {
      openOverview();
      return;
    }

    trackTodaySupportResourceClick(plan);

    if (plan.resource.type === "lesson" && plan.resource.moduleId && plan.resource.lessonId) {
      openLesson(plan.resource.moduleId, plan.resource.lessonId);
      return;
    }

    if (plan.resource.type === "guide" && plan.resource.guideId) {
      openGuide(plan.resource.guideId);
      return;
    }

    if (plan.resource.type === "video" && plan.resource.videoId) {
      openVideoHub(plan.resource.videoId);
      return;
    }

    openGuides();
  };
```

- [ ] **Step 4: Pass Today callbacks into `OverviewPage`**

Patch the overview render:

```diff
           onRecommendationClick={trackRecommendationClick}
           onSaveProfileDetails={saveProfileDetails}
+          onSelectTodayContext={saveTodaySupportContext}
+          onMarkTodayDone={markTodaySupportDone}
+          onOpenTodayResource={openTodayResource}
           darkMode={darkMode}
           translateText={translateText}
         />
```

- [ ] **Step 5: Run the build**

Run:

```bash
npm run build
```

Expected: build completes with the Today card included in the dashboard bundle.

- [ ] **Step 6: Commit Task 5**

Run:

```bash
git add src/features/partner-dashboard/pages/OverviewPage.jsx src/features/partner-dashboard/index.jsx
git commit -m "feat: show today support plan on dashboard"
```

Expected: commit succeeds with only the two dashboard wiring files staged.

## Task 6: Browser Verification And Safety Checks

**Files:**
- No code file required unless verification reveals a defect in prior task files.

- [ ] **Step 1: Start the Vite dev server**

Run:

```bash
npm run dev -- --host 127.0.0.1
```

Expected: Vite prints a local URL, usually `http://127.0.0.1:5173/`.

- [ ] **Step 2: Open the signed-in demo dashboard**

Open:

```text
http://127.0.0.1:5173/partner-dashboard?org_demo=1
```

Expected: the dashboard loads as organization demo learner access, not admin access.

- [ ] **Step 3: Verify the default Today card**

Expected visible behavior:

```text
Today
What kind of support is needed today?
Prenatal support
Appointment prep
Labor prep
Postpartum recovery
Feeding support
Mood or stress
Home setup
Urgent concern
```

- [ ] **Step 4: Verify a normal context**

Click `Postpartum recovery`.

Expected visible behavior:

```text
Protect one recovery block
Action
Protect one recovery block today by handling baby care, dishes, laundry, or visitor boundaries.
Watch point
Heavy bleeding, large clots, chest pain, trouble breathing, fever, severe headache, or thoughts of self-harm need urgent care.
Say this
"You do not have to manage everyone right now. I will protect this rest block."
Open Postpartum Recovery Guide
Mark done
```

- [ ] **Step 5: Verify Mark done**

Click `Mark done`.

Expected visible behavior:

```text
Marked done for today.
Done today
```

Refresh the page.

Expected: the same context remains selected and the button still says `Done today`.

- [ ] **Step 6: Verify urgent context safety language**

Click `Change context`, then `Urgent concern`.

Expected visible behavior:

```text
Take the concern seriously
Call the care team now, or use emergency care if symptoms feel severe or fast-moving.
Do not wait with chest pain, trouble breathing, seizure, severe headache, vision changes, heavy bleeding, fainting, or thoughts of self-harm.
Open Warning Signs Guide
```

- [ ] **Step 7: Verify organization demo does not open owner admin**

Open:

```text
http://127.0.0.1:5173/owner-admin
```

Expected: access denied or owner-only restriction. The organization demo learner must not see admin analytics.

- [ ] **Step 8: Stop the dev server**

Stop the Vite process with `Ctrl-C`.

Expected: terminal returns to the shell prompt.

## Task 7: Final Build And Commit Verification Fixes

**Files:**
- Modify only files from Tasks 1 through 5 if verification found defects.

- [ ] **Step 1: Run final build**

Run:

```bash
npm run build
```

Expected: build completes.

- [ ] **Step 2: Check git status**

Run:

```bash
git status --short --branch
```

Expected: only intended Today Support implementation files appear as changed. Existing unrelated local changes may still appear and must be left untouched.

- [ ] **Step 3: Commit any verification fixes**

If verification caused edits, run:

```bash
git add src/features/partner-dashboard/data/todaySupport.js src/features/partner-dashboard/components/TodaySupportCard.jsx src/features/partner-dashboard/services/profileService.js src/features/partner-dashboard/state/PartnerDashboardContext.jsx src/features/partner-dashboard/pages/OverviewPage.jsx src/features/partner-dashboard/index.jsx
git commit -m "fix: polish today support plan flow"
```

Expected: commit includes only Today Support implementation files. If no fixes were needed, skip this commit.

## Self-Review Notes

- Spec coverage: Tasks cover static plan content, guided context taps, one action, safety watch point, support phrase, resource link, one-tap completion, profile persistence, coarse analytics events, error handling, signed-in dashboard placement, urgent safety language, and organization demo admin restriction checks.
- Scope check: No task changes Supabase Auth, RLS, env vars, production data, deployment settings, public homepage content, reminders, chat, AI triage, caregiver invitations, or admin roles.
- Type consistency: `todaySupport.selectedContext`, `todaySupport.currentPlanId`, `todaySupport.lastViewedAt`, `todaySupport.lastCompletedAt`, and `todaySupport.recentCompletions` are defined in Task 1, normalized in Task 2, saved in Task 3, and read by Task 4.
