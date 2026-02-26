import React from "react";
import { AlertTriangle, PhoneCall, Siren } from "lucide-react";

export default function WarningSignsPanel({ warningSigns, darkMode = false, translateText = (value) => value }) {
  const tx = (value) => translateText(value);
  if (!warningSigns) {
    return null;
  }

  return (
    <section className={`rounded-[1.8rem] border p-5 ${darkMode ? "border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 shadow-xl" : "border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm"}`}>
      <h3 className={`mb-2 flex items-center gap-2 text-lg font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
        <AlertTriangle className="h-5 w-5 text-amber-500" /> {tx("Postpartum Warning Signs")}
      </h3>
      <p className={`mb-4 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
        {tx("Use explicit escalation thresholds. Do not wait for symptoms to worsen.")}
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className={`rounded-xl border p-4 ${darkMode ? "border-amber-900/50 bg-amber-950/30" : "border-amber-200 bg-amber-50"}`}>
          <h4 className={`mb-2 flex items-center gap-2 text-sm font-black uppercase tracking-wide ${darkMode ? "text-amber-200" : "text-amber-800"}`}>
            <PhoneCall className="h-4 w-4" /> {tx("Call Provider")}
          </h4>
          <ul className={`space-y-2 text-sm ${darkMode ? "text-amber-100" : "text-amber-900"}`}>
            {warningSigns.callProvider.map((item) => (
              <li key={item} className="leading-relaxed">• {tx(item)}</li>
            ))}
          </ul>
        </article>

        <article className={`rounded-xl border p-4 ${darkMode ? "border-rose-900/50 bg-rose-950/30" : "border-rose-200 bg-rose-50"}`}>
          <h4 className={`mb-2 flex items-center gap-2 text-sm font-black uppercase tracking-wide ${darkMode ? "text-rose-200" : "text-rose-800"}`}>
            <Siren className="h-4 w-4" /> {tx("Seek Emergency Care")}
          </h4>
          <ul className={`space-y-2 text-sm ${darkMode ? "text-rose-100" : "text-rose-900"}`}>
            {warningSigns.emergency.map((item) => (
              <li key={item} className="leading-relaxed">• {tx(item)}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
