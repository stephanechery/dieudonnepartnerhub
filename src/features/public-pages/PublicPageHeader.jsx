import React from "react";
import { Moon, Sun } from "lucide-react";
import dieudonneDarkLogo from "../../assets/Dieudonne_Dark_Logo.png";
import PublicLanguageSelector from "../language/PublicLanguageSelector";

const publicLinks = [
  { id: "organizations", href: "/partner-orgs", label: "For Organizations" },
  { id: "demo", href: "/partner-demo", label: "Guided Demo" },
  { id: "privacy", href: "/privacy", label: "Privacy" },
];

const getInitialDarkMode = () => {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem("dieudonne-theme") !== "light";
};

const toggleStoredTheme = (darkMode) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("dieudonne-theme", darkMode ? "light" : "dark");
  window.location.reload();
};

export const getPublicPageDarkMode = getInitialDarkMode;

export default function PublicPageHeader({
  activePage,
  language = "en",
  onLanguageChange = () => {},
  translateText = (value) => value,
  showPlatformLink = false,
}) {
  const darkMode = getInitialDarkMode();
  const tx = translateText;

  return (
    <nav
      aria-label={tx("Partner Hub public navigation")}
      className="public-nav mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border px-4 py-3"
    >
      <a href="/" className="flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
        <img
          src={dieudonneDarkLogo}
          alt={tx("Dieudonne logo")}
          width="3172"
          height="1041"
          className="public-logo h-9 w-auto sm:h-12"
        />
        <span className="public-brand hidden text-sm font-black uppercase tracking-[0.16em] sm:inline">{tx("Partner Hub")}</span>
      </a>

      <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:justify-end">
        <PublicLanguageSelector language={language} onLanguageChange={onLanguageChange} translateText={translateText} />
        <button
          type="button"
          onClick={() => toggleStoredTheme(darkMode)}
          aria-pressed={darkMode}
          aria-label={tx(darkMode ? "Switch to light mode" : "Switch to dark mode")}
          className="public-theme-toggle inline-flex min-h-11 items-center gap-2 rounded-full border px-3.5 text-sm font-bold"
        >
          {darkMode ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
          {tx(darkMode ? "Light Mode" : "Dark Mode")}
        </button>

        {publicLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            aria-current={activePage === link.id ? "page" : undefined}
            className={`public-nav-link inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-sm font-bold ${
              activePage === link.id ? "public-nav-link-active" : ""
            }`}
          >
            {tx(link.label)}
          </a>
        ))}

        {showPlatformLink ? (
          <a
            href="/partner-dashboard"
            className="inline-flex min-h-11 items-center rounded-full bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
          >
            {tx("Open Platform")}
          </a>
        ) : null}
      </div>
    </nav>
  );
}
