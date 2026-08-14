import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import AuthPanel from "./components/AuthPanel";
import DashboardShell from "./components/DashboardShell";
import MobilePlatformNav from "./components/MobilePlatformNav";
import OnboardingFlow from "./components/OnboardingFlow";
import OverviewPage from "./pages/OverviewPage";
import ModulePage from "./pages/ModulePage";
import LessonPage from "./pages/LessonPage";
import InteractiveGuidesPage from "./pages/InteractiveGuidesPage";
import MorePage from "./pages/MorePage";
import TrainingPage from "./pages/TrainingPage";
import VideoHubPage from "./pages/VideoHubPage";
import LocalizedDomBoundary from "../language/LocalizedDomBoundary";
import { PartnerDashboardProvider, usePartnerDashboard } from "./state/PartnerDashboardContext";
import { isConfiguredOwnerUser, trackPartnerEvent } from "./services/analyticsService";
import { getModuleState, isLessonUnlocked, isModuleUnlocked } from "./utils/progress";
import {
  applyPartnerDocumentTheme,
  getInitialPartnerDarkMode,
  getStoredTheme,
  persistPartnerTheme,
  subscribeToPartnerSystemTheme,
} from "./utils/theme";

const BASE_PATH = "/partner-dashboard";

const getSubPath = (pathname) => {
  if (!pathname.startsWith(BASE_PATH)) {
    return "/";
  }

  const raw = pathname.slice(BASE_PATH.length);
  return raw || "/";
};

