import React, { useEffect, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Globe2,
} from "lucide-react";

const languageOptions = [
  { code: "en", label: "EN · English" },
  { code: "es", label: "ES · Español" },
  { code: "fr", label: "FR · Français" },
  { code: "ht", label: "HT · Kreyòl" },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2";

function GuideMap({
  activeSection,
  completedSections,
  darkMode,
  sectionIds,
  sectionLabels,
  onSelectSection,
  translateText,
}) {
  const tx = translateText;

  return (
    <nav aria-label={tx("Guide Map")} className="space-y-2">
      {sectionLabels.map((label, index) => {
        const isCurrent = index === activeSection;
        const isComplete = completedSections.has(sectionIds[index]);
        return (
          <button
            key={sectionIds[index]}
            type="button"
            aria-current={isCurrent ? "step" : undefined}
            onClick={() => onSelectSection(index)}
            className={`flex min-h-12 w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm font-bold transition ${focusRing} ${
              isCurrent
                ? darkMode
                  ? "border-cyan-400/60 bg-cyan-400/10 text-cyan-100 ring-1 ring-cyan-400/20 focus-visible:ring-offset-slate-900"
                  : "border-cyan-300 bg-cyan-50 text-cyan-900 ring-1 ring-cyan-200 focus-visible:ring-offset-white"
                : darkMode
                  ? "border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-800 focus-visible:ring-offset-slate-900"
                  : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 focus-visible:ring-offset-white"
            }`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-black ${
                isComplete
                  ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-400"
                  : isCurrent
                    ? "border-cyan-400 bg-cyan-400 text-slate-950"
                    : darkMode
                      ? "border-slate-600 text-slate-400"
                      : "border-slate-300 text-slate-500"
              }`}
            >
              {isComplete ? <Check className="h-4 w-4" aria-hidden="true" /> : index + 1}
            </span>
            <span className="min-w-0 flex-1 leading-snug">{label}</span>
            <span className="sr-only">
              {isComplete ? tx("Completed") : isCurrent ? tx("Current section") : tx("Not started")}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default function GuideShell({
  guide,
  activeSection,
  sectionIds,
  sectionLabels,
  completedSections,
  completionPercent,
  onSelectSection,
  onToggleComplete,
  onReturnToGuides,
  darkMode,
  language = "en",
  onLanguageChange = () => {},
  translateText = (value) => value,
  children,
}) {
  const tx = translateText;
  const mobileMapRef = useRef(null);
  const isCurrentComplete = completedSections.has(sectionIds[activeSection]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [activeSection]);

  const selectFromMap = (index) => {
    onSelectSection(index);
    if (mobileMapRef.current) mobileMapRef.current.open = false;
  };

  return (
    <section className="space-y-4 pb-36 sm:pb-28 lg:pb-8">
      <header
        className={`rounded-[1.5rem] border p-4 shadow-sm sm:p-5 ${
          darkMode
            ? "border-slate-700 bg-gradient-to-br from-slate-800 via-slate-800 to-cyan-900/20"
            : "border-slate-200 bg-gradient-to-br from-white via-white to-cyan-50/60"
        }`}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className={`text-xs font-black uppercase tracking-[0.18em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
              {tx(guide.phase)}
            </p>
            <h2 className={`mt-1 text-2xl font-black tracking-tight sm:text-3xl ${darkMode ? "text-white" : "text-slate-950"}`}>
              {tx(guide.title)}
            </h2>
            <p className={`mt-1 max-w-3xl text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              {tx(guide.summary)}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
            <label className="relative" data-no-translate="true">
              <span className="sr-only">{tx("Select language")}</span>
              <Globe2 className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${darkMode ? "text-cyan-300" : "text-cyan-700"}`} aria-hidden="true" />
              <select
                aria-label={tx("Select language")}
                value={language}
                onChange={(event) => onLanguageChange(event.target.value)}
                className={`min-h-11 appearance-none rounded-xl border py-2 pl-9 pr-8 text-sm font-black ${focusRing} ${darkMode ? "border-slate-600 bg-slate-900 text-slate-100 focus-visible:ring-offset-slate-900" : "border-slate-300 bg-white text-slate-800 focus-visible:ring-offset-white"}`}
              >
                {languageOptions.map((option) => (
                  <option key={option.code} value={option.code}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className={`pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 ${darkMode ? "text-slate-400" : "text-slate-500"}`} aria-hidden="true" />
            </label>
            <div className={`text-sm font-bold ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              {tx("Section")} {activeSection + 1} {tx("of")} {sectionIds.length}
              <span aria-hidden="true"> · </span>
              <span className={darkMode ? "text-cyan-300" : "text-cyan-700"}>
                {tx("Guide progress")} {completionPercent}%
              </span>
            </div>
          </div>
        </div>
        <div
          className={`mt-4 h-2 overflow-hidden rounded-full ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}
          role="progressbar"
          aria-label={tx("Guide progress")}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={completionPercent}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 transition-[width] motion-reduce:transition-none"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </header>

      <details
        ref={mobileMapRef}
        className={`group rounded-2xl border lg:hidden ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}
      >
        <summary className={`flex min-h-12 cursor-pointer list-none items-center gap-3 rounded-2xl px-4 py-3 font-black ${focusRing} ${darkMode ? "text-slate-100 focus-visible:ring-offset-slate-900" : "text-slate-900 focus-visible:ring-offset-white"}`}>
          <BookOpen className="h-5 w-5 shrink-0 text-cyan-400" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate">
            {tx("Guide Map")} · {sectionLabels[activeSection]} · {activeSection + 1}/{sectionIds.length}
          </span>
          <ChevronDown className="h-5 w-5 shrink-0 transition group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
        </summary>
        <div className={`border-t p-3 ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
          <GuideMap
            activeSection={activeSection}
            completedSections={completedSections}
            darkMode={darkMode}
            sectionIds={sectionIds}
            sectionLabels={sectionLabels}
            onSelectSection={selectFromMap}
            translateText={translateText}
          />
        </div>
      </details>

      <div className="grid min-w-0 gap-4 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
        <aside className={`sticky top-4 hidden rounded-[1.5rem] border p-3 lg:block ${darkMode ? "border-slate-700 bg-slate-800/95" : "border-slate-200 bg-white"}`}>
          <div className="mb-3 flex items-center justify-between gap-3 px-2 pt-1">
            <h3 className={`font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx("Guide Map")}</h3>
            <span className={`text-xs font-bold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{completionPercent}%</span>
          </div>
          <GuideMap
            activeSection={activeSection}
            completedSections={completedSections}
            darkMode={darkMode}
            sectionIds={sectionIds}
            sectionLabels={sectionLabels}
            onSelectSection={onSelectSection}
            translateText={translateText}
          />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>

      <div className={`fixed inset-x-3 z-40 rounded-[1.35rem] border p-2 shadow-2xl backdrop-blur-xl sm:inset-x-4 lg:sticky lg:bottom-4 lg:inset-x-auto ${darkMode ? "bottom-[6.9rem] border-slate-700 bg-slate-900/95 shadow-black/40" : "bottom-[6.9rem] border-slate-200 bg-white/95 shadow-slate-900/15"}`}>
        <div className="grid grid-cols-3 gap-2 lg:grid-cols-[auto_auto_1fr_auto_auto_auto]">
          <button
            type="button"
            onClick={onReturnToGuides}
            className={`hidden min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-black lg:inline-flex ${focusRing} ${darkMode ? "border-slate-700 text-slate-200 hover:bg-slate-800 focus-visible:ring-offset-slate-900" : "border-slate-300 text-slate-700 hover:bg-slate-50 focus-visible:ring-offset-white"}`}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {tx("Return to Guides")}
          </button>
          <button
            type="button"
            onClick={onReturnToGuides}
            className={`hidden min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-black lg:inline-flex ${focusRing} ${darkMode ? "border-slate-700 text-slate-200 hover:bg-slate-800 focus-visible:ring-offset-slate-900" : "border-slate-300 text-slate-700 hover:bg-slate-50 focus-visible:ring-offset-white"}`}
          >
            <Bookmark className="h-4 w-4" aria-hidden="true" /> {tx("Save and exit")}
          </button>
          <span className="hidden lg:block" aria-hidden="true" />
          <button
            type="button"
            disabled={activeSection === 0}
            onClick={() => onSelectSection(activeSection - 1)}
            className={`inline-flex min-h-11 items-center justify-center gap-1 rounded-xl border px-2 text-xs font-black disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm ${focusRing} ${darkMode ? "border-slate-700 text-slate-200 hover:bg-slate-800 focus-visible:ring-offset-slate-900" : "border-slate-300 text-slate-700 hover:bg-slate-50 focus-visible:ring-offset-white"}`}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {tx("Previous")}
          </button>
          <button
            type="button"
            aria-pressed={isCurrentComplete}
            onClick={onToggleComplete}
            className={`inline-flex min-h-11 items-center justify-center gap-1 rounded-xl border px-2 text-xs font-black sm:text-sm ${focusRing} ${
              isCurrentComplete
                ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-500"
                : darkMode
                  ? "border-cyan-400/60 text-cyan-200 hover:bg-cyan-400/10 focus-visible:ring-offset-slate-900"
                  : "border-cyan-500 text-cyan-800 hover:bg-cyan-50 focus-visible:ring-offset-white"
            }`}
          >
            {isCurrentComplete ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <Check className="h-4 w-4" aria-hidden="true" />}
            <span>{isCurrentComplete ? tx("Completed") : tx("Mark complete")}</span>
          </button>
          <button
            type="button"
            disabled={activeSection === sectionIds.length - 1}
            onClick={() => onSelectSection(activeSection + 1)}
            className={`inline-flex min-h-11 items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-2 text-xs font-black text-white shadow-lg shadow-cyan-950/20 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm ${focusRing} ${darkMode ? "focus-visible:ring-offset-slate-900" : "focus-visible:ring-offset-white"}`}
          >
            {tx("Next")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-center gap-4 lg:hidden">
          <button type="button" onClick={onReturnToGuides} className={`min-h-11 text-xs font-black underline-offset-4 hover:underline ${focusRing} ${darkMode ? "text-slate-300 focus-visible:ring-offset-slate-900" : "text-slate-600 focus-visible:ring-offset-white"}`}>
            {tx("Save and exit")}
          </button>
          <span className={darkMode ? "text-slate-600" : "text-slate-300"} aria-hidden="true">|</span>
          <button type="button" onClick={onReturnToGuides} className={`min-h-11 text-xs font-black underline-offset-4 hover:underline ${focusRing} ${darkMode ? "text-slate-300 focus-visible:ring-offset-slate-900" : "text-slate-600 focus-visible:ring-offset-white"}`}>
            {tx("Return to Guides")}
          </button>
        </div>
      </div>
    </section>
  );
}
