import React, { useState } from 'react';
import { ArrowDownToLine, ArrowUpRight, BookOpen, CalendarDays, Check, ChevronDown, CircleHelp, FlaskConical, LockKeyhole, Moon, ShieldCheck, Sun, Users, Activity } from 'lucide-react';
import { cohorts, periods, previewReport, previewCsv } from './previewModel';

const surface = 'rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800';
const muted = 'text-slate-600 dark:text-slate-300';
const control = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700';
const months = { '2026-07': 'July 2026', '2026-08': 'August 2026' };

function Metric({ title, value, detail, Icon, accent = false }) {
  return <article className={`${surface} min-w-0 p-4 sm:p-5`}>
    <div className="flex items-start justify-between gap-2"><h3 className={`text-sm font-bold ${muted}`}>{title}</h3><Icon className="h-4 w-4 shrink-0 text-cyan-700 dark:text-cyan-300" aria-hidden="true" /></div>
    <p className={`my-3 font-black tracking-tight tabular-nums ${value === null ? 'text-xl text-slate-500 dark:text-slate-400' : `text-4xl ${accent ? 'text-cyan-800 dark:text-cyan-300' : ''}`}`}>{value ?? 'Not reported'}</p>
    <p className={`text-xs leading-relaxed ${muted}`}>{detail}</p>
  </article>;
}

