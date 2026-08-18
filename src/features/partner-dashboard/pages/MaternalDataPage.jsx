import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  ChevronDown,
  ExternalLink,
  HeartHandshake,
  MapPinned,
  ShieldCheck,
} from "lucide-react";
import {
  maternalHealthGroups,
  maternalHealthSources,
} from "../data/maternalHealthData";

const groupOptions = [
  {
    id: "partner",
    label: "Your impact",
    title: "What equipped fathers and support people can change",
    description:
      "These studies show where prepared, continuous support can help. Results vary by family and care setting.",
    Icon: HeartHandshake,
  },
  {
    id: "national",
    label: "United States",
    title: "National access, outcomes, and disparities",
    description:
      "The latest final national mortality data and the latest official March of Dimes maternity care access report.",
    Icon: BarChart3,
  },
  {
    id: "indiana",
    label: "Indiana",
    title: "What Hoosier families should know",
    description:
      "Indiana's latest review findings and March of Dimes indicators, with reporting periods shown on every item.",
    Icon: MapPinned,
  },
];

const toneClasses = {
  cyan: {
    border: "border-cyan-200 dark:border-cyan-400/25",
    accent: "text-cyan-700 dark:text-cyan-300",
    panel: "border-cyan-200 bg-cyan-50 text-cyan-950 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-50",
  },
  rose: {
    border: "border-rose-200 dark:border-rose-400/25",
    accent: "text-rose-700 dark:text-rose-300",
    panel: "border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-50",
  },
  amber: {
    border: "border-amber-200 dark:border-amber-400/25",
    accent: "text-amber-700 dark:text-amber-300",
    panel: "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-50",
  },
  indigo: {
    border: "border-indigo-200 dark:border-indigo-400/25",
    accent: "text-indigo-700 dark:text-indigo-300",
    panel: "border-indigo-200 bg-indigo-50 text-indigo-950 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-50",
  },
  emerald: {
    border: "border-emerald-200 dark:border-emerald-400/25",
    accent: "text-emerald-700 dark:text-emerald-300",
    panel: "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-50",
  },
};

const groupForHighlight = (highlightId) =>
  Object.entries(maternalHealthGroups).find(([, highlights]) =>
    highlights.some((highlight) => highlight.id === highlightId)
  )?.[0] || "national";

