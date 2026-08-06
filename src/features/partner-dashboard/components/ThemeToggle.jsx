import React from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({
  darkMode,
  onToggle,
  translateText = (value) => value,
  className = "",
}) {
  const label = translateText(darkMode ? "Switch to light mode" : "Switch to dark mode");

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={darkMode}
      aria-label={label}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
        darkMode
          ? "border-slate-700 bg-slate-900 text-amber-300 hover:bg-slate-800 focus-visible:outline-amber-300"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-700"
      } ${className}`}
    >
      {darkMode ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
      <span>{translateText(darkMode ? "Light Mode" : "Dark Mode")}</span>
    </button>
  );
}
