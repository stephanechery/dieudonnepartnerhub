import React from "react";
import { Globe } from "lucide-react";
import { LANGUAGE_OPTIONS } from "../../App";

export default function PublicLanguageSelector({
  language = "en",
  onLanguageChange = () => {},
  translateText = (value) => value,
}) {
  return (
    <label className="public-language-select inline-flex min-h-11 items-center gap-2 rounded-full border px-3 text-sm font-bold">
      <span className="sr-only">{translateText("Select language")}</span>
      <Globe className="h-4 w-4 shrink-0" aria-hidden="true" />
      <select
        value={language}
        onChange={(event) => onLanguageChange(event.target.value)}
        aria-label={translateText("Select language")}
        className="min-h-10 max-w-[9.5rem] cursor-pointer appearance-none bg-transparent pr-2 font-bold text-inherit outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <option key={option.code} value={option.code} className="bg-slate-950 text-white">
            {option.short} · {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
