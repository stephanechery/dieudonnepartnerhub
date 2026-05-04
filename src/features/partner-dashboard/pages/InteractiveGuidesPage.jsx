import React, { Suspense, lazy, useMemo } from "react";
import { ArrowLeft, ArrowRight, BookOpenCheck, Library } from "lucide-react";
import {
  getPartnerInteractiveGuide,
  partnerInteractiveGuides,
} from "../data/interactiveGuides";

const guideComponents = {
  "partner-trimester-guide": lazy(() =>
    import("../interactive-guides/PartnerTrimesterGuide")
  ),
  "partner-labor-guide": lazy(() =>
    import("../interactive-guides/PartnerLaborGuide")
  ),
  "partner-postpartum-guide": lazy(() =>
    import("../interactive-guides/PartnerPostpartumGuide")
  ),
  "partner-communication-guide": lazy(() =>
    import("../interactive-guides/PartnerCommunicationGuide")
  ),
  "partner-mentalhealth-guide": lazy(() =>
    import("../interactive-guides/PartnerMentalHealthGuide")
  ),
};

const accentClasses = {
  amber: {
    badge: "text-amber-300 border-amber-400/30 bg-amber-400/10",
    icon: "bg-amber-400/15 text-amber-300 border-amber-300/25",
    button: "from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400",
  },
  cyan: {
    badge: "text-cyan-300 border-cyan-400/30 bg-cyan-400/10",
    icon: "bg-cyan-400/15 text-cyan-300 border-cyan-300/25",
    button: "from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400",
  },
  emerald: {
    badge: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10",
    icon: "bg-emerald-400/15 text-emerald-300 border-emerald-300/25",
    button:
      "from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400",
  },
  rose: {
    badge: "text-rose-300 border-rose-400/30 bg-rose-400/10",
    icon: "bg-rose-400/15 text-rose-300 border-rose-300/25",
    button: "from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400",
  },
  violet: {
    badge: "text-violet-300 border-violet-400/30 bg-violet-400/10",
    icon: "bg-violet-400/15 text-violet-300 border-violet-300/25",
    button:
      "from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400",
  },
};

function GuideCard({ guide, onOpen, translateText }) {
  const tx = translateText;
  const Icon = guide.Icon;
  const accent = accentClasses[guide.accent] || accentClasses.cyan;

  return (
    <article className="group flex h-full flex-col rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-black/10 transition hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className={`rounded-2xl border p-3 ${accent.icon}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] ${accent.badge}`}
        >
          {tx(guide.phase)}
        </span>
      </div>
      <h3 className="mt-5 text-xl font-black leading-tight text-slate-50">
        {tx(guide.title)}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
        {tx(guide.summary)}
      </p>
      <button
        type="button"
        onClick={() => onOpen(guide.id)}
        className={`mt-5 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-4 py-2 text-sm font-black text-white shadow-lg shadow-black/20 transition ${accent.button}`}
      >
        {tx("Open Guide")} <ArrowRight className="h-4 w-4" />
      </button>
    </article>
  );
}

export default function InteractiveGuidesPage({
  guideId,
  onBack,
  onBackToDashboard,
  onOpenGuide,
  darkMode = false,
  translateText = (value) => value,
}) {
  const tx = translateText;
  const selectedGuide = useMemo(() => getPartnerInteractiveGuide(guideId), [guideId]);
  const SelectedGuideComponent = selectedGuide
    ? guideComponents[selectedGuide.id]
    : null;

  if (guideId && !selectedGuide) {
    return (
      <section
        className={`rounded-[1.8rem] border p-5 ${
          darkMode
            ? "border-rose-900/50 bg-rose-950/30 text-rose-200"
            : "border-rose-200 bg-rose-50 text-rose-700"
        }`}
      >
        <p className="font-black">{tx("Guide not found.")}</p>
        <button
          type="button"
          className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-black text-white"
          onClick={onBack}
        >
          {tx("Back to Guide Library")}
        </button>
      </section>
    );
  }

  if (selectedGuide && SelectedGuideComponent) {
    return (
      <div className="space-y-4">
        <section className="rounded-[1.5rem] border border-slate-800 bg-slate-950 p-4 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                {tx(selectedGuide.phase)}
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-50">
                {tx(selectedGuide.title)}
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-400">
                {tx(selectedGuide.summary)}
              </p>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-black text-slate-200 transition hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" /> {tx("Back to Guide Library")}
            </button>
          </div>
        </section>

        <div className="overflow-hidden rounded-[1.5rem] border border-slate-800 bg-slate-950 shadow-2xl shadow-black/30">
          <Suspense
            fallback={
              <div className="flex min-h-[420px] items-center justify-center bg-slate-950 text-sm font-bold text-slate-400">
                {tx("Loading interactive guide...")}
              </div>
            }
          >
            <SelectedGuideComponent />
          </Suspense>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-20 sm:pb-0">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 p-5 shadow-2xl shadow-black/20 sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-12 h-48 w-48 rounded-full bg-fuchsia-400/10 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
              <Library className="h-4 w-4" /> {tx("Interactive Guide Library")}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              {tx("Practice core support skills with focused visual guides.")}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              {tx(
                "Use these companion guides alongside the course lessons for deeper practice in pregnancy, labor, postpartum recovery, communication, and mental health support."
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onBackToDashboard}
            className="flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm font-black text-slate-100 transition hover:border-cyan-400/60 hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" /> {tx("Back to Dashboard")}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {partnerInteractiveGuides.map((guide) => (
          <GuideCard
            key={guide.id}
            guide={guide}
            onOpen={onOpenGuide}
            translateText={tx}
          />
        ))}
      </section>

      <section
        className={`rounded-[1.5rem] border p-5 ${
          darkMode
            ? "border-slate-800 bg-slate-900 text-slate-300"
            : "border-slate-200 bg-white text-slate-700"
        }`}
      >
        <p className="flex items-center gap-2 text-sm font-black">
          <BookOpenCheck className="h-4 w-4 text-cyan-400" />
          {tx("How to use these guides")}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {tx(
            "Open one guide before or after a related lesson. The guides are for practice and orientation, while lesson completion and quiz progress stay inside the course modules."
          )}
        </p>
      </section>
    </div>
  );
}
