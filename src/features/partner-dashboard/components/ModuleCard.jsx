import React from "react";
import { ArrowRight, Lock } from "lucide-react";
import ProgressBar from "./ProgressBar";

export default function ModuleCard({ module, onOpen, darkMode = false, translateText = (value) => value }) {
  const tx = (value) => translateText(value);
  return (
    <article className={`relative overflow-hidden rounded-[1.5rem] border p-5 transition duration-200 ${
      module.unlocked
        ? darkMode
          ? "border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 shadow-xl hover:-translate-y-0.5 hover:border-cyan-700/50"
          : "border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
        : darkMode
          ? "border-slate-800 bg-slate-900/70 shadow-xl"
          : "border-slate-200 bg-slate-100 shadow-sm"
    }`}>
      <div className={`absolute left-0 top-0 h-1 w-full ${module.unlocked ? "bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400" : darkMode ? "bg-slate-800" : "bg-slate-200"}`} />
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className={`text-lg font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx(module.title)}</h3>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{tx(module.subtitle)}</p>
        </div>
        {!module.unlocked && (
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-bold uppercase ${
            darkMode ? "border-slate-700 bg-slate-800 text-slate-400" : "border-slate-300 bg-white text-slate-500"
          }`}>
            <Lock className="h-3 w-3" /> {tx("Locked")}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className={`flex items-center justify-between text-xs font-bold uppercase tracking-wide ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
          <span>{tx("Completion")}</span>
          <span>{module.completion}%</span>
        </div>
        <ProgressBar value={module.completion} trackClassName={darkMode ? "bg-slate-800" : ""} />
        <div className={`flex items-center justify-between text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          <span>
            {tx("Lessons")}: {module.completedLessons}/{module.totalLessons}
          </span>
          <span>{tx("Quiz Avg")}: {module.quizAverage}%</span>
        </div>
      </div>

      <button
        type="button"
        className={`mt-4 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${
          darkMode
            ? "bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400"
            : "bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-700"
        }`}
        disabled={!module.unlocked}
        onClick={onOpen}
      >
        {tx("Open Module")} <ArrowRight className="h-4 w-4" />
      </button>
    </article>
  );
}
