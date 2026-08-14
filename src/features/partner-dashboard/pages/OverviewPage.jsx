import React from "react";
import { ArrowRight, ExternalLink, GraduationCap, HeartHandshake } from "lucide-react";
import PartnerPlatformDiscovery from "../components/PartnerPlatformDiscovery";
import ProgressBar from "../components/ProgressBar";
import TodaySupportCard from "../components/TodaySupportCard";

const DOULA_MATCH_URL = "https://dieudonnematch.org";

export default function OverviewPage({
  metrics,
  profile,
  curriculum,
  onOpenTraining = () => {},
  onOpenLesson,
  onOpenGuide,
  onOpenVideoHub,
  onSelectTodayContext = () => Promise.resolve(),
  onMarkTodayDone = () => Promise.resolve(),
  onOpenTodayResource = () => {},
  darkMode = false,
  translateText = (value) => value,
}) {
  const tx = (value) => translateText(value);
  const nextLesson = metrics.nextLesson;

  return (
    <div className="space-y-4 sm:space-y-5">
      <TodaySupportCard
        profile={profile}
        onSelectContext={onSelectTodayContext}
        onMarkDone={onMarkTodayDone}
        onOpenResource={onOpenTodayResource}
        darkMode={darkMode}
        translateText={translateText}
      />

      <section
        className={`rounded-[1.6rem] border p-4 shadow-sm sm:p-5 ${
          darkMode
            ? "border-slate-800 bg-gradient-to-br from-slate-900 to-cyan-950/25 shadow-xl"
            : "border-slate-200 bg-gradient-to-br from-white to-cyan-50/60"
        }`}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <p className={`flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
              <GraduationCap className="h-4 w-4" aria-hidden="true" /> {tx("Continue learning")}
            </p>
            <h2 className={`mt-2 text-lg font-black leading-tight sm:text-xl ${darkMode ? "text-white" : "text-slate-950"}`}>
              {tx(nextLesson.lessonTitle)}
            </h2>
            <p className={`mt-1 text-sm font-semibold ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              {tx(nextLesson.moduleTitle)}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <ProgressBar
                className="min-w-0 flex-1"
                value={metrics.currentModule.completion}
                trackClassName={darkMode ? "bg-slate-800" : ""}
              />
              <span className={`shrink-0 text-xs font-black tabular-nums ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                {metrics.currentModule.completion}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:w-auto">
            {nextLesson.lessonId && (
              <button
                type="button"
                onClick={() => onOpenLesson(nextLesson.moduleId, nextLesson.lessonId)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-700 to-teal-700 px-4 py-2 text-sm font-black text-white transition hover:from-cyan-800 hover:to-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
              >
                {tx("Resume")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={onOpenTraining}
              className={`inline-flex min-h-11 items-center justify-center rounded-xl border px-4 py-2 text-sm font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 ${
                darkMode
                  ? "border-slate-700 bg-slate-900 text-slate-100 hover:border-cyan-400/50 hover:text-cyan-200"
                  : "border-slate-300 bg-white text-slate-800 hover:border-cyan-300 hover:text-cyan-800"
              }`}
            >
              {tx("View Training")}
            </button>
          </div>
        </div>
      </section>

      <PartnerPlatformDiscovery
        curriculum={curriculum}
        onOpenLesson={onOpenLesson}
        onOpenGuide={onOpenGuide}
        onOpenVideoHub={onOpenVideoHub}
        translateText={translateText}
      />

      <section
        className={`rounded-[1.4rem] border p-4 ${
          darkMode
            ? "border-cyan-400/20 bg-cyan-400/[0.06]"
            : "border-cyan-200 bg-cyan-50/70"
        }`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className={`flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
              <HeartHandshake className="h-4 w-4" aria-hidden="true" /> {tx("Care-Team Support")}
            </p>
            <h2 className={`mt-1 text-base font-black ${darkMode ? "text-white" : "text-slate-950"}`}>
              {tx("Match mom with a doula")}
            </h2>
            <p className={`mt-1 text-xs leading-relaxed sm:text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              {tx("Connect with hands-on birth or recovery support when your family needs more help.")}
            </p>
          </div>
          <a
            href={DOULA_MATCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 ${
              darkMode
                ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/15"
                : "border-cyan-200 bg-white text-cyan-800 hover:bg-cyan-100"
            }`}
          >
            {tx("Match Mom with a Doula")} <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
}
