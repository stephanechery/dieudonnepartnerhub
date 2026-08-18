import React from "react";
import { ArrowRight, BookOpenCheck, GraduationCap } from "lucide-react";
import ModuleCard from "../components/ModuleCard";
import ProgressBar from "../components/ProgressBar";

export default function TrainingPage({
  metrics,
  onOpenModule,
  onOpenLesson,
  darkMode = false,
  translateText = (value) => value,
}) {
  const tx = (value) => translateText(value);

  return (
    <div className="space-y-5">
      <section
        className={`overflow-hidden rounded-[1.75rem] border p-4 shadow-sm sm:p-5 ${
          darkMode
            ? "border-cyan-400/25 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/50 shadow-xl"
            : "border-cyan-200 bg-gradient-to-br from-white via-cyan-50/70 to-indigo-50 shadow-sm"
        }`}
      >
        <p className={`flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
          <GraduationCap className="h-4 w-4" aria-hidden="true" /> {tx("Training")}
        </p>
        <h2 className={`mt-2 text-2xl font-black tracking-tight sm:text-3xl ${darkMode ? "text-white" : "text-slate-950"}`}>
          {tx("Your learning path")}
        </h2>
        <p className={`mt-2 text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
          {tx("See every module, track your progress, and continue from your next lesson.")}
        </p>
        <div className={`mt-5 rounded-2xl border p-4 ${darkMode ? "border-white/10 bg-white/[0.045]" : "border-slate-200 bg-white/85"}`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className={`text-[11px] font-black uppercase tracking-[0.16em] ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                {tx("Overall Progress")}
              </p>
              <p className={`mt-1 text-2xl font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
                {metrics.overallProgress}%
              </p>
            </div>
            {metrics.nextLesson.lessonId && (
              <button
                type="button"
                onClick={() => onOpenLesson(metrics.nextLesson.moduleId, metrics.nextLesson.lessonId)}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-black text-white transition ${darkMode ? "bg-cyan-700 hover:bg-cyan-800" : "bg-slate-900 hover:bg-slate-800"}`}
              >
                {tx("Resume")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <ProgressBar className="mt-3" value={metrics.overallProgress} trackClassName={darkMode ? "bg-slate-800" : ""} />
          <p className={`mt-3 text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
            {tx(metrics.nextLesson.lessonTitle)}
          </p>
          <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            {tx(metrics.nextLesson.moduleTitle)}
          </p>
        </div>
      </section>

      <section className={`rounded-[1.8rem] border p-4 sm:p-5 ${darkMode ? "border-slate-800 bg-slate-900 shadow-xl" : "border-slate-200 bg-white shadow-sm"}`}>
        <h2 className={`mb-4 text-xl font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx("Module Progress")}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {metrics.modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onOpen={() => onOpenModule(module.id)}
              darkMode={darkMode}
              translateText={translateText}
            />
          ))}
        </div>
      </section>

      <section className={`rounded-[1.8rem] border p-4 sm:p-5 ${darkMode ? "border-slate-800 bg-slate-900 shadow-xl" : "border-slate-200 bg-white shadow-sm"}`}>
        <h2 className={`flex items-center gap-2 text-xl font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
          <BookOpenCheck className="h-5 w-5 text-emerald-500" aria-hidden="true" /> {tx("Recently Completed")}
        </h2>
        {!metrics.recentlyCompleted.length ? (
          <p className={`mt-3 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            {tx("No lessons completed yet. Start with the first available module.")}
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {metrics.recentlyCompleted.slice(0, 6).map((item) => (
              <li key={`${item.moduleId}-${item.lessonId}-${item.completedAt}`} className={`rounded-xl border p-3 ${darkMode ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-slate-50"}`}>
                <p className={`text-sm font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx(item.lessonTitle)}</p>
                <p className={`mt-1 text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{tx(item.moduleTitle)}</p>
                <button
                  type="button"
                  onClick={() => onOpenLesson(item.moduleId, item.lessonId)}
                  className={`mt-3 min-h-11 w-full rounded-xl border px-3 py-2 text-sm font-black sm:w-auto ${darkMode ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"}`}
                >
                  {tx("Review Lesson")}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
