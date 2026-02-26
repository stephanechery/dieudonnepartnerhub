import React from "react";
import { ArrowLeft, LogOut, ShieldCheck } from "lucide-react";
import dieudonneDarkLogo from "../../../assets/Dieudonne_Dark_Logo.png";

export default function DashboardShell({
  authUser,
  onLogout,
  onNavigateHome,
  children,
  embedded = false,
  showHomeButton = true,
  homeLabel = "Site Home",
  darkMode = false,
  translateText = (value) => value,
}) {
  const tx = (value) => translateText(value);
  return (
    <div
      className={
        embedded
          ? "relative w-full"
          : `relative min-h-screen px-4 py-6 md:px-8 md:py-8 ${darkMode ? "bg-slate-950" : "bg-slate-50"}`
      }
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cyan-500/10 via-rose-500/5 to-transparent" />
      <div className={embedded ? "relative z-10 w-full" : "relative z-10 mx-auto w-full max-w-7xl"}>
        <header
          className={`mb-6 flex flex-col justify-between gap-4 rounded-[2rem] border px-5 py-5 md:flex-row md:items-center ${
            darkMode
              ? "border-slate-800 bg-slate-900/95 shadow-xl shadow-black/20"
              : "border-slate-200 bg-white/95 shadow-sm"
          }`}
        >
          <div className="flex items-start gap-3">
            <img
              src={dieudonneDarkLogo}
              alt="Dieudonne logo"
              className={`h-12 w-auto rounded-lg border p-1 ${darkMode ? "border-slate-700 bg-slate-950" : "border-slate-200 bg-slate-50"}`}
            />
            <div>
            <p className={`text-xs font-bold uppercase tracking-[0.2em] ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
              {tx("Partner Education Dashboard")}
            </p>
            <h1 className={`text-2xl font-black tracking-tight md:text-3xl ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
              {tx("Structured Training Environment")}
            </h1>
            <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              {tx("Signed in as")} <span className="font-semibold">{authUser.displayName}</span> ({authUser.email})
            </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${darkMode ? "border-emerald-900/50 bg-emerald-900/30 text-emerald-300" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
              <ShieldCheck className="h-4 w-4" /> {tx("User Progress Tracking Active")}
            </div>
            {showHomeButton && (
              <button
                type="button"
                onClick={onNavigateHome}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition ${
                  darkMode
                    ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                <ArrowLeft className="h-4 w-4" /> {tx(homeLabel)}
              </button>
            )}
            <button
              type="button"
              onClick={onLogout}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-white transition ${
                darkMode
                  ? "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500"
                  : "bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-700"
              }`}
            >
              <LogOut className="h-4 w-4" /> {tx("Log Out")}
            </button>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
