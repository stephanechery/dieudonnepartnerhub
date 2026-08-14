import React, { useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  ChevronDown,
  ExternalLink,
  FileText,
  Search,
  ShieldAlert,
  Video,
  X,
} from "lucide-react";
import { maternalHealthHighlights } from "../data/maternalHealthData";
import {
  buildPartnerPlatformSearchIndex,
  localizePartnerPlatformSearchIndex,
  searchPartnerPlatform,
} from "../data/partnerPlatformSearch";

const filters = [
  { id: "all", label: "All" },
  { id: "safety", label: "Safety" },
  { id: "lesson", label: "Lessons" },
  { id: "guide", label: "Guides" },
  { id: "video", label: "Videos" },
  { id: "data", label: "Data" },
];

const kindMeta = {
  lesson: { label: "Lesson", Icon: BookOpen },
  guide: { label: "Guide", Icon: FileText },
  video: { label: "Video", Icon: Video },
  data: { label: "Data", Icon: BarChart3 },
};

const toneClasses = {
  cyan: {
    border: "border-cyan-200 dark:border-cyan-400/25",
    accent: "text-cyan-700 dark:text-cyan-300",
    action: "border-cyan-200 bg-cyan-50 text-cyan-950 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-50",
  },
  rose: {
    border: "border-rose-200 dark:border-rose-400/25",
    accent: "text-rose-700 dark:text-rose-300",
    action: "border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-50",
  },
  amber: {
    border: "border-amber-200 dark:border-amber-400/25",
    accent: "text-amber-700 dark:text-amber-300",
    action: "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-50",
  },
  indigo: {
    border: "border-indigo-200 dark:border-indigo-400/25",
    accent: "text-indigo-700 dark:text-indigo-300",
    action: "border-indigo-200 bg-indigo-50 text-indigo-950 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-50",
  },
  emerald: {
    border: "border-emerald-200 dark:border-emerald-400/25",
    accent: "text-emerald-700 dark:text-emerald-300",
    action: "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-50",
  },
};