function DataHighlight({ highlight, expanded, onToggle, translateText }) {
  const tx = (value) => translateText(value);
  const tone = toneClasses[highlight.tone] || toneClasses.cyan;
  const panelId = `maternal-data-panel-${highlight.id}`;

  return (
    <article
      id={`maternal-highlight-${highlight.id}`}
      className={`scroll-mt-28 self-start overflow-hidden rounded-[1.35rem] border bg-white shadow-sm dark:bg-slate-900 ${expanded ? "lg:col-span-2" : ""} ${tone.border}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={panelId}
        className="block min-h-28 w-full p-4 text-left transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 sm:p-5 dark:hover:bg-white/[0.03]"
      >
        <span className="flex items-start justify-between gap-3">
          <span className={`text-[10px] font-black uppercase leading-relaxed tracking-[0.15em] sm:text-[11px] ${tone.accent}`}>
            {tx(highlight.scope)}
          </span>
          <ChevronDown
            className={`mt-0.5 h-5 w-5 shrink-0 text-slate-500 transition-transform ${expanded ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </span>
        <span className="mt-3 flex items-end justify-between gap-4">
          <span className="min-w-0">
            <span className="block text-2xl font-black tracking-tight text-slate-950 sm:text-3xl dark:text-white">
              {highlight.value}
            </span>
            <span className="mt-1 block text-xs font-bold leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
              {tx(highlight.unit)}
            </span>
          </span>
          {highlight.priority && (
            <span className={`hidden shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide sm:inline-flex ${tone.panel}`}>
              {tx("Key finding")}
            </span>
          )}
        </span>
        <span className="mt-3 block text-sm font-black leading-snug text-slate-950 sm:text-base dark:text-white">
          {tx(highlight.title)}
        </span>
      </button>

      {expanded && (
        <div id={panelId} className="border-t border-slate-200 px-4 pb-4 pt-3 sm:px-5 sm:pb-5 dark:border-slate-700">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {tx(highlight.detail)}
          </p>
          <div className={`mt-3 rounded-xl border p-3.5 sm:p-4 ${tone.panel}`}>
            <p className="text-[10px] font-black uppercase tracking-[0.15em]">
              {tx("What you can do")}
            </p>
            <p className="mt-1.5 text-sm font-semibold leading-relaxed">
              {tx(highlight.supportAction)}
            </p>
          </div>
          <a
            href={highlight.source.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex min-h-11 items-center gap-2 text-xs font-bold text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-cyan-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:text-slate-300 dark:hover:text-cyan-200"
          >
            {tx(highlight.source.label)}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      )}
    </article>
  );
}

export default function MaternalDataPage({
  initialHighlightId = "",
  translateText = (value) => value,
}) {
  const tx = (value) => translateText(value);
  const [activeGroup, setActiveGroup] = useState(() => groupForHighlight(initialHighlightId));
  const [expandedIds, setExpandedIds] = useState(() =>
    initialHighlightId ? [initialHighlightId] : ["national-preventability"]
  );
  const currentOption = groupOptions.find((option) => option.id === activeGroup) || groupOptions[1];
  const highlights = useMemo(() => maternalHealthGroups[activeGroup] || [], [activeGroup]);
  const allExpanded = highlights.length > 0 && highlights.every((highlight) => expandedIds.includes(highlight.id));

  useEffect(() => {
    if (!initialHighlightId) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(`maternal-highlight-${initialHighlightId}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [initialHighlightId]);

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-white via-cyan-50/55 to-indigo-50/55 p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-cyan-950/35">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div className="min-w-0">
            <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl dark:text-white">
              {tx("Understand the data. Know how to help.")}
            </h2>
            <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
              {tx("Plain-language national and Indiana maternal health evidence, with a practical role for fathers and support people beside every finding.")}
            </p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-bold text-slate-600 lg:max-w-xs lg:justify-end lg:text-right dark:text-slate-300">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
              {tx("Official sources only")}
            </span>
            <span>{tx("Sources checked August 16, 2026")}</span>
          </div>
        </div>

        <div className="mt-4 border-t border-slate-200/80 pt-4 dark:border-slate-800">
          <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-3" role="group" aria-label={tx("Choose maternal data view")}>
            {groupOptions.map(({ id, label, Icon }) => {
              const active = activeGroup === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setActiveGroup(id);
                    const firstPriority = maternalHealthGroups[id]?.find((highlight) => highlight.priority)
                      || maternalHealthGroups[id]?.[0];
                    setExpandedIds(firstPriority ? [firstPriority.id] : []);
                  }}
                  aria-pressed={active}
                  className={`flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-black leading-tight transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 sm:min-h-12 sm:gap-2 sm:rounded-2xl sm:px-3 sm:text-sm ${
                    active
                      ? "border-slate-950 bg-slate-950 text-white dark:border-cyan-300 dark:bg-cyan-300 dark:text-slate-950"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-300 hover:text-cyan-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-400/40 dark:hover:text-cyan-200"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" /> {tx(label)}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 id="maternal-data-group-heading" className="text-lg font-black tracking-tight text-slate-950 sm:text-2xl dark:text-white">
                {tx(currentOption.title)}
              </h3>
              <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {tx(currentOption.description)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setExpandedIds(allExpanded ? [] : highlights.map((highlight) => highlight.id))}
              className="min-h-11 shrink-0 self-start rounded-xl border border-cyan-300 bg-cyan-50 px-4 text-xs font-black text-cyan-900 transition-colors hover:bg-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-100 dark:hover:bg-cyan-400/15"
            >
              {tx(allExpanded ? "Collapse all" : "Expand all")}
            </button>
          </div>
        </div>
      </section>

      <section aria-labelledby="maternal-data-group-heading">
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {highlights.map((highlight) => (
            <DataHighlight
              key={highlight.id}
              highlight={highlight}
              expanded={expandedIds.includes(highlight.id)}
              onToggle={() => setExpandedIds((current) =>
                current.includes(highlight.id)
                  ? current.filter((id) => id !== highlight.id)
                  : [...current, highlight.id]
              )}
              translateText={translateText}
            />
          ))}
        </div>
      </section>

      <details className="group rounded-2xl border border-slate-200 bg-slate-50 text-sm leading-relaxed text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-black text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:text-white">
          {tx("How to read and compare these numbers")}
          <ChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="space-y-3 border-t border-slate-200 px-4 pb-4 pt-3 dark:border-slate-700">
          <p>
            {tx("The latest official March of Dimes maternity care desert report is the 2024 report. It uses access data collected in different source years, mainly 2022 and 2023. We do not label it as a 2026 report.")}
          </p>
          <p>
            {tx("National maternal mortality counts deaths during pregnancy or within 42 days from causes related to or aggravated by pregnancy. Indiana pregnancy-associated data include deaths from any cause during pregnancy or within one year. These measures should not be compared directly.")}
          </p>
          <p className="font-semibold">
            {tx("Data describes populations, not an individual's risk. This platform does not diagnose. Contact the care team for concerning symptoms and call emergency services for immediate danger.")}
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href={maternalHealthSources.hearHer.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 text-xs font-black text-slate-700 hover:border-cyan-300 hover:text-cyan-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-cyan-400/40 dark:hover:text-cyan-200"
            >
              {tx("Open CDC warning signs and support guidance")}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </details>
    </div>
  );
}
