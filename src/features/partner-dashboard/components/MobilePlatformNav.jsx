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
      className={`fixed inset-x-3 z-40 mx-auto max-w-md rounded-[1.4rem] border px-2 py-2 shadow-[0_18px_50px_rgba(15,23,42,0.22)] backdrop-blur-xl md:hidden ${
        darkMode
          ? "border-white/10 bg-slate-950/92"
          : "border-white/90 bg-white/92"
      }`}
      style={{ bottom: "max(env(safe-area-inset-bottom), 0.75rem)" }}
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
              className={`flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1.5 text-[10px] font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${
                active
                  ? darkMode
                    ? "bg-white/10 text-cyan-200 shadow-sm focus-visible:ring-offset-slate-950"
                    : "bg-cyan-50/90 text-cyan-800 shadow-sm focus-visible:ring-offset-white"
                  : darkMode
                    ? "text-slate-400 hover:bg-slate-900 hover:text-slate-100 focus-visible:ring-offset-slate-950"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-offset-white"
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="truncate">{translateText(label)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
