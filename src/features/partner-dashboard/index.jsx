import React, { useCallback, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import AuthPanel from "./components/AuthPanel";
import DashboardShell from "./components/DashboardShell";
import OverviewPage from "./pages/OverviewPage";
import ModulePage from "./pages/ModulePage";
import LessonPage from "./pages/LessonPage";
import { PartnerDashboardProvider, usePartnerDashboard } from "./state/PartnerDashboardContext";
import { getModuleState, isLessonUnlocked, isModuleUnlocked } from "./utils/progress";

const BASE_PATH = "/partner-dashboard";

const getSubPath = (pathname) => {
  if (!pathname.startsWith(BASE_PATH)) {
    return "/";
  }

  const raw = pathname.slice(BASE_PATH.length);
  return raw || "/";
};

const DashboardRouter = ({ pathname, navigate, embedded = false, onExit, darkMode = false, translateText = (value) => value }) => {
  const {
    authUser,
    authLoading,
    profile,
    curriculum,
    dashboardMetrics,
    logout,
    saveScenarioReflection,
    submitQuiz,
    markLessonCompleted,
  } = usePartnerDashboard();

  const subPath = useMemo(() => getSubPath(pathname), [pathname]);

  if (authLoading) {
    return (
      <div
        className={
          embedded
            ? `rounded-[2rem] border px-4 py-10 text-center ${darkMode ? "border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 text-slate-300 shadow-xl" : "border-slate-200 bg-gradient-to-br from-white to-slate-50 text-slate-600 shadow-sm"}`
            : `min-h-screen px-4 py-10 text-center ${darkMode ? "bg-slate-950 text-slate-300" : "bg-slate-50 text-slate-600"}`
        }
      >
        <div className="mx-auto flex max-w-md flex-col items-center gap-3">
          <div className={`h-10 w-10 animate-pulse rounded-full border-4 border-t-transparent ${darkMode ? "border-cyan-400" : "border-cyan-500"}`} />
          <p className="text-sm font-semibold">{translateText("Loading partner dashboard...")}</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className={embedded ? "w-full" : `min-h-screen px-4 py-8 md:px-8 ${darkMode ? "bg-slate-950" : "bg-slate-50"}`}>
        <AuthPanel darkMode={darkMode} translateText={translateText} />
      </div>
    );
  }

  const openOverview = () => navigate(BASE_PATH);
  const openModule = (moduleId) => navigate(`${BASE_PATH}/module/${moduleId}`);
  const openLesson = (moduleId, lessonId) =>
    navigate(`${BASE_PATH}/module/${moduleId}/lesson/${lessonId}`);

  const moduleMatch = subPath.match(/^\/module\/([a-z0-9-]+)$/i);
  const lessonMatch = subPath.match(/^\/module\/([a-z0-9-]+)\/lesson\/([a-z0-9-]+)$/i);

  let page = null;

  if (subPath === "/") {
    page = (
        <OverviewPage
          metrics={dashboardMetrics}
          curriculum={curriculum}
          onOpenModule={openModule}
          onOpenLesson={openLesson}
          darkMode={darkMode}
          translateText={translateText}
        />
    );
  } else if (moduleMatch) {
    const moduleId = moduleMatch[1];
    const module = curriculum.modules.find((item) => item.id === moduleId);

    if (!module) {
      page = (
        <div className={`rounded-2xl border p-5 ${darkMode ? "border-rose-900/50 bg-rose-950/30 text-rose-200" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
          {translateText("Module not found.")}
        </div>
      );
    } else if (!isModuleUnlocked(curriculum.modules, profile, moduleId)) {
      page = (
        <div className={`rounded-2xl border p-5 ${darkMode ? "border-amber-900/50 bg-amber-950/30 text-amber-200" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
          {translateText("This module is locked. Complete the previous module to continue progression.")}
        </div>
      );
    } else {
      page = (
        <ModulePage
          module={module}
          profile={profile}
          onBack={openOverview}
          onOpenLesson={(lessonId) => openLesson(module.id, lessonId)}
          darkMode={darkMode}
          translateText={translateText}
        />
      );
    }
  } else if (lessonMatch) {
    const moduleId = lessonMatch[1];
    const lessonId = lessonMatch[2];
    const module = curriculum.modules.find((item) => item.id === moduleId);
    const lesson = module?.lessons.find((item) => item.id === lessonId);

    if (!module || !lesson) {
      page = (
        <div className={`rounded-2xl border p-5 ${darkMode ? "border-rose-900/50 bg-rose-950/30 text-rose-200" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
          {translateText("Lesson not found.")}
        </div>
      );
    } else if (!isModuleUnlocked(curriculum.modules, profile, moduleId)) {
      page = (
        <div className={`rounded-2xl border p-5 ${darkMode ? "border-amber-900/50 bg-amber-950/30 text-amber-200" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
          {translateText("Module is locked. Complete previous module first.")}
        </div>
      );
    } else {
      const moduleState = getModuleState(profile, moduleId);
      if (!isLessonUnlocked(module, moduleState, lessonId)) {
        page = (
          <div className={`rounded-2xl border p-5 ${darkMode ? "border-amber-900/50 bg-amber-950/30 text-amber-200" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
            {translateText("Lesson is locked. Complete the previous lesson first.")}
          </div>
        );
      } else {
        page = (
          <LessonPage
            module={module}
            lesson={lesson}
            profile={profile}
            onBackToModule={() => openModule(module.id)}
            onSaveScenario={(responseText) =>
              saveScenarioReflection(module.id, lesson.id, responseText)
            }
            onSubmitQuiz={(answers) => submitQuiz(module.id, lesson.id, answers)}
            onCompleteLesson={() => markLessonCompleted(module.id, lesson.id)}
            darkMode={darkMode}
            translateText={translateText}
          />
        );
      }
    }
  } else {
    page = (
      <div className={`rounded-2xl border p-5 ${darkMode ? "border-amber-900/50 bg-amber-950/30 text-amber-100" : "border-amber-200 bg-amber-50 text-amber-900"}`}>
        <p className="flex items-center gap-2 font-bold">
            <AlertTriangle className="h-4 w-4" /> {translateText("Unknown dashboard path.")}
        </p>
        <button
          type="button"
          className={`mt-3 rounded-lg px-3 py-2 text-sm font-bold text-white ${darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-900 hover:bg-slate-800"}`}
          onClick={openOverview}
        >
          {translateText("Return to Dashboard Home")}
        </button>
      </div>
    );
  }

  return (
    <DashboardShell
      authUser={authUser}
      onLogout={logout}
      onNavigateHome={() => {
        if (embedded && onExit) {
          onExit();
          return;
        }
        navigate("/");
      }}
      embedded={embedded}
      showHomeButton={!embedded || Boolean(onExit)}
      homeLabel={embedded ? "Back to Main Guide" : "Site Home"}
      darkMode={darkMode}
      translateText={translateText}
    >
      {page}
    </DashboardShell>
  );
};

export default function PartnerDashboardApp({
  pathname,
  navigate,
  embedded = false,
  onExit,
  darkMode,
  translateText = (value) => value,
}) {
  const [embeddedPathname, setEmbeddedPathname] = useState(BASE_PATH);
  const effectiveDarkMode = useMemo(() => {
    if (typeof darkMode === "boolean") {
      return darkMode;
    }

    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem("dieudonne-theme") === "dark";
  }, [darkMode]);

  const resolvedPathname = embedded ? embeddedPathname : pathname;
  const resolvedNavigate = useCallback(
    (to) => {
      if (!embedded) {
        navigate(to);
        return;
      }

      if (to.startsWith(BASE_PATH)) {
        setEmbeddedPathname(to);
        return;
      }

      if (to === "/" && onExit) {
        onExit();
      }
    },
    [embedded, navigate, onExit]
  );

  return (
    <PartnerDashboardProvider>
      <DashboardRouter
        pathname={resolvedPathname}
        navigate={resolvedNavigate}
        embedded={embedded}
        onExit={onExit}
        darkMode={effectiveDarkMode}
        translateText={translateText}
      />
    </PartnerDashboardProvider>
  );
}
