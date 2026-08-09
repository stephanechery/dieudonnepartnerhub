import React, { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Baby,
  CalendarDays,
  CheckCircle2,
  Eye,
  Heart,
  Home,
  MessageCircle,
  Milk,
  Quote,
  RefreshCcw,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import {
  getTodaySupportContext,
  getTodaySupportPlan,
  selectTodaySupportPlan,
  todaySupportContexts,
} from "../data/todaySupport";

const contextIcons = {
  activity: Activity,
  baby: Baby,
  calendar: CalendarDays,
  heart: Heart,
  home: Home,
  message: MessageCircle,
  milk: Milk,
  shield: ShieldAlert,
};

const isSameLocalDay = (first, second = new Date()) => {
  const parsed = new Date(first);
  return !Number.isNaN(parsed.getTime()) && parsed.toDateString() === second.toDateString();
};

export default function TodaySupportCard({
  profile,
  onSelectContext = () => Promise.resolve(),
  onMarkDone = () => Promise.resolve(),
  onOpenResource = () => {},
  darkMode = false,
  translateText = (value) => value,
}) {
  const tx = (value) => translateText(value);
  const storedPlan = getTodaySupportPlan(profile?.todaySupport?.currentPlanId);
  const [previewPlan, setPreviewPlan] = useState(null);
  const [showPicker, setShowPicker] = useState(!storedPlan);
  const [pendingAction, setPendingAction] = useState("");
  const [error, setError] = useState("");
  const plan = previewPlan || storedPlan;
  const selectedContext = plan ? getTodaySupportContext(plan.context) : null;
  const completedToday = useMemo(
    () =>
      Boolean(plan) &&
      (profile?.todaySupport?.recentCompletions || []).some(
        (completion) =>
          completion.planId === plan.id && isSameLocalDay(completion.completedAt)
      ),
    [plan, profile?.todaySupport?.recentCompletions]
  );

  const chooseContext = async (contextId) => {
    const nextPlan = selectTodaySupportPlan(contextId, profile);
    setPendingAction(contextId);
    setError("");
    try {
      await onSelectContext(contextId);
      setPreviewPlan(nextPlan);
      setShowPicker(false);
    } catch {
      setError(tx("We could not save that choice. Please try again."));
    } finally {
      setPendingAction("");
    }
  };

  const markDone = async () => {
    setPendingAction("done");
    setError("");
    try {
      await onMarkDone();
    } catch {
      setError(tx("We could not save that update. Please try again."));
    } finally {
      setPendingAction("");
    }
  };

  const cardTone = darkMode
    ? "border-cyan-400/20 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/45 shadow-xl"
    : "border-cyan-200 bg-gradient-to-br from-white via-cyan-50/70 to-indigo-50 shadow-sm";
  const surfaceTone = darkMode
    ? "border-white/10 bg-white/[0.045]"
    : "border-slate-200 bg-white/90";

  return (
    <section className={`overflow-hidden rounded-[1.8rem] border p-4 sm:p-5 md:p-6 ${cardTone}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className={`flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
            <Sparkles className="h-4 w-4" aria-hidden="true" /> {tx("Today")}
          </p>
          <h2 className={`mt-2 text-2xl font-black tracking-tight sm:text-3xl ${darkMode ? "text-white" : "text-slate-950"}`}>
            {tx(showPicker || !plan ? "What kind of support is needed today?" : plan.title)}
          </h2>
          <p className={`mt-2 max-w-3xl text-sm leading-relaxed sm:text-base ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
            {tx(
              showPicker || !plan
                ? "Choose the closest situation. We will give you one useful action for right now."
                : `A focused plan for ${selectedContext.label.toLowerCase()}.`
            )}
          </p>
        </div>

        {plan && !showPicker && (
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${
              darkMode
                ? "border-cyan-300/25 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/15 focus-visible:ring-offset-slate-900"
                : "border-cyan-200 bg-white text-cyan-800 hover:bg-cyan-50 focus-visible:ring-offset-white"
            }`}
          >
            <RefreshCcw className="h-4 w-4" aria-hidden="true" />
            {tx("Change context")}
          </button>
        )}
      </div>

      {showPicker || !plan ? (
        <div className="mt-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {todaySupportContexts.map((context) => {
              const Icon = contextIcons[context.icon] || Heart;
              const isPending = pendingAction === context.id;
              return (
                <button
                  key={context.id}
                  type="button"
                  disabled={Boolean(pendingAction)}
                  onClick={() => chooseContext(context.id)}
                  className={`group min-h-[8.25rem] rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70 ${
                    darkMode
                      ? "border-white/10 bg-white/[0.045] text-white hover:border-cyan-300/40 hover:bg-cyan-300/10 focus-visible:ring-offset-slate-900"
                      : "border-slate-200 bg-white/90 text-slate-950 hover:border-cyan-300 hover:bg-cyan-50 focus-visible:ring-offset-white"
                  } ${context.id === "urgent" ? darkMode ? "border-rose-400/30" : "border-rose-200" : ""}`}
                >
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    context.id === "urgent"
                      ? darkMode ? "bg-rose-400/15 text-rose-200" : "bg-rose-50 text-rose-700"
                      : darkMode ? "bg-cyan-300/10 text-cyan-200" : "bg-cyan-50 text-cyan-700"
                  }`}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="mt-3 block text-sm font-black">{tx(context.label)}</span>
                  <span className={`mt-1 block text-xs leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                    {isPending ? tx("Building your plan...") : tx(context.helper)}
                  </span>
                </button>
              );
            })}
          </div>
          <p className={`mt-4 text-xs font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            {tx("No private notes or symptom details are collected.")}
          </p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-4">
          <article className={`rounded-2xl border p-4 lg:col-span-2 ${surfaceTone}`}>
            <p className={`text-[11px] font-black uppercase tracking-[0.16em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
              {tx("Action for right now")}
            </p>
            <p className={`mt-2 text-base font-bold leading-relaxed ${darkMode ? "text-white" : "text-slate-950"}`}>
              {tx(plan.action)}
            </p>
          </article>

          <article className={`rounded-2xl border p-4 ${plan.urgent ? darkMode ? "border-rose-400/35 bg-rose-400/10" : "border-rose-200 bg-rose-50" : surfaceTone}`}>
            <p className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] ${plan.urgent ? darkMode ? "text-rose-200" : "text-rose-700" : darkMode ? "text-amber-200" : "text-amber-700"}`}>
              <Eye className="h-4 w-4" aria-hidden="true" /> {tx("Watch point")}
            </p>
            <p className={`mt-2 text-sm font-semibold leading-relaxed ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
              {tx(plan.watchPoint)}
            </p>
          </article>

          <article className={`rounded-2xl border p-4 ${surfaceTone}`}>
            <p className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] ${darkMode ? "text-violet-200" : "text-violet-700"}`}>
              <Quote className="h-4 w-4" aria-hidden="true" /> {tx("Say this")}
            </p>
            <p className={`mt-2 text-sm font-semibold leading-relaxed ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
              “{tx(plan.phrase)}”
            </p>
          </article>

          <div className="flex flex-col gap-3 lg:col-span-2 lg:flex-row">
            <button
              type="button"
              onClick={() => onOpenResource(plan)}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-700 to-teal-700 px-4 py-3 text-sm font-black text-white transition hover:from-cyan-800 hover:to-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
            >
              {tx(plan.resource.label)} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              disabled={pendingAction === "done" || completedToday}
              onClick={markDone}
              className={`inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-default ${
                darkMode
                  ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/15 disabled:opacity-75 focus-visible:ring-offset-slate-900"
                  : "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 disabled:opacity-75 focus-visible:ring-offset-white"
              }`}
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              {completedToday ? tx("Done today") : pendingAction === "done" ? tx("Saving...") : tx("Mark done")}
            </button>
          </div>

          <p className={`self-center text-xs font-semibold leading-relaxed lg:col-span-2 ${plan.urgent ? darkMode ? "text-rose-200" : "text-rose-700" : darkMode ? "text-slate-400" : "text-slate-500"}`}>
            {tx(plan.urgent ? "This guide does not replace emergency or medical care." : "Use this as a practical starting point and contact the care team when you are unsure.")}
          </p>
        </div>
      )}

      <p className={`mt-3 min-h-5 text-sm font-bold ${darkMode ? "text-rose-200" : "text-rose-700"}`} role="status" aria-live="polite">
        {error}
      </p>
    </section>
  );
}
