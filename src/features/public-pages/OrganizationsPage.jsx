import React from "react";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  CheckCircle2,
  Globe2,
  HeartHandshake,
  House,
  Languages,
  Presentation,
  Stethoscope,
  Users,
} from "lucide-react";
import PublicPageHeader, { getPublicPageDarkMode } from "./PublicPageHeader";

const participantBenefits = [
  { text: "Clear next steps for supporting mom before, during, and after birth." },
  { text: "Practice for appointments, labor support, recovery, warning signs, and communication." },
  { text: "Lessons, videos, and interactive guides in one place." },
  { text: "A private learning experience that does not ask for clinical case notes." },
];

const organizationUses = [
  {
    icon: Users,
    title: "Fatherhood and family programs",
    detail: "Add practical partner education to existing group sessions.",
  },
  {
    icon: Presentation,
    title: "Prenatal education",
    detail: "Give support people a clear role before appointments and birth.",
  },
  {
    icon: House,
    title: "Home visiting and community health",
    detail: "Reinforce lessons with mobile-friendly tools families can revisit.",
  },
  {
    icon: HeartHandshake,
    title: "Workshops and support groups",
    detail: "Use guided content for discussion, practice, and follow-through.",
  },
];

export default function OrganizationsPage({
  language = "en",
  onLanguageChange = () => {},
  translateText = (value) => value,
}) {
  const darkMode = getPublicPageDarkMode();
  const tx = translateText;

  return (
    <main className={`min-h-screen px-4 py-5 sm:px-6 lg:px-8 ${darkMode ? "public-page-dark" : "public-page-light"}`}>
      <div className="mx-auto max-w-7xl">
        <PublicPageHeader
          activePage="organizations"
          language={language}
          onLanguageChange={onLanguageChange}
          translateText={translateText}
          showPlatformLink
        />

        <section className="public-hero grid gap-7 rounded-[2rem] border p-5 sm:p-8 lg:grid-cols-[1.08fr_0.92fr] lg:p-10">
          <div className="self-center">
            <p className="public-eyebrow flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em]">
              <Building2 className="h-4 w-4" aria-hidden="true" /> {tx("For organizations and community programs")}
            </p>
            <h1 className="public-heading mt-4 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-balance sm:text-5xl">
              {tx("Equip fathers and support people with practical maternal health skills.")}
            </h1>
            <p className="public-body mt-5 max-w-2xl text-base leading-relaxed text-pretty sm:text-lg">
              {tx("Partner Hub gives families a clear place to learn what to do during pregnancy, labor, birth, and postpartum recovery. Programs can use it alongside classes, fatherhood groups, and family support services.")}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/partner-demo" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-3 text-sm font-black text-white transition hover:from-cyan-400 hover:to-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2">
                {tx("Explore guided demo")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href="/partner-dashboard" className="public-nav-link inline-flex min-h-12 items-center justify-center rounded-2xl border px-5 py-3 text-sm font-black">
                {tx("Open Partner Hub")}
              </a>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: Users, label: "Built for", value: "Fathers and support people" },
              { icon: Stethoscope, label: "Covers", value: "Pregnancy through postpartum" },
              { icon: BookOpenCheck, label: "Format", value: "Short lessons and practical tools" },
              { icon: Languages, label: "Languages", value: "English, Spanish, French, and Haitian Creole" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.label} className="public-card rounded-2xl border p-4">
                  <span className="public-icon-wrap inline-flex rounded-2xl border p-3">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="public-muted mt-4 text-[11px] font-black uppercase tracking-[0.16em]">{tx(item.label)}</p>
                  <p className="public-card-title mt-1 text-lg font-black leading-tight">{tx(item.value)}</p>
                </article>
              );
            })}
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="public-panel rounded-[1.8rem] border p-5 sm:p-6">
            <p className="public-eyebrow text-xs font-black uppercase tracking-[0.18em]">{tx("What participants receive")}</p>
            <div className="mt-5 space-y-3">
              {participantBenefits.map((item) => (
                <div key={item.text} className="public-soft-card flex gap-3 rounded-2xl border p-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
                  <p className="public-body text-sm font-semibold leading-relaxed">{tx(item.text)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="public-panel rounded-[1.8rem] border p-5 sm:p-6">
            <p className="public-violet-eyebrow flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em]">
              <Globe2 className="h-4 w-4" aria-hidden="true" /> {tx("How organizations can use it")}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {organizationUses.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="public-soft-card rounded-2xl border p-4">
                    <Icon className="h-5 w-5 text-cyan-500" aria-hidden="true" />
                    <h2 className="public-card-title mt-3 text-base font-black leading-tight">{tx(item.title)}</h2>
                    <p className="public-card-text mt-2 text-sm font-semibold leading-relaxed">{tx(item.detail)}</p>
                  </article>
                );
              })}
            </div>
          </section>
        </div>

        <section className="public-cta-panel mt-6 flex flex-col gap-5 rounded-[1.8rem] border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="public-card-title text-xl font-black">{tx("Ready to preview the experience?")}</h2>
            <p className="public-card-text mt-2 max-w-3xl text-sm font-semibold leading-relaxed">
              {tx("Walk through the same Today, Training, Guides, Videos, and Maternal Data sections that learners use.")}
            </p>
          </div>
          <a href="/partner-demo" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2">
            {tx("Explore guided demo")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </section>
      </div>
    </main>
  );
}
