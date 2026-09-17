import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  ChevronDown,
  ExternalLink,
  HeartHandshake,
  MapPinned,
} from "lucide-react";
import {
  maternalHealthGroups,
  maternalHealthSources,
} from "../data/maternalHealthData";
import { evidenceResourcePaths } from "../data/evidenceResourcePaths";
import { getResourceSection } from "../data/resourcesDashboard";
import FacilitatorPacks from "../components/FacilitatorPacks";

const groupOptions = [
  {
    id: "partner",
    routeId: "your-impact",
    label: "Your impact",
    title: "What equipped fathers and support people can change",
    description:
      "These studies show where prepared, continuous support can help. Results vary by family and care setting.",
    Icon: HeartHandshake,
  },
  {
    id: "national",
    routeId: "united-states",
    label: "United States",
    title: "National access, outcomes, and disparities",
    description: "",
    Icon: BarChart3,
  },
  {
    id: "indiana",
    routeId: "indiana",
    label: "Indiana",
    title: "What Hoosier families should know",
    description:
      "Indiana's latest review findings and March of Dimes indicators, with reporting periods shown on every item.",
    Icon: MapPinned,
  },
];

const toneClasses = { cyan: {
  border: "border-slate-200 dark:border-slate-700",
  accent: "text-slate-500 dark:text-slate-400",
  panel: "border-cyan-200 bg-cyan-50/50 text-slate-800 dark:border-cyan-400/20 dark:bg-cyan-400/5 dark:text-slate-200",
} };

const groupForHighlight = (highlightId) =>
  Object.entries(maternalHealthGroups).find(([, highlights]) =>
    highlights.some((highlight) => highlight.id === highlightId)
  )?.[0] || "national";

const groupForRoute = (routeSectionId) =>
  groupOptions.find((option) => option.routeId === routeSectionId)?.id || "";

