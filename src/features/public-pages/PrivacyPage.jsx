import React from "react";
import { ArrowRight, Database, EyeOff, FileText, ShieldCheck } from "lucide-react";
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

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#050914] px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-white/10 bg-slate-950/78 px-4 py-3 shadow-2xl shadow-black/20">
          <a href="/" className="flex items-center gap-3">
            <img src={dieudonneDarkLogo} alt="Dieudonne logo" className="h-10 w-auto rounded-xl border border-white/10 bg-black p-1" />
            <span className="text-sm font-black uppercase tracking-[0.16em] text-slate-300">Partner Hub</span>
          </a>
          <div className="flex flex-wrap items-center gap-2">
            <a href="/partner-orgs" className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-bold text-slate-100 transition hover:bg-white/[0.09]">For Organizations</a>
            <a href="/partner-demo" className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-bold text-slate-100 transition hover:bg-white/[0.09]">Guided Demo</a>
          </div>
        </nav>

        <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/35 p-5 shadow-2xl shadow-black/25 sm:p-8">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
            <ShieldCheck className="h-4 w-4" /> Privacy and analytics
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
            Product signals, not private care records.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Dieudonne Partner Hub uses activity signals to improve the learning product. The admin dashboard is designed for product decisions, not care-team case management.
          </p>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {privacyItems.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-[1.6rem] border border-white/10 bg-slate-900/72 p-5 shadow-xl shadow-black/15">
                <span className="inline-flex rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-200">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-lg font-black text-white">{item.title}</h2>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-400">{item.detail}</p>
              </article>
            );
          })}
        </section>

        <section className="mt-6 rounded-[1.6rem] border border-amber-300/20 bg-amber-300/10 p-5">
          <h2 className="text-lg font-black text-amber-100">Before a broad rollout</h2>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-amber-50/85">
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
