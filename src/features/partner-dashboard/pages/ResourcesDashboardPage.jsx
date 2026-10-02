import React, { useEffect, useState } from "react";
import { ArrowRight, ExternalLink, Phone, MessageCircle, AlertTriangle } from "lucide-react";
import { resourceSections, resourceRegion, filterResources } from "../data/resourcesDashboard";

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500";
const regions = ["All resources", "Indiana", "United States", "Partner Hub guide"];

function ActionLink({ action, translateText }) {
  const external = action.kind === "external";
  const Icon = action.kind === "call" ? Phone : action.kind === "text" ? MessageCircle : ExternalLink;
  return <a href={action.href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}
    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold ${focus} ${action.kind === "call" ? "border-cyan-800 bg-cyan-800 text-white dark:border-cyan-300 dark:bg-cyan-300 dark:text-slate-950" : "border-slate-300 text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-700"}`}>
    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />{translateText(action.label)}
  </a>;
}

function ResourceCard({ resource, translateText }) {
  const tx = translateText;
  return <article id={`resource-${resource.id}`} tabIndex={-1} className={`scroll-mt-6 self-start rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-700 dark:bg-slate-800 ${focus}`}>
    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{tx(resourceRegion(resource))}</p>
    <h3 className="mt-2 text-lg font-black leading-snug text-slate-950 dark:text-white">{tx(resource.title)}</h3>
    <p className="mt-2 max-w-prose text-sm leading-relaxed text-slate-600 dark:text-slate-300">{tx(resource.description)}</p>
    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      {resource.actions.map(action => <ActionLink key={`${action.href}-${action.label}`} action={action} translateText={tx} />)}
    </div>
    <details className="mt-3 border-t border-slate-100 pt-1 dark:border-slate-700">
      <summary className={`min-h-11 cursor-pointer rounded-lg py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 ${focus}`}>{tx("Source details")}</summary>
      <a href={resource.source.href} target={resource.source.kind === "external" ? "_blank" : undefined} rel={resource.source.kind === "external" ? "noopener noreferrer" : undefined} className={`inline-flex min-h-11 items-center text-xs leading-relaxed text-cyan-800 underline dark:text-cyan-200 ${focus}`}>{tx(resource.source.label)}</a>
      {resource.source.checkedOn && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{tx("Last checked")}: <time dateTime={resource.source.checkedOn}>{resource.source.checkedOn}</time></p>}
      {resource.source.serviceLanguages && <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{tx(resource.source.serviceLanguages)}</p>}
      {resource.source.kind === "external" && <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{tx("Confirm hours, eligibility and service languages with the provider.")}</p>}
    </details>
  </article>;
}

export default function ResourcesDashboardPage({ routeSectionId = "", initialResourceId = "", onNavigateSection = () => {}, translateText = value => value }) {
  const tx = translateText;
  const activeSection = resourceSections.find(({ id }) => id === routeSectionId);
  const [region, setRegion] = useState("All resources");
  const targetId = activeSection?.resources.find(item => item.id === initialResourceId)?.id || "";
  useEffect(() => {
    setRegion("All resources");
    if (!targetId) return;
    const frame = window.requestAnimationFrame(() => {
      const node = document.getElementById(`resource-${targetId}`);
      node?.scrollIntoView({ block: "start", behavior: "auto" });
      node?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [routeSectionId, targetId]);

  const selectSection = id => {
    onNavigateSection(id);
    window.scrollTo({ top: 0, behavior: "auto" });
  };
  const items = activeSection ? filterResources(activeSection.resources, region) : [];
  const ordered = [...items].sort((a, b) => Number(b.id === targetId) - Number(a.id === targetId));
  return <div className="space-y-4 sm:space-y-6">
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div><h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl dark:text-white">{tx("Find the right next contact")}</h2>
        <p className="mt-1 max-w-prose text-sm leading-relaxed text-slate-600 dark:text-slate-300">{tx("Choose what is happening, then open the safest verified next step.")}</p></div>
      {activeSection?.id !== "urgent-help" && <button onClick={() => selectSection("urgent-help")} className={`inline-flex min-h-11 items-center gap-2 rounded-xl border border-rose-200 px-3 text-sm font-bold text-rose-800 dark:border-rose-400/30 dark:text-rose-200 ${focus}`}><AlertTriangle className="h-4 w-4" aria-hidden="true" />{tx("Urgent help")}</button>}
    </header>
    <div className={activeSection ? "grid items-start gap-4 xl:grid-cols-[13rem_minmax(0,1fr)] xl:gap-6" : ""}>
      <nav aria-label={tx("What help do you need?")} className={activeSection ? "xl:sticky xl:top-6" : ""}>
        {activeSection ? <>
          <label className="block text-xs font-bold text-slate-600 xl:hidden dark:text-slate-300">{tx("What help do you need?")}
            <select aria-label={tx("What help do you need?")} value={activeSection.id} onChange={event => selectSection(event.target.value)} className={`mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white ${focus}`}>
              <option value="">{tx("All resources")}</option>
              {resourceSections.map(section => <option key={section.id} value={section.id}>{tx(section.label)}</option>)}
            </select>
          </label>
          <div className="hidden space-y-1 xl:block">
            <button onClick={() => selectSection("")} className={`min-h-11 w-full rounded-xl px-3 text-left text-sm font-bold text-slate-600 dark:text-slate-300 ${focus}`}>{tx("All resources")}</button>
            {resourceSections.map(section => <button key={section.id} aria-current={activeSection.id === section.id ? "page" : undefined} onClick={() => selectSection(section.id)} className={`min-h-12 w-full rounded-xl px-3 text-left text-sm font-bold ${focus} ${activeSection.id === section.id ? "bg-cyan-50 text-cyan-900 dark:bg-cyan-300/10 dark:text-cyan-200" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}>{tx(section.label)}</button>)}
          </div>
        </> : <section aria-labelledby="resource-needs-heading">
          <h3 id="resource-needs-heading" className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">{tx("What help do you need?")}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {resourceSections.map(section => <button key={section.id} onClick={() => selectSection(section.id)} className={`flex min-h-20 items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left hover:border-cyan-400 dark:border-slate-700 dark:bg-slate-800 ${focus}`}>
              <span><span className="block text-lg font-bold text-slate-950 dark:text-white">{tx(section.label)}</span><span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">{tx(section.title)}</span></span><ArrowRight className="h-5 w-5 shrink-0 text-cyan-700 dark:text-cyan-300" aria-hidden="true" />
            </button>)}
          </div>
        </section>}
      </nav>
      {activeSection && <section aria-labelledby="resources-section-heading" className="min-w-0">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 id="resources-section-heading" className="text-xl font-black text-slate-950 dark:text-white">{tx(activeSection.label)}</h3>
          {activeSection.id !== "urgent-help" && <label className="flex max-w-full flex-wrap items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">{tx("Show resources")}
            <select aria-label={tx("Show resources")} value={region} onChange={event => setRegion(event.target.value)} className={`min-h-11 max-w-full rounded-xl border border-slate-300 bg-white px-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white ${focus}`}>{regions.map(value => <option key={value} value={value}>{tx(value)}</option>)}</select>
          </label>}
        </div>
        {activeSection.id === "urgent-help" && <p className="mb-4 max-w-prose text-sm leading-relaxed text-slate-600 dark:text-slate-300">{tx(activeSection.description)}</p>}
        <div className="grid items-start gap-3 lg:grid-cols-2">{ordered.map(resource => <ResourceCard key={resource.id} resource={resource} translateText={tx} />)}</div>
        {!items.length && <p role="status" className="rounded-xl bg-slate-100 p-4 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{tx("No resources in this view. Choose All resources.")}</p>}
      </section>}
    </div>
    <p className="max-w-prose text-xs leading-relaxed text-slate-500 dark:text-slate-400">{tx("Partner Hub provides educational guidance, not diagnosis or a complete service directory. Confirm local contacts and eligibility with the responsible organization.")}</p>
  </div>;
}
