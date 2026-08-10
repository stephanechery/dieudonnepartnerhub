import React from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MessageCircle,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

const phases = [
  { id: "learn", label: "Learn" },
  { id: "practice", label: "Practice" },
  { id: "check", label: "Check" },
  { id: "mission", label: "Mission" },
];

const getPhaseIndex = (view) =>
  Math.max(0, phases.findIndex((phase) => phase.id === view));

export default function LessonMissionExperience({
  module,
  lesson,
  lessonMission,
  lessonNumber,
  courseSections,
  courseStep,
  experienceView,
  quizUnlocked,
  completeStatus,
  missionChecks,
  missionSaved,
  nextLesson,
  phaseHeadingRef,
  renderCourseSection,
  renderQuizPanel,
  onBackToModule,
  onPhaseChange,
  onAdvance,
  onGoBack,
  onToggleMissionItem,
  onSaveMission,
  onOpenNextLesson,
  darkMode = false,
  translateText = (value) => value,
}) {
  const tx = (value) => translateText(value);
  const activePhaseIndex = getPhaseIndex(experienceView);
  const allMissionItemsChecked =
    missionChecks.length === lessonMission.checklist.length;
  const currentSection = courseSections[courseStep] || courseSections[0];

  const surface = darkMode
    ? "border-slate-800 bg-slate-900 text-slate-100"
    : "border-slate-200 bg-white text-slate-950";
  const subtle = darkMode
    ? "border-slate-800 bg-slate-800/70"
    : "border-slate-200 bg-slate-50";
  const secondaryText = darkMode ? "text-slate-400" : "text-slate-600";
  const accentText = darkMode ? "text-cyan-300" : "text-cyan-700";

  return (
    <div className="space-y-5 pb-6 sm:space-y-6">
      <button
        type="button"
        onClick={onBackToModule}
        className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${
          darkMode
            ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 focus-visible:ring-offset-slate-950"
            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 focus-visible:ring-offset-slate-50"
        }`}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {tx("Back to Module")}
      </button>

      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className={`text-xs font-black uppercase tracking-[0.18em] ${accentText}`}>
            {tx("Training")} / {tx(module.title)}
          </p>
          <h2 className={`mt-2 text-3xl font-black tracking-tight ${darkMode ? "text-slate-100" : "text-slate-950"}`}>
            {tx(lesson.title)}
          </h2>
          <p className={`mt-2 text-base leading-relaxed ${secondaryText}`}>
            {tx(lessonMission.learningOutcome)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-black uppercase tracking-[0.12em] ${darkMode ? "border-cyan-800 bg-cyan-950/60 text-cyan-200" : "border-cyan-200 bg-cyan-50 text-cyan-800"}`}>
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            {lessonMission.durationMinutes} {tx("min")}
          </span>
          <span className={`rounded-full border px-3 py-2 text-xs font-black uppercase tracking-[0.12em] ${subtle} ${secondaryText}`}>
            {tx("Lesson")} {lessonNumber} {tx("of")} {module.lessons.length}
          </span>
          <span className={`rounded-full border px-3 py-2 text-xs font-black uppercase tracking-[0.12em] ${subtle} ${secondaryText}`}>
            {lessonMission.required ? tx("Required") : tx("Optional")}
          </span>
        </div>
      </header>

      <nav
        aria-label={tx("Lesson progress")}
        className={`grid grid-cols-4 gap-1 rounded-3xl border p-2 sm:gap-3 sm:p-4 ${surface}`}
      >
        {phases.map((phase, index) => {
          const active = index === activePhaseIndex;
          const completed = index < activePhaseIndex || (missionSaved && index === 3);
          const locked =
            (phase.id === "check" && !quizUnlocked) ||
            (phase.id === "mission" && !completeStatus);

          return (
            <button
              key={phase.id}
              type="button"
              disabled={locked}
              aria-current={active ? "step" : undefined}
              onClick={() => onPhaseChange(phase.id)}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-45 sm:min-h-12 sm:flex-row sm:gap-2 sm:text-sm ${
                active
                  ? darkMode
                    ? "bg-cyan-950 text-cyan-100"
                    : "bg-cyan-50 text-cyan-900"
                  : secondaryText
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                  active
                    ? darkMode
                      ? "bg-cyan-400 text-slate-950"
                      : "bg-slate-950 text-white"
                    : completed
                      ? darkMode
                        ? "bg-cyan-950 text-cyan-300"
                        : "bg-cyan-100 text-cyan-800"
                      : darkMode
                        ? "bg-slate-800 text-slate-400"
                        : "bg-slate-100 text-slate-500"
                }`}
              >
                {completed ? <Check className="h-4 w-4" aria-hidden="true" /> : index + 1}
              </span>
              <span>{tx(missionSaved && phase.id === "mission" ? "Done" : phase.label)}</span>
            </button>
          );
        })}
      </nav>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
        <main className="min-w-0">
          <h3 ref={phaseHeadingRef} tabIndex={-1} className="sr-only">
            {tx(phases[activePhaseIndex].label)}
          </h3>

          {experienceView === "mission" ? (
            <section className={`rounded-[1.75rem] border p-5 sm:p-6 ${surface}`}>
              <div className={`flex flex-col gap-4 rounded-3xl border p-5 sm:flex-row sm:items-center ${darkMode ? "border-cyan-800 bg-slate-800" : "border-cyan-300 bg-cyan-50"}`}>
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${darkMode ? "bg-cyan-500 text-slate-950" : "bg-cyan-600 text-white"}`}>
                  {missionSaved ? (
                    <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Sparkles className="h-6 w-6" aria-hidden="true" />
                  )}
                </span>
                <div>
                  <p className={`text-xs font-black uppercase tracking-[0.18em] ${accentText}`}>
                    {tx("Do This Today")}
                  </p>
                  <h4 className={`mt-1 text-2xl font-black ${darkMode ? "text-slate-100" : "text-slate-950"}`}>
                    {missionSaved ? tx("Mission complete") : tx("Turn support into one action")}
                  </h4>
                  <p className={`mt-1 text-sm ${secondaryText}`} aria-live="polite">
                    {missionSaved
                      ? tx("Your practical support plan is saved.")
                      : tx("Choose all three actions, then save your plan.")}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <p className={`text-xs font-black uppercase tracking-[0.18em] ${accentText}`}>
                  {tx("Tonight's plan")}
                </p>
                <h4 className={`mt-2 text-2xl font-black ${darkMode ? "text-slate-100" : "text-slate-950"}`}>
                  {tx(lessonMission.action)}
                </h4>
                <div className={`mt-4 rounded-2xl border p-4 ${subtle}`}>
                  <p className={`flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] ${accentText}`}>
                    <MessageCircle className="h-4 w-4" aria-hidden="true" /> {tx("Say this")}
                  </p>
                  <p className={`mt-2 text-base leading-relaxed ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
                    “{tx(lessonMission.sayThis)}”
                  </p>
                </div>

                <div className="mt-4 space-y-3">
                  {lessonMission.checklist.map((item, index) => {
                    const checked = missionChecks.includes(index);
                    return (
                      <button
                        key={item}
                        type="button"
                        role="checkbox"
                        aria-checked={checked}
                        disabled={missionSaved}
                        onClick={() => onToggleMissionItem(index)}
                        className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:cursor-default ${
                          checked
                            ? darkMode
                              ? "border-cyan-800 bg-slate-800 text-slate-100"
                              : "border-cyan-200 bg-cyan-50 text-slate-900"
                            : darkMode
                              ? "border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-700"
                              : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300"
                        }`}
                      >
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${checked ? "bg-cyan-500 text-slate-950" : darkMode ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-500"}`}>
                          {checked ? <Check className="h-4 w-4" aria-hidden="true" /> : index + 1}
                        </span>
                        {tx(item)}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  {!missionSaved && (
                    <button
                      type="button"
                      disabled={!allMissionItemsChecked}
                      onClick={onSaveMission}
                      className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      {tx("Save today's mission")}
                    </button>
                  )}
                  {missionSaved && (
                    <button
                      type="button"
                      onClick={onOpenNextLesson}
                      className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
                    >
                      {nextLesson ? tx("Start next lesson") : tx("Return to module")}
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onPhaseChange("learn")}
                    className={`inline-flex min-h-12 items-center justify-center rounded-2xl border px-4 py-3 text-sm font-bold ${darkMode ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"}`}
                  >
                    {tx("Review lesson")}
                  </button>
                </div>
              </div>
            </section>
          ) : experienceView === "check" ? (
            <section className={`rounded-[1.75rem] border p-4 sm:p-6 ${surface}`}>
              <p className={`text-xs font-black uppercase tracking-[0.18em] ${accentText}`}>
                {tx("Knowledge Check")}
              </p>
              <h4 className={`mt-2 text-2xl font-black ${darkMode ? "text-slate-100" : "text-slate-950"}`}>
                {tx("Show what you know")}
              </h4>
              <p className={`mb-5 mt-2 text-sm leading-relaxed ${secondaryText}`}>
                {tx("A score of 70% or higher completes the lesson and opens the mission.")}
              </p>
              {quizUnlocked ? (
                renderQuizPanel()
              ) : (
                <div className={`rounded-2xl border p-4 ${darkMode ? "border-amber-900 bg-amber-950/30 text-amber-100" : "border-amber-200 bg-amber-50 text-amber-900"}`}>
                  <p className="flex items-center gap-2 text-sm font-bold">
                    <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                    {tx("Complete the practice checks before taking the quiz.")}
                  </p>
                </div>
              )}
            </section>
          ) : (
            <div>
              {renderCourseSection(currentSection, courseStep)}
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onGoBack}
                  disabled={experienceView === "learn" && courseStep === 0}
                  className={`inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold disabled:opacity-40 ${darkMode ? "border-slate-700 bg-slate-900 text-slate-200" : "border-slate-300 bg-white text-slate-700"}`}
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" /> {tx("Back")}
                </button>
                <button
                  type="button"
                  onClick={onAdvance}
                  className={`inline-flex min-h-12 flex-[2] items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${darkMode ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400" : "bg-slate-950 text-white hover:bg-slate-800"}`}
                >
                  {experienceView === "learn" ? tx("Continue to practice") : quizUnlocked ? tx("Continue to check") : tx("Continue practice")}
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </main>

        <aside className="space-y-4">
          <section className={`rounded-3xl border p-5 ${darkMode ? "border-cyan-800 bg-slate-900" : "border-cyan-200 bg-white"}`}>
            <p className={`text-xs font-black uppercase tracking-[0.18em] ${accentText}`}>
              {tx("You'll be able to")}
            </p>
            <p className={`mt-3 text-base leading-relaxed ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
              {tx(lessonMission.learningOutcome)}
            </p>
          </section>

          <section className={`rounded-3xl border p-5 ${subtle}`}>
            <p className={`flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] ${accentText}`}>
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> {tx("Say this")}
            </p>
            <p className={`mt-3 text-base leading-relaxed ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
              “{tx(lessonMission.sayThis)}”
            </p>
          </section>

          <details className={`group rounded-3xl border p-5 ${darkMode ? "border-rose-800 bg-rose-950/35" : "border-rose-200 bg-rose-50"}`}>
            <summary className="cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500">
              <p className={`flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] ${darkMode ? "text-rose-300" : "text-rose-700"}`}>
                <ShieldAlert className="h-4 w-4" aria-hidden="true" /> {tx("Safety access")}
              </p>
              <h4 className={`mt-2 text-xl font-black ${darkMode ? "text-slate-100" : "text-slate-950"}`}>
                {tx("Urgent warning signs")}
              </h4>
              <p className={`mt-2 text-xs leading-relaxed ${secondaryText}`}>
                {tx("This platform does not diagnose. Contact the care team for concerning symptoms. Call emergency services for immediate danger.")}
              </p>
              <span className={`mt-4 inline-flex min-h-11 items-center rounded-xl border px-3 py-2 text-sm font-bold ${darkMode ? "border-slate-700 bg-slate-900 text-slate-200" : "border-rose-200 bg-white text-slate-700"}`}>
                {tx("Review warning signs")}
              </span>
            </summary>
            <ul className={`mt-4 space-y-2 border-t pt-4 text-sm leading-relaxed ${darkMode ? "border-rose-900 text-rose-100" : "border-rose-200 text-rose-900"}`}>
              <li>• {tx("Severe bleeding, chest pain, trouble breathing, fainting, or seizure")}</li>
              <li>• {tx("Severe headache, vision changes, or rapidly worsening pain")}</li>
              <li>• {tx("Thoughts of harming self, the mother, or the baby")}</li>
            </ul>
          </details>

          {experienceView !== "mission" && (
            <button
              type="button"
              disabled={!completeStatus}
              onClick={() => onPhaseChange("mission")}
              className={`flex min-h-20 w-full items-center justify-between rounded-3xl border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-45 ${darkMode ? "border-cyan-800 bg-slate-800 text-slate-100" : "border-cyan-200 bg-emerald-50 text-slate-900"}`}
            >
              <span>
                <span className={`block text-xs font-black uppercase tracking-[0.18em] ${accentText}`}>
                  {completeStatus ? tx("Up next") : tx("Complete the check to unlock")}
                </span>
                <span className="mt-1 block text-sm font-black">{tx("Do This Today")}</span>
              </span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}
