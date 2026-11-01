import React, { useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { resourceSections } from "../data/resourcesDashboard";
import { normalizeResourceQuery, searchResources } from "../utils/resourceSearch";

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500";
const field = `min-h-11 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white ${focus}`;

export default function ResourceSearch({ translateText: tx, children, renderResource, scopeNeed = "" }) {
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All resources");
  const [need, setNeed] = useState(scopeNeed);
  const [contact, setContact] = useState("");
  const contactOptions = [["", "Any contact method"], ["call", "Phone"], ["text", "Text message"], ["external", "Website"], ["internal", "Partner Hub guide"]];
  const [showAll, setShowAll] = useState(false);
  const searching = Boolean(normalizeResourceQuery(query) || need !== scopeNeed || contact || region !== "All resources");
  const results = searching ? searchResources(resourceSections, { query, region, need, contact, translateText: tx }) : [];
  const clearQuery = () => { setQuery(""); setShowAll(false); inputRef.current?.focus(); };
  const reset = () => { clearQuery(); setRegion("All resources"); setNeed(scopeNeed); setContact(""); };
  const activeFilters = [
    ...(need !== scopeNeed ? [{ kind: "What help do you need?", label: resourceSections.find(section => section.id === need)?.label || "All resources", clear: () => setNeed(scopeNeed) }] : []),
    ...(region !== "All resources" ? [{ kind: "Show resources", label: region, clear: () => setRegion("All resources") }] : []),
    ...(contact ? [{ kind: "Contact method", label: contactOptions.find(([value]) => value === contact)[1], clear: () => setContact("") }] : []),
  ];
  return <>
    <section aria-label={tx("Search resources")} className="space-y-2">
      <label htmlFor="resource-search" className="block text-sm font-bold text-slate-800 dark:text-slate-100">{tx("Search resources")}</label>
      <div className="flex min-h-12 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 focus-within:ring-2 focus-within:ring-cyan-500 dark:border-slate-600 dark:bg-slate-800">
        <Search className="h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" aria-hidden="true" />
        <input ref={inputRef} id="resource-search" type="search" maxLength={160} autoComplete="off" value={query} onChange={event => {setQuery(event.target.value); setShowAll(false);}} placeholder={tx("Try food, transport or feeding")} className="min-h-12 w-full min-w-0 bg-transparent text-base text-slate-900 outline-none dark:text-white [&::-webkit-search-cancel-button]:appearance-none" />
        {query && <button type="button" onClick={clearQuery} aria-label={tx("Clear search")} className={`flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 ${focus}`}><X className="h-4 w-4" aria-hidden="true" /></button>}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{tx("Search stays in this browser. Use a topic, not personal or medical details.")}</p>
      <details>
        <summary className={`w-fit min-h-11 cursor-pointer rounded-lg py-3 text-sm font-semibold text-cyan-800 dark:text-cyan-200 ${focus}`}>{tx("Refine results")}{activeFilters.length ? ` (${activeFilters.length})` : ""}</summary>
        <div className="grid gap-3 rounded-xl bg-slate-50 p-3 sm:grid-cols-2 xl:grid-cols-3 dark:bg-slate-800/50">
          <label className="space-y-1 text-sm text-slate-700 dark:text-slate-200"><span>{tx("What help do you need?")}</span><select className={field} value={need} onChange={event => {setNeed(event.target.value); setShowAll(false);}}><option value="">{tx("All resources")}</option>{resourceSections.map(section => <option key={section.id} value={section.id}>{tx(section.label)}</option>)}</select></label>
          <label className="space-y-1 text-sm text-slate-700 dark:text-slate-200"><span>{tx("Show resources")}</span><select className={field} value={region} onChange={event => {setRegion(event.target.value); setShowAll(false);}}>{["All resources", "Indiana", "United States", "Partner Hub guide"].map(value => <option key={value} value={value}>{tx(value)}</option>)}</select></label>
          <label className="space-y-1 text-sm text-slate-700 dark:text-slate-200"><span>{tx("Contact method")}</span><select className={field} value={contact} onChange={event => {setContact(event.target.value); setShowAll(false);}}>{contactOptions.map(([value, label]) => <option key={value} value={value}>{tx(label)}</option>)}</select></label>
        </div>
      </details>
      {activeFilters.length > 0 && <div aria-label={tx("Active filters")} className="flex flex-wrap gap-2">{activeFilters.map(filter => <button key={filter.kind} type="button" onClick={() => {filter.clear(); setShowAll(false);}} aria-label={`${tx("Remove filter")}: ${tx(filter.kind)}: ${tx(filter.label)}`} className={`inline-flex min-h-11 max-w-full items-center gap-2 rounded-lg bg-cyan-50 px-3 text-sm font-semibold text-cyan-900 dark:bg-cyan-300/10 dark:text-cyan-100 ${focus}`}><span>{tx(filter.label)}</span><X className="h-4 w-4 shrink-0" aria-hidden="true" /></button>)}</div>}
    </section>
    {searching ? <section aria-label={tx("Search results")}>
      <a href="/partner-dashboard/resources/urgent-help" className={`inline-flex min-h-11 items-center rounded-lg text-sm font-semibold text-rose-800 underline dark:text-rose-200 ${focus}`}>{tx("Urgent help")}</a>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><p role="status" aria-live="polite" className="text-sm font-semibold text-slate-700 dark:text-slate-200">{tx("Search results")}: {results.length}</p><button type="button" onClick={reset} className={`min-h-11 rounded-lg text-sm font-bold text-cyan-800 underline dark:text-cyan-200 ${focus}`}>{tx("Clear search and filters")}</button></div>
      {!results.length && <p className="py-4 text-sm text-slate-600 dark:text-slate-300">{tx("No matching resources. Try a broader topic or clear the filters. This directory does not include every service.")}</p>}
      <div className="grid items-start gap-3 lg:grid-cols-2">{(showAll ? results : results.slice(0, 4)).map(({resource}) => renderResource(resource))}</div>
      {results.length > 4 && <button type="button" aria-expanded={showAll} onClick={() => setShowAll(!showAll)} className={`mt-3 min-h-11 rounded-lg text-sm font-bold text-cyan-800 underline dark:text-cyan-200 ${focus}`}>{tx(showAll ? "Show fewer results" : "Show more results")}</button>}
    </section> : children}
  </>;
}
