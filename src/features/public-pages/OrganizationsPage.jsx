import React from "react";
import { ArrowRight, BarChart3, BookOpenCheck, Building2, CheckCircle2, LineChart, ShieldCheck, Users } from "lucide-react";
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

export default function OrganizationsPage() {
  return (
    <main className="min-h-screen bg-[#050914] px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-white/10 bg-slate-950/78 px-4 py-3 shadow-2xl shadow-black/20">
          <a href="/" className="flex items-center gap-3">
            <img src={dieudonneDarkLogo} alt="Dieudonne logo" className="h-10 w-auto rounded-xl border border-white/10 bg-black p-1" />
            <span className="text-sm font-black uppercase tracking-[0.16em] text-slate-300">Partner Hub</span>
          </a>
          <div className="flex flex-wrap items-center gap-2">
            <a href="/demo" className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-bold text-slate-100 transition hover:bg-white/[0.09]">Guided Demo</a>
            <a href="/privacy" className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-bold text-slate-100 transition hover:bg-white/[0.09]">Privacy</a>
            <a href="/partner-dashboard" className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-cyan-200">Open Platform</a>
          </div>
        </nav>

        <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 p-5 shadow-2xl shadow-black/25 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
          <div>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
              <Building2 className="h-4 w-4" /> For community partners
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
              A learning platform for fathers, dads, partners, and support people.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Dieudonne Partner Hub helps support people build practical confidence through lessons, quizzes, video resources, and focused interactive guides.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/demo" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-3 text-sm font-black text-white transition hover:from-cyan-400 hover:to-violet-400">
                View 5-minute demo <ArrowRight className="h-4 w-4" />
              </a>
              <a href="/admin-dashboard" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-black text-white transition hover:bg-white/[0.1]">
                Admin Hub
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
                <article key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                  <span className="inline-flex rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
                  <p className="mt-1 text-lg font-black text-white">{item.value}</p>
                </article>
              );
            })}
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[1.8rem] border border-white/10 bg-slate-900/72 p-5 shadow-xl shadow-black/15 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">What a partner org gets</p>
            <div className="mt-5 space-y-3">
              {partnerOutcomes.map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                  <p className="text-sm font-semibold leading-relaxed text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[1.8rem] border border-white/10 bg-slate-900/72 p-5 shadow-xl shadow-black/15 sm:p-6">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-violet-300">
              <BarChart3 className="h-4 w-4" /> Pilot path
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {pilotSteps.map((item, index) => (
                <article key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Step {index + 1}</p>
                  <p className="mt-2 text-sm font-bold leading-relaxed text-slate-100">{item}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
