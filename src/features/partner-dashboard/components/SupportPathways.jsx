import React, { useRef, useState } from "react";
import PreparationSheet from "./PreparationSheet";
import { supportPathways, preparationPacks } from "../data/supportPathways";
import { maternalHealthHighlights } from "../data/maternalHealthData";
import { resourceSections } from "../data/resourcesDashboard";

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500";
export default function SupportPathways({ routeSectionId, onNavigateSection, translateText: tx }) {
  const active = supportPathways.find(path => `path-${path.id}` === routeSectionId);
  const evidence = maternalHealthHighlights.find(item => item.id === active?.evidenceId);
  const pack = preparationPacks[active?.id];
  const [printPlanId, setPrintPlanId] = useState("");
  const printTriggerRef = useRef(null);
  const closePrintPreview = () => {
    setPrintPlanId("");
    window.requestAnimationFrame(() => printTriggerRef.current?.focus());
  };
  const printResources = active?.resources.map(id => resourceSections.flatMap(section => section.resources).find(resource => resource.id === id)).filter(Boolean) || [];
  return <section aria-label={tx("Make a support plan")} className="grid items-start gap-5 lg:grid-cols-[15rem_minmax(0,1fr)]">
    <nav aria-label={tx("Support pathways")} className="space-y-2">
      <h3 className="text-lg font-black text-slate-950 dark:text-white">{tx("Make a support plan")}</h3>
      <select aria-label={tx("Support pathways")} value={active ? `path-${active.id}` : "pathways"} onChange={event => onNavigateSection(event.target.value)} className={`min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 lg:hidden dark:border-slate-600 dark:bg-slate-800 dark:text-white ${focus}`}>
        <option value="pathways">{tx("Make a support plan")}</option>
        {supportPathways.map(path => <option key={path.id} value={`path-${path.id}`}>{tx(path.title)}</option>)}
      </select>
      {supportPathways.map(path => <button key={path.id} aria-current={active?.id === path.id ? "page" : undefined} onClick={() => onNavigateSection(`path-${path.id}`)} className={`hidden min-h-12 w-full rounded-xl px-3 py-3 text-left text-sm font-bold lg:block ${focus} ${active?.id === path.id ? "bg-cyan-50 text-cyan-900 dark:bg-cyan-300/10 dark:text-cyan-200" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}>{tx(path.title)}</button>)}
    </nav>
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-700 dark:bg-slate-800">
      {!active ? <>
        <h3 className="text-xl font-black text-slate-950 dark:text-white">{tx("Prepare for what comes next")}</h3>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-slate-600 dark:text-slate-300">{tx("Choose a situation for a short plan and relevant help. These plans are not medical advice or a completion checklist.")}</p>
        <div className="mt-4 divide-y divide-slate-200 dark:divide-slate-700">{supportPathways.filter(path => preparationPacks[path.id]).map(path => <button key={path.id} onClick={() => onNavigateSection(`path-${path.id}`)} className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-lg py-4 text-left text-sm font-bold text-cyan-800 dark:text-cyan-200 ${focus}`}>{tx(path.title)}<span aria-hidden="true">→</span></button>)}</div>
      </> : <>
        <h3 className="text-xl font-black text-slate-950 dark:text-white">{tx(active.title)}</h3>
        {pack && <button ref={printTriggerRef} type="button" onClick={() => setPrintPlanId(active.id)} className={`mt-2 min-h-11 rounded-lg text-sm font-semibold text-cyan-800 underline underline-offset-4 dark:text-cyan-200 ${focus}`}>{tx("Printable preparation sheet")}</button>}
        {pack && printPlanId === active.id && <PreparationSheet active={active} pack={pack} evidence={evidence} resources={printResources} translateText={tx} onClose={closePrintPreview} />}
        {pack ? <div key={active.id}>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-slate-600 dark:text-slate-300">{tx(pack.intro)}</p>
          <div className="my-5 border-l-2 border-cyan-400 pl-4"><h4 className="text-xs font-bold text-slate-600 dark:text-slate-300">{tx("Try asking")}</h4><p className="mt-2 text-lg font-semibold leading-relaxed text-slate-900 dark:text-white">{tx(pack.prompt)}</p></div>
          <details className="my-4 rounded-xl bg-slate-50 px-4 dark:bg-slate-900/50">
            <summary className={`min-h-12 cursor-pointer rounded-lg py-3 text-sm font-bold text-slate-900 dark:text-white ${focus}`}>{tx("Preparation checklist")}</summary>
            <p className="mb-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{tx("Checks are temporary and reset when you leave this plan. They do not measure learning or medical readiness.")}</p>
            {pack.checklist.map(step => <label key={step} className="flex min-h-12 cursor-pointer items-start gap-3 py-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200"><input type="checkbox" className={`mt-1 h-5 w-5 shrink-0 accent-cyan-700 ${focus}`} /><span>{tx(step)}</span></label>)}
          </details>
        </div> : <ol className="my-5 list-decimal space-y-4 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{active.steps.map(step => <li key={step} className="pl-2">{tx(step)}</li>)}</ol>}
        <a className={`inline-flex min-h-11 items-center rounded-lg text-sm font-bold text-cyan-800 underline dark:text-cyan-200 ${focus}`} href={`/partner-dashboard/maternal-data/your-impact?highlight=${active.evidenceId}`}>{tx("Understand the evidence")}: {tx(evidence.title)}</a>
        <h4 className="mt-5 text-sm font-bold text-slate-950 dark:text-white">{tx("Relevant help")}</h4>
        <div className="mt-2 divide-y divide-slate-100 dark:divide-slate-700">{active.resources.map(id => {
          const section = resourceSections.find(section => section.resources.some(item => item.id === id));
          const resource = section.resources.find(item => item.id === id);
          return <a key={id} href={`/partner-dashboard/resources/${section.id}?resource=${id}`} className={`flex min-h-12 items-center justify-between gap-3 rounded-lg py-3 text-sm font-semibold text-cyan-800 dark:text-cyan-200 ${focus}`}>{tx(resource.title)}<span aria-hidden="true">→</span></a>;
        })}</div>
      </>}
    </div>
  </section>;
}
