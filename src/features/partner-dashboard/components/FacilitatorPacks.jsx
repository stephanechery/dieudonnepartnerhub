import React from "react";
import { facilitatorPacks, evidenceForPack, sessionPackText } from "../data/facilitatorPacks";

export default function FacilitatorPacks({ translateText = (value) => value }) {
  const tx = translateText;
  const download = (pack) => {
    const blob = new Blob([sessionPackText(pack, tx)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `partner-hub-${pack.id}-${document.documentElement.lang || "en"}.txt`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const linkClass = "inline-flex min-h-11 items-center rounded-xl border border-cyan-300 px-3 py-2 text-sm font-bold text-cyan-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:border-cyan-400/30 dark:text-cyan-100";
  return (
    <details className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <summary className="min-h-11 cursor-pointer py-2 text-lg font-black text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500 dark:text-white">{tx("Learn together")}</summary>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{tx("Practice scenarios only. Sharing is optional. Do not record personal or medical details.")}</p>
      <div className="mt-4 grid items-start gap-3 lg:grid-cols-2">
        {facilitatorPacks.map((pack) => {
          const evidence = evidenceForPack(pack);
          return <article key={pack.id} className="min-w-0 rounded-xl border border-slate-200 p-4 dark:border-slate-600">
            <h3 className="text-lg font-black text-slate-950 dark:text-white">{tx(pack.title)}</h3>
            <p className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-200">{tx("Key finding")}: {evidence.value} {tx(evidence.unit)}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{tx(evidence.detail)}</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{tx(pack.context)}</p>
            <a className={`${linkClass} mt-3`} href={evidence.source.href} target="_blank" rel="noopener noreferrer">{tx(evidence.source.label)}</a>
            <h4 className="mt-4 text-sm font-black text-slate-900 dark:text-white">{tx("Practice scenario")}</h4>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{tx(pack.scenario)}</p>
            <h4 className="mt-3 text-sm font-black text-slate-900 dark:text-white">{tx("Discuss")}</h4>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{tx(pack.prompt)}</p>
            <h4 className="mt-3 text-sm font-black text-slate-900 dark:text-white">{tx("Try together")}</h4>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{tx(pack.activity)}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a className={linkClass} href={pack.guideHref}>{tx("Open guide")}</a>
              <a className={linkClass} href={`/partner-dashboard/resources/${pack.resourceSection}`}>{tx("Find help")}</a>
              <button className={linkClass} type="button" onClick={() => download(pack)}>{tx("Download session pack")}</button>
            </div>
          </article>;
        })}
      </div>
    </details>
  );
}
