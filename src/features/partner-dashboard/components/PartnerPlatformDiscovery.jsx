import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  FileText,
  Search,
  ShieldAlert,
  Video,
  X,
} from "lucide-react";
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
  onOpenMaternalData,
  translateText = (value) => value,
}) {
  const tx = (value) => translateText(value);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAllMobileResults, setShowAllMobileResults] = useState(false);
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
  const hasQuery = query.trim().length >= 2;

  const openResult = (result) => {
    if (result.kind === "lesson") onOpenLesson(result.moduleId, result.lessonId);
    if (result.kind === "guide") onOpenGuide(result.guideId);
    if (result.kind === "video") onOpenVideoHub(result.videoId);
    if (result.kind === "data") onOpenMaternalData(result.highlightId);
  };

  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:shadow-xl">
      <div className="bg-gradient-to-br from-white via-cyan-50/45 to-indigo-50/50 p-4 sm:p-6 dark:from-slate-950 dark:via-slate-950 dark:to-cyan-950/30">
        <div className="max-w-3xl">
          <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-3xl dark:text-white">
            {tx("What do you need right now?")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {tx("Search lessons, guides, videos, safety topics, and maternal health data from one place.")}
          </p>
        </div>

        <div className="mt-5 max-w-3xl">
          <label htmlFor="partner-platform-search" className="sr-only">
            {tx("Search Partner Platform")}
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-700 dark:text-cyan-300" strokeWidth={2} aria-hidden="true" />
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
              className="h-14 w-full rounded-2xl border border-slate-300 bg-white pl-12 pr-14 text-base font-semibold text-slate-950 shadow-sm outline-none transition-colors placeholder:font-medium placeholder:text-slate-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 [&::-webkit-search-cancel-button]:appearance-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-400"
              aria-describedby="partner-search-help partner-search-status"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label={tx("Clear search")}
              >
                <X className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              </button>
            )}
          </div>
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
    </section>
  );
}
