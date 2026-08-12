import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  CircleHelp,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";
import dieudonneDarkLogo from "../../../assets/Dieudonne_Dark_Logo.png";
import {
  buildCompletedOnboarding,
  buildSkippedOnboarding,
  getOnboardingRecommendation,
  getOnboardingSummary,
  normalizeOnboarding,
  onboardingDeliverySettings,
  onboardingPriorities,
  onboardingRoles,
  onboardingStages,
  validateOnboardingStep,
} from "../data/onboarding";
import ThemeToggle from "./ThemeToggle";

const steps = ["Pregnancy stage", "Your role", "Delivery plan", "Priority", "Review"];

const stepMeta = [
  {
    eyebrow: "Pregnancy stage",
    title: "Where are you in the pregnancy or recovery timeline?",
    description: "Choose the closest answer. You can update this later.",
  },
  {
    eyebrow: "Your role",
    title: "How are you supporting mom?",
    description: "This changes the language and actions we recommend.",
  },
  {
    eyebrow: "Delivery plan",
    title: "Where does mom plan to deliver?",
    description: "Choose what is known today. You can change it anytime.",
  },
  {
    eyebrow: "Priority",
    title: "What support matters most right now?",
    description: "Choose up to two. The first choice becomes your main focus.",
  },
];

const surface = (darkMode) =>
  darkMode
    ? "border-slate-800 bg-slate-900 text-slate-100 shadow-2xl shadow-black/25"
    : "border-slate-200 bg-white text-slate-950 shadow-xl shadow-slate-300/35";

const stepSurface = (darkMode) =>
  darkMode
    ? "border-0 bg-transparent text-slate-100 shadow-none sm:border sm:border-slate-800 sm:bg-slate-900 sm:shadow-2xl sm:shadow-black/25"
    : "border-0 bg-transparent text-slate-950 shadow-none sm:border sm:border-slate-200 sm:bg-white sm:shadow-xl sm:shadow-slate-300/35";

