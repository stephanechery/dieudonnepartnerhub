import React from "react";
import { Activity, ArrowRight, EyeOff, GraduationCap, ShieldCheck, UserRoundCheck } from "lucide-react";
import PublicPageHeader, { getPublicPageDarkMode } from "./PublicPageHeader";

const privacyItems = [
  {
    icon: Activity,
    title: "Learning activity",
    detail: "The platform may record lesson starts and completions, quiz completion, guide opens, video views, saves, and recommendation clicks.",
  },
  {
    icon: EyeOff,
    title: "Information to leave out",
    detail: "Do not enter diagnoses, medical records, case notes, or other sensitive personal details into reflections or search.",
  },
  {
    icon: GraduationCap,
    title: "Demo access",
    detail: "The guided demo uses a learner-only experience and does not include owner or administrative tools.",
  },
  {
    icon: UserRoundCheck,
    title: "Owner access",
    detail: "Administrative tools are limited to the verified owner account. Organization demo users cannot access them.",
  },
];

export default function PrivacyPage({
  language = "en",
  onLanguageChange = () => {},
  translateText = (value) => value,
}) {
  const darkMode = getPublicPageDarkMode();
  const tx = translateText;

  return (
    <main className={`min-h-screen px-4 py-5 sm:px-6 lg:px-8 ${darkMode ? "public-page-dark" : "public-page-light"}`}>
      <div className="mx-auto max-w-5xl">
        <PublicPageHeader
          activePage="privacy"
          language={language}
          onLanguageChange={onLanguageChange}
          translateText={translateText}
        />

        <section className="public-hero rounded-[2rem] border p-5 sm:p-8 lg:p-10">
          <p className="public-eyebrow flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em]">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" /> {tx("Privacy and learning activity")}
          </p>
          <h1 className="public-heading mt-4 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-balance sm:text-5xl">
            {tx("Clear limits for a learning platform.")}
          </h1>
          <p className="public-body mt-4 max-w-3xl text-base leading-relaxed text-pretty sm:text-lg">
            {tx("Partner Hub uses limited learning activity to help people resume content and improve the experience. It is not a clinical record or case-management system.")}
          </p>
        </section>

        <section className="mt-6 grid items-start gap-4 md:grid-cols-2">
          {privacyItems.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="public-panel rounded-[1.6rem] border p-5">
                <span className="public-icon-wrap inline-flex rounded-2xl border p-3">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="public-card-title mt-4 text-lg font-black">{tx(item.title)}</h2>
                <p className="public-card-text mt-2 text-sm font-semibold leading-relaxed">{tx(item.detail)}</p>
              </article>
            );
          })}
        </section>

        <section className="public-cta-panel mt-6 flex flex-col gap-5 rounded-[1.6rem] border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="public-card-title text-lg font-black">{tx("Keep care information with the care team")}</h2>
            <p className="public-card-text mt-2 max-w-3xl text-sm font-semibold leading-relaxed">
              {tx("Use Partner Hub for education and practice. Share personal medical details only through approved healthcare channels.")}
            </p>
          </div>
          <a href="/partner-demo" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2">
            {tx("Open guided demo")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </section>
      </div>
    </main>
  );
}
