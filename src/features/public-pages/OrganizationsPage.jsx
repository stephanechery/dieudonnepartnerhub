import React from "react";
import { ArrowRight, BarChart3, BookOpenCheck, Building2, CheckCircle2, LineChart, Moon, ShieldCheck, Sun, Users } from "lucide-react";
import dieudonneDarkLogo from "../../assets/Dieudonne_Dark_Logo.png";

const partnerOutcomes = [
  "Fathers and partners know what to do before, during, and after birth.",
  "Families get practical support without turning the product into a service marketplace.",
  "Program leaders see coarse learning signals that help improve content.",
  "Privacy stays clear: no client notes, private health details, or doula case records in the admin hub.",
];

const pilotSteps = [
  "Invite a small father cohort.",
  "Track lesson completion, guide use, and video interest.",
  "Review content health after the pilot window.",
  "Decide which modules need stronger support.",
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

export default function OrganizationsPage() {
  const darkMode = getInitialDarkMode();

  return (
    <main className={`min-h-screen px-4 py-5 sm:px-6 lg:px-8 ${darkMode ? "public-page-dark" : "public-page-light"}`}>
      <div className="mx-auto max-w-7xl">
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
            <a href="/partner-demo" className="public-nav-link rounded-full border px-4 py-2 text-sm font-bold">Guided Demo</a>
            <a href="/privacy" className="public-nav-link rounded-full border px-4 py-2 text-sm font-bold">Privacy</a>
            <a href="/partner-dashboard" className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-cyan-200">Open Platform</a>
          </div>
        </nav>

        <section className="public-hero grid gap-6 rounded-[2rem] border p-5 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
          <div>
            <p className="public-eyebrow flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em]">
              <Building2 className="h-4 w-4" /> For community partners
            </p>
            <h1 className="public-heading mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              A learning platform for fathers, dads, partners, and support people.
            </h1>
            <p className="public-body mt-5 max-w-2xl text-base leading-relaxed sm:text-lg">
              Dieudonne Partner Hub helps support people build practical confidence through lessons, quizzes, video resources, and focused interactive guides.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/partner-demo" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-3 text-sm font-black text-white transition hover:from-cyan-400 hover:to-violet-400">
                View 5-minute demo <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: Users, label: "Audience", value: "Fathers and partners" },
              { icon: BookOpenCheck, label: "Learning", value: "Lessons and quizzes" },
              { icon: LineChart, label: "Signals", value: "Progress and content health" },
              { icon: ShieldCheck, label: "Privacy", value: "No private notes in admin" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.label} className="public-card rounded-2xl border p-4">
                  <span className="public-icon-wrap inline-flex rounded-2xl border p-3">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="public-muted mt-4 text-[11px] font-black uppercase tracking-[0.16em]">{item.label}</p>
                  <p className="public-card-title mt-1 text-lg font-black">{item.value}</p>
                </article>
              );
            })}
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="public-panel rounded-[1.8rem] border p-5 sm:p-6">
            <p className="public-eyebrow text-xs font-black uppercase tracking-[0.18em]">What a partner org gets</p>
            <div className="mt-5 space-y-3">
              {partnerOutcomes.map((item) => (
                <div key={item} className="public-soft-card flex gap-3 rounded-2xl border p-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                  <p className="public-body text-sm font-semibold leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="public-panel rounded-[1.8rem] border p-5 sm:p-6">
            <p className="public-violet-eyebrow flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em]">
              <BarChart3 className="h-4 w-4" /> Pilot path
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {pilotSteps.map((item, index) => (
                <article key={item} className="public-soft-card rounded-2xl border p-4">
                  <p className="public-muted text-xs font-black uppercase tracking-[0.16em]">Step {index + 1}</p>
                  <p className="public-card-title mt-2 text-sm font-bold leading-relaxed">{item}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
