import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  Brain,
  ChevronDown,
  ExternalLink,
  HandHeart,
  HeartPulse,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { getResourceSection, resourceSections } from "../data/resourcesDashboard";

const sectionIcons = {
  "urgent-help": AlertTriangle,
  "warning-signs": HeartPulse,
  "mental-health": Brain,
  "practical-support": HandHeart,
  "benefits-planning": BadgeDollarSign,
};

const toneClasses = {
  urgent: {
    icon: "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-200",
    accent: "text-rose-700 dark:text-rose-200",
  },
  warning: {
    icon: "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200",
    accent: "text-amber-800 dark:text-amber-200",
  },
  mental: {
    icon: "border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-400/30 dark:bg-violet-400/10 dark:text-violet-200",
    accent: "text-violet-700 dark:text-violet-200",
  },
  support: {
    icon: "border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-200",
    accent: "text-cyan-700 dark:text-cyan-200",
  },
  planning: {
    icon: "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200",
    accent: "text-emerald-700 dark:text-emerald-200",
  },
};

function ResourceMap({ activeSection, onSelect, translateText }) {
  const tx = (value) => translateText(value);
  const activeIndex = Math.max(0, resourceSections.findIndex(({ id }) => id === activeSection.id));
  const ActiveIcon = sectionIcons[activeSection.id];
  const buttons = resourceSections.map((section, index) => {
    const Icon = sectionIcons[section.id];
    const active = section.id === activeSection.id;
    return (
      <button
        key={section.id}
        type="button"
        aria-current={active ? "step" : undefined}
        onClick={() => onSelect(section.id)}
        className={`flex min-h-14 min-w-0 items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-black leading-snug transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 ${
          active
            ? "border-cyan-300 bg-cyan-50 text-cyan-950 ring-1 ring-cyan-200 dark:border-cyan-400/60 dark:bg-cyan-400/10 dark:text-cyan-100 dark:ring-cyan-400/20"
            : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700/70"
        }`}
      >
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
          active
            ? "border-cyan-400 bg-cyan-400 text-slate-950"
            : "border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-400"
        }`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">{tx(section.label)}</span>
        <span className="text-[10px] tabular-nums text-slate-400 dark:text-slate-500" aria-hidden="true">{index + 1}</span>
      </button>
    );
  });

  return (
    <>
      <details className="group rounded-2xl border border-slate-200 bg-white lg:hidden dark:border-slate-700 dark:bg-slate-800">
        <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 rounded-2xl px-4 py-3 font-black text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:text-slate-100">
          <ActiveIcon className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-300" aria-hidden="true" />
          <span className="min-w-0 flex-1">{tx(activeSection.label)} · {activeIndex + 1}/{resourceSections.length}</span>
          <ChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
        </summary>
        <nav aria-label={tx("Resource Guide Map")} className="space-y-2 border-t border-slate-200 p-3 dark:border-slate-700">{buttons}</nav>
      </details>

      <nav aria-label={tx("Resource Guide Map")} className="hidden grid-cols-5 gap-2 rounded-2xl border border-slate-200 bg-white p-2 lg:grid dark:border-slate-700 dark:bg-slate-800">{buttons}</nav>
    </>
  );
}

function ActionLink({ action, translateText }) {
  const tx = (value) => translateText(value);
  const external = action.kind === "external";
  const Icon = action.kind === "call" ? Phone : action.kind === "text" ? MessageCircle : ExternalLink;
  return (
    <a
      href={action.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 ${
        action.kind === "call"
          ? "bg-slate-950 text-white hover:bg-slate-800 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200"
          : "border border-slate-300 bg-white text-slate-800 hover:border-cyan-300 hover:text-cyan-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-cyan-400/50 dark:hover:text-cyan-200"
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {tx(action.label)}
    </a>
  );
}

function ResourceCard({ resource, expanded, onToggle, urgent, pinned = false, translateText }) {
  const tx = (value) => translateText(value);
  const panelId = `resource-panel-${resource.id}`;
  if (pinned) {
    return (
      <article className="self-start overflow-hidden rounded-2xl border border-rose-200 bg-white p-4 shadow-sm dark:border-rose-400/25 dark:bg-slate-800/90">
        <h4 className="text-lg font-black leading-snug text-slate-950 dark:text-white">{tx(resource.title)}</h4>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {resource.actions.map((action) => <ActionLink key={`${resource.id}-${action.href}-${action.label}`} action={action} translateText={translateText} />)}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{tx(resource.description)}</p>
        <p className="mt-3 text-xs font-semibold leading-relaxed text-slate-500 dark:text-slate-400">{tx("Verified from")} {tx(resource.source.label)}</p>
      </article>
    );
  }

  return (
    <article className={`self-start overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-slate-800/90 ${
      urgent ? "border-rose-200 dark:border-rose-400/25" : "border-slate-200 dark:border-slate-700"
    }`}>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex min-h-24 w-full items-start justify-between gap-3 p-4 text-left transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:hover:bg-white/[0.03]"
      >
        <span className="min-w-0">
          <span className="block text-lg font-black leading-snug text-slate-950 dark:text-white">{tx(resource.title)}</span>
          <span className="mt-1.5 block text-sm leading-relaxed text-slate-600 dark:text-slate-300">{tx(resource.description)}</span>
          {resource.source.checkedOn && <span className="mt-2 block text-xs font-semibold text-slate-500 dark:text-slate-400">{tx("Indiana")} · {tx("Last checked")}: <time dateTime={resource.source.checkedOn}>{resource.source.checkedOn}</time></span>}
          <span className="mt-2 block text-xs font-bold text-cyan-700 dark:text-cyan-200">{tx(expanded ? "Hide details" : "View details")}</span>
        </span>
        <ChevronDown className={`mt-1 h-5 w-5 shrink-0 text-slate-500 transition-transform motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      <div className="flex flex-col gap-2 px-4 pb-4 sm:flex-row sm:flex-wrap">
        {resource.actions.map((action) => <ActionLink key={`${resource.id}-${action.href}-${action.label}`} action={action} translateText={translateText} />)}
      </div>
      {expanded && (
        <div id={panelId} className="border-t border-slate-200 px-4 pb-4 pt-3 dark:border-slate-700">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{tx(resource.source.kind === "internal" ? "Partner Hub guide" : "External resource")}</p>
          <p className="mt-3 text-xs font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
            {tx("Verified from")} <a className="inline-flex min-h-11 items-center underline underline-offset-4 focus-visible:outline focus-visible:outline-2" href={resource.source.href} target={resource.source.kind === "external" ? "_blank" : undefined} rel={resource.source.kind === "external" ? "noopener noreferrer" : undefined}>{tx(resource.source.label)}</a>
          </p>
        </div>
      )}
    </article>
  );
}

export default function ResourcesDashboardPage({ routeSectionId = "", onNavigateSection = () => {}, translateText = (value) => value }) {
  const tx = (value) => translateText(value);
  const routedSection = getResourceSection(routeSectionId);
  const [activeSectionId, setActiveSectionId] = useState(routedSection.id);
  const [expandedIds, setExpandedIds] = useState(() => routedSection.resources.slice(0, routedSection.id === "urgent-help" ? 2 : 1).map(({ id }) => id));
  const activeSection = useMemo(() => getResourceSection(activeSectionId), [activeSectionId]);
  const activeIndex = resourceSections.findIndex(({ id }) => id === activeSection.id);
  const previousSection = resourceSections[activeIndex - 1];
  const nextSection = resourceSections[activeIndex + 1];
  const ActiveIcon = sectionIcons[activeSection.id];
  const tone = toneClasses[activeSection.tone] || toneClasses.support;

  useEffect(() => {
    const next = getResourceSection(routeSectionId);
    if (next.id === activeSectionId) return;
    setActiveSectionId(next.id);
    setExpandedIds(next.resources.slice(0, next.id === "urgent-help" ? 2 : 1).map(({ id }) => id));
  }, [activeSectionId, routeSectionId]);

  const selectSection = (sectionId) => {
    const next = getResourceSection(sectionId);
    if (next.id === activeSection.id) return;
    setActiveSectionId(next.id);
    setExpandedIds(next.resources.slice(0, next.id === "urgent-help" ? 2 : 1).map(({ id }) => id));
    onNavigateSection(next.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-white via-cyan-50/55 to-indigo-50/55 p-4 shadow-sm sm:p-5 dark:border-slate-700 dark:from-slate-800 dark:via-slate-800 dark:to-cyan-900/35">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div className="min-w-0">
            <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl dark:text-white">{tx("Find the right next contact")}</h2>
            <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">{tx("Choose what is happening, then open the safest verified next step.")}</p>
          </div>
          <div className="hidden items-center gap-2 text-xs font-bold text-slate-600 sm:flex lg:max-w-xs lg:justify-end lg:text-right dark:text-slate-300">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
            <span>{tx("Official and Partner Hub sources. Contact details can change.")}</span>
          </div>
        </div>
        <div className="mt-4 border-t border-slate-200/80 pt-4 dark:border-slate-700">
          <h3 className="mb-3 text-sm font-black text-slate-800 dark:text-slate-100">{tx("What help do you need?")}</h3>
          <ResourceMap activeSection={activeSection} onSelect={selectSection} translateText={translateText} />
        </div>
      </section>

      {activeSection.id !== "urgent-help" && <button type="button" onClick={() => selectSection("urgent-help")} className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-left text-sm font-bold text-rose-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-100"><span>{tx("Urgent help")}</span><ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></button>}

      <section aria-labelledby="resources-section-heading" className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-700 dark:bg-slate-800/75">
        <div className="flex items-start gap-3">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${tone.icon}`}><ActiveIcon className="h-5 w-5" aria-hidden="true" /></span>
          <div className="min-w-0">
            <p className={`text-[10px] font-black uppercase tracking-[0.16em] ${tone.accent}`}>{tx("Section")} {activeIndex + 1} {tx("of")} {resourceSections.length}</p>
            <h3 id="resources-section-heading" className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl dark:text-white">{tx(activeSection.title)}</h3>
            <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">{tx(activeSection.description)}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {activeSection.resources.map((resource, index) => (
            <div key={resource.id} className={index === 0 && activeSection.id === "urgent-help" ? "lg:col-span-2" : ""}>
              <ResourceCard
                resource={resource}
                urgent={activeSection.id === "urgent-help" && index < 2}
                pinned={activeSection.id === "urgent-help" && index < 2}
                expanded={expandedIds.includes(resource.id)}
                onToggle={() => setExpandedIds((current) => current.includes(resource.id) ? current.filter((id) => id !== resource.id) : [...current, resource.id])}
                translateText={translateText}
              />
            </div>
          ))}
        </div>
      </section>

      <nav aria-label={tx("Resource Guide Map")} className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
        <button type="button" disabled={!previousSection} onClick={() => previousSection && selectSection(previousSection.id)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 px-3 text-sm font-black text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> {tx("Previous")}</button>
        <button type="button" disabled={!nextSection} onClick={() => nextSection && selectSection(nextSection.id)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3 text-sm font-black text-white shadow-lg shadow-cyan-950/15 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 disabled:cursor-not-allowed disabled:opacity-40">{tx("Next")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
      </nav>

      <p className="px-1 text-xs font-semibold leading-relaxed text-slate-500 dark:text-slate-400">{tx("Partner Hub provides educational guidance, not diagnosis or a complete service directory. Confirm local contacts and eligibility with the responsible organization.")}</p>
    </div>
  );
}