function MaternalHealthCard({ highlight, translateText, idPrefix = "" }) {
  const tx = (value) => translateText(value);
  const tone = toneClasses[highlight.tone] || toneClasses.cyan;

  return (
    <article
      id={`${idPrefix}maternal-highlight-${highlight.id}`}
      className={`flex min-w-[84vw] snap-start scroll-mb-28 flex-col rounded-[1.25rem] border bg-white p-4 shadow-sm sm:min-w-[22rem] sm:rounded-[1.5rem] sm:p-5 md:min-w-0 dark:bg-slate-900 ${tone.border}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={`text-[11px] font-black uppercase tracking-[0.16em] ${tone.accent}`}>
          {tx(highlight.scope)}
        </p>
        {highlight.priority && (
          <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-rose-800 dark:border-rose-400/25 dark:bg-rose-400/10 dark:text-rose-200">
            {tx("Disparity")}
          </span>
        )}
      </div>
      <h3 className="mt-2.5 text-base font-black leading-tight text-slate-950 sm:mt-3 sm:text-lg dark:text-white">
        {tx(highlight.title)}
      </h3>
      <p className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:mt-4 sm:text-4xl dark:text-white">
        {highlight.value}
      </p>
      <p className="mt-1 text-[13px] font-bold leading-relaxed text-slate-700 sm:text-sm dark:text-slate-200">
        {tx(highlight.unit)}
      </p>
      <p className="mt-2.5 text-[13px] leading-relaxed text-slate-600 sm:mt-3 sm:text-sm dark:text-slate-300">
        {tx(highlight.detail)}
      </p>
      <div className={`mt-3 border-t pt-3 sm:mt-4 sm:rounded-2xl sm:border sm:p-4 ${tone.action}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.15em]">
          {tx("What this means for support")}
        </p>
        <p className="mt-1.5 text-[13px] font-semibold leading-relaxed sm:mt-2 sm:text-sm">
          {tx(highlight.supportAction)}
        </p>
      </div>
      <a
        href={highlight.source.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex min-h-11 items-center gap-2 pt-3 text-[11px] font-bold text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-cyan-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 sm:pt-4 sm:text-xs dark:text-slate-300 dark:hover:text-cyan-200"
      >
        {tx(highlight.source.label)}
        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
      </a>
    </article>
  );
}

function MobileDataCard({ highlight, expanded, onToggle, translateText }) {
  const tx = (value) => translateText(value);
  const tone = toneClasses[highlight.tone] || toneClasses.cyan;
  const panelId = `mobile-maternal-panel-${highlight.id}`;

  return (
    <article
      id={`mobile-maternal-highlight-${highlight.id}`}
      className={`scroll-mb-28 overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-slate-900 ${tone.border}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={panelId}
        className="block min-h-[5.75rem] w-full p-4 text-left transition-colors active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:hover:bg-white/[0.03]"
      >
        <span className="flex items-start justify-between gap-3">
          <span className={`min-w-0 text-[10px] font-black uppercase leading-relaxed tracking-[0.14em] ${tone.accent}`}>
            {tx(highlight.scope)}
          </span>
          <span className="shrink-0 text-lg font-black tabular-nums text-slate-950 dark:text-white">{highlight.value}</span>
        </span>
        <span className="mt-2 flex items-start justify-between gap-3">
          <span className="line-clamp-2 min-w-0 text-sm font-black leading-snug text-slate-950 dark:text-white">
            {tx(highlight.title)}
          </span>
          <ChevronDown
            className={`mt-0.5 h-4 w-4 shrink-0 text-slate-500 transition-transform ${expanded ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </span>
      </button>
      {expanded && (
        <div id={panelId} className="border-t border-slate-200 px-4 pb-4 pt-3 dark:border-slate-700">
          <p className="text-xs font-bold leading-relaxed text-slate-700 dark:text-slate-200">
            {tx(highlight.unit)}
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
            {tx(highlight.detail)}
          </p>
          <div className={`mt-3 rounded-xl border p-3 ${tone.action}`}>
            <p className="text-[10px] font-black uppercase tracking-[0.14em]">
              {tx("What this means for your role")}
            </p>
            <p className="mt-1.5 text-[13px] font-semibold leading-relaxed">
              {tx(highlight.supportAction)}
            </p>
          </div>
          <a
            href={highlight.source.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex min-h-11 items-center gap-2 text-[11px] font-bold text-slate-600 underline decoration-slate-300 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:text-slate-300"
          >
            {tx(highlight.source.label)}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      )}
    </article>
  );
}

function SearchResult({ result, onSelect, translateText, mobileHidden = false }) {
  const tx = (value) => translateText(value);
  const meta = kindMeta[result.kind] || kindMeta.lesson;
  const Icon = result.safety ? ShieldAlert : meta.Icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(result)}
      className={`group min-h-[5.5rem] w-full scroll-mb-28 items-start gap-3 rounded-2xl border p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 sm:min-h-24 sm:p-4 ${mobileHidden ? "hidden md:flex" : "flex"} ${
        result.safety
          ? "border-rose-200 bg-rose-50 hover:border-rose-300 dark:border-rose-400/25 dark:bg-rose-400/10 dark:hover:border-rose-300/40"
          : "border-slate-200 bg-white hover:border-cyan-300 hover:bg-cyan-50/40 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-cyan-400/40 dark:hover:bg-cyan-400/5"
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
          result.safety
            ? "border-rose-200 bg-white text-rose-700 dark:border-rose-400/25 dark:bg-slate-950 dark:text-rose-200"
            : "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-200"
        }`}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className={`text-[10px] font-black uppercase tracking-[0.14em] ${result.safety ? "text-rose-700 dark:text-rose-200" : "text-cyan-700 dark:text-cyan-300"}`}>
            {result.safety ? tx("Safety") : tx(meta.label)}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {tx(result.category)}
          </span>
        </span>
        <span className="mt-1 line-clamp-2 block text-sm font-black leading-snug text-slate-950 dark:text-white">
          {tx(result.title)}
        </span>
        <span className="mt-1 line-clamp-1 block text-xs leading-relaxed text-slate-600 sm:line-clamp-2 dark:text-slate-300">
          {result.kind === "data"
            ? `${result.value} ${tx(result.unit)}. ${tx(result.detail)}`
            : tx(result.description)}
        </span>
      </span>
      <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-cyan-600" aria-hidden="true" />
    </button>
  );
}

export default function PartnerPlatformDiscovery({
  curriculum,
  onOpenLesson,
  onOpenGuide,
  onOpenVideoHub,
  translateText = (value) => value,
}) {
  const tx = (value) => translateText(value);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAllMobileResults, setShowAllMobileResults] = useState(false);
  const [activeMobileScope, setActiveMobileScope] = useState("partner");
  const [expandedMobileHighlights, setExpandedMobileHighlights] = useState(["partner-breastfeeding"]);
  const dataSectionRef = useRef(null);
  const baseIndex = useMemo(() => buildPartnerPlatformSearchIndex(curriculum), [curriculum]);
  const localizedIndex = useMemo(
    () => localizePartnerPlatformSearchIndex(baseIndex, tx),
    [baseIndex, translateText]
  );
  const allResults = useMemo(
    () => searchPartnerPlatform(localizedIndex, query, 12),
    [localizedIndex, query]
  );
  const results = useMemo(
    () =>
      activeFilter === "all"
        ? allResults
        : allResults.filter((entry) =>
            activeFilter === "safety" ? entry.safety : entry.kind === activeFilter
          ),
    [activeFilter, allResults]
  );

  const openResult = (result) => {
    if (result.kind === "lesson") onOpenLesson(result.moduleId, result.lessonId);
    if (result.kind === "guide") onOpenGuide(result.guideId);
    if (result.kind === "video") onOpenVideoHub(result.videoId);
    if (result.kind === "data") {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      if (isMobile) {
        const nextScope = result.highlightId.startsWith("partner-")
          ? "partner"
          : result.highlightId.startsWith("indiana-")
            ? "indiana"
            : "national";
        setActiveMobileScope(nextScope);
        setExpandedMobileHighlights([result.highlightId]);
      }
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          document.getElementById(`${isMobile ? "mobile-" : ""}maternal-highlight-${result.highlightId}`)?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        });
      });
    }
  };

  const partnerHighlights = maternalHealthHighlights.filter((item) => item.id.startsWith("partner-"));
  const nationalHighlights = maternalHealthHighlights.filter((item) => item.id.startsWith("national-"));
  const indianaHighlights = maternalHealthHighlights.filter((item) => item.id.startsWith("indiana-"));
  const mobileHighlights = activeMobileScope === "partner"
    ? partnerHighlights
    : activeMobileScope === "national"
      ? nationalHighlights
      : indianaHighlights;
  const allMobileHighlightsExpanded = mobileHighlights.length > 0
    && mobileHighlights.every((highlight) => expandedMobileHighlights.includes(highlight.id));
  const hasQuery = query.trim().length >= 2;

  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:shadow-xl">
      <div className="border-b border-slate-200 bg-gradient-to-br from-white via-cyan-50/45 to-indigo-50/50 p-4 sm:p-6 dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-cyan-950/30">
        <div className="max-w-3xl">
          <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-3xl dark:text-white">
            {tx("What do you need right now?")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {tx("Search lessons, guides, videos, safety topics, and maternal health data from one place.")}
          </p>
        </div>

        <div className="relative mt-5 max-w-3xl">
          <label htmlFor="partner-platform-search" className="sr-only">
            {tx("Search Partner Platform")}
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-700 dark:text-cyan-300" aria-hidden="true" />
          <input
            id="partner-platform-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveFilter("all");
              setShowAllMobileResults(false);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setQuery("");
                event.currentTarget.blur();
              }
            }}
            placeholder={tx("Search lessons, guides, videos, and safety topics")}
            autoComplete="off"
            className="h-14 w-full rounded-2xl border border-slate-300 bg-white pl-12 pr-12 text-base font-semibold text-slate-950 shadow-sm outline-none transition-colors placeholder:font-medium placeholder:text-slate-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 [&::-webkit-search-cancel-button]:appearance-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-400"
            aria-describedby="partner-search-help partner-search-status"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-1.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label={tx("Clear search")}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
          <p id="partner-search-help" className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            {tx("Search runs on this device. It does not use ChatGPT or send your query to an AI model.")}
          </p>
        </div>

        <p id="partner-search-status" role="status" aria-live="polite" className="sr-only">
          {hasQuery ? `${results.length} ${tx("results")}` : ""}
        </p>

        {hasQuery && (
          <div className="mt-5" aria-label={tx("Search results")}>
            <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label={tx("Filter search results")}>
              {filters.map((filter) => {
                const count = filter.id === "all"
                  ? allResults.length
                  : allResults.filter((entry) => filter.id === "safety" ? entry.safety : entry.kind === filter.id).length;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => {
                      setActiveFilter(filter.id);
                      setShowAllMobileResults(false);
                    }}
                    aria-pressed={activeFilter === filter.id}
                    className={`min-h-11 shrink-0 rounded-full border px-4 py-2 text-xs font-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 ${
                      activeFilter === filter.id
                        ? "border-slate-950 bg-slate-950 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950"
                        : "border-slate-300 bg-white text-slate-700 hover:border-cyan-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    }`}
                  >
                    {tx(filter.label)} {count}
                  </button>
                );
              })}
            </div>
            {results.length ? (
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {results.map((result, index) => (
                  <SearchResult
                    key={result.id}
                    result={result}
                    onSelect={openResult}
                    translateText={translateText}
                    mobileHidden={!showAllMobileResults && index >= 4}
                  />
                ))}
                {results.length > 4 && (
                  <button
                    type="button"
                    onClick={() => setShowAllMobileResults((current) => !current)}
                    className="flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-black text-slate-700 transition-colors hover:border-cyan-300 hover:text-cyan-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 md:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-400/50 dark:hover:text-cyan-200"
                  >
                    {tx(showAllMobileResults ? "Show fewer results" : "Show more results")}
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                <p className="font-black text-slate-950 dark:text-white">{tx("No matching content yet")}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {tx("Try a shorter phrase such as warning signs, labor support, postpartum, or Indiana data.")}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div ref={dataSectionRef} id="maternal-health-data" className="scroll-mt-24 px-4 pb-28 pt-4 sm:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
              <BarChart3 className="h-4 w-4" aria-hidden="true" /> {tx("Recent maternal health data")}
            </p>
            <h2 className="mt-2 text-xl font-black tracking-tight text-slate-950 sm:text-3xl dark:text-white">
              {tx("Understand who is affected most, then know how to help")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {tx("Each figure includes its reporting period, source, and one practical action for fathers and support people.")}
            </p>
          </div>
          <a
            href="#indiana-maternal-data"
            className="hidden min-h-11 items-center gap-2 self-start rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-black text-slate-700 hover:border-cyan-300 hover:text-cyan-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 md:inline-flex dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-400/50 dark:hover:text-cyan-200"
          >
            {tx("Jump to Indiana data")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div className="mt-5 md:hidden">
          <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-slate-100 p-1 dark:bg-slate-900" role="group" aria-label={tx("Choose maternal data view")}>
            {[
              { id: "partner", label: "Your impact" },
              { id: "national", label: "U.S." },
              { id: "indiana", label: "Indiana" },
            ].map((scope) => (
              <button
                key={scope.id}
                type="button"
                onClick={() => {
                  const nextHighlights = scope.id === "partner"
                    ? partnerHighlights
                    : scope.id === "national"
                      ? nationalHighlights
                      : indianaHighlights;
                  setActiveMobileScope(scope.id);
                  setExpandedMobileHighlights(nextHighlights.length ? [nextHighlights[0].id] : []);
                }}
                aria-pressed={activeMobileScope === scope.id}
                className={`min-h-11 rounded-xl px-2 text-xs font-black transition-colors active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 ${
                  activeMobileScope === scope.id
                    ? "bg-white text-cyan-800 shadow-sm dark:bg-cyan-400 dark:text-slate-950"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {tx(scope.label)}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.14em] text-slate-700 dark:text-slate-200">
                {tx(activeMobileScope === "partner"
                  ? "Your support matters"
                  : activeMobileScope === "national"
                    ? "National data"
                    : "Indiana data")}
              </h3>
              <p className="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {tx("Open only what you need.")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setExpandedMobileHighlights(
                allMobileHighlightsExpanded ? [] : mobileHighlights.map((highlight) => highlight.id)
              )}
              className="min-h-10 shrink-0 rounded-full border border-cyan-300 bg-cyan-50 px-3 text-[11px] font-black text-cyan-900 transition-colors active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-100"
            >
              {tx(allMobileHighlightsExpanded ? "Collapse all" : "Expand all")}
            </button>
          </div>
          <div className="mt-3 space-y-2.5">
            {mobileHighlights.map((highlight) => (
              <MobileDataCard
                key={highlight.id}
                highlight={highlight}
                expanded={expandedMobileHighlights.includes(highlight.id)}
                onToggle={() => setExpandedMobileHighlights((current) =>
                  current.includes(highlight.id)
                    ? current.filter((id) => id !== highlight.id)
                    : [...current, highlight.id]
                )}
                translateText={translateText}
              />
            ))}
          </div>
        </div>

        <div className="hidden md:block">
          <h3 className="mt-6 text-sm font-black uppercase tracking-[0.16em] text-slate-600 dark:text-slate-300">
            {tx("What equipped partners can change")}
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {tx("These findings show what structured partner education and continuous support can influence. Results vary by family and care setting.")}
          </p>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {partnerHighlights.map((highlight) => (
              <MaternalHealthCard key={highlight.id} highlight={highlight} translateText={translateText} />
            ))}
          </div>

          <h3 className="mt-6 text-sm font-black uppercase tracking-[0.16em] text-slate-600 dark:text-slate-300">
            {tx("National overview and disparities")}
          </h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {nationalHighlights.map((highlight) => (
              <MaternalHealthCard key={highlight.id} highlight={highlight} translateText={translateText} />
            ))}
          </div>

          <h3 id="indiana-maternal-data" className="mt-7 scroll-mt-24 text-sm font-black uppercase tracking-[0.16em] text-slate-600 dark:text-slate-300">
            {tx("Indiana overview and disparities")}
          </h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {indianaHighlights.map((highlight) => (
              <MaternalHealthCard key={highlight.id} highlight={highlight} translateText={translateText} />
            ))}
          </div>
        </div>

        <details className="group mt-4 rounded-2xl border border-slate-200 bg-slate-50 text-xs leading-relaxed text-slate-600 md:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-2 font-black text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:text-slate-100">
            {tx("How to read these numbers")}
            <span className="text-cyan-700 transition-transform group-open:rotate-90 dark:text-cyan-300" aria-hidden="true">→</span>
          </summary>
          <div className="border-t border-slate-200 px-4 pb-4 pt-3 dark:border-slate-700">
            <p className="font-semibold">
              {tx("Partner-impact findings include one controlled father-training trial. Labor-support findings include different companion types and are not father-only.")}
            </p>
            <p>
              {tx("National maternal mortality counts deaths during pregnancy or within 42 days from causes related to or aggravated by pregnancy. Indiana pregnancy-associated data include deaths from any cause during pregnancy or within one year. The measures use different definitions and should not be compared directly.")}
            </p>
            <p className="mt-2 font-semibold">
              {tx("Data describes populations, not an individual's risk. This platform does not diagnose. Contact the care team for concerning symptoms and call emergency services for immediate danger.")}
            </p>
          </div>
        </details>

        <div className="mt-5 hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600 md:block dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          <p className="font-black text-slate-800 dark:text-slate-100">{tx("How to read these numbers")}</p>
          <p className="mt-1 font-semibold">
            {tx("Partner-impact findings include one controlled father-training trial. Labor-support findings include different companion types and are not father-only.")}
          </p>
          <p className="mt-1">
            {tx("National maternal mortality counts deaths during pregnancy or within 42 days from causes related to or aggravated by pregnancy. Indiana pregnancy-associated data include deaths from any cause during pregnancy or within one year. The measures use different definitions and should not be compared directly.")}
          </p>
          <p className="mt-2 font-semibold">
            {tx("Data describes populations, not an individual's risk. This platform does not diagnose. Contact the care team for concerning symptoms and call emergency services for immediate danger.")}
          </p>
        </div>
      </div>
    </section>
  );
}
