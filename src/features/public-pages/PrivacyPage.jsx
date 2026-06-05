import React from "react";
import { ArrowRight, Database, EyeOff, FileText, Moon, ShieldCheck, Sun } from "lucide-react";
import dieudonneDarkLogo from "../../assets/Dieudonne_Dark_Logo.png";

const privacyItems = [
  {
    icon: Database,
    title: "What the product tracks",
    detail: "Coarse learning activity such as lesson starts, lesson completions, quiz completion, guide opens, video views, saves, and recommendation clicks.",
  },
  {
    icon: EyeOff,
    title: "What the admin hub avoids",
    detail: "No client case notes, doula logs, private medical details, or sensitive health narratives are needed for product decisions.",
  },
  {
    icon: FileText,
    title: "Free-text caution",
    detail: "Reflection prompts should be treated carefully. Users should avoid entering private medical or family details unless a clear retention policy is in place.",
  },
  {
    icon: ShieldCheck,
    title: "Admin access",
    detail: "Admin access is restricted and should move to server-enforced Supabase roles before broad partner rollout.",
  },
];

const getInitialDarkMode = () => {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem("dieudonne-theme") !== "light";
};

const toggleStoredTheme = (darkMode) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("dieudonne-theme", darkMode ? "light" : "dark");
  window.location.reload();
};

export default function PrivacyPage() {
  const darkMode = getInitialDarkMode();

  return (
    <main className={`min-h-screen px-4 py-5 sm:px-6 lg:px-8 ${darkMode ? "public-page-dark" : "public-page-light"}`}>
      <div className="mx-auto max-w-5xl">
        <nav className="public-nav mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border px-4 py-3">
          <a href="/" className="flex items-center gap-3">
            <img src={dieudonneDarkLogo} alt="Dieudonne logo" className="public-logo h-10 w-auto rounded-xl border p-1" />
            <span className="public-brand text-sm font-black uppercase tracking-[0.16em]">Partner Hub</span>
          </a>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => toggleStoredTheme(darkMode)}
              aria-pressed={darkMode}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="public-theme-toggle inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-sm font-bold"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <a href="/partner-orgs" className="public-nav-link rounded-full border px-4 py-2 text-sm font-bold">For Organizations</a>
            <a href="/partner-demo" className="public-nav-link rounded-full border px-4 py-2 text-sm font-bold">Guided Demo</a>
          </div>
        </nav>

        <section className="public-hero rounded-[2rem] border p-5 sm:p-8">
          <p className="public-eyebrow flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em]">
            <ShieldCheck className="h-4 w-4" /> Privacy and analytics
          </p>
          <h1 className="public-heading mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Product signals, not private care records.
          </h1>
          <p className="public-body mt-4 max-w-3xl text-base leading-relaxed sm:text-lg">
            Dieudonne Partner Hub uses activity signals to improve the learning product. The admin dashboard is designed for product decisions, not care-team case management.
          </p>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {privacyItems.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="public-panel rounded-[1.6rem] border p-5">
                <span className="public-icon-wrap inline-flex rounded-2xl border p-3">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="public-card-title mt-4 text-lg font-black">{item.title}</h2>
                <p className="public-card-text mt-2 text-sm font-semibold leading-relaxed">{item.detail}</p>
              </article>
            );
          })}
        </section>

        <section className="public-amber-panel mt-6 rounded-[1.6rem] border p-5">
          <h2 className="public-amber-heading text-lg font-black">Before a broad rollout</h2>
          <p className="public-amber-text mt-2 text-sm font-semibold leading-relaxed">
            Finalize Supabase RLS policies, server-enforced admin roles, a retention policy, and a public privacy policy reviewed by counsel.
          </p>
          <a href="/partner-demo" className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-200 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-amber-100">
            Open guided demo <ArrowRight className="h-4 w-4" />
          </a>
        </section>
      </div>
    </main>
  );
}
