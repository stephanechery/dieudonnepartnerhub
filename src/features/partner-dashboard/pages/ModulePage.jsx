import React from "react";
import { ArrowLeft, Lock, PlayCircle } from "lucide-react";
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
  const moduleState = getModuleState(profile, module.id);

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition ${
          darkMode ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
        }`}
      >
        <ArrowLeft className="h-4 w-4" /> {tx("Back to Dashboard")}
      </button>

      <section className={`rounded-[1.8rem] border p-5 ${darkMode ? "border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 shadow-xl" : "border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm"}`}>
        <h2 className={`text-2xl font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx(module.title)}</h2>
        <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{tx(module.subtitle)}</p>
        <p className={`mt-3 text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{tx(module.objective)}</p>
      </section>

      {module.warningSigns && <WarningSignsPanel warningSigns={module.warningSigns} darkMode={darkMode} translateText={translateText} />}

      <section className={`rounded-[1.8rem] border p-5 ${darkMode ? "border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 shadow-xl" : "border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm"}`}>
        <h3 className={`mb-4 text-xl font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx("Lessons")}</h3>
        <div className="space-y-3">
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
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className={`text-xs font-black uppercase tracking-wide ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
                      {tx("Lesson")} {index + 1}
                    </p>
                    <h4 className={`text-lg font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx(lesson.title)}</h4>
                    <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{tx(lesson.summary)}</p>
                  </div>

                  <div className="flex items-center gap-2">
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
                      className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${
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
    </div>
  );
}
