import React from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  ChartNoAxesCombined,
  Compass,
  PlayCircle,
  Sparkles,
  Video,
} from "lucide-react";
import PublicPageHeader, { getPublicPageDarkMode } from "./PublicPageHeader";

const demoSteps = [
  {
    icon: Compass,
    title: "Start with Today",
    detail: "See the next recommended action and practical support tools.",
    href: "/partner-dashboard",
  },
  {
    icon: BookOpenCheck,
    title: "Explore Training",
    detail: "Preview short lessons, progress cues, and knowledge checks.",
    href: "/partner-dashboard/training",
  },
  {
    icon: PlayCircle,
    title: "Open practical guides",
    detail: "Practice support for pregnancy, labor, postpartum, communication, and mental health.",
    href: "/partner-dashboard/guides",
  },
  {
    icon: Video,
    title: "Watch partner-focused videos",
    detail: "Browse trusted videos organized around real family needs.",
    href: "/partner-dashboard/video-hub",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Understand maternal health data",
    detail: "Review national and Indiana data with clear actions for support people.",
    href: "/partner-dashboard/maternal-data",
  },
];

const addOrganizationDemoAccess = (href) => {
  if (!href.startsWith("/partner-dashboard")) {
    return href;
  }

  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}org_demo=1`;
};

export default function DemoPage({
  language = "en",
  onLanguageChange = () => {},
  translateText = (value) => value,
}) {
  const darkMode = getPublicPageDarkMode();
  const tx = translateText;

  return (
    <main className={`min-h-screen px-4 py-5 sm:px-6 lg:px-8 ${darkMode ? "public-page-dark" : "public-page-light"}`}>
      <div className="mx-auto max-w-6xl">
        <PublicPageHeader
          activePage="demo"
          language={language}
          onLanguageChange={onLanguageChange}
          translateText={translateText}
        />

        <section className="public-hero public-hero-violet rounded-[2rem] border p-5 sm:p-8 lg:p-10">
          <div className="grid gap-7 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <p className="public-eyebrow flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em]">
                <BarChart3 className="h-4 w-4" aria-hidden="true" /> {tx("Guided preview")}
              </p>
              <h1 className="public-heading mt-4 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-balance sm:text-5xl">
                {tx("See how Partner Hub helps someone take the next right step.")}
              </h1>
              <p className="public-body mt-4 max-w-3xl text-base leading-relaxed text-pretty sm:text-lg">
                {tx("This public preview walks through the core learner experience. No demo email or password is needed.")}
              </p>
            </div>

            <div className="public-demo-access rounded-2xl border p-4 sm:p-5">
              <p className="public-eyebrow flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em]">
                <Sparkles className="h-4 w-4" aria-hidden="true" /> {tx("Ready when you are")}
              </p>
              <p className="mt-3 text-sm font-semibold leading-relaxed">
                {tx("Open a sample learner experience, then use the steps below to explore each section.")}
              </p>
              <a href="/partner-dashboard?org_demo=1" className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2">
                {tx("Start guided preview")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section aria-labelledby="demo-steps-heading" className="mt-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="public-eyebrow text-xs font-black uppercase tracking-[0.18em]">{tx("Explore at your pace")}</p>
              <h2 id="demo-steps-heading" className="public-card-title mt-2 text-2xl font-black sm:text-3xl">{tx("Five useful stops")}</h2>
            </div>
            <p className="public-card-text max-w-xl text-sm font-semibold leading-relaxed">
              {tx("Each link opens a learner-only preview and keeps owner tools out of view.")}
            </p>
          </div>

          <div className="mt-5 grid items-start gap-4 md:grid-cols-2">
            {demoSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className={`public-panel rounded-[1.6rem] border p-5 ${index === demoSteps.length - 1 ? "md:col-span-2" : ""}`}>
                  <div className="flex items-start gap-4">
                    <span className="public-icon-wrap flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="public-muted text-[11px] font-black uppercase tracking-[0.16em]">{tx("Step")} {index + 1}</p>
                      <h3 className="public-card-title mt-1 text-lg font-black leading-tight">{tx(step.title)}</h3>
                      <p className="public-card-text mt-2 text-sm font-semibold leading-relaxed">{tx(step.detail)}</p>
                    </div>
                  </div>
                  <a href={addOrganizationDemoAccess(step.href)} className="public-nav-link mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-black">
                    {tx("Preview section")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
