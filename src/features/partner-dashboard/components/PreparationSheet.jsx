import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// Only approved catalog content enters this sheet. No profile or saved state.
export default function PreparationSheet({ active, pack, evidence, resources, translateText: tx, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);
  return createPortal(<div className="preparation-print-root">
    <dialog ref={dialogRef} onCancel={onClose} onClose={onClose} aria-labelledby="preparation-sheet-title" className="preparation-sheet m-auto max-h-[90dvh] w-[calc(100%-1.5rem)] max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-xl backdrop:bg-slate-950/60 sm:p-8">
      <div className="preparation-print-controls mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <button type="button" onClick={() => window.print()} className="min-h-11 rounded-lg bg-cyan-800 px-4 text-sm font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500">{tx("Print or save PDF")}</button>
        <button type="button" autoFocus onClick={onClose} className="min-h-11 rounded-lg px-3 text-sm font-semibold text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500">{tx("Close preview")}</button>
      </div>
      <p className="text-xs font-bold tracking-widest text-cyan-800">DIEUDONNE PARTNER HUB</p>
      <h2 id="preparation-sheet-title" className="mt-2 text-2xl font-bold">{tx(active.title)}</h2>
      <p className="mt-3 text-sm leading-relaxed">{tx(pack.intro)}</p>
      <section className="my-5 border-l-2 border-cyan-700 pl-4"><h3 className="text-sm font-bold">{tx("Try asking")}</h3><p className="mt-2 text-lg font-semibold">{tx(pack.prompt)}</p></section>
      <h3 className="text-sm font-bold">{tx("Preparation checklist")}</h3>
      <ul className="my-3 space-y-3">{pack.checklist.map(step => <li key={step} className="flex items-start gap-3 text-sm leading-relaxed"><span aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 rounded-sm border border-slate-500" /><span>{tx(step)}</span></li>)}</ul>
      <p className="my-4 text-xs leading-relaxed text-slate-600">{tx("Use this sheet for a conversation, not as a medical readiness score.")}</p>
      <section className="mt-5 border-t border-slate-200 pt-4"><h3 className="text-sm font-bold">{tx("Relevant help")}</h3>
        <ul className="mt-2 space-y-3">{resources.map(resource => <li key={resource.id} className="text-xs leading-relaxed"><span className="font-semibold">{tx(resource.title)}</span>{resource.actions.map(action => <a key={action.href} href={action.href.startsWith('/') ? `https://www.dieudonnepartnerhub.org${action.href}` : action.href} className="mt-1 block break-words text-cyan-800 underline">{action.kind === "call" || action.kind === "text" ? tx(action.label) : action.href.startsWith('/') ? `https://www.dieudonnepartnerhub.org${action.href}` : action.href}</a>)}</li>)}</ul>
      </section>
      <section className="mt-5 border-t border-slate-200 pt-4 text-xs leading-relaxed"><h3 className="font-bold">{tx("Source details")}</h3><p className="mt-1">{tx(evidence.source.label)}</p><a className="block break-words text-cyan-800 underline" href={evidence.source.href}>{evidence.source.href}</a></section>
      <p className="mt-5 text-xs leading-relaxed text-slate-600">{tx("Partner Hub provides educational guidance, not diagnosis or a complete service directory. Confirm local contacts and eligibility with the responsible organization.")}</p>
    </dialog>
  </div>, document.body);
}
