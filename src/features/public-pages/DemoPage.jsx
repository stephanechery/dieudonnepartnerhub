import React from "react";
import { ArrowRight, BarChart3, BookOpenCheck, Compass, Moon, PlayCircle, ShieldCheck, Sun, Video } from "lucide-react";
import dieudonneDarkLogo from "../../assets/Dieudonne_Dark_Logo.png";
import { ORGANIZATION_DEMO_CREDENTIALS } from "../partner-dashboard/services/authService";

const demoSteps = [
  {
    icon: Compass,
    title: "Start on the homepage",
    detail: "Show the mission, language support, and the entry point into the partner platform.",
    href: "/",
  },
  {
    icon: BookOpenCheck,
    title: "Open the partner platform",
    detail: "Show the resume card, next best action, module progress, and lesson structure.",
    href: "/partner-dashboard",
  },
  {
    icon: Video,
    title: "Open the video hub",
    detail: "Show trusted videos, save/watch-later behavior, and topic interest signals.",
    href: "/partner-dashboard/video-hub",
  },
  {
    icon: PlayCircle,
    title: "Open an interactive guide",
    detail: "Show focused practice for pregnancy, labor, postpartum, communication, and mental health.",
    href: "/partner-dashboard/guides",
  },
  {
    icon: ShieldCheck,
    title: "Close with privacy",
    detail: "Show what the platform tracks, what it avoids, and how partner privacy stays protected.",
    href: "/privacy",
  },
];

const addOrganizationDemoAccess = (href) => {
  if (!href.startsWith("/partner-dashboard")) {
    return href;
  }

  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}org_demo=1`;
};

const getInitialDarkMode = () => {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem("dieudonne-theme") !== "light";
};

const toggleStoredTheme = (darkMode) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("dieudonne-theme", darkMode ? "light" : "dark");
  window.location.reload();
};

export default function DemoPage() {
  const darkMode = getInitialDarkMode();

  return (
    <main className={`min-h-screen px-4 py-5 sm:px-6 lg:px-8 ${darkMode ? "public-page-dark" : "public-page-light"}`}>
      <div className="mx-auto max-w-6xl">
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
            <a href="/privacy" className="public-nav-link rounded-full border px-4 py-2 text-sm font-bold">Privacy</a>
          </div>
        </nav>

        <section className="public-hero public-hero-violet rounded-[2rem] border p-5 sm:p-8">
          <p className="public-eyebrow flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em]">
            <BarChart3 className="h-4 w-4" /> 5-minute guided demo
          </p>
          <h1 className="public-heading mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            A simple path for partner conversations.
          </h1>
          <p className="public-body mt-4 max-w-3xl text-base leading-relaxed sm:text-lg">
            Use this route to show the product without wandering. It moves from mission, to learner experience, to guided practice, to privacy.
          </p>
          <div className="public-demo-access mt-6 grid gap-3 rounded-2xl border p-4 text-sm font-bold sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="public-eyebrow text-xs font-black uppercase tracking-[0.16em]">Organization demo access</p>
              <dl className="mt-2 grid gap-1">
                <div className="grid gap-0.5 sm:grid-cols-[4.5rem_1fr] sm:gap-2">
                  <dt className="public-demo-label">Email</dt>
                  <dd className="break-all">{ORGANIZATION_DEMO_CREDENTIALS.email}</dd>
                </div>
                <div className="grid gap-0.5 sm:grid-cols-[4.5rem_1fr] sm:gap-2">
                  <dt className="public-demo-label">Password</dt>
                  <dd>{ORGANIZATION_DEMO_CREDENTIALS.password}</dd>
                </div>
              </dl>
            </div>
            <a href="/partner-dashboard?org_demo=1" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-cyan-200">
              Open demo access
            </a>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {demoSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={step.title} className="public-panel rounded-[1.6rem] border p-5">
                <div className="flex items-start gap-4">
                  <span className="public-icon-wrap flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="public-muted text-[11px] font-black uppercase tracking-[0.16em]">Minute {index + 1}</p>
                    <h2 className="public-card-title mt-1 text-lg font-black leading-tight">{step.title}</h2>
                    <p className="public-card-text mt-2 text-sm font-semibold leading-relaxed">{step.detail}</p>
                  </div>
                </div>
                <a href={addOrganizationDemoAccess(step.href)} className="public-nav-link mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-black">
                  Open step <ArrowRight className="h-4 w-4" />
                </a>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
