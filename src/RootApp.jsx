import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import App, {
  LANGUAGE_CHANGE_EVENT,
  getStoredLanguage,
  persistLanguage,
  translateStaticText,
} from "./App";
import { getInitialPartnerDarkMode } from "./features/partner-dashboard/utils/theme";
const PartnerDashboardApp = React.lazy(() => import("./features/partner-dashboard"));
const AdminDashboardApp = React.lazy(() => import("./features/admin-dashboard"));
const OrganizationsPage = React.lazy(() => import("./features/public-pages/OrganizationsPage"));
const DemoPage = React.lazy(() => import("./features/public-pages/DemoPage"));
const PrivacyPage = React.lazy(() => import("./features/public-pages/PrivacyPage"));

function usePathRouter() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useLayoutEffect(() => {
    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    resetScroll();
    const frameId = window.requestAnimationFrame(resetScroll);

    return () => window.cancelAnimationFrame(frameId);
  }, [pathname]);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    const onPopState = () => setPathname(window.location.pathname);

    window.history.scrollRestoration = "manual";
    window.addEventListener("popstate", onPopState);
    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  const navigate = (to, replace = false) => {
    if (replace) {
      window.history.replaceState({}, "", to);
    } else {
      window.history.pushState({}, "", to);
    }
    setPathname(window.location.pathname);
  };

  return { pathname, navigate };
}

export default function RootApp() {
  const { pathname, navigate } = usePathRouter();
  const [initialPartnerDarkMode] = useState(() => getInitialPartnerDarkMode());
  const [language, setLanguage] = useState(getStoredLanguage);
  const translateText = useCallback((value) => translateStaticText(value, language), [language]);
  const changeLanguage = useCallback((nextLanguage) => {
    persistLanguage(nextLanguage);
    setLanguage(getStoredLanguage());
  }, []);

  useLayoutEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setLanguage(event.detail || getStoredLanguage());
    };
    window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange);
    return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange);
  }, []);

  const page = useMemo(() => {
    if (pathname.startsWith("/partner-dashboard")) {
      return (
        <React.Suspense
          fallback={
            <div className={`min-h-screen px-4 py-10 text-center ${initialPartnerDarkMode ? "bg-slate-950 text-slate-300" : "bg-slate-50 text-slate-600"}`}>
              Loading partner dashboard...
            </div>
          }
        >
          <PartnerDashboardApp
            pathname={pathname}
            navigate={navigate}
            language={language}
            onLanguageChange={changeLanguage}
            translateText={translateText}
          />
        </React.Suspense>
      );
    }
    if (pathname.startsWith("/owner-admin") || pathname.startsWith("/admin-dashboard")) {
      return (
        <React.Suspense
          fallback={
            <div className="min-h-screen bg-slate-950 px-4 py-10 text-center text-slate-300">
              Loading admin dashboard...
            </div>
          }
        >
          <AdminDashboardApp pathname={pathname} navigate={navigate} />
        </React.Suspense>
      );
    }
    if (pathname.startsWith("/partner-orgs") || pathname.startsWith("/organizations")) {
      return (
        <React.Suspense fallback={<div className="min-h-screen bg-slate-950 px-4 py-10 text-center text-slate-300">Loading organizations page...</div>}>
          <OrganizationsPage language={language} onLanguageChange={changeLanguage} translateText={translateText} />
        </React.Suspense>
      );
    }
    if (pathname.startsWith("/partner-demo") || pathname.startsWith("/demo")) {
      return (
        <React.Suspense fallback={<div className="min-h-screen bg-slate-950 px-4 py-10 text-center text-slate-300">Loading guided demo...</div>}>
          <DemoPage language={language} onLanguageChange={changeLanguage} translateText={translateText} />
        </React.Suspense>
      );
    }
    if (pathname.startsWith("/privacy")) {
      return (
        <React.Suspense fallback={<div className="min-h-screen bg-slate-950 px-4 py-10 text-center text-slate-300">Loading privacy page...</div>}>
          <PrivacyPage language={language} onLanguageChange={changeLanguage} translateText={translateText} />
        </React.Suspense>
      );
    }
    return <App />;
  }, [changeLanguage, initialPartnerDarkMode, language, navigate, pathname, translateText]);

  return page;
}