function Progress({ currentStep, darkMode, translateText }) {
  return (
    <div className="grid grid-cols-5 gap-2" aria-label={`${translateText("Step")} ${currentStep + 1} ${translateText("of")} 5`}>
      {steps.map((label, index) => (
        <span
          key={label}
          className={`h-2 rounded-full transition-colors ${
            index <= currentStep
              ? darkMode
                ? "bg-cyan-500"
                : "bg-slate-900"
              : darkMode
                ? "bg-slate-800"
                : "bg-slate-200"
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function ChoiceCard({ option, name, selected, onChange, darkMode, translateText, type = "radio" }) {
  return (
    <label
      className={`relative flex min-h-[80px] cursor-pointer items-start gap-3 rounded-2xl border p-4 transition focus-within:ring-2 focus-within:ring-cyan-500 focus-within:ring-offset-2 ${
        selected
          ? darkMode
            ? "border-cyan-400 bg-cyan-400/10 focus-within:ring-offset-slate-900"
            : "border-cyan-300 bg-cyan-50 focus-within:ring-offset-white"
          : darkMode
            ? "border-slate-700 bg-slate-950/45 hover:border-slate-500 focus-within:ring-offset-slate-900"
            : "border-slate-200 bg-white hover:border-slate-400 focus-within:ring-offset-white"
      }`}
    >
      <input
        type={type}
        name={name}
        value={option.id}
        checked={selected}
        onChange={onChange}
        className="sr-only"
      />
      <span className="min-w-0 flex-1">
        <span
          className={`block text-sm font-extrabold ${
            selected
              ? darkMode
                ? "text-cyan-200"
                : "text-cyan-800"
              : darkMode
                ? "text-slate-100"
                : "text-slate-950"
          }`}
        >
          {translateText(option.label)}
        </span>
        <span className={`mt-2 block text-xs leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          {translateText(option.description)}
        </span>
      </span>
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
          selected
            ? darkMode
              ? "border-cyan-300 bg-cyan-400 text-slate-950"
              : "border-slate-900 bg-slate-900 text-white"
            : darkMode
              ? "border-slate-600"
              : "border-slate-300"
        }`}
        aria-hidden="true"
      >
        {selected ? <Check className="h-4 w-4" strokeWidth={3} /> : null}
      </span>
    </label>
  );
}

function FieldHelp({ children, darkMode }) {
  return (
    <p className={`mt-3 flex gap-2 text-xs leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
      <CircleHelp className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

export default function OnboardingFlow({
  profile,
  darkMode = false,
  onToggleTheme,
  onSave,
  onDone,
  translateText = (value) => value,
}) {
  const tx = (value) => translateText(value);
  const [view, setView] = useState(profile?.onboarding?.status === "completed" ? "steps" : "welcome");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(() => normalizeOnboarding(profile?.onboarding));
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const weekRef = useRef(null);
  const facilityRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    headingRef.current?.focus({ preventScroll: true });
  }, [step, view]);

  const summary = useMemo(() => getOnboardingSummary(answers), [answers]);
  const recommendation = useMemo(() => getOnboardingRecommendation(answers), [answers]);

  const updateAnswer = (key, value) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setStatusMessage("");
  };

  const skip = async () => {
    setSaving(true);
    setStatusMessage("");
    try {
      await onSave(buildSkippedOnboarding(answers));
      onDone();
    } catch {
      setStatusMessage(tx("We could not save that choice. Please try again."));
      setSaving(false);
    }
  };

  const goBack = () => {
    setErrors({});
    setStatusMessage("");
    if (step === 0) {
      setView("welcome");
      return;
    }
    setStep((current) => current - 1);
  };

  const continueFromStep = (event) => {
    event.preventDefault();
    const nextErrors = validateOnboardingStep(step, answers);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      window.requestAnimationFrame(() => {
        if (nextErrors.pregnancyWeek) weekRef.current?.focus();
        if (nextErrors.facilityName) facilityRef.current?.focus();
      });
      return;
    }
    setStatusMessage("");
    setStep((current) => Math.min(current + 1, 4));
  };

  const complete = async () => {
    setSaving(true);
    setStatusMessage("");
    try {
      await onSave(buildCompletedOnboarding(answers));
      onDone();
    } catch {
      setStatusMessage(tx("We could not save your setup. Please try again."));
      setSaving(false);
    }
  };

  const togglePriority = (priorityId) => {
    const current = answers.priorities || [];
    if (current.includes(priorityId)) {
      updateAnswer("priorities", current.filter((item) => item !== priorityId));
      return;
    }
    if (current.length >= 2) {
      setStatusMessage(tx("Choose up to two priorities. Clear one before adding another."));
      return;
    }
    updateAnswer("priorities", [...current, priorityId]);
  };

  const pageClasses = darkMode
    ? "bg-slate-950 text-slate-100"
    : "bg-slate-50 text-slate-950";

  return (
    <div className={`min-h-screen px-6 py-6 sm:px-8 sm:py-8 ${pageClasses}`}>
      <header className="mx-auto flex w-full max-w-[1312px] items-center justify-between gap-4">
        <img
          src={dieudonneDarkLogo}
          alt="Dieudonne"
          className={`h-12 w-auto rounded-lg border p-1 sm:h-14 ${
            darkMode ? "border-slate-800 bg-black" : "border-slate-200 bg-white"
          }`}
        />
        <div className="flex items-center gap-2">
          {onToggleTheme ? (
            <ThemeToggle darkMode={darkMode} onToggle={onToggleTheme} translateText={translateText} />
          ) : null}
          <button
            type="button"
            onClick={skip}
            disabled={saving}
            className={`min-h-11 rounded-xl px-4 py-2 text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60 ${
              darkMode
                ? "bg-slate-900 text-cyan-300 hover:bg-slate-800 focus-visible:ring-offset-slate-950"
                : "bg-white text-cyan-700 shadow-sm hover:bg-slate-100 focus-visible:ring-offset-slate-50"
            }`}
          >
            {saving ? tx("Saving...") : tx(view === "welcome" ? "Skip for now" : "Skip")}
          </button>
        </div>
      </header>

      <main className="mx-auto mt-8 w-full max-w-[1312px] sm:mt-12">
        {view === "welcome" ? (
          <section className={`mx-auto min-h-[580px] max-w-[960px] rounded-[1.75rem] border p-6 sm:p-10 md:p-14 ${surface(darkMode)}`}>
            <div className="flex h-full min-h-[470px] flex-col">
              <p className={`text-xs font-extrabold uppercase tracking-[0.16em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
                {tx("Personalize your Partner Hub")}
              </p>
              <h1
                ref={headingRef}
                tabIndex={-1}
                className="mt-7 max-w-4xl text-3xl font-extrabold leading-tight tracking-tight outline-none sm:text-4xl md:text-[40px] md:leading-[44px]"
              >
                {tx("Support that fits what is happening now")}
              </h1>
              <p className={`mt-2 max-w-3xl text-base leading-6 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                {tx("Answer a few optional questions so Today can surface the most useful lessons, guides, and support prompts for you.")}
              </p>

              <div className={`mt-7 rounded-2xl p-5 ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}>
                <p className="flex items-center gap-2 text-xl font-extrabold">
                  <ShieldCheck className={`h-5 w-5 ${darkMode ? "text-cyan-300" : "text-cyan-700"}`} aria-hidden="true" />
                  {tx("You stay in control")}
                </p>
                <p className={`mt-2 text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                  {tx("Every question can be skipped. We use your answers only to tailor the order and emphasis of Partner Hub content. This first version does not ask for medical history, an exact due date, or private notes.")}
                </p>
              </div>

              <div className="mt-auto flex flex-col gap-4 pt-7 sm:flex-row sm:items-center sm:justify-between">
                <p className={`text-xs font-medium ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  {tx("About 1 minute · 5 short steps")}
                </p>
                <button
                  type="button"
                  onClick={() => setView("steps")}
                  className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${
                    darkMode
                      ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300 focus-visible:ring-offset-slate-900"
                      : "bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-offset-white"
                  }`}
                >
                  {tx("Begin setup")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </section>
        ) : (
          <div>
            <Progress currentStep={step} darkMode={darkMode} translateText={tx} />
            {step < 4 ? (
              <form
                className={`mx-auto mt-8 max-w-[960px] rounded-[1.75rem] p-0 sm:border sm:p-8 md:p-12 ${stepSurface(darkMode)}`}
                onSubmit={continueFromStep}
                noValidate
              >
                <p className={`text-xs font-extrabold uppercase tracking-[0.16em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
                  {tx("Step")} {step + 1} {tx("of")} 5 · {tx(stepMeta[step].eyebrow)}
                </p>
                <h1
                  ref={headingRef}
                  tabIndex={-1}
                  className="mt-3 max-w-4xl text-2xl font-extrabold leading-[30px] tracking-tight outline-none sm:text-3xl sm:leading-tight"
                >
                  {tx(stepMeta[step].title)}
                </h1>
                <p className={`mt-2 text-base leading-6 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                  {tx(stepMeta[step].description)}
                </p>

                {step === 0 ? (
                  <fieldset className="mt-5">
                    <legend className="sr-only">{tx("Pregnancy or recovery stage")}</legend>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {onboardingStages.map((option) => (
                        <ChoiceCard
                          key={option.id}
                          option={option}
                          name="onboarding-stage"
                          selected={answers.stage === option.id}
                          onChange={() => updateAnswer("stage", option.id)}
                          darkMode={darkMode}
                          translateText={tx}
                        />
                      ))}
                    </div>
                    {answers.stage === "pregnant" ? (
                      <div className={`mt-5 rounded-2xl p-4 ${darkMode ? "bg-slate-800/80" : "bg-slate-100"}`}>
                        <label htmlFor="pregnancy-week" className="text-sm font-extrabold">
                          {tx("How many weeks pregnant is mom?")} <span className="font-medium">{tx("Optional")}</span>
                        </label>
                        <input
                          ref={weekRef}
                          id="pregnancy-week"
                          inputMode="numeric"
                          type="number"
                          min="1"
                          max="42"
                          value={answers.pregnancyWeek ?? ""}
                          onChange={(event) => updateAnswer("pregnancyWeek", event.target.value)}
                          aria-invalid={Boolean(errors.pregnancyWeek)}
                          aria-describedby={errors.pregnancyWeek ? "pregnancy-week-error pregnancy-week-help" : "pregnancy-week-help"}
                          className={`mt-3 h-12 w-full max-w-[200px] rounded-xl border px-4 text-base outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 ${
                            errors.pregnancyWeek
                              ? "border-rose-400"
                              : darkMode
                                ? "border-slate-600 bg-slate-950 text-slate-100"
                                : "border-slate-300 bg-white text-slate-950"
                          }`}
                          placeholder={tx("28 weeks")}
                        />
                        {errors.pregnancyWeek ? (
                          <p id="pregnancy-week-error" className="mt-2 text-sm font-semibold text-rose-500">
                            {tx(errors.pregnancyWeek)}
                          </p>
                        ) : null}
                        <p id="pregnancy-week-help" className={`mt-3 text-xs leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                          {tx("Why we ask: Today can prioritize trimester-specific guidance. We never infer a due date.")}
                        </p>
                      </div>
                    ) : null}
                  </fieldset>
                ) : null}

                {step === 1 ? (
                  <fieldset className="mt-5">
                    <legend className="sr-only">{tx("Your support role")}</legend>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {onboardingRoles.map((option) => (
                        <ChoiceCard
                          key={option.id}
                          option={option}
                          name="onboarding-role"
                          selected={answers.supportRole === option.id}
                          onChange={() => updateAnswer("supportRole", option.id)}
                          darkMode={darkMode}
                          translateText={tx}
                        />
                      ))}
                    </div>
                    <FieldHelp darkMode={darkMode}>
                      {tx("Why we ask: role-aware wording makes prompts easier to use in the moment.")}
                    </FieldHelp>
                  </fieldset>
                ) : null}

                {step === 2 ? (
                  <fieldset className="mt-5">
                    <legend className="sr-only">{tx("Planned delivery setting")}</legend>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {onboardingDeliverySettings.map((option) => (
                        <ChoiceCard
                          key={option.id}
                          option={option}
                          name="onboarding-delivery"
                          selected={answers.deliverySetting === option.id}
                          onChange={() => updateAnswer("deliverySetting", option.id)}
                          darkMode={darkMode}
                          translateText={tx}
                        />
                      ))}
                    </div>
                    <div className={`mt-5 rounded-2xl p-4 ${errors.facilityName ? (darkMode ? "bg-rose-950/30" : "bg-rose-50") : darkMode ? "bg-slate-800/80" : "bg-slate-100"}`}>
                      <label htmlFor="facility-name" className="text-sm font-extrabold">
                        {tx("Hospital or facility name")} <span className="font-medium">{tx("Optional")}</span>
                      </label>
                      <input
                        ref={facilityRef}
                        id="facility-name"
                        type="text"
                        value={answers.facilityName}
                        onChange={(event) => updateAnswer("facilityName", event.target.value)}
                        aria-invalid={Boolean(errors.facilityName)}
                        aria-describedby={errors.facilityName ? "facility-name-error facility-name-help" : "facility-name-help"}
                        className={`mt-3 h-12 w-full rounded-xl border px-4 text-base outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 ${
                          errors.facilityName
                            ? "border-rose-400 bg-white text-slate-950"
                            : darkMode
                              ? "border-slate-600 bg-slate-950 text-slate-100"
                              : "border-slate-300 bg-white text-slate-950"
                        }`}
                        placeholder={tx("Optional facility name")}
                      />
                      {errors.facilityName ? (
                        <p id="facility-name-error" className="mt-2 text-sm font-semibold text-rose-500">
                          {tx(errors.facilityName)}
                        </p>
                      ) : null}
                      <p id="facility-name-help" className={`mt-3 text-xs leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                        {tx("Why we ask: facility-aware resources can be surfaced later. We do not send anything to the facility.")}
                      </p>
                    </div>
                  </fieldset>
                ) : null}

                {step === 3 ? (
                  <fieldset className="mt-5">
                    <legend className="sr-only">{tx("Current support priorities")}</legend>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {onboardingPriorities.map((option) => (
                        <ChoiceCard
                          key={option.id}
                          option={option}
                          name="onboarding-priorities"
                          type="checkbox"
                          selected={answers.priorities.includes(option.id)}
                          onChange={() => togglePriority(option.id)}
                          darkMode={darkMode}
                          translateText={tx}
                        />
                      ))}
                    </div>
                    <FieldHelp darkMode={darkMode}>
                      {tx("Choose none, one, or two. You can update priorities whenever life changes.")}
                    </FieldHelp>
                  </fieldset>
                ) : null}

                <div aria-live="polite" className="min-h-6 pt-3 text-sm font-semibold text-rose-500">
                  {statusMessage}
                </div>

                <div className="mt-3 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={goBack}
                    className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${
                      darkMode
                        ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 focus-visible:ring-offset-slate-900"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 focus-visible:ring-offset-white"
                    }`}
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {tx("Back")}
                  </button>
                  <button
                    type="submit"
                    className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${
                      darkMode
                        ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300 focus-visible:ring-offset-slate-900"
                        : "bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-offset-white"
                    }`}
                  >
                    {tx("Continue")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </form>
            ) : (
              <section className="mt-8">
                <p className={`text-xs font-extrabold uppercase tracking-[0.16em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
                  {tx("Step 5 of 5 · Review")}
                </p>
                <h1 ref={headingRef} tabIndex={-1} className="mt-5 text-3xl font-extrabold tracking-tight outline-none">
                  {tx("Your Partner Hub is ready to personalize")}
                </h1>
                <p className={`mt-3 text-base ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  {tx("Review your answers, then open a Today plan shaped around what matters now.")}
                </p>

                <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.05fr]">
                  <article className={`rounded-3xl border p-6 ${surface(darkMode)}`}>
                    <h2 className="text-xl font-extrabold">{tx("Your answers")}</h2>
                    <dl className="mt-4 space-y-3">
                      {[
                        ["Pregnancy stage", summary.stage],
                        ["Your role", summary.role],
                        ["Delivery plan", summary.delivery],
                        ["Main focus", summary.mainFocus],
                        ["Also useful", summary.alsoUseful],
                      ].map(([label, value]) => (
                        <div key={label} className={`rounded-xl p-4 ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}>
                          <dt className={`text-[11px] font-extrabold uppercase tracking-[0.14em] ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                            {tx(label)}
                          </dt>
                          <dd className="mt-1 text-sm font-bold">{tx(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  </article>

                  <article className={`rounded-3xl border p-6 ${darkMode ? "border-cyan-500 bg-slate-900" : "border-cyan-300 bg-cyan-50/40"}`}>
                    <p className={`text-xs font-extrabold uppercase tracking-[0.16em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
                      {tx("How Today changes")}
                    </p>
                    <h2 className="mt-5 text-2xl font-extrabold">{tx("A clearer next step, based on your answers")}</h2>
                    <div className="mt-4 space-y-4">
                      {[
                        ["Start here", recommendation.startHere],
                        ["Say this", `“${recommendation.sayThis}”`],
                        ["Watch for", recommendation.watchFor],
                        ["Recommended guide", `Open the ${recommendation.guideTitle}.`],
                      ].map(([label, value]) => (
                        <div key={label} className={`rounded-2xl p-4 ${darkMode ? "bg-cyan-950/80" : "bg-white"}`}>
                          <p className={`text-[11px] font-extrabold uppercase tracking-[0.14em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
                            {tx(label)}
                          </p>
                          <p className={`mt-2 text-sm leading-relaxed ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                            {tx(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>

                <div aria-live="polite" className="min-h-6 pt-4 text-sm font-semibold text-rose-500">
                  {statusMessage}
                </div>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className={`min-h-12 rounded-xl border px-5 py-3 text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${
                      darkMode
                        ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 focus-visible:ring-offset-slate-950"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 focus-visible:ring-offset-slate-50"
                    }`}
                  >
                    {tx("Edit answers")}
                  </button>
                  <button
                    type="button"
                    onClick={complete}
                    disabled={saving}
                    className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60 ${
                      darkMode
                        ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300 focus-visible:ring-offset-slate-950"
                        : "bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-offset-slate-50"
                    }`}
                  >
                    {saving ? tx("Saving...") : tx("View Today")}
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <footer className={`mx-auto mt-8 flex max-w-[960px] items-center justify-center gap-2 pb-4 text-xs ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
        <HeartHandshake className="h-4 w-4" aria-hidden="true" />
        {tx("Private, optional setup for a more useful Partner Hub")}
      </footer>
    </div>
  );
}
