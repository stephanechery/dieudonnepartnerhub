import React from "react";
import { ArrowRight, BarChart3, BookOpenCheck, Compass, LayoutDashboard, PlayCircle, ShieldCheck, Video } from "lucide-react";
import dieudonneDarkLogo from "../../assets/Dieudonne_Dark_Logo.png";

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
    icon: LayoutDashboard,
    title: "Open the admin hub",
    detail: "Show progress, drop-off areas, content health, and recommendation follow-through.",
    href: "/owner-admin",
  },
  {
    icon: ShieldCheck,
    title: "Close with privacy",
    detail: "Show what the platform tracks, what it avoids, and why the admin hub stays coarse.",
    href: "/privacy",
  },
];

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#050914] px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-white/10 bg-slate-950/78 px-4 py-3 shadow-2xl shadow-black/20">
          <a href="/" className="flex items-center gap-3">
            <img src={dieudonneDarkLogo} alt="Dieudonne logo" className="h-10 w-auto rounded-xl border border-white/10 bg-black p-1" />
            <span className="text-sm font-black uppercase tracking-[0.16em] text-slate-300">Partner Hub</span>
          </a>
          <div className="flex flex-wrap items-center gap-2">
            <a href="/partner-orgs" className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-bold text-slate-100 transition hover:bg-white/[0.09]">For Organizations</a>
            <a href="/privacy" className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-bold text-slate-100 transition hover:bg-white/[0.09]">Privacy</a>
          </div>
        </nav>

        <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950/35 p-5 shadow-2xl shadow-black/25 sm:p-8">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
            <BarChart3 className="h-4 w-4" /> 5-minute guided demo
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
            A simple path for partner conversations.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Use this route to show the product without wandering. It moves from mission, to learner experience, to admin insight, to privacy.
          </p>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {demoSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={step.title} className="rounded-[1.6rem] border border-white/10 bg-slate-900/72 p-5 shadow-xl shadow-black/15">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Minute {index + 1}</p>
                    <h2 className="mt-1 text-lg font-black leading-tight text-white">{step.title}</h2>
                    <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-400">{step.detail}</p>
                  </div>
                </div>
                <a href={step.href} className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-black text-white transition hover:bg-white/[0.1]">
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
