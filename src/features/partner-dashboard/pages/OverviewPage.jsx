import React from "react";
import { BarChart3, BookMarked, Clock3, GraduationCap } from "lucide-react";
import ModuleCard from "../components/ModuleCard";
import ProgressBar from "../components/ProgressBar";

export default function OverviewPage({ metrics, curriculum, onOpenModule, onOpenLesson, darkMode = false, translateText = (value) => value }) {
  const tx = (value) => translateText(value);
  return (
    <div className="space-y-6">
      <section
        className={`relative overflow-hidden rounded-[2rem] border p-5 md:p-6 ${
          darkMode
            ? "border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 shadow-xl"
            : "border-slate-200 bg-gradient-to-br from-white via-white to-cyan-50/50 shadow-sm"
        }`}
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 left-16 h-40 w-40 rounded-full bg-rose-500/10 blur-3xl" />
        <div className="relative z-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div>
            <p
              className={`text-xs font-black uppercase tracking-[0.2em] ${
                darkMode ? "text-slate-500" : "text-slate-500"
              }`}
            >
              {tx("Current Module")}
            </p>
            <h2
              className={`mt-1 text-2xl font-black tracking-tight md:text-3xl ${
                darkMode ? "text-slate-100" : "text-slate-900"
              }`}
            >
              {tx(metrics.currentModule.title)}
            </h2>
            <p className={`mt-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              {tx("Completion")}: {metrics.currentModule.completion}%
            </p>
            <ProgressBar className="mt-3 max-w-md" value={metrics.currentModule.completion} trackClassName={darkMode ? "bg-slate-800" : ""} />
            {metrics.nextLesson.lessonId && (
              <button
                type="button"
                className={`mt-4 rounded-xl px-4 py-2 text-sm font-bold text-white transition ${
                  darkMode
                    ? "bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400"
                    : "bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-700"
                }`}
                onClick={() =>
                  onOpenLesson(metrics.nextLesson.moduleId, metrics.nextLesson.lessonId)
                }
              >
                {tx("Resume")}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <article
              className={`rounded-2xl border p-4 ${
                darkMode
                  ? "border-slate-800 bg-slate-900/70"
                  : "border-slate-200 bg-white/70"
              }`}
            >
              <p className={`text-[11px] font-black uppercase tracking-wide ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
                {tx("Overall Progress")}
              </p>
              <p className={`mt-1 text-2xl font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
                {metrics.overallProgress}%
              </p>
            </article>
            <article
              className={`rounded-2xl border p-4 ${
                darkMode
                  ? "border-slate-800 bg-slate-900/70"
                  : "border-slate-200 bg-white/70"
              }`}
            >
              <p className={`text-[11px] font-black uppercase tracking-wide ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
                {tx("Quiz Avg")}
              </p>
              <p className={`mt-1 text-2xl font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
                {metrics.overallQuizAverage}%
              </p>
            </article>
            <article
              className={`rounded-2xl border p-4 ${
                darkMode
                  ? "border-slate-800 bg-slate-900/70"
                  : "border-slate-200 bg-white/70"
              }`}
            >
              <p className={`text-[11px] font-black uppercase tracking-wide ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
                {tx("Recently Completed")}
              </p>
              <p className={`mt-1 text-2xl font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
                {metrics.recentlyCompleted.length}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className={`rounded-[1.6rem] border p-4 transition ${darkMode ? "border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 shadow-xl" : "border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm"}`}>
          <p className={`flex items-center gap-2 text-xs font-black uppercase tracking-wide ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
            <Clock3 className="h-4 w-4 text-rose-400" /> {tx("Current Module")}
          </p>
          <h3 className={`mt-1 text-lg font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx(metrics.currentModule.title)}</h3>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{metrics.currentModule.completion}% {tx("complete")}</p>
        </article>

        <article className={`rounded-[1.6rem] border p-4 transition ${darkMode ? "border-slate-800 bg-gradient-to-br from-slate-900 to-cyan-950/40 shadow-xl" : "border-slate-200 bg-gradient-to-br from-white to-cyan-50/50 shadow-sm"}`}>
          <p className={`flex items-center gap-2 text-xs font-black uppercase tracking-wide ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
            <BarChart3 className="h-4 w-4 text-cyan-400" /> {tx("Overall Progress")}
          </p>
          <h3 className={`mt-1 text-lg font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{metrics.overallProgress}%</h3>
          <ProgressBar className="mt-2" value={metrics.overallProgress} trackClassName={darkMode ? "bg-slate-800" : ""} />
        </article>

        <article className={`rounded-[1.6rem] border p-4 transition ${darkMode ? "border-slate-800 bg-gradient-to-br from-slate-900 to-indigo-950/30 shadow-xl" : "border-slate-200 bg-gradient-to-br from-white to-indigo-50/40 shadow-sm"}`}>
          <p className={`flex items-center gap-2 text-xs font-black uppercase tracking-wide ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
            <GraduationCap className="h-4 w-4 text-indigo-400" /> {tx("Next Lesson")}
          </p>
          <h3 className={`mt-1 text-sm font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx(metrics.nextLesson.lessonTitle)}</h3>
          <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{tx(metrics.nextLesson.moduleTitle)}</p>
          {metrics.nextLesson.lessonId && (
            <button
              type="button"
              className={`mt-2 rounded-lg px-3 py-1.5 text-xs font-bold text-white transition ${darkMode ? "bg-indigo-600 hover:bg-indigo-500" : "bg-indigo-700 hover:bg-indigo-600"}`}
              onClick={() =>
                onOpenLesson(metrics.nextLesson.moduleId, metrics.nextLesson.lessonId)
              }
            >
              {tx("Resume")}
            </button>
          )}
        </article>

        <article className={`rounded-[1.6rem] border p-4 transition ${darkMode ? "border-slate-800 bg-gradient-to-br from-slate-900 to-emerald-950/30 shadow-xl" : "border-slate-200 bg-gradient-to-br from-white to-emerald-50/40 shadow-sm"}`}>
          <p className={`flex items-center gap-2 text-xs font-black uppercase tracking-wide ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
            <BookMarked className="h-4 w-4 text-emerald-400" /> {tx("Recently Completed")}
          </p>
          <h3 className={`mt-1 text-lg font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{metrics.recentlyCompleted.length}</h3>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{tx("Lessons tracked in profile")}</p>
        </article>
      </section>

      <section className={`rounded-[1.8rem] border p-5 ${darkMode ? "border-slate-800 bg-slate-900 shadow-xl" : "border-slate-200 bg-white shadow-sm"}`}>
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

      <section className={`rounded-[1.8rem] border p-5 ${darkMode ? "border-slate-800 bg-slate-900 shadow-xl" : "border-slate-200 bg-white shadow-sm"}`}>
        <h2 className={`mb-4 text-xl font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx("Recently Completed Lessons")}</h2>
        {!metrics.recentlyCompleted.length ? (
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{tx("No lessons completed yet. Start with Prenatal Module 1.")}</p>
        ) : (
          <ul className="space-y-3">
            {metrics.recentlyCompleted.slice(0, 6).map((item) => (
              <li
                key={`${item.moduleId}-${item.lessonId}-${item.completedAt}`}
                className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-3 py-2 ${darkMode ? "border-slate-800 bg-slate-800/70" : "border-slate-100 bg-slate-50"}`}
              >
                <div>
                  <p className={`text-sm font-bold ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx(item.lessonTitle)}</p>
                  <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{tx(item.moduleTitle)}</p>
                </div>
                <button
                  type="button"
                  className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${darkMode ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"}`}
                  onClick={() => onOpenLesson(item.moduleId, item.lessonId)}
                >
                  {tx("Review")}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={`rounded-[1.8rem] border p-5 ${darkMode ? "border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 shadow-xl" : "border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm"}`}>
        <h2 className={`mb-2 text-lg font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx("Training Approach")}</h2>
        <p className={`text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          {tx("This dashboard is built as structured training: lesson content, scenario practice, immediate quiz feedback, and measurable progression through Prenatal, Labor and Delivery, and Postpartum Recovery modules.")}
        </p>
      </section>
    </div>
  );
}