const DashboardRouter = ({ pathname, navigate, embedded = false, onExit, darkMode = false, onToggleTheme, language = "en", onLanguageChange = () => {}, translateText = (value) => value }) => {
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
    saveLessonMission,
    saveProfileDetails,
    saveOnboarding,
    saveTodaySupportContext,
    markTodaySupportDone,
    trackTodaySupportResourceClick,
  } = usePartnerDashboard();

  const subPath = useMemo(() => getSubPath(pathname), [pathname]);
  const lastTrackedPath = useRef("");
  const [editingOnboarding, setEditingOnboarding] = useState(false);
  const showAdminDashboard = isConfiguredOwnerUser(authUser, profile);

  useEffect(() => {
    if (!authUser || lastTrackedPath.current === subPath) return;

    const lessonMatchForTracking = subPath.match(/^\/module\/([a-z0-9-]+)\/lesson\/([a-z0-9-]+)$/i);
    const guideMatchForTracking = subPath.match(/^\/guides(?:\/([a-z0-9-]+))?$/i);

    if (lessonMatchForTracking) {
      trackPartnerEvent("lesson_start", {
        uid: authUser.uid,
        email: authUser.email,
        moduleId: lessonMatchForTracking[1],
        lessonId: lessonMatchForTracking[2],
      });
    } else if (guideMatchForTracking?.[1]) {
      trackPartnerEvent("guide_open", {
        uid: authUser.uid,
        email: authUser.email,
        guideId: guideMatchForTracking[1],
      });
    } else if (guideMatchForTracking) {
      trackPartnerEvent("guide_library_open", {
        uid: authUser.uid,
        email: authUser.email,
      });
    } else if (subPath === "/video-hub") {
      trackPartnerEvent("video_hub_open", {
        uid: authUser.uid,
        email: authUser.email,
      });
    }

    lastTrackedPath.current = subPath;
  }, [authUser, subPath]);

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
        <AuthPanel darkMode={darkMode} onToggleTheme={onToggleTheme} translateText={translateText} />
      </div>
    );
  }

  const onboardingStatus = profile?.onboarding?.status;
  const needsOnboarding = onboardingStatus !== "completed" && onboardingStatus !== "skipped";

  if (subPath === "/" && (needsOnboarding || editingOnboarding)) {
    return (
      <OnboardingFlow
        profile={profile}
        darkMode={darkMode}
        onToggleTheme={onToggleTheme}
        onSave={saveOnboarding}
        onDone={() => setEditingOnboarding(false)}
        translateText={translateText}
      />
    );
  }

  const openOverview = () => navigate(BASE_PATH);
  const openTraining = () => navigate(`${BASE_PATH}/training`);
  const openModule = (moduleId) => navigate(`${BASE_PATH}/module/${moduleId}`);
  const openLesson = (moduleId, lessonId) =>
    navigate(`${BASE_PATH}/module/${moduleId}/lesson/${lessonId}`);
  const openGuides = () => navigate(`${BASE_PATH}/guides`);
  const openMore = () => navigate(`${BASE_PATH}/more`);
  const openGuide = (guideId) => navigate(`${BASE_PATH}/guides/${guideId}`);
  const openVideoHub = (videoId) => {
    const videoParam = videoId ? `?video=${encodeURIComponent(videoId)}` : "";
    navigate(`${BASE_PATH}/video-hub${videoParam}`);
  };
  const openTodaySupportResource = (plan) => {
    if (!plan?.resource) return;
    trackTodaySupportResourceClick(plan);

    if (plan.resource.type === "lesson") {
      openLesson(plan.resource.moduleId, plan.resource.lessonId);
      return;
    }
    if (plan.resource.type === "guide") {
      openGuide(plan.resource.guideId);
      return;
    }
    if (plan.resource.type === "video") {
      openVideoHub(plan.resource.videoId);
      return;
    }
    openGuides();
  };
  const moduleMatch = subPath.match(/^\/module\/([a-z0-9-]+)$/i);
  const lessonMatch = subPath.match(/^\/module\/([a-z0-9-]+)\/lesson\/([a-z0-9-]+)$/i);
  const guidesMatch = subPath.match(/^\/guides(?:\/([a-z0-9-]+))?$/i);
  const navigateSiteHome = () => {
    if (embedded && onExit) {
      onExit();
      return;
    }
    navigate("/");
  };

  let page = null;

  if (subPath === "/") {
    page = (
        <OverviewPage
          metrics={dashboardMetrics}
          profile={profile}
          curriculum={curriculum}
          onOpenTraining={openTraining}
          onOpenLesson={openLesson}
          onOpenGuide={openGuide}
          onOpenVideoHub={openVideoHub}
          onSelectTodayContext={saveTodaySupportContext}
          onMarkTodayDone={markTodaySupportDone}
          onOpenTodayResource={openTodaySupportResource}
          darkMode={darkMode}
          translateText={translateText}
        />
    );
  } else if (subPath === "/training") {
    page = (
      <TrainingPage
        metrics={dashboardMetrics}
        onOpenModule={openModule}
        onOpenLesson={openLesson}
        darkMode={darkMode}
        translateText={translateText}
      />
    );
  } else if (subPath === "/video-hub") {
    page = (
      <VideoHubPage
        darkMode={darkMode}
        onToggleTheme={onToggleTheme}
        showAdminDashboard={showAdminDashboard}
        translateText={translateText}
      />
    );
  } else if (subPath === "/more") {
    page = (
      <MorePage
        authUser={authUser}
        profile={profile}
        showAdminDashboard={showAdminDashboard}
        onSaveProfileDetails={saveProfileDetails}
        onEditPersonalization={() => {
          setEditingOnboarding(true);
          openOverview();
        }}
        onNavigateSiteHome={navigateSiteHome}
        onLogout={logout}
        darkMode={darkMode}
        translateText={translateText}
      />
    );
  } else if (guidesMatch) {
    page = (
      <InteractiveGuidesPage
        guideId={guidesMatch[1] || null}
        onBack={openGuides}
        onBackToDashboard={openOverview}
        onOpenGuide={openGuide}
        darkMode={darkMode}
        onToggleTheme={onToggleTheme}
        language={language}
        onLanguageChange={onLanguageChange}
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
            onSaveScenario={(responseText, responseKey) =>
              saveScenarioReflection(module.id, lesson.id, responseText, responseKey)
            }
            onSubmitQuiz={(answers) => submitQuiz(module.id, lesson.id, answers)}
            onCompleteLesson={() => markLessonCompleted(module.id, lesson.id)}
            onSaveMission={(completedItems) =>
              saveLessonMission(module.id, lesson.id, completedItems)
            }
            onOpenNextLesson={() => {
              const lessonIndex = module.lessons.findIndex((item) => item.id === lesson.id);
              const nextLesson = module.lessons[lessonIndex + 1];
              if (nextLesson) {
                openLesson(module.id, nextLesson.id);
                return;
              }
              openModule(module.id);
            }}
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

  const activePlatformItem = subPath.startsWith("/video-hub")
    ? "videos"
    : subPath.startsWith("/guides")
      ? "guides"
      : subPath === "/more"
        ? "more"
        : subPath === "/training" || subPath.startsWith("/module/")
          ? "training"
          : "today";
  const mobileNav = !embedded ? (
    <MobilePlatformNav
      activeItem={activePlatformItem}
      onNavigate={(item) => {
        if (item === "today") openOverview();
        if (item === "training") openTraining();
        if (item === "guides") openGuides();
        if (item === "videos") openVideoHub();
        if (item === "more") openMore();
      }}
      darkMode={darkMode}
      translateText={translateText}
    />
  ) : null;

  if (subPath === "/video-hub") {
    return (
      <>
        <div className="pb-28 md:pb-0">{page}</div>
        {mobileNav}
      </>
    );
  }

  return (
    <>
    <DashboardShell
      activeItem={activePlatformItem}
      authUser={authUser}
      metrics={dashboardMetrics}
      onLogout={logout}
      onNavigateHome={navigateSiteHome}
      onNavigatePlatform={(item) => {
        if (item === "today") openOverview();
        if (item === "training") openTraining();
        if (item === "guides") openGuides();
        if (item === "videos") openVideoHub();
        if (item === "more") openMore();
      }}
      embedded={embedded}
      showHomeButton={!embedded || Boolean(onExit)}
      homeLabel={embedded ? "Back to Main Guide" : "Site Home"}
      darkMode={darkMode}
      onToggleTheme={onToggleTheme}
      showAdminDashboard={showAdminDashboard}
      translateText={translateText}
    >
      <div className="pb-28 md:pb-0">{page}</div>
    </DashboardShell>
    {mobileNav}
    </>
  );
};

export default function PartnerDashboardApp({
  pathname,
  navigate,
  embedded = false,
  onExit,
  darkMode,
  language = "en",
  onLanguageChange = () => {},
  translateText = (value) => value,
}) {
  const [embeddedPathname, setEmbeddedPathname] = useState(BASE_PATH);
  const isControlledTheme = typeof darkMode === "boolean";
  const [localDarkMode, setLocalDarkMode] = useState(() => getInitialPartnerDarkMode());
  const effectiveDarkMode = isControlledTheme ? darkMode : localDarkMode;

  useEffect(() => {
    applyPartnerDocumentTheme(effectiveDarkMode);
  }, [effectiveDarkMode]);

  useEffect(() => {
    if (isControlledTheme || getStoredTheme()) return undefined;
    return subscribeToPartnerSystemTheme(setLocalDarkMode);
  }, [isControlledTheme]);

  const toggleTheme = useCallback(() => {
    if (isControlledTheme) return;
    setLocalDarkMode((current) => {
      const next = !current;
      persistPartnerTheme(next);
      return next;
    });
  }, [isControlledTheme]);

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
      <LocalizedDomBoundary key={language} language={language} translateText={translateText}>
        <DashboardRouter
          pathname={resolvedPathname}
          navigate={resolvedNavigate}
          embedded={embedded}
          onExit={onExit}
          darkMode={effectiveDarkMode}
          onToggleTheme={isControlledTheme ? undefined : toggleTheme}
          language={language}
          onLanguageChange={onLanguageChange}
          translateText={translateText}
        />
      </LocalizedDomBoundary>
    </PartnerDashboardProvider>
  );
}
