import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Baby,
  Bookmark,
  BookOpen,
  ChevronDown,
  Clock3,
  Download,
  FileText,
  Globe2,
  GraduationCap,
  HeartHandshake,
  HelpCircle,
  Home,
  Library,
  LayoutDashboard,
  Menu,
  MessageCircleQuestion,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
  Video,
  X,
} from "lucide-react";
import dieudonneDarkLogo from "../../../assets/Dieudonne_Dark_Logo.png";
import {
  browseTopics,
  recommendedResources,
  trustedResources,
  videoCategories,
  videoHubVideos,
} from "../data/videoHub";
import { trackPartnerEvent } from "../services/analyticsService";
import { usePartnerDashboard } from "../state/PartnerDashboardContext";
import ThemeToggle from "../components/ThemeToggle";

const navGroups = [
  {
    label: "Core",
    items: [
      { label: "Home", icon: Home, action: "home" },
      { label: "My Journey", icon: GraduationCap, action: "home" },
      { label: "Continue Watching", icon: Play, action: "continue" },
      { label: "Saved Videos", icon: Bookmark, action: "saved" },
      { label: "Watch Later", icon: Clock3, action: "watchLater" },
    ],
  },
  {
    label: "Learn by Topic",
    items: [
      { label: "Doula Basics", icon: Sparkles, category: "Doula Basics" },
      { label: "Prenatal Education", icon: Stethoscope, category: "Prenatal Education" },
      { label: "Labor Support", icon: HeartHandshake, category: "Labor Support" },
      { label: "Postpartum Recovery", icon: ShieldCheck, category: "Postpartum" },
      { label: "Newborn Care", icon: Baby, category: "Newborn Care" },
      { label: "Mental Health", icon: HelpCircle, category: "Mental Health" },
      { label: "Birth Equity", icon: Globe2, category: "Birth Equity" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Guides & Checklists", icon: FileText, action: "guides" },
      { label: "Expert Q&A", icon: MessageCircleQuestion, resourceId: "ask-doula" },
      { label: "Downloads", icon: Download, resourceId: "hospital-bag" },
      { label: "Glossary", icon: BookOpen, action: "glossary" },
    ],
  },
];

const categoryAccent = {
  "Doula Basics": "text-cyan-200 border-cyan-300/25 bg-cyan-300/10",
  "Prenatal Education": "text-blue-200 border-blue-300/25 bg-blue-300/10",
  "Labor Support": "text-fuchsia-200 border-fuchsia-300/25 bg-fuchsia-300/10",
  Postpartum: "text-violet-200 border-violet-300/25 bg-violet-300/10",
  "Mental Health": "text-rose-200 border-rose-300/25 bg-rose-300/10",
  "Newborn Care": "text-teal-200 border-teal-300/25 bg-teal-300/10",
  "Birth Equity": "text-amber-200 border-amber-300/25 bg-amber-300/10",
  "Professional Development": "text-indigo-200 border-indigo-300/25 bg-indigo-300/10",
  Lactation: "text-emerald-200 border-emerald-300/25 bg-emerald-300/10",
};

const lightCategoryAccent = {
  "Doula Basics": "text-cyan-800 border-cyan-200 bg-cyan-50",
  "Prenatal Education": "text-blue-800 border-blue-200 bg-blue-50",
  "Labor Support": "text-fuchsia-800 border-fuchsia-200 bg-fuchsia-50",
  Postpartum: "text-violet-800 border-violet-200 bg-violet-50",
  "Mental Health": "text-rose-800 border-rose-200 bg-rose-50",
  "Newborn Care": "text-teal-800 border-teal-200 bg-teal-50",
  "Birth Equity": "text-amber-800 border-amber-200 bg-amber-50",
  "Professional Development": "text-indigo-800 border-indigo-200 bg-indigo-50",
  Lactation: "text-emerald-800 border-emerald-200 bg-emerald-50",
};

const themeClass = (darkMode, darkClasses, lightClasses) =>
  darkMode ? darkClasses : lightClasses;

const glossaryResource = {
  id: "video-glossary",
  label: "Glossary",
  title: "Partner Video Hub Glossary",
  description: "Plain-language definitions for the video library.",
  details:
    "Doula: a trained support person. Induction: starting labor with medical support. PMAD: perinatal mood and anxiety disorder. Safe sleep: baby sleeps alone, on the back, on a firm flat surface. Advocacy: asking clear questions and making sure mom is heard.",
};

const findVideo = (videoId) => videoHubVideos.find((video) => video.id === videoId);

function SidebarNav({
  open,
  onClose,
  darkMode,
  activeCategory,
  savedCount,
  watchLaterCount,
  libraryView,
  onItemSelect,
}) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close video navigation"
          className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[286px] border-r px-4 py-5 shadow-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-[calc(100dvh-2rem)] lg:translate-x-0 lg:rounded-[1.75rem] lg:border lg:shadow-none ${themeClass(
          darkMode,
          "border-white/10 bg-slate-950/95 shadow-slate-950/60 lg:bg-slate-950/70",
          "border-slate-200 bg-white/95 shadow-slate-300/40 lg:bg-white/90"
        )} ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={dieudonneDarkLogo}
              alt="Dieudonne Partner Hub logo"
              className="h-10 w-auto rounded-xl border border-white/10 bg-slate-950 p-1"
            />
            <div>
              <p className={`text-[10px] font-black uppercase tracking-[0.22em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
                Partner Hub
              </p>
              <p className={`text-sm font-black ${darkMode ? "text-white" : "text-slate-950"}`}>Video Library</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className={`rounded-xl border p-2 lg:hidden ${darkMode ? "border-white/10 text-slate-300" : "border-slate-200 text-slate-700"}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className={`mb-2 px-2 text-[10px] font-black uppercase tracking-[0.18em] ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item, index) => {
                  const Icon = item.icon;
                  const active =
                    item.category === activeCategory ||
                    (item.action === libraryView && ["saved", "watchLater"].includes(item.action)) ||
                    (item.action === "home" && index === 0 && activeCategory === "All" && libraryView === "all");
                  const count =
                    item.action === "saved"
                      ? savedCount
                      : item.action === "watchLater"
                        ? watchLaterCount
                        : 0;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => onItemSelect(item)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition active:scale-[0.99] ${
                        active
                          ? darkMode
                            ? "border border-white/10 bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                            : "border border-cyan-200 bg-cyan-50 text-cyan-900 shadow-sm"
                          : darkMode
                            ? "text-slate-400 hover:bg-white/[0.06] hover:text-slate-100"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="min-w-0 flex-1">{item.label}</span>
                      {count > 0 && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${darkMode ? "bg-cyan-300/15 text-cyan-100" : "bg-cyan-100 text-cyan-800"}`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className={`mt-8 rounded-2xl border p-4 ${darkMode ? "border-violet-300/20 bg-violet-300/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" : "border-violet-200 bg-violet-50 shadow-sm"}`}>
          <p className={`text-sm font-black ${darkMode ? "text-violet-100" : "text-violet-900"}`}>Need guidance?</p>
          <p className={`mt-1 text-xs leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            Save a video pack before the next appointment or birth planning call.
          </p>
          <button
            type="button"
            onClick={() => onItemSelect({ action: "watchLater" })}
            className={`mt-4 w-full rounded-xl border px-3 py-2 text-sm font-black transition active:scale-[0.98] ${darkMode ? "border-violet-300/30 bg-violet-300/10 text-violet-100 hover:bg-violet-300/15" : "border-violet-200 bg-white text-violet-800 hover:bg-violet-100"}`}
          >
            Build Watchlist
          </button>
        </div>
      </aside>
    </>
  );
}

function TopSearchBar({
  query,
  onQueryChange,
  onMenu,
  darkMode,
  onToggleTheme,
  showAdminDashboard,
}) {
  return (
    <div className={`sticky top-0 z-20 border-b px-4 py-4 backdrop-blur-xl lg:rounded-t-[1.75rem] ${darkMode ? "border-white/10 bg-slate-950/86" : "border-slate-200 bg-white/90"}`}>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            aria-label="Open video navigation"
            onClick={onMenu}
            className={`rounded-xl border p-3 lg:hidden ${darkMode ? "border-white/10 bg-white/[0.04] text-slate-200" : "border-slate-200 bg-slate-50 text-slate-700"}`}
          >
            <Menu className="h-5 w-5" />
          </button>
          <label className="sr-only" htmlFor="video-search">
            Search videos, topics, or experts
          </label>
          <div className="relative min-w-0 flex-1">
            <Search className={`pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${darkMode ? "text-slate-400" : "text-slate-500"}`} />
            <input
              id="video-search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search videos, topics, or experts..."
              className={`h-12 w-full rounded-2xl border pl-12 pr-4 text-sm font-semibold outline-none transition focus:ring-2 focus:ring-cyan-500/30 ${darkMode ? "border-white/10 bg-white/[0.04] text-slate-100 placeholder:text-slate-400 focus:border-cyan-300/40 focus:bg-white/[0.07]" : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:border-cyan-500"}`}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onToggleTheme && (
            <ThemeToggle
              darkMode={darkMode}
              onToggle={onToggleTheme}
              className="min-h-11 flex-1 sm:flex-none"
            />
          )}
          <button
            type="button"
            className={`hidden h-11 items-center gap-2 rounded-2xl border px-4 text-sm font-black transition md:flex ${darkMode ? "border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.07]" : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
          >
            <Globe2 className="h-4 w-4" />
            EN
            <ChevronDown className={`h-4 w-4 ${darkMode ? "text-slate-400" : "text-slate-500"}`} />
          </button>
          {showAdminDashboard && (
            <a
              href="/owner-admin"
              aria-label="Open Admin Dashboard"
              className={`hidden min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 sm:flex-none md:flex ${darkMode ? "border-cyan-300/25 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/15 focus-visible:ring-offset-slate-950" : "border-cyan-200 bg-cyan-50 text-cyan-800 hover:bg-cyan-100 focus-visible:ring-offset-white"}`}
            >
              <LayoutDashboard className="h-4 w-4" /> Admin Dashboard
            </a>
          )}
          <button
            type="button"
            className={`hidden h-11 items-center gap-3 rounded-2xl border px-3 text-sm font-black transition lg:flex ${darkMode ? "border-white/10 bg-white/[0.04] text-slate-100 hover:bg-white/[0.07]" : "border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100"}`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300/70 to-fuchsia-300/70 text-slate-950">
              <UserRound className="h-4 w-4" />
            </span>
            Partner
            <ChevronDown className={`h-4 w-4 ${darkMode ? "text-slate-400" : "text-slate-500"}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

function HeroVisualCard({ darkMode }) {
  return (
    <section
      className={`relative w-full overflow-hidden rounded-[2rem] border p-3 md:p-4 ${darkMode ? "border-white/10 bg-[#070d1d] shadow-[0_30px_90px_rgba(0,0,0,0.45)]" : "border-slate-200 bg-white shadow-lg shadow-slate-300/40"}`}
      aria-label="Dieudonne Partner Video Hub visual"
    >
      <img
        src="/hero-reference.png"
        alt="Partner and expecting mother watching support videos together on a tablet"
        className="block aspect-[4/3] w-full rounded-[1.55rem] object-cover object-center md:aspect-[4/3]"
      />
    </section>
  );
}

function HeroVideoSection({ onPrimary, onExplore, darkMode }) {
  return (
    <section className={`m-4 grid gap-5 overflow-hidden rounded-[1.75rem] border p-4 shadow-sm sm:m-5 sm:p-5 lg:mx-7 lg:mb-6 lg:mt-7 lg:grid-cols-[0.92fr_1.08fr] ${darkMode ? "border-slate-800 bg-gradient-to-br from-slate-950 via-slate-950 to-cyan-950/35" : "border-slate-200 bg-gradient-to-br from-white via-cyan-50/55 to-indigo-50/55"}`}>
      <div className="flex min-w-0 flex-col justify-center">
        <p className={`mb-3 w-fit rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] ${darkMode ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-200" : "border-cyan-200 bg-cyan-50 text-cyan-800"}`}>
          Dieudonne Partner Video Hub
        </p>
        <h1 className={`max-w-2xl text-4xl font-black leading-[0.95] tracking-tight md:text-6xl ${darkMode ? "text-white" : "text-slate-950"}`}>
          Support her with confidence.
        </h1>
        <p className={`mt-5 max-w-2xl text-base leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
          Evidence-based videos, practical tools, and partner-focused guidance to help you understand pregnancy, birth, postpartum recovery, and newborn care, all in one place.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onPrimary}
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-700 to-fuchsia-700 px-5 text-sm font-black text-white transition hover:from-cyan-800 hover:to-fuchsia-800 active:scale-[0.98]"
          >
            <Play className="h-4 w-4" />
            Continue Learning
          </button>
          <button
            type="button"
            onClick={onExplore}
            className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-5 text-sm font-black transition active:scale-[0.98] ${darkMode ? "border-white/10 bg-white/[0.04] text-slate-100 hover:bg-white/[0.08]" : "border-slate-300 bg-white text-slate-800 hover:bg-slate-100"}`}
          >
            <Library className="h-4 w-4" />
            Explore Topics
          </button>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {["Curated sources", "In-hub playback", "Partner-ready"].map((label) => (
            <div
              key={label}
              className={`rounded-2xl border px-4 py-3 text-sm font-black ${darkMode ? "border-white/10 bg-white/[0.04] text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" : "border-slate-200 bg-white text-slate-800 shadow-sm"}`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      <HeroVisualCard darkMode={darkMode} />
    </section>
  );
}

function CategoryFilters({ selectedCategory, onSelect, darkMode }) {
  return (
    <section id="video-section-topics" className="px-4 pt-6 lg:px-7">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {videoCategories.map((category) => {
          const active = category === selectedCategory;
          return (
            <button
              key={category}
              onClick={() => onSelect(category)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-black transition active:scale-[0.98] ${
                active
                  ? darkMode
                    ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100"
                    : "border-cyan-300 bg-cyan-50 text-cyan-900"
                  : darkMode
                    ? "border-white/10 bg-white/[0.04] text-slate-400 hover:bg-white/[0.07] hover:text-slate-100"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function VideoCard({ video, onSelect, selected, darkMode, translateText }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(video)}
      className={`group min-w-[250px] max-w-[250px] text-left transition hover:-translate-y-1 active:scale-[0.98] ${
        selected ? "opacity-100" : "opacity-90 hover:opacity-100"
      }`}
    >
      <div className={`relative overflow-hidden rounded-2xl border bg-slate-900 ${selected ? (darkMode ? "border-cyan-300/40" : "border-cyan-500") : (darkMode ? "border-white/10" : "border-slate-200")}`}>
        <img
          src={video.thumbnail}
          alt=""
          className="aspect-video w-full object-cover opacity-80 transition group-hover:scale-[1.03] group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/18 text-white backdrop-blur-md">
          <Play className="h-5 w-5 fill-current" />
        </span>
        <span className="absolute bottom-3 right-3 rounded-lg bg-slate-950/80 px-2 py-1 text-xs font-black text-white">
          {video.duration}
        </span>
        <div className="absolute bottom-0 left-0 h-1 bg-white/25" style={{ width: "100%" }} />
        <div className="absolute bottom-0 left-0 h-1 bg-cyan-300" style={{ width: `${video.progress}%` }} />
      </div>
      <h3 className={`mt-3 line-clamp-2 text-base font-black leading-tight ${darkMode ? "text-white" : "text-slate-950"}`}>
        {video.title}
      </h3>
      <p className={`mt-1 text-sm font-bold ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>{video.category}</p>
      <p className={`mt-1 text-xs font-semibold ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{video.progress}% {translateText("complete")}</p>
    </button>
  );
}

function VideoCarousel({ title, videos, onSelect, selectedVideo, onViewAll, darkMode, translateText }) {
  if (!videos.length) {
    const emptyCopy =
      title === "Saved Videos"
        ? "No saved videos yet. Open a video and tap Save to build this list."
        : title === "Watch Later"
          ? "No videos added to Watch Later yet. Open a video and tap Watch Later to build your watchlist."
          : "No videos match this search yet.";

    return (
      <section className="px-4 py-8 lg:px-7">
        <div className={`rounded-[1.5rem] border p-6 ${darkMode ? "border-white/10 bg-white/[0.04] text-slate-400" : "border-slate-200 bg-white text-slate-600"}`}>
          {emptyCopy}
        </div>
      </section>
    );
  }

  return (
    <section id="video-section-continue" className="px-4 py-7 lg:px-7">
      <div className="mb-4 flex items-center justify-between">
        <h2 className={`text-xl font-black ${darkMode ? "text-white" : "text-slate-950"}`}>{translateText(title)}</h2>
        <button
          type="button"
          onClick={onViewAll}
          className={`text-sm font-black transition ${darkMode ? "text-slate-400 hover:text-cyan-200" : "text-slate-600 hover:text-cyan-700"}`}
        >
          {translateText("View all")}
        </button>
      </div>
      <div className="flex gap-5 overflow-x-auto pb-3">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onSelect={onSelect}
            selected={video.id === selectedVideo.id}
            darkMode={darkMode}
            translateText={translateText}
          />
        ))}
      </div>
    </section>
  );
}

function RecommendedResources({ onOpenResource, darkMode }) {
  return (
    <section id="video-section-recommended" className={`border-t px-4 py-7 lg:px-7 ${darkMode ? "border-white/10" : "border-slate-200"}`}>
      <h2 className={`mb-4 text-xl font-black ${darkMode ? "text-white" : "text-slate-950"}`}>Recommended for You</h2>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr_1.15fr] xl:grid-cols-5">
        {recommendedResources.map((resource) => (
          <button
            key={resource.id}
            type="button"
            onClick={() => onOpenResource(resource)}
            className={`group rounded-[1.5rem] border p-4 text-left transition hover:-translate-y-1 active:scale-[0.99] ${darkMode ? "border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-cyan-300/30 hover:bg-white/[0.07]" : "border-slate-200 bg-white shadow-sm hover:border-cyan-300 hover:bg-cyan-50/40"}`}
          >
            <span className={`mb-4 flex h-10 w-10 items-center justify-center rounded-2xl border ${darkMode ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-200" : "border-cyan-200 bg-cyan-50 text-cyan-700"}`}>
              <FileText className="h-5 w-5" />
            </span>
            <p className={`text-[10px] font-black uppercase tracking-[0.16em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
              {resource.label}
            </p>
            <h3 className={`mt-2 text-base font-black leading-tight ${darkMode ? "text-white" : "text-slate-950"}`}>
              {resource.title}
            </h3>
            <p className={`mt-2 text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              {resource.description}
            </p>
            <p className={`mt-4 text-sm font-black ${darkMode ? "text-slate-200 group-hover:text-cyan-200" : "text-slate-800 group-hover:text-cyan-700"}`}>
              {resource.action}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}

function TrustedResources({ onOpenResource, darkMode }) {
  return (
    <section id="video-section-trusted" className={`border-t px-4 py-7 lg:px-7 ${darkMode ? "border-white/10" : "border-slate-200"}`}>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className={`text-xl font-black ${darkMode ? "text-white" : "text-slate-950"}`}>Best of the Best</h2>
          <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            Trusted resources open inside the hub first, so partners can review without losing context.
          </p>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {trustedResources.map((resource) => (
          <button
            key={resource.id}
            type="button"
            onClick={() => onOpenResource(resource)}
            className={`rounded-2xl border p-4 text-left transition hover:-translate-y-1 active:scale-[0.99] ${darkMode ? "border-white/10 bg-slate-950/50 hover:border-violet-300/30 hover:bg-white/[0.05]" : "border-slate-200 bg-white shadow-sm hover:border-violet-300 hover:bg-violet-50/40"}`}
          >
            <p className={`text-[10px] font-black uppercase tracking-[0.16em] ${darkMode ? "text-violet-300" : "text-violet-700"}`}>
              {resource.source}
            </p>
            <h3 className={`mt-2 text-sm font-black leading-tight ${darkMode ? "text-white" : "text-slate-950"}`}>{resource.title}</h3>
            <p className={`mt-2 text-xs leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{resource.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function TopicBrowser({ onTopic, darkMode }) {
  return (
    <section id="video-section-browse" className={`border-t px-4 py-7 lg:px-7 ${darkMode ? "border-white/10" : "border-slate-200"}`}>
      <h2 className={`mb-4 text-xl font-black ${darkMode ? "text-white" : "text-slate-950"}`}>Browse Topics</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {browseTopics.map((topic) => (
          <button
            key={topic}
            type="button"
            onClick={() => onTopic(topic)}
            className={`rounded-2xl border px-4 py-4 text-left text-sm font-black transition active:scale-[0.99] ${darkMode ? "border-white/10 bg-white/[0.04] text-slate-200 hover:border-cyan-300/30 hover:bg-white/[0.07]" : "border-slate-200 bg-white text-slate-800 shadow-sm hover:border-cyan-300 hover:bg-cyan-50/40"}`}
          >
            {topic}
          </button>
        ))}
      </div>
    </section>
  );
}

const buildVideoShareHref = (video) => {
  const subject = `Video from Dieudonne Partner Hub: ${video.title}`;
  const hubUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/partner-dashboard/video-hub`
      : "https://www.dieudonnepartnerhub.org/partner-dashboard/video-hub";
  const body = [
    `I thought this video from Dieudonne Partner Hub could be helpful:`,
    "",
    video.title,
    "",
    `Open the video hub: ${hubUrl}`,
  ]
    .join("\n");

  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

function VideoEmbed({ video }) {
  const [playerRequested, setPlayerRequested] = useState(false);

  useEffect(() => {
    setPlayerRequested(false);
  }, [video.id]);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
      <img
        src={video.thumbnail}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-85"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/30 via-slate-950/10 to-slate-950/60" />
      {playerRequested && (
        <iframe
          key={video.id}
          src={video.embedUrl}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
        />
      )}
      {!playerRequested && (
        <button
          type="button"
          onClick={() => setPlayerRequested(true)}
          className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-4 bg-slate-950/12 text-white transition hover:bg-slate-950/4"
          aria-label={`Play ${video.title}`}
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/20 shadow-2xl shadow-slate-950/50 backdrop-blur-md transition hover:scale-105">
            <Play className="h-8 w-8 fill-current" />
          </span>
          <span className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-sm font-black backdrop-blur-md">
            Play video in hub
          </span>
        </button>
      )}
    </div>
  );
}

function VideoPlayerModal({
  video,
  onClose,
  darkMode,
  saved,
  watchLater,
  onSave,
  onWatchLater,
  translateText,
}) {
  const [shareStatus, setShareStatus] = useState("");

  useEffect(() => {
    setShareStatus("");
  }, [video?.id]);

  if (!video) return null;

  const handleShareVideo = async () => {
    const mailtoHref = buildVideoShareHref(video);
    setShareStatus("Opening email draft...");

    try {
      await navigator.clipboard?.writeText(
        `${video.title}\n${window.location.origin}/partner-dashboard/video-hub`
      );
    } catch {
      // Clipboard is best-effort. The email handoff is the primary action.
    }

    const mailLink = document.createElement("a");
    mailLink.href = mailtoHref;
    mailLink.target = "_blank";
    mailLink.rel = "noopener noreferrer";
    document.body.appendChild(mailLink);
    mailLink.click();
    mailLink.remove();

    window.setTimeout(() => {
      setShareStatus("Email draft requested. Video link copied as backup.");
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/78 p-3 backdrop-blur-md sm:p-5">
      <div className={`relative max-h-[94dvh] w-full max-w-5xl overflow-hidden rounded-[1.75rem] border shadow-2xl ${darkMode ? "border-white/10 bg-slate-950 shadow-slate-950/80" : "border-slate-200 bg-white shadow-slate-950/30"}`}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_88%_80%,rgba(217,70,239,0.14),transparent_36%)]" />
        <div className="relative z-[1] grid max-h-[94dvh] overflow-y-auto lg:grid-cols-[1.55fr_0.85fr]">
          <div className="bg-slate-950">
            <VideoEmbed video={video} />
          </div>
          <aside className={`flex min-h-0 flex-col border-t p-5 lg:border-l lg:border-t-0 ${darkMode ? "border-white/10" : "border-slate-200"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${(darkMode ? categoryAccent : lightCategoryAccent)[video.category] || (darkMode ? "border-white/10 bg-white/[0.05] text-slate-300" : "border-slate-200 bg-slate-50 text-slate-700")}`}>
                    {video.category}
                  </span>
                  <span className={`text-xs font-bold ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{video.duration}</span>
                </div>
                <h2 className={`text-2xl font-black leading-tight tracking-tight ${darkMode ? "text-white" : "text-slate-950"}`}>
                  {video.title}
                </h2>
                <p className={`mt-2 text-sm font-bold ${darkMode ? "text-cyan-200" : "text-cyan-700"}`}>{video.source}</p>
              </div>
              <button
                type="button"
                aria-label="Close video"
                onClick={onClose}
                className={`shrink-0 rounded-xl border p-2 transition ${darkMode ? "border-white/10 text-slate-300 hover:bg-white/[0.06]" : "border-slate-200 text-slate-700 hover:bg-slate-100"}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className={`mt-4 text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
              {video.description}
            </p>

            <div className={`mt-5 rounded-2xl border p-4 ${darkMode ? "border-cyan-300/20 bg-cyan-300/10" : "border-cyan-200 bg-cyan-50"}`}>
              <div className={`mb-2 flex items-center justify-between text-xs font-bold ${darkMode ? "text-cyan-100/80" : "text-cyan-800"}`}>
                <span>Progress</span>
                <span>{video.progress}% {translateText("complete")}</span>
              </div>
              <div className={`h-2 overflow-hidden rounded-full ${darkMode ? "bg-white/[0.1]" : "bg-cyan-100"}`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-400"
                  style={{ width: `${video.progress}%` }}
                />
              </div>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
              <button
                type="button"
                onClick={handleShareVideo}
                className={`rounded-2xl border px-4 py-3 text-sm font-black transition active:scale-[0.98] ${darkMode ? "border-white/10 bg-white/[0.04] text-slate-100 hover:bg-white/[0.08]" : "border-slate-300 bg-white text-slate-800 hover:bg-slate-100"}`}
              >
                Send to Friend or Family Member
              </button>
              {shareStatus && (
                <p className={`-mt-1 rounded-xl border px-3 py-2 text-xs font-bold ${darkMode ? "border-cyan-300/15 bg-cyan-300/10 text-cyan-100" : "border-cyan-200 bg-cyan-50 text-cyan-800"}`}>
                  {shareStatus}
                </p>
              )}
              <button
                type="button"
                onClick={() => onSave(video.id)}
                className={`rounded-2xl border px-4 py-3 text-sm font-black transition active:scale-[0.98] ${
                  saved
                    ? darkMode
                      ? "border-cyan-300/30 bg-cyan-300/15 text-cyan-100"
                      : "border-cyan-300 bg-cyan-50 text-cyan-800"
                    : darkMode
                      ? "border-white/10 bg-white/[0.04] text-slate-100 hover:bg-white/[0.08]"
                      : "border-slate-300 bg-white text-slate-800 hover:bg-slate-100"
                }`}
              >
                {saved ? "Saved" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => onWatchLater(video.id)}
                className={`rounded-2xl border px-4 py-3 text-sm font-black transition active:scale-[0.98] ${
                  watchLater
                    ? darkMode
                      ? "border-fuchsia-300/30 bg-fuchsia-300/15 text-fuchsia-100"
                      : "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-800"
                    : darkMode
                      ? "border-white/10 bg-white/[0.04] text-slate-100 hover:bg-white/[0.08]"
                      : "border-slate-300 bg-white text-slate-800 hover:bg-slate-100"
                }`}
              >
                {watchLater ? "Added to Watch Later" : "Watch Later"}
              </button>
            </div>

            <div className={`mt-5 rounded-2xl border p-4 text-xs leading-relaxed ${darkMode ? "border-white/10 bg-white/[0.04] text-slate-400" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
              Review this together, pause for questions, then save the main action you want to bring into the next appointment or recovery check-in.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ResourceModal({ resource, onClose, darkMode }) {
  if (!resource) return null;
  const hasSections = Array.isArray(resource.sections) && resource.sections.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md">
      <div className={`max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-[1.75rem] border p-5 shadow-2xl ${darkMode ? "border-white/10 bg-slate-950 shadow-slate-950/70" : "border-slate-200 bg-white shadow-slate-950/30"}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
              {resource.source || resource.label}
            </p>
            <h3 className={`mt-2 text-2xl font-black tracking-tight ${darkMode ? "text-white" : "text-slate-950"}`}>
              {resource.title}
            </h3>
          </div>
          <button
            type="button"
            aria-label="Close resource"
            onClick={onClose}
            className={`rounded-xl border p-2 transition ${darkMode ? "border-white/10 text-slate-300 hover:bg-white/[0.06]" : "border-slate-200 text-slate-700 hover:bg-slate-100"}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className={`mt-4 text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
          {resource.description}
        </p>
        {hasSections ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {resource.sections.map((section) => (
              <div
                key={section.title}
                className={`rounded-2xl border p-4 ${darkMode ? "border-white/10 bg-white/[0.04]" : "border-slate-200 bg-slate-50"}`}
              >
                <h4 className={`text-sm font-black ${darkMode ? "text-white" : "text-slate-950"}`}>{section.title}</h4>
                <ul className="mt-3 space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className={`flex gap-2 text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className={`mt-4 text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
            {resource.details}
          </p>
        )}
        <div className={`mt-6 rounded-2xl border p-4 text-sm leading-relaxed ${darkMode ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-100" : "border-cyan-200 bg-cyan-50 text-cyan-900"}`}>
          Partner use: {resource.partnerAction || "save the key point, discuss it with mom, and bring it to the care team when it affects safety or preferences."}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-gradient-to-r from-cyan-700 to-fuchsia-700 px-4 py-3 text-sm font-black text-white transition hover:from-cyan-800 hover:to-fuchsia-800 active:scale-[0.98]"
        >
          Back to Hub
        </button>
      </div>
    </div>
  );
}

export default function VideoHubPage({
  darkMode = false,
  onToggleTheme,
  showAdminDashboard = false,
  translateText = (value) => value,
}) {
  const { profile, saveVideoHubPreferences } = usePartnerDashboard();
  const openedDeepLinkVideoRef = useRef("");
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [libraryView, setLibraryView] = useState("all");
  const [selectedVideo, setSelectedVideo] = useState(videoHubVideos[0]);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resourceModal, setResourceModal] = useState(null);
  const [savedVideoIds, setSavedVideoIds] = useState([]);
  const [watchLaterIds, setWatchLaterIds] = useState([]);

  useEffect(() => {
    setSavedVideoIds(profile?.videoHub?.savedVideoIds || []);
    setWatchLaterIds(profile?.videoHub?.watchLaterIds || []);
  }, [profile?.uid]);

  const filteredVideos = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return videoHubVideos.filter((video) => {
      const matchesCategory =
        selectedCategory === "All" || video.category === selectedCategory;
      const matchesLibrary =
        libraryView === "saved"
          ? savedVideoIds.includes(video.id)
          : libraryView === "watchLater"
            ? watchLaterIds.includes(video.id)
            : true;
      const searchText = [
        video.title,
        video.category,
        video.source,
        video.description,
        ...(video.tags || []),
      ]
        .join(" ")
        .toLowerCase();
      return matchesCategory && matchesLibrary && (!normalized || searchText.includes(normalized));
    });
  }, [query, selectedCategory, libraryView, savedVideoIds, watchLaterIds]);

  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
    setVideoModalOpen(true);
    trackPartnerEvent("video_view", {
      uid: profile?.uid,
      email: profile?.email,
      videoId: video.id,
      category: video.category,
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const videoId = new URLSearchParams(window.location.search).get("video");
    if (!videoId || openedDeepLinkVideoRef.current === videoId) return;

    const linkedVideo = findVideo(videoId);
    if (!linkedVideo) return;

    openedDeepLinkVideoRef.current = videoId;
    setSelectedCategory("All");
    setLibraryView("all");
    setSelectedVideo(linkedVideo);
    setVideoModalOpen(true);
    trackPartnerEvent("video_view", {
      uid: profile?.uid,
      email: profile?.email,
      videoId: linkedVideo.id,
      category: linkedVideo.category,
      source: "recommendation_deep_link",
    });
  }, [profile?.email, profile?.uid]);

  const scrollToSection = (sectionId) => {
    requestAnimationFrame(() => {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setLibraryView("all");
    scrollToSection("video-section-continue");
  };

  const openResource = (resource) => {
    const linkedVideo = resource.videoId ? findVideo(resource.videoId) : null;
    if (linkedVideo) {
      handleSelectVideo(linkedVideo);
      return;
    }
    setResourceModal(resource);
  };

  const handleSidebarItem = (item) => {
    setSidebarOpen(false);

    if (item.category) {
      selectCategory(item.category);
      return;
    }

    if (item.resourceId) {
      const resource = recommendedResources.find((entry) => entry.id === item.resourceId);
      if (resource) openResource(resource);
      return;
    }

    if (item.action === "home") {
      window.location.assign("/partner-dashboard");
      return;
    }

    if (item.action === "continue") {
      setLibraryView("all");
      scrollToSection("video-section-continue");
      return;
    }

    if (item.action === "saved") {
      setSelectedCategory("All");
      setLibraryView("saved");
      scrollToSection("video-section-continue");
      return;
    }

    if (item.action === "watchLater") {
      setSelectedCategory("All");
      setLibraryView("watchLater");
      scrollToSection("video-section-continue");
      return;
    }

    if (item.action === "guides") {
      window.location.assign("/partner-dashboard/guides");
      return;
    }

    if (item.action === "glossary") {
      setResourceModal(glossaryResource);
    }
  };

  const toggleSaved = (videoId) => {
    setSavedVideoIds((current) => {
      const nextSaved = current.includes(videoId)
        ? current.filter((id) => id !== videoId)
        : [...current, videoId];
      if (!current.includes(videoId)) {
        const video = findVideo(videoId);
        trackPartnerEvent("video_save", {
          uid: profile?.uid,
          email: profile?.email,
          videoId,
          category: video?.category,
        });
      }
      saveVideoHubPreferences({
        savedVideoIds: nextSaved,
        watchLaterIds,
      });
      return nextSaved;
    });
  };

  const toggleWatchLater = (videoId) => {
    setWatchLaterIds((current) => {
      const nextWatchLater = current.includes(videoId)
        ? current.filter((id) => id !== videoId)
        : [...current, videoId];
      if (!current.includes(videoId)) {
        const video = findVideo(videoId);
        trackPartnerEvent("video_watch_later", {
          uid: profile?.uid,
          email: profile?.email,
          videoId,
          category: video?.category,
        });
      }
      saveVideoHubPreferences({
        savedVideoIds,
        watchLaterIds: nextWatchLater,
      });
      return nextWatchLater;
    });
  };

  return (
    <div className={`relative min-h-[100dvh] overflow-hidden ${darkMode ? "bg-[#050914] text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <div className={`pointer-events-none absolute inset-0 ${darkMode ? "bg-[radial-gradient(circle_at_18%_8%,rgba(34,211,238,0.14),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(217,70,239,0.14),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.4),rgba(2,6,23,0.9))]" : "bg-[radial-gradient(circle_at_18%_8%,rgba(14,165,233,0.12),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(192,38,211,0.08),transparent_28%),linear-gradient(180deg,rgba(248,250,252,0.72),rgba(241,245,249,0.96))]"}`} />
      <div className="relative grid min-h-[100dvh] gap-0 lg:grid-cols-[286px_1fr] lg:p-4">
        <SidebarNav
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          darkMode={darkMode}
          activeCategory={selectedCategory}
          savedCount={savedVideoIds.length}
          watchLaterCount={watchLaterIds.length}
          libraryView={libraryView}
          onItemSelect={handleSidebarItem}
        />
        <main className={`min-w-0 overflow-hidden backdrop-blur-xl lg:rounded-[1.75rem] lg:border ${darkMode ? "border-white/10 bg-slate-950/40" : "border-slate-200 bg-white/80 shadow-sm"}`}>
          <TopSearchBar
            query={query}
            onQueryChange={setQuery}
            onMenu={() => setSidebarOpen(true)}
            darkMode={darkMode}
            onToggleTheme={onToggleTheme}
            showAdminDashboard={showAdminDashboard}
          />
          <HeroVideoSection
            darkMode={darkMode}
            onPrimary={() => handleSelectVideo(selectedVideo || videoHubVideos[0])}
            onExplore={() => {
              setSelectedCategory("All");
              setLibraryView("all");
              scrollToSection("video-section-browse");
            }}
          />
          <CategoryFilters
            selectedCategory={selectedCategory}
            onSelect={selectCategory}
            darkMode={darkMode}
          />
          <VideoCarousel
            title={
              libraryView === "saved"
                ? "Saved Videos"
                : libraryView === "watchLater"
                  ? "Watch Later"
                  : "Continue Watching"
            }
            videos={filteredVideos}
            onSelect={handleSelectVideo}
            selectedVideo={selectedVideo}
            darkMode={darkMode}
            onViewAll={() => {
              setSelectedCategory("All");
              setLibraryView("all");
            }}
            translateText={translateText}
          />
          <RecommendedResources onOpenResource={openResource} darkMode={darkMode} />
          <TrustedResources onOpenResource={openResource} darkMode={darkMode} />
          <TopicBrowser onTopic={selectCategory} darkMode={darkMode} />
        </main>
      </div>
      {videoModalOpen && (
        <VideoPlayerModal
          video={selectedVideo}
          darkMode={darkMode}
          onClose={() => setVideoModalOpen(false)}
          saved={savedVideoIds.includes(selectedVideo.id)}
          watchLater={watchLaterIds.includes(selectedVideo.id)}
          onSave={toggleSaved}
          onWatchLater={toggleWatchLater}
          translateText={translateText}
        />
      )}
      <ResourceModal resource={resourceModal} onClose={() => setResourceModal(null)} darkMode={darkMode} />
    </div>
  );
}