export default function ReportingPreview() {
  const [cohort, setCohort] = useState(cohorts[0].id);
  const [period, setPeriod] = useState(periods[0]);
  const [dark, setDark] = useState(false);
  const [exported, setExported] = useState(false);
  const report = previewReport(cohort, period);
  const rate = report.enrolled ? Math.round(report.active / report.enrolled * 100) : null;
  const exportPreview = () => {
    const url = URL.createObjectURL(new Blob([previewCsv(report)], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'synthetic-partner-report.csv'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); setExported(true);
  };
  return <div data-theme={dark ? 'dark' : 'light'}>
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <a href="#report-summary" className="sr-only focus:not-sr-only focus:block focus:p-3">Skip to reporting summary</a>
      <header className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2"><img src="/assets/dieudonne-foundation-logo-transparent-300dpi.png" width="2801" height="677" alt="Dieudonne" className="h-auto w-36 dark:brightness-125" /><span className={`text-sm font-semibold ${muted}`}>Partner Hub <span aria-hidden="true" className="mx-1">/</span> Reporting</span></div>
          <button className={control} onClick={() => setDark(value => !value)} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>{dark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}<span>{dark ? 'Light mode' : 'Dark mode'}</span></button>
        </div>
      </header>
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 sm:py-6">
        <aside className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-950 dark:border-amber-700/60 dark:bg-amber-950/30 dark:text-amber-100">
          <FlaskConical size={18} className="mt-0.5 shrink-0" aria-hidden="true" /><p className="text-xs leading-relaxed sm:text-sm"><strong>Synthetic preview.</strong> Sample data only. No real participants or live reporting connection. English design review.</p>
        </aside>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-cyan-800 dark:text-cyan-300">Program overview</p><h1 className="text-2xl font-black tracking-tight sm:text-3xl">Participation, made clearer.</h1><p className={`mt-2 text-sm ${muted}`}>Understand engagement. Plan your next check-in.</p></div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400"><ShieldCheck size={16} aria-hidden="true" /> Aggregate view · No personal notes</div>
        </div>
        <section aria-label="Report filters" className={`${surface} grid gap-3 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end`}>
          <div><label htmlFor="report-cohort" className={`mb-2 block text-xs font-bold ${muted}`}>Cohort</label><select id="report-cohort" className={`${control} w-full min-w-0 justify-start`} value={cohort} onChange={event => {setCohort(event.target.value);setExported(false);}}>{cohorts.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div>
          <div><label htmlFor="report-month" className={`mb-2 block text-xs font-bold ${muted}`}>Reporting month</label><select id="report-month" className={`${control} w-full min-w-0`} value={period} onChange={event => {setPeriod(event.target.value);setExported(false);}}>{periods.map(value => <option key={value} value={value}>{months[value]}</option>)}</select></div>
          <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-800 px-4 py-2 text-sm font-bold text-white hover:bg-cyan-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200" onClick={exportPreview}><ArrowDownToLine size={16} aria-hidden="true" /> Export sample CSV</button>
        </section>
        <p role="status" className="sr-only">{exported ? 'Synthetic summary downloaded.' : `${report.cohort}, ${months[period]} selected.`}</p>
        <section id="report-summary" tabIndex={-1} aria-labelledby="summary-title" className="scroll-mt-4 space-y-3 outline-none">
          <div className="flex flex-wrap items-center justify-between gap-2"><h2 id="summary-title" className="text-base font-extrabold">At a glance</h2><span className={`text-xs ${muted}`}>{report.cohort} · {months[period]}</span></div>
          {report.suppressed && <p className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-950 dark:bg-amber-950/30 dark:text-amber-100"><LockKeyhole size={17} className="shrink-0" aria-hidden="true" /> Small cohort: counts and breakdowns are withheld in this preview.</p>}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric title="Enrolled" value={report.enrolled} detail="Participants enrolled as of month end." Icon={Users} />
            <Metric title="Active participants" value={report.active} detail="Enrolled people with a learning event this month." Icon={Activity} accent />
            <Metric title="Lesson participation" value={report.completions} detail="People who completed at least one lesson this month." Icon={BookOpen} />
            <Metric title="Guide completion" value={null} detail="Device-only progress is not available for organization reporting." Icon={CircleHelp} />
          </div>
        </section>
        <div className="grid items-start gap-4 lg:grid-cols-[1.35fr_1fr]">
          <section className={`${surface} p-4 sm:p-5`} aria-labelledby="engagement-title">
            <div className="flex items-center justify-between gap-3"><h2 id="engagement-title" className="text-base font-extrabold">Learning engagement</h2><span className="rounded-full bg-cyan-50 px-2 py-1 text-[10px] font-bold text-cyan-900 dark:bg-cyan-950 dark:text-cyan-200">SAMPLE</span></div>
            <p className={`mt-1 text-xs ${muted}`}>People, not clicks. Each participant is counted once per measure.</p>
            <div className="my-5 space-y-4">{[['Active participants',report.active],['Completed a lesson',report.completions]].map(([label,value]) => <div key={label}>
              <div className="mb-2 flex justify-between gap-3 text-sm"><span className={muted}>{label}</span><strong className="tabular-nums">{value === null ? 'Withheld' : `${value} / ${report.enrolled}`}</strong></div>
              <div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"><div className="h-full rounded-full bg-cyan-700 dark:bg-cyan-300" style={{width:value === null ? '0%' : `${value/report.enrolled*100}%`}} /></div>
            </div>)}</div>
            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60"><Activity size={18} className="mt-0.5 shrink-0 text-cyan-700 dark:text-cyan-300" aria-hidden="true" /><p className={`text-xs leading-relaxed ${muted}`}>{rate === null ? 'No rate is shown when the cohort is too small.' : <><strong className="text-slate-900 dark:text-white">{rate}% active in this sample.</strong> This measures participation, not knowledge gained or health outcomes.</>}</p></div>
          </section>
          <section className={`${surface} p-4 sm:p-5`} aria-labelledby="sessions-title"><h2 id="sessions-title" className="text-base font-extrabold">Program touchpoints</h2><p className={`mt-1 text-xs ${muted}`}>Keep learning connected to practical support.</p><dl className="my-4 divide-y divide-slate-100 dark:divide-slate-700">{[['Kickoff sessions',report.kickoff],['Check-in sessions',report.checkIns]].map(([label,value])=><div className="flex items-center gap-3 py-3" key={label}><span className="rounded-lg bg-slate-100 p-2 text-cyan-800 dark:bg-slate-900 dark:text-cyan-300"><CalendarDays size={16} aria-hidden="true" /></span><dt className={`flex-1 text-sm ${muted}`}>{label}</dt><dd className="text-xl font-extrabold tabular-nums">{value ?? '—'}</dd></div>)}</dl><p className={`text-xs leading-relaxed ${muted}`}>Session counts are not attendance counts. No participant notes are included.</p></section>
        </div>
        <section className={`${surface} flex flex-wrap items-start gap-4 p-4 sm:p-5`} aria-labelledby="feedback-title"><div className="rounded-xl bg-amber-50 p-3 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200"><LockKeyhole size={20} aria-hidden="true" /></div><div className="min-w-0 flex-1 basis-64"><h2 id="feedback-title" className="text-base font-extrabold">Voluntary feedback</h2><p className={`mt-1 text-sm ${muted}`}>Withheld to protect small groups.</p><p className={`mt-2 max-w-3xl text-xs leading-relaxed ${muted}`}>Usefulness and confidence are separate self-reported measures. Too few responses or small complementary groups are suppressed. Nonresponse is not a negative response.</p></div></section>
        <details className={`${surface} group p-4`}><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-lg text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-600"><span className="flex items-center gap-2"><ShieldCheck size={17} aria-hidden="true" /> Data definitions & readiness</span><ChevronDown size={16} className="shrink-0 group-open:rotate-180" aria-hidden="true" /></summary><div className={`mt-3 space-y-3 border-t border-slate-200 pt-4 text-sm leading-relaxed dark:border-slate-700 ${muted}`}><p>Before real reporting can be enabled: verified organization membership, server/database isolation, consent and retention rules, complete event instrumentation, and an approved small-cohort privacy policy are required.</p><p>Private notes, reminders, health narratives, and learner reflections are excluded. This preview does not authorize access.</p><p>Guide completion is unavailable because current progress is stored on individual devices. Enrollment is a month-end count; participation is measured within the selected month.</p></div></details>
        <footer className={`flex flex-wrap items-center justify-between gap-2 pb-2 text-xs ${muted}`}><span className="flex items-center gap-1.5"><Check size={14} aria-hidden="true" /> Synthetic data · No live account access</span><a className="inline-flex min-h-11 items-center gap-1 font-semibold underline underline-offset-4" href="/">Return to Partner Hub <ArrowUpRight size={14} aria-hidden="true" /></a></footer>
      </div>
    </main>
  </div>;
}
