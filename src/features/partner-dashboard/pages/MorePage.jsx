import React, { useEffect, useState } from "react";
import { ArrowLeft, BarChart3, Building2, LayoutDashboard, LogOut, Save, SlidersHorizontal, UserRound } from "lucide-react";

export default function MorePage({
  authUser,
  profile,
  showAdminDashboard = false,
  onSaveProfileDetails,
  onEditPersonalization,
  onOpenMaternalData,
  onNavigateSiteHome,
  onLogout,
  darkMode = false,
  translateText = (value) => value,
}) {
  const tx = (value) => translateText(value);
  const [organizationName, setOrganizationName] = useState(profile?.organizationName || "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setOrganizationName(profile?.organizationName || "");
  }, [profile?.organizationName]);

  const saveOrganization = (event) => {
    event.preventDefault();
    onSaveProfileDetails({ organizationName });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const actionClass = `flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${
    darkMode
      ? "border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800 focus-visible:ring-offset-slate-950"
      : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50 focus-visible:ring-offset-slate-50"
  }`;

  return (
    <div className="space-y-5">
      <section className={`rounded-[1.8rem] border p-5 ${darkMode ? "border-slate-800 bg-slate-900 shadow-xl" : "border-slate-200 bg-white shadow-sm"}`}>
        <p className={`flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
          <UserRound className="h-4 w-4" aria-hidden="true" /> {tx("More")}
        </p>
        <h2 className={`mt-2 text-2xl font-black tracking-tight ${darkMode ? "text-slate-100" : "text-slate-950"}`}>
          {tx("Profile and platform settings")}
        </h2>
        <p className={`mt-2 text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          {tx("Update your personalization, organization, or account actions here.")}
        </p>
        <p className={`mt-4 text-sm font-semibold break-words ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
          {authUser.displayName} · {authUser.email}
        </p>
      </section>

      <section className={`rounded-[1.8rem] border p-4 sm:p-5 ${darkMode ? "border-slate-800 bg-slate-900 shadow-xl" : "border-slate-200 bg-white shadow-sm"}`}>
        <h2 className={`text-lg font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx("Personalization")}</h2>
        <button type="button" onClick={onEditPersonalization} className={`${actionClass} mt-3`}>
          <span className="flex items-center gap-3"><SlidersHorizontal className="h-5 w-5 text-cyan-500" aria-hidden="true" /> {tx("Edit personalization")}</span>
        </button>
      </section>

      <section className={`rounded-[1.8rem] border p-4 sm:p-5 ${darkMode ? "border-slate-800 bg-slate-900 shadow-xl" : "border-slate-200 bg-white shadow-sm"}`}>
        <form onSubmit={saveOrganization}>
          <p className={`flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
            <Building2 className="h-4 w-4" aria-hidden="true" /> {tx("Organization")}
          </p>
          <label className={`mt-3 block text-sm font-bold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
            {tx("Organization or program")}
            <input
              value={organizationName}
              onChange={(event) => {
                setOrganizationName(event.target.value);
                setSaved(false);
              }}
              placeholder={tx("Optional")}
              className={`mt-1 h-12 w-full rounded-xl border px-4 text-base font-semibold outline-none transition focus:border-cyan-400 ${darkMode ? "border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-600" : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"}`}
            />
          </label>
          <button type="submit" className={`mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-black text-white transition ${darkMode ? "bg-cyan-700 hover:bg-cyan-800" : "bg-slate-900 hover:bg-slate-800"}`}>
            <Save className="h-4 w-4" aria-hidden="true" /> {saved ? tx("Saved") : tx("Save organization")}
          </button>
        </form>
      </section>

      <section className={`rounded-[1.8rem] border p-4 sm:p-5 ${darkMode ? "border-slate-800 bg-slate-900 shadow-xl" : "border-slate-200 bg-white shadow-sm"}`}>
        <h2 className={`text-lg font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx("Platform")}</h2>
        <div className="mt-3 space-y-2">
          <button type="button" onClick={() => onOpenMaternalData()} className={actionClass}>
            <span className="flex items-center gap-3"><BarChart3 className="h-5 w-5 text-cyan-500" aria-hidden="true" /> {tx("Maternal Data")}</span>
          </button>
          {showAdminDashboard && (
            <a href="/owner-admin" aria-label={tx("Open Admin Dashboard")} className={actionClass}>
              <span className="flex items-center gap-3"><LayoutDashboard className="h-5 w-5 text-cyan-500" aria-hidden="true" /> {tx("Admin Dashboard")}</span>
            </a>
          )}
          <button type="button" onClick={onNavigateSiteHome} className={actionClass}>
            <span className="flex items-center gap-3"><ArrowLeft className="h-5 w-5 text-cyan-500" aria-hidden="true" /> {tx("Site Home")}</span>
          </button>
          <button type="button" onClick={onLogout} className={`${actionClass} ${darkMode ? "text-rose-200" : "text-rose-700"}`}>
            <span className="flex items-center gap-3"><LogOut className="h-5 w-5" aria-hidden="true" /> {tx("Log Out")}</span>
          </button>
        </div>
      </section>
    </div>
  );
}
