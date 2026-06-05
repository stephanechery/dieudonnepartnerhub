import React, { useEffect, useMemo, useState } from "react";
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
  Menu,
  MessageCircleQuestion,
  Play,
  Search,
  Settings,
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
        className={`fixed inset-y-0 left-0 z-40 w-[286px] border-r border-white/10 bg-slate-950/95 px-4 py-5 shadow-2xl shadow-slate-950/60 transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-[calc(100dvh-2rem)] lg:translate-x-0 lg:rounded-[1.75rem] lg:border lg:bg-slate-950/70 lg:shadow-none ${
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
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">
                Partner Hub
              </p>
              <p className="text-sm font-black text-white">Video Library</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-xl border border-white/10 p-2 text-slate-300 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
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
                          ? "border border-white/10 bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                          : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-100"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="min-w-0 flex-1">{item.label}</span>
                      {count > 0 && (
                        <span className="rounded-full bg-cyan-300/15 px-2 py-0.5 text-[10px] font-black text-cyan-100">
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

        <div className="mt-8 rounded-2xl border border-violet-300/20 bg-violet-300/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <p className="text-sm font-black text-violet-100">Need guidance?</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            Save a video pack before the next appointment or birth planning call.
          </p>
          <button
            type="button"
            onClick={() => onItemSelect({ action: "watchLater" })}
            className="mt-4 w-full rounded-xl border border-violet-300/30 bg-violet-300/10 px-3 py-2 text-sm font-black text-violet-100 transition hover:bg-violet-300/15 active:scale-[0.98]"
          >
            Build Watchlist
          </button>
        </div>
      </aside>
    </>
  );
}

function TopSearchBar({ query, onQueryChange, onMenu }) {
  return (
    <div className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/86 px-4 py-4 backdrop-blur-xl lg:rounded-t-[1.75rem]">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open video navigation"
          onClick={onMenu}
          className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-slate-200 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <label className="sr-only" htmlFor="video-search">
          Search videos, topics, or experts
        </label>
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input
            id="video-search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search videos, topics, or experts..."
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-12 pr-4 text-sm font-semibold text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:bg-white/[0.07]"
          />
        </div>
        <button className="hidden h-12 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-black text-slate-200 transition hover:bg-white/[0.07] md:flex">
          <Globe2 className="h-4 w-4" />
          EN
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </button>
        <a
          href="/owner-admin"
          aria-label="Open admin hub"
          title="Admin hub"
          className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10 text-cyan-100 transition hover:bg-cyan-300/15 xl:flex"
        >
          <Settings className="h-5 w-5" />
        </a>
        <button className="hidden h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 text-sm font-black text-slate-100 transition hover:bg-white/[0.07] sm:flex">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300/70 to-fuchsia-300/70 text-slate-950">
            <UserRound className="h-4 w-4" />
          </span>
          Partner
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </button>
      </div>
    </div>
  );
}

function HeroVisualCard() {
  return (
    <section
      className="relative w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#070d1d] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.45)] md:p-4"
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

function HeroVideoSection({ onPrimary, onExplore }) {
  return (
    <section className="grid gap-7 border-b border-white/10 px-4 py-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-7 lg:py-10">
      <div className="flex min-w-0 flex-col justify-center">
        <p className="mb-3 w-fit rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-cyan-200">
          Dieudonne Partner Video Hub
        </p>
        <h1 className="max-w-2xl text-4xl font-black leading-[0.95] tracking-tight text-white md:text-6xl">
          Support her with confidence.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
          Evidence-based videos, practical tools, and partner-focused guidance to help you understand pregnancy, birth, postpartum recovery, and newborn care, all in one place.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onPrimary}
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-5 text-sm font-black text-white transition hover:from-cyan-400 hover:to-fuchsia-400 active:scale-[0.98]"
          >
            <Play className="h-4 w-4" />
            Continue Learning
          </button>
          <button
            type="button"
            onClick={onExplore}
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm font-black text-slate-100 transition hover:bg-white/[0.08] active:scale-[0.98]"
          >
            <Library className="h-4 w-4" />
            Explore Topics
          </button>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {["Curated sources", "In-hub playback", "Partner-ready"].map((label) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      <HeroVisualCard />
    </section>
  );
}

function CategoryFilters({ selectedCategory, onSelect }) {
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
                  ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100"
                  : "border-white/10 bg-white/[0.04] text-slate-400 hover:bg-white/[0.07] hover:text-slate-100"
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

function VideoCard({ video, onSelect, selected }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(video)}
      className={`group min-w-[250px] max-w-[250px] text-left transition hover:-translate-y-1 active:scale-[0.98] ${
        selected ? "opacity-100" : "opacity-90 hover:opacity-100"
      }`}
    >
      <div className={`relative overflow-hidden rounded-2xl border bg-slate-900 ${selected ? "border-cyan-300/40" : "border-white/10"}`}>
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
      <h3 className="mt-3 line-clamp-2 text-base font-black leading-tight text-white">
        {video.title}
      </h3>
      <p className="mt-1 text-sm font-bold text-cyan-300">{video.category}</p>
      <p className="mt-1 text-xs font-semibold text-slate-500">{video.progress}% complete</p>
    </button>
  );
}

function VideoCarousel({ title, videos, onSelect, selectedVideo, onViewAll }) {
  if (!videos.length) {
    const emptyCopy =
      title === "Saved Videos"
        ? "No saved videos yet. Open a video and tap Save to build this list."
        : title === "Watch Later"
          ? "No videos added to Watch Later yet. Open a video and tap Watch Later to build your watchlist."
          : "No videos match this search yet.";

    return (
      <section className="px-4 py-8 lg:px-7">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 text-slate-400">
          {emptyCopy}
        </div>
      </section>
    );
  }

  return (
    <section id="video-section-continue" className="px-4 py-7 lg:px-7">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black text-white">{title}</h2>
        <button
          type="button"
          onClick={onViewAll}
          className="text-sm font-black text-slate-400 transition hover:text-cyan-200"
        >
          View all
        </button>
      </div>
      <div className="flex gap-5 overflow-x-auto pb-3">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onSelect={onSelect}
            selected={video.id === selectedVideo.id}
          />
        ))}
      </div>
    </section>
  );
}

function RecommendedResources({ onOpenResource }) {
  return (
    <section id="video-section-recommended" className="border-t border-white/10 px-4 py-7 lg:px-7">
      <h2 className="mb-4 text-xl font-black text-white">Recommended for You</h2>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr_1.15fr] xl:grid-cols-5">
        {recommendedResources.map((resource) => (
          <button
            key={resource.id}
            type="button"
            onClick={() => onOpenResource(resource)}
            className="group rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.07] active:scale-[0.99]"
          >
            <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
              <FileText className="h-5 w-5" />
            </span>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-300">
              {resource.label}
            </p>
            <h3 className="mt-2 text-base font-black leading-tight text-white">
              {resource.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {resource.description}
            </p>
            <p className="mt-4 text-sm font-black text-slate-200 group-hover:text-cyan-200">
              {resource.action}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}

function TrustedResources({ onOpenResource }) {
  return (
    <section id="video-section-trusted" className="border-t border-white/10 px-4 py-7 lg:px-7">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Best of the Best</h2>
          <p className="mt-1 text-sm text-slate-400">
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
            className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-left transition hover:-translate-y-1 hover:border-violet-300/30 hover:bg-white/[0.05] active:scale-[0.99]"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-violet-300">
              {resource.source}
            </p>
            <h3 className="mt-2 text-sm font-black leading-tight text-white">{resource.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">{resource.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function TopicBrowser({ onTopic }) {
  return (
    <section id="video-section-browse" className="border-t border-white/10 px-4 py-7 lg:px-7">
      <h2 className="mb-4 text-xl font-black text-white">Browse Topics</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {browseTopics.map((topic) => (
          <button
            key={topic}
            type="button"
            onClick={() => onTopic(topic)}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-left text-sm font-black text-slate-200 transition hover:border-cyan-300/30 hover:bg-white/[0.07] active:scale-[0.99]"
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
  saved,
  watchLater,
  onSave,
  onWatchLater,
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
      <div className="relative max-h-[94dvh] w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950 shadow-2xl shadow-slate-950/80">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_88%_80%,rgba(217,70,239,0.14),transparent_36%)]" />
        <div className="relative z-[1] grid max-h-[94dvh] overflow-y-auto lg:grid-cols-[1.55fr_0.85fr]">
          <div className="bg-slate-950">
            <VideoEmbed video={video} />
          </div>
          <aside className="flex min-h-0 flex-col border-t border-white/10 p-5 lg:border-l lg:border-t-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${categoryAccent[video.category] || "border-white/10 bg-white/[0.05] text-slate-300"}`}>
                    {video.category}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{video.duration}</span>
                </div>
                <h2 className="text-2xl font-black leading-tight tracking-tight text-white">
                  {video.title}
                </h2>
                <p className="mt-2 text-sm font-bold text-cyan-200">{video.source}</p>
              </div>
              <button
                type="button"
                aria-label="Close video"
                onClick={onClose}
                className="shrink-0 rounded-xl border border-white/10 p-2 text-slate-300 transition hover:bg-white/[0.06]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              {video.description}
            </p>

            <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <div className="mb-2 flex items-center justify-between text-xs font-bold text-cyan-100/80">
                <span>Progress</span>
                <span>{video.progress}% complete</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.1]">
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
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-slate-100 transition hover:bg-white/[0.08] active:scale-[0.98]"
              >
                Send to Friend or Family Member
              </button>
              {shareStatus && (
                <p className="-mt-1 rounded-xl border border-cyan-300/15 bg-cyan-300/10 px-3 py-2 text-xs font-bold text-cyan-100">
                  {shareStatus}
                </p>
              )}
              <button
                type="button"
                onClick={() => onSave(video.id)}
                className={`rounded-2xl border px-4 py-3 text-sm font-black transition active:scale-[0.98] ${
                  saved
                    ? "border-cyan-300/30 bg-cyan-300/15 text-cyan-100"
                    : "border-white/10 bg-white/[0.04] text-slate-100 hover:bg-white/[0.08]"
                }`}
              >
                {saved ? "Saved" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => onWatchLater(video.id)}
                className={`rounded-2xl border px-4 py-3 text-sm font-black transition active:scale-[0.98] ${
                  watchLater
                    ? "border-fuchsia-300/30 bg-fuchsia-300/15 text-fuchsia-100"
                    : "border-white/10 bg-white/[0.04] text-slate-100 hover:bg-white/[0.08]"
                }`}
              >
                {watchLater ? "Added to Watch Later" : "Watch Later"}
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs leading-relaxed text-slate-400">
              Review this together, pause for questions, then save the main action you want to bring into the next appointment or recovery check-in.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ResourceModal({ resource, onClose }) {
  if (!resource) return null;
  const hasSections = Array.isArray(resource.sections) && resource.sections.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md">
      <div className="max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-[1.75rem] border border-white/10 bg-slate-950 p-5 shadow-2xl shadow-slate-950/70">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">
              {resource.source || resource.label}
            </p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
              {resource.title}
            </h3>
          </div>
          <button
            type="button"
            aria-label="Close resource"
            onClick={onClose}
            className="rounded-xl border border-white/10 p-2 text-slate-300 transition hover:bg-white/[0.06]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          {resource.description}
        </p>
        {hasSections ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {resource.sections.map((section) => (
              <div
                key={section.title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <h4 className="text-sm font-black text-white">{section.title}</h4>
                <ul className="mt-3 space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm leading-relaxed text-slate-300">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            {resource.details}
          </p>
        )}
        <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-relaxed text-cyan-100">
          Partner use: {resource.partnerAction || "save the key point, discuss it with mom, and bring it to the care team when it affects safety or preferences."}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-3 text-sm font-black text-white transition hover:from-cyan-400 hover:to-fuchsia-400 active:scale-[0.98]"
        >
          Back to Hub
        </button>
      </div>
    </div>
  );
}

export default function VideoHubPage() {
  const { profile, saveVideoHubPreferences } = usePartnerDashboard();
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
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#050914] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(34,211,238,0.14),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(217,70,239,0.14),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.4),rgba(2,6,23,0.9))]" />
      <div className="relative grid min-h-[100dvh] gap-0 lg:grid-cols-[286px_1fr] lg:p-4">
        <SidebarNav
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeCategory={selectedCategory}
          savedCount={savedVideoIds.length}
          watchLaterCount={watchLaterIds.length}
          libraryView={libraryView}
          onItemSelect={handleSidebarItem}
        />
        <main className="min-w-0 overflow-hidden border-white/10 bg-slate-950/38 backdrop-blur-xl lg:rounded-[1.75rem] lg:border">
          <TopSearchBar
            query={query}
            onQueryChange={setQuery}
            onMenu={() => setSidebarOpen(true)}
          />
          <HeroVideoSection
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
            onViewAll={() => {
              setSelectedCategory("All");
              setLibraryView("all");
            }}
          />
          <RecommendedResources onOpenResource={openResource} />
          <TrustedResources onOpenResource={openResource} />
          <TopicBrowser onTopic={selectCategory} />
        </main>
      </div>
      {videoModalOpen && (
        <VideoPlayerModal
          video={selectedVideo}
          onClose={() => setVideoModalOpen(false)}
          saved={savedVideoIds.includes(selectedVideo.id)}
          watchLater={watchLaterIds.includes(selectedVideo.id)}
          onSave={toggleSaved}
          onWatchLater={toggleWatchLater}
        />
      )}
      <ResourceModal resource={resourceModal} onClose={() => setResourceModal(null)} />
    </div>
  );
}
