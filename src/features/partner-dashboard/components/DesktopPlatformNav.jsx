import React from "react";
import {
  GraduationCap,
  House,
  Library,
  Menu,
  PanelLeftClose,
  Video,
} from "lucide-react";
import dieudonneDarkLogo from "../../../assets/Dieudonne_Dark_Logo.png";
import ProgressBar from "./ProgressBar";

const navItems = [
  { id: "today", label: "Today", Icon: House },
  { id: "training", label: "Training", Icon: GraduationCap },
  { id: "guides", label: "Guides", Icon: Library },
  { id: "videos", label: "Videos", Icon: Video },
  { id: "more", label: "More", Icon: Menu },
];

const getInitials = (name = "Partner") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "P";

export default function DesktopPlatformNav({
  activeItem,
  authUser,
  metrics,
  onNavigate,
  onHide,
  darkMode = false,
  translateText = (value) => value,
}) {
  const tx = (value) => translateText(value);
  const completedLessons = (metrics?.modules || []).reduce(
    (total, module) => total + Number(module.completedLessons || 0),
    0
  );
  const totalLessons = (metrics?.modules || []).reduce(
    (total, module) => total + Number(module.totalLessons || 0),
    0
  );
  const displayName = authUser?.displayName || tx("Partner");

  return (
    <aside
      id="partner-platform-sidebar"
      className={`sticky top-0 hidden h-screen w-[272px] shrink-0 flex-col border-r px-5 py-7 md:flex ${
        darkMode
          ? "border-slate-800 bg-slate-950 text-slate-100"
          : "border-slate-200 bg-white text-slate-950"
      }`}
    >
      <div className="flex items-center gap-3">
        <img
          src={dieudonneDarkLogo}
          alt="Dieudonne logo"
          className={`h-11 w-11 rounded-2xl border object-contain p-1 ${
            darkMode
              ? "border-slate-700 bg-slate-900"
              : "border-slate-200 bg-slate-50"
          }`}
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-black">{tx("Partner Platform")}</p>
          <p className={`mt-0.5 truncate text-[9px] font-black uppercase tracking-[0.16em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
            {tx("Dieudonne Partner Hub")}
          </p>
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between gap-2">
        <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
          {tx("Workspace")}
        </p>
        <button
          type="button"
          onClick={onHide}
          aria-controls="partner-platform-sidebar"
          aria-expanded="true"
          className={`inline-flex min-h-11 items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
            darkMode
              ? "text-slate-300 hover:bg-slate-900 focus-visible:ring-offset-slate-950"
              : "text-slate-600 hover:bg-slate-100 focus-visible:ring-offset-white"
          }`}
        >
          <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
          {tx("Hide menu")}
        </button>
      </div>

      <nav aria-label={tx("Partner Platform desktop navigation")} className="mt-2 space-y-1.5">
        {navItems.map(({ id, label, Icon }) => {
          const active = activeItem === id;
          return (
            <button
              key={id}
              type="button"
              aria-current={active ? "page" : undefined}
              onClick={() => onNavigate(id)}
              className={`flex min-h-12 w-full items-center gap-3 rounded-2xl px-2 py-2 text-left text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${
                active
                  ? darkMode
                    ? "bg-slate-900 text-cyan-200 focus-visible:ring-offset-slate-950"
                    : "bg-cyan-50 text-cyan-800 focus-visible:ring-offset-white"
                  : darkMode
                    ? "text-slate-300 hover:bg-slate-900 hover:text-white focus-visible:ring-offset-slate-950"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-offset-white"
              }`}
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                active
                  ? darkMode
                    ? "bg-cyan-300 text-slate-950"
                    : "bg-slate-950 text-white"
                  : darkMode
                    ? "bg-slate-900 text-slate-400"
                    : "bg-slate-100 text-slate-600"
              }`}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              {tx(label)}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 pt-6">
        <section className={`rounded-3xl border p-4 ${darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-slate-50"}`}>
          <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
            {tx("Your progress")}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black">{metrics?.overallProgress || 0}%</span>
            <span className={`truncate text-xs font-bold ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              {tx(metrics?.currentModule?.title || "Training")}
            </span>
          </div>
          <ProgressBar
            className="mt-3"
            value={metrics?.overallProgress || 0}
            trackClassName={darkMode ? "bg-slate-800" : "bg-slate-200"}
          />
          <p className={`mt-2 text-xs font-semibold ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            {completedLessons} {tx("of")} {totalLessons} {tx("lessons completed")}
          </p>
        </section>

        <button
          type="button"
          onClick={() => onNavigate("more")}
          className={`flex min-h-14 w-full items-center gap-3 rounded-3xl p-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${
            darkMode
              ? "bg-cyan-300/10 hover:bg-cyan-300/15 focus-visible:ring-offset-slate-950"
              : "bg-cyan-50 hover:bg-cyan-100 focus-visible:ring-offset-white"
          }`}
        >
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black ${darkMode ? "bg-cyan-300 text-slate-950" : "bg-slate-950 text-white"}`}>
            {getInitials(displayName)}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-black">{displayName}</span>
            <span className={`block truncate text-xs font-semibold ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              {tx("Profile and settings")}
            </span>
          </span>
        </button>
      </div>
    </aside>
  );
}
