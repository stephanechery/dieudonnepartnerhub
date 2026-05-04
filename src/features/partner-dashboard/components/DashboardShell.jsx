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
          : `relative min-h-screen px-3 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8 ${darkMode ? "bg-slate-950" : "bg-slate-50"}`
      }
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cyan-500/10 via-rose-500/5 to-transparent" />
      <div className={embedded ? "relative z-10 w-full" : "relative z-10 mx-auto w-full max-w-7xl"}>
        <header
          className={`mb-4 flex flex-col justify-between gap-3 rounded-[1.5rem] border px-3 py-3 sm:mb-6 sm:gap-4 sm:rounded-[1.75rem] sm:px-5 sm:py-5 md:flex-row md:items-center ${
            darkMode
              ? "border-slate-800 bg-slate-900/95 shadow-xl shadow-black/20"
              : "border-slate-200 bg-white/95 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-3 sm:items-start sm:gap-4">
            <img
              src={dieudonneDarkLogo}
              alt="Dieudonne logo"
              className={`h-9 w-auto rounded-lg border p-1 sm:h-12 ${darkMode ? "border-slate-700 bg-slate-950" : "border-slate-200 bg-slate-50"}`}
            />
            <div className="min-w-0">
              <p className={`text-[10px] font-bold uppercase tracking-[0.16em] sm:text-xs sm:tracking-[0.2em] ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
                {tx("Partner Education Dashboard")}
              </p>
              <h1 className={`text-lg font-black tracking-tight sm:text-2xl md:text-3xl ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
                {tx("Structured Training Environment")}
              </h1>
              <p className={`mt-1 hidden text-sm leading-relaxed break-words sm:block ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                {tx("Signed in as")} <span className="font-semibold">{authUser.displayName}</span> ({authUser.email})
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-end">
            <div className={`col-span-2 flex min-h-9 items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs font-bold sm:col-span-1 sm:min-h-0 sm:justify-start sm:py-1.5 ${darkMode ? "border-emerald-900/50 bg-emerald-900/30 text-emerald-300" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
              <ShieldCheck className="h-4 w-4" /> {tx("User Progress Tracking Active")}
            </div>
            {showHomeButton && (
              <button
                type="button"
                onClick={onNavigateHome}
                className={`flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition sm:min-h-0 sm:w-auto sm:justify-start sm:px-3 ${
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
              className={`flex min-h-10 w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-white transition sm:min-h-0 sm:w-auto sm:justify-start sm:px-3 ${
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