function MaternalDataMap({ activeGroup, onSelectGroup, translateText }) {
  const tx = (value) => translateText(value);
  const activeIndex = Math.max(0, groupOptions.findIndex((option) => option.id === activeGroup));
  const activeOption = groupOptions[activeIndex];

  const mapButtons = groupOptions.map(({ id, label, Icon }, index) => {
    const active = activeGroup === id;
    return (
      <button
        key={id}
        type="button"
        onClick={() => onSelectGroup(id)}
        aria-current={active ? "step" : undefined}
        className={`flex min-h-12 min-w-0 items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm font-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 ${
          active
            ? "border-cyan-300 bg-cyan-50 text-cyan-950 ring-1 ring-cyan-200 dark:border-cyan-400/60 dark:bg-cyan-400/10 dark:text-cyan-100 dark:ring-cyan-400/20"
            : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
        }`}
      >
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
          active
            ? "border-cyan-400 bg-cyan-400 text-slate-950"
            : "border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-400"
        }`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1 leading-snug">{tx(label)}</span>
        <span className="text-xs font-black tabular-nums text-slate-400 dark:text-slate-500" aria-hidden="true">
          {index + 1}
        </span>
      </button>
    );
  });

  return (
    <>
      <details className="group rounded-2xl border border-slate-200 bg-white lg:hidden dark:border-slate-700 dark:bg-slate-800">
        <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 rounded-2xl px-4 py-3 font-black text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:text-slate-100">
          <BookOpen className="h-5 w-5 shrink-0 text-cyan-500 dark:text-cyan-300" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            {tx("Guide Map")} · {tx(activeOption.label)} · {activeIndex + 1}/{groupOptions.length}
          </span>
          <ChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
        </summary>
        <nav aria-label={tx("Guide Map")} className="space-y-2 border-t border-slate-200 p-3 dark:border-slate-700">
          {mapButtons}
        </nav>
      </details>

      <nav
        aria-label={tx("Guide Map")}
        className="hidden grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-white p-2 lg:grid dark:border-slate-700 dark:bg-slate-800"
      >
        {mapButtons}
      </nav>
    </>
  );
}

function DataHighlight({ highlight, expanded, onToggle, translateText }) {
  const tx = (value) => translateText(value);
  const tone = toneClasses[highlight.tone] || toneClasses.cyan;
  const panelId = `maternal-data-panel-${highlight.id}`;
  const resourceSection = getResourceSection(evidenceResourcePaths[highlight.id]);

  return (
    <article
      id={`maternal-highlight-${highlight.id}`}
      className={`scroll-mt-28 self-start overflow-hidden rounded-[1.35rem] border bg-white dark:bg-slate-800 ${expanded ? "lg:col-span-3" : ""} ${tone.border}`}
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
              {tx(highlight.value)}
            </span>
            <span className="mt-1 block text-xs font-bold leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
              {tx(highlight.unit)}
            </span>
          </span>

        </span>
        <span className="mt-3 block text-sm font-black leading-snug text-slate-950 sm:text-base dark:text-white">
          {tx(highlight.title)}
        </span>
        <span className="mt-2 block text-xs font-bold text-slate-600 dark:text-slate-300">{tx(expanded ? "Hide details" : "View details")}</span>
      </button>
      <div className="px-4 pb-3 sm:px-5">
            <a href={`/partner-dashboard/resources/${resourceSection.id}`} onClick={() => {
              const returnUrl = new URL(window.location.href);
              returnUrl.searchParams.set("highlight", highlight.id);
              window.history.replaceState(window.history.state, "", returnUrl);
            }} className="inline-flex min-h-11 items-center gap-2 rounded-lg text-xs font-bold text-cyan-800 underline underline-offset-4 dark:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
              {tx("Find help")}: {tx(resourceSection.label)} <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </a>

      </div>

      {expanded && (
        <div id={panelId} className="border-t border-slate-200 px-4 pb-4 pt-3 sm:px-5 sm:pb-5 dark:border-slate-700">
          <h4 className="text-sm font-black text-slate-900 dark:text-white">{tx("What it means")}</h4>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-slate-600 dark:text-slate-300">
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
          <details className="mt-3 rounded-xl border border-slate-200 px-3 dark:border-slate-600">
            <summary className="min-h-11 cursor-pointer py-3 text-sm font-bold text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500 dark:text-slate-200">{tx("Source details")}</summary>
          <a
            href={highlight.source.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex min-h-11 items-center gap-2 text-xs font-bold text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-cyan-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:text-slate-300 dark:hover:text-cyan-200"
          >
            {tx(highlight.source.label)}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          </details>
        </div>
      )}
    </article>
  );
}

export default function MaternalDataPage({
  initialHighlightId = "",
  routeSectionId = "",
  onNavigateSection = () => {},
  translateText = (value) => value,
}) {
  const tx = (value) => translateText(value);
  const initialGroup = groupForRoute(routeSectionId) || groupForHighlight(initialHighlightId);
  const [activeGroup, setActiveGroup] = useState(initialGroup);
  const [expandedIds, setExpandedIds] = useState(() => {
    if (initialHighlightId) return [initialHighlightId];
    return [];
  });
  const [showMore, setShowMore] = useState(Boolean(initialHighlightId));
  const currentOption = groupOptions.find((option) => option.id === activeGroup) || groupOptions[1];
  const highlights = useMemo(() => {
    const first = activeGroup === "national"
      ? ["national-overview", "national-racial-disparity", "national-postpartum-depression"]
      : activeGroup === "indiana"
        ? ["indiana-overview", "indiana-racial-disparity", "indiana-prenatal-care"] : [];
    const all = maternalHealthGroups[activeGroup] || [];
    return [...first.map(id => all.find(item => item.id === id)).filter(Boolean), ...all.filter(item => !first.includes(item.id))];
  }, [activeGroup]);
  const allExpanded = highlights.length > 0 && highlights.every((highlight) => expandedIds.includes(highlight.id));

  useEffect(() => {
    const routedGroup = groupForRoute(routeSectionId);
    if (!routedGroup || routedGroup === activeGroup) return;
    setActiveGroup(routedGroup);
    setExpandedIds(initialHighlightId ? [initialHighlightId] : []);
    setShowMore(Boolean(initialHighlightId));
  }, [activeGroup, routeSectionId, initialHighlightId]);

  useEffect(() => {
    if (!initialHighlightId) return;
    const frame = window.requestAnimationFrame(() => {
      setShowMore(true);
      setExpandedIds([initialHighlightId]);
      document.getElementById(`maternal-highlight-${initialHighlightId}`)?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "center",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [initialHighlightId]);

  const selectGroup = (groupId) => {
    if (groupId === activeGroup) return;
    const option = groupOptions.find(({ id }) => id === groupId);
    if (!option) return;
    setActiveGroup(groupId);
    setExpandedIds([]);
    setShowMore(false);
    onNavigateSection(option.routeId);
  };

  const activeIndex = Math.max(0, groupOptions.findIndex((option) => option.id === activeGroup));
  const previousOption = groupOptions[activeIndex - 1];
  const nextOption = groupOptions[activeIndex + 1];

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="space-y-4">
        <div className="grid gap-3 lg:grid-cols-1 lg:items-start">
          <div className="min-w-0">
            <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl dark:text-white">
              {tx("Understand the data. Know how to help.")}
            </h2>
            <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
              {tx("Plain-language national and Indiana maternal health evidence, with a practical role for fathers and support people beside every finding.")}
            </p>
          </div>
        </div>

        <div className="mt-4 border-t border-slate-200/80 pt-4 dark:border-slate-700">
          <MaternalDataMap
            activeGroup={activeGroup}
            onSelectGroup={selectGroup}
            translateText={translateText}
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="min-w-0">
                <h3 id="maternal-data-group-heading" className="text-lg font-black tracking-tight text-slate-950 sm:text-2xl dark:text-white">
                  {tx(currentOption.title)}
                </h3>
                {currentOption.description && <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {tx(currentOption.description)}
                </p>}
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setShowMore(true); setExpandedIds(allExpanded ? [] : highlights.map((highlight) => highlight.id)); }}
              className="min-h-11 shrink-0 self-start rounded-xl border border-cyan-300 bg-cyan-50 px-4 text-xs font-black text-cyan-900 transition-colors hover:bg-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-100 dark:hover:bg-cyan-400/15"
            >
              {tx(allExpanded ? "Collapse all" : "Expand all")}
            </button>
          </div>
        </div>
      </section>

      <section aria-labelledby="maternal-data-group-heading">
        <div className="grid items-start gap-3 lg:grid-cols-3">
          {(showMore ? highlights : highlights.slice(0, 3)).map((highlight) => (
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
        {highlights.length > 3 && <button type="button" aria-expanded={showMore} onClick={() => {setShowMore(!showMore); if(showMore) setExpandedIds([]);}} className="mt-3 min-h-11 rounded-lg px-3 text-sm font-bold text-cyan-800 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500 dark:text-cyan-200">{tx(showMore ? "Show less" : "More evidence")} ({highlights.length - 3})</button>}
      </section>

      <FacilitatorPacks translateText={translateText} />

      <nav aria-label={tx("Guide Map")} className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
        <button
          type="button"
          disabled={!previousOption}
          onClick={() => previousOption && selectGroup(previousOption.id)}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 px-3 text-sm font-black text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {tx("Previous")}
        </button>
        <button
          type="button"
          disabled={!nextOption}
          onClick={() => nextOption && selectGroup(nextOption.id)}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-800 dark:bg-cyan-300 dark:text-slate-950 px-3 text-sm font-black text-white transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {tx("Next")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </nav>

      <details className="group rounded-2xl border border-slate-200 bg-slate-50 text-sm leading-relaxed text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
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
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 text-xs font-black text-slate-700 hover:border-cyan-300 hover:text-cyan-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-cyan-400/40 dark:hover:text-cyan-200"
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
