import React, { useEffect, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Lock, PlayCircle } from "lucide-react";
import { getModuleState, isLessonComplete, isLessonUnlocked } from "../utils/progress";
import WarningSignsPanel from "../components/WarningSignsPanel";

export default function ModulePage({
  module,
  profile,
  onBack,
  onOpenLesson,
  darkMode = false,
  translateText = (value) => value,
}) {
  const tx = (value) => translateText(value);
  const [lessonStep, setLessonStep] = useState(0);
  const moduleState = getModuleState(profile, module.id);
  const completedCount = module.lessons.filter((lesson) =>
    isLessonComplete(moduleState, lesson.id)
  ).length;
  const nextAvailableLesson =
    module.lessons.find(
      (lesson) =>
        isLessonUnlocked(module, moduleState, lesson.id) &&
        !isLessonComplete(moduleState, lesson.id)
    ) ||
    module.lessons.find((lesson) => isLessonUnlocked(module, moduleState, lesson.id)) ||
    null;
  const currentLesson = module.lessons[lessonStep] || module.lessons[0];
  const currentLessonUnlocked = currentLesson
    ? isLessonUnlocked(module, moduleState, currentLesson.id)
    : false;
  const currentLessonCompleted = currentLesson
    ? isLessonComplete(moduleState, currentLesson.id)
    : false;
  const currentLessonScore = currentLesson
    ? moduleState.quizScores[currentLesson.id]
    : null;
  const currentLessonHasResponses = currentLesson
    ? Boolean(moduleState.quizResponses?.[currentLesson.id])
    : false;
  const lessonStepPercent = currentLesson
    ? Math.round(((lessonStep + 1) / module.lessons.length) * 100)
    : 0;

  useEffect(() => {
    const nextIndex = nextAvailableLesson
      ? module.lessons.findIndex((lesson) => lesson.id === nextAvailableLesson.id)
      : 0;
    setLessonStep(Math.max(0, nextIndex));
  }, [module.id, nextAvailableLesson?.id, module.lessons]);

  return (
    <div className="space-y-5 pb-24 sm:space-y-6 sm:pb-0">
      <button
        type="button"
        onClick={onBack}
        className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition sm:min-h-0 sm:w-auto sm:justify-start sm:px-3 sm:py-2 ${
          darkMode ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
        }`}
      >
        <ArrowLeft className="h-4 w-4" /> {tx("Back to Dashboard")}
      </button>

      <section className={`rounded-[1.8rem] border p-4 sm:p-5 ${darkMode ? "border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 shadow-xl" : "border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm"}`}>
        <h2 className={`text-xl font-black sm:text-2xl ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx(module.title)}</h2>
        <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{tx(module.subtitle)}</p>
        <p className={`mt-3 text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{tx(module.objective)}</p>
        <div className={`mt-4 flex flex-wrap items-center gap-2 text-xs font-bold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
          <span className={`rounded-full border px-3 py-1.5 ${darkMode ? "border-cyan-900/60 bg-cyan-950/30 text-cyan-200" : "border-cyan-200 bg-cyan-50 text-cyan-700"}`}>
            {tx("Lessons")} {completedCount}/{module.lessons.length}
          </span>
          {nextAvailableLesson && (
            <span className={`rounded-full border px-3 py-1.5 ${darkMode ? "border-emerald-900/60 bg-emerald-950/30 text-emerald-200" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
              {tx("Up Next")}: {tx(nextAvailableLesson.title)}
            </span>
          )}
        </div>
      </section>

      {module.warningSigns && <WarningSignsPanel warningSigns={module.warningSigns} darkMode={darkMode} translateText={translateText} />}

      <section className={`rounded-[1.8rem] border p-4 sm:p-5 ${darkMode ? "border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 shadow-xl" : "border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm"}`}>
        <h3 className={`mb-4 text-xl font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx("Lessons")}</h3>
        {currentLesson && (
          <div className="space-y-4 sm:hidden">
            <div className={`flex items-center justify-between text-[11px] font-black uppercase tracking-[0.16em] ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
              <span>{tx("Lesson")} {lessonStep + 1}/{module.lessons.length}</span>
              <span>{lessonStepPercent}%</span>
            </div>
            <div className={`h-2 overflow-hidden rounded-full ${darkMode ? "bg-slate-800" : "bg-slate-200"}`}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500"
                style={{ width: `${lessonStepPercent}%` }}
              />
            </div>
            <article
              className={`relative overflow-hidden rounded-2xl border px-4 py-4 transition ${
                currentLessonUnlocked
                  ? darkMode
                    ? "border-slate-700 bg-slate-900"
                    : "border-slate-200 bg-white"
                  : darkMode
                    ? "border-slate-800 bg-slate-900/70"
                    : "border-slate-200 bg-slate-100"
              }`}
            >
              <div
                className={`absolute left-0 top-0 h-full w-1 ${
                  currentLessonCompleted
                    ? "bg-emerald-500"
                    : currentLessonUnlocked
                      ? "bg-cyan-500"
                      : darkMode
                        ? "bg-slate-800"
                        : "bg-slate-200"
                }`}
              />
              <p className={`text-xs font-black uppercase tracking-wide ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
                {tx("Lesson")} {lessonStep + 1}
              </p>
              <h4 className={`mt-1 text-xl font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx(currentLesson.title)}</h4>
              <p className={`mt-2 text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{tx(currentLesson.summary)}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {typeof currentLessonScore === "number" && (
                  <span className={`rounded-full border px-2 py-1 text-xs font-bold ${darkMode ? "border-cyan-900/60 bg-cyan-950/30 text-cyan-200" : "border-cyan-200 bg-cyan-50 text-cyan-700"}`}>
                    {tx("Quiz")} {currentLessonScore}%
                  </span>
                )}
                {currentLessonHasResponses && (
                  <span className={`rounded-full border px-2 py-1 text-xs font-bold ${darkMode ? "border-indigo-900/60 bg-indigo-950/30 text-indigo-200" : "border-indigo-200 bg-indigo-50 text-indigo-700"}`}>
                    {tx("Responses saved")}
                  </span>
                )}
                {currentLessonCompleted && (
                  <span className={`rounded-full border px-2 py-1 text-xs font-bold ${darkMode ? "border-emerald-900/60 bg-emerald-950/30 text-emerald-200" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                    {tx("Completed")}
                  </span>
                )}
                {!currentLessonUnlocked && (
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-bold ${darkMode ? "border-slate-700 bg-slate-800 text-slate-400" : "border-slate-300 bg-white text-slate-500"}`}>
                    <Lock className="h-3 w-3" /> {tx("Locked")}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => onOpenLesson(currentLesson.id)}
                disabled={!currentLessonUnlocked}
                className={`mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  darkMode
                    ? "bg-gradient-to-r from-cyan-600 to-teal-500"
                    : "bg-gradient-to-r from-slate-900 to-slate-700"
                }`}
              >
                <PlayCircle className="h-4 w-4" /> {tx("Open")}
              </button>
            </article>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLessonStep((current) => Math.max(0, current - 1))}
                disabled={lessonStep === 0}
                className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold disabled:opacity-40 ${
                  darkMode ? "border-slate-700 bg-slate-950 text-slate-200" : "border-slate-300 bg-white text-slate-700"
                }`}
              >
                <ChevronLeft className="h-4 w-4" /> {tx("Back")}
              </button>
              <button
                type="button"
                onClick={() => setLessonStep((current) => Math.min(module.lessons.length - 1, current + 1))}
                disabled={lessonStep === module.lessons.length - 1}
                className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold text-white disabled:opacity-40 ${
                  darkMode ? "bg-gradient-to-r from-cyan-600 to-teal-500" : "bg-gradient-to-r from-slate-900 to-slate-700"
                }`}
              >
                {tx("Next")} <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="hidden space-y-3 sm:block">
          {module.lessons.map((lesson, index) => {
            const unlocked = isLessonUnlocked(module, moduleState, lesson.id);
            const completed = isLessonComplete(moduleState, lesson.id);
            const score = moduleState.quizScores[lesson.id];
            const hasResponses = Boolean(moduleState.quizResponses?.[lesson.id]);

            return (
              <article
                key={lesson.id}
                className={`relative overflow-hidden rounded-2xl border px-4 py-3 transition ${
                  unlocked
                    ? darkMode
                      ? "border-slate-700 bg-slate-900 hover:border-cyan-700/60"
                      : "border-slate-200 bg-white hover:border-cyan-300"
                    : darkMode
                      ? "border-slate-800 bg-slate-900/70"
                      : "border-slate-200 bg-slate-100"
                }`}
              >
                <div
                  className={`absolute left-0 top-0 h-full w-1 ${
                    completed
                      ? "bg-emerald-500"
                      : unlocked
                        ? "bg-cyan-500"
                        : darkMode
                          ? "bg-slate-800"
                          : "bg-slate-200"
                  }`}
                />
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className={`text-xs font-black uppercase tracking-wide ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
                      {tx("Lesson")} {index + 1}
                    </p>
                    <h4 className={`text-lg font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx(lesson.title)}</h4>
                    <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{tx(lesson.summary)}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {typeof score === "number" && (
                      <span className={`rounded-full border px-2 py-1 text-xs font-bold ${darkMode ? "border-cyan-900/60 bg-cyan-950/30 text-cyan-200" : "border-cyan-200 bg-cyan-50 text-cyan-700"}`}>
                        {tx("Quiz")} {score}%
                      </span>
                    )}
                    {hasResponses && (
                      <span className={`rounded-full border px-2 py-1 text-xs font-bold ${darkMode ? "border-indigo-900/60 bg-indigo-950/30 text-indigo-200" : "border-indigo-200 bg-indigo-50 text-indigo-700"}`}>
                        {tx("Responses saved")}
                      </span>
                    )}
                    {completed && (
                      <span className={`rounded-full border px-2 py-1 text-xs font-bold ${darkMode ? "border-emerald-900/60 bg-emerald-950/30 text-emerald-200" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                        {tx("Completed")}
                      </span>
                    )}
                    {!unlocked && (
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-bold ${darkMode ? "border-slate-700 bg-slate-800 text-slate-400" : "border-slate-300 bg-white text-slate-500"}`}>
                        <Lock className="h-3 w-3" /> {tx("Locked")}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => onOpenLesson(lesson.id)}
                      disabled={!unlocked}
                      className={`inline-flex min-h-11 w-full items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:text-xs ${
                        darkMode
                          ? "bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400"
                          : "bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-700"
                      }`}
                    >
                      <PlayCircle className="h-4 w-4" /> {tx("Open")}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {nextAvailableLesson && (
        <div
          className={`fixed inset-x-0 bottom-0 z-40 border-t px-3 py-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:hidden ${
            darkMode
              ? "border-slate-800 bg-slate-950/95"
              : "border-slate-200/80 bg-white/95"
          }`}
        >
          <div className="mx-auto flex max-w-md items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className={`text-[11px] font-black uppercase tracking-[0.16em] ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
                {tx("Continue Module")}
              </p>
              <p className={`truncate text-sm font-bold ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
                {tx(nextAvailableLesson.title)}
              </p>
              <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                {tx("Lesson")} {module.lessons.findIndex((lesson) => lesson.id === nextAvailableLesson.id) + 1}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenLesson(nextAvailableLesson.id)}
              className={`min-h-11 shrink-0 rounded-xl px-4 py-3 text-sm font-bold text-white ${
                darkMode
                  ? "bg-gradient-to-r from-cyan-600 to-teal-500"
                  : "bg-gradient-to-r from-slate-900 to-slate-700"
              }`}
            >
              {tx("Open")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
