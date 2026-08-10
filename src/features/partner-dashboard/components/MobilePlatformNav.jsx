import React from "react";
import { GraduationCap, House, Library, Menu, Video } from "lucide-react";

const navItems = [
  { id: "today", label: "Today", Icon: House },
  { id: "training", label: "Training", Icon: GraduationCap },
  { id: "guides", label: "Guides", Icon: Library },
  { id: "videos", label: "Videos", Icon: Video },
  { id: "more", label: "More", Icon: Menu },
];

export default function MobilePlatformNav({
  activeItem,
  onNavigate,
  darkMode = false,
  translateText = (value) => value,
}) {
  return (
    <nav
      aria-label={translateText("Partner Platform navigation")}
      className={`fixed inset-x-4 z-40 mx-auto max-w-md transform-gpu rounded-[2.125rem] border px-2 py-[9px] shadow-[0_18px_45px_-18px_rgba(2,6,23,0.3)] will-change-transform md:hidden ${
        darkMode
          ? "border-slate-700/70 bg-slate-900"
          : "border-slate-200 bg-white"
      }`}
      style={{ bottom: "max(env(safe-area-inset-bottom), 1rem)" }}
    >
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {navItems.map(({ id, label, Icon }) => {
          const active = activeItem === id;

          return (
            <button
              key={id}
              type="button"
              aria-current={active ? "page" : undefined}
              aria-label={translateText(label)}
              onClick={() => onNavigate(id)}
              className={`flex min-h-16 min-w-0 flex-col items-center justify-center gap-[3px] rounded-[1.625rem] border px-1 py-2 text-[11px] font-black leading-[14px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${
                active
                  ? darkMode
                    ? "border-cyan-400/50 bg-cyan-950/70 text-cyan-200 shadow-sm focus-visible:ring-offset-slate-950"
                    : "border-cyan-300 bg-cyan-50 text-cyan-800 shadow-sm focus-visible:ring-offset-white"
                  : darkMode
                    ? "border-transparent text-slate-400 hover:border-white/10 hover:bg-slate-800 hover:text-slate-100 focus-visible:ring-offset-slate-950"
                    : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-offset-white"
              }`}
            >
              <Icon className="h-[25px] w-[25px]" aria-hidden="true" />
              <span className="truncate">{translateText(label)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
