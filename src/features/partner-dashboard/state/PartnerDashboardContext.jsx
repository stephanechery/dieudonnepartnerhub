import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { partnerCurriculum } from "../data/curriculum";
import { partnerInteractiveGuides } from "../data/interactiveGuides";
import { videoHubVideos } from "../data/videoHub";
import { trackPartnerEvent } from "../services/analyticsService";
import {
  clearSession,
  confirmPasswordReset,
  getCurrentSession,
  hydrateSessionFromUrl,
  loginWithEmail,
  loginWithGoogle,
  registerWithEmail,
  requestPasswordReset,
  startOrganizationDemoSession,
  validateSupabaseSession,
} from "../services/authService";
import { ensureUserProfile, saveProfile } from "../services/profileService";
import {
  getModuleState,
  getCompletedLessonCount,
  getNextRecommendedLesson,
  getOverallQuizAverage,
  getOverallProgress,
  getQuizAverage,
  isLessonUnlocked,
  isModuleUnlocked,
  roundPercent,
} from "../utils/progress";

const PartnerDashboardContext = createContext(null);

const shouldStartOrganizationDemoSession = () => {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("org_demo") === "1";
};

const clearOrganizationDemoQuery = () => {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  if (!params.has("org_demo")) return;
  params.delete("org_demo");
  const nextSearch = params.toString();
  window.history.replaceState(
    {},
    "",
    `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}${window.location.hash}`
  );
};

const sortRecent = (items) =>
  [...items].sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

const normalizeIndexArray = (value) => {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value
        .map((item) => Number(item))
        .filter((item) => Number.isInteger(item) && item >= 0)
    )
  ).sort((a, b) => a - b);
};

const normalizeStringArray = (value) => {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean)
    )
  );
};

const isMultiQuestion = (question) =>
  question?.type === "multi" || Array.isArray(question?.answerIndexes);

const recommendationsByModule = {
  prenatal: {
    guideId: "partner-trimester-guide",
    videoId: "healthy-pregnancy-prenatal-care",
  },
  labor: {
    guideId: "partner-labor-guide",
    videoId: "inducing-labor",
  },
  postpartum: {
    guideId: "partner-postpartum-guide",
    videoId: "postpartum-warning-signs",
  },
};

const getQuestionCorrect = (question, response) => {
  if (isMultiQuestion(question)) {
    const expected = normalizeIndexArray(question.answerIndexes);
    const actual = normalizeIndexArray(response);
    if (!expected.length || expected.length !== actual.length) return false;
    return expected.every((value, index) => value === actual[index]);
  }

  const expectedIndex = Number(question.answerIndex);
  const actualIndex = Number(response);
  if (!Number.isInteger(expectedIndex) || !Number.isInteger(actualIndex)) return false;
  return expectedIndex === actualIndex;
};

const normalizeLessonResponses = (lesson, answersByQuestion = {}) =>
  (lesson?.quiz || []).reduce((acc, question) => {
    if (isMultiQuestion(question)) {
      acc[question.id] = normalizeIndexArray(answersByQuestion[question.id]);
      return acc;
    }

    const parsed = Number(answersByQuestion[question.id]);
    if (Number.isInteger(parsed)) {
      acc[question.id] = parsed;
    }
    return acc;
  }, {});

export const PartnerDashboardProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const bootstrapSession = useCallback(async () => {
    setAuthLoading(true);
    try {
      await hydrateSessionFromUrl();
      const session = shouldStartOrganizationDemoSession()
        ? await startOrganizationDemoSession()
        : (await validateSupabaseSession()) || getCurrentSession();
      clearOrganizationDemoQuery();
      if (!session) {
        setAuthUser(null);
        setProfile(null);
        setAuthLoading(false);
        return;
      }

      const currentProfile = await ensureUserProfile(session);
      setAuthUser(session);
      setProfile(currentProfile);
      setAuthLoading(false);
    } catch {
      setAuthUser(null);
      setProfile(null);
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrapSession();
  }, [bootstrapSession]);

  const persistProfile = useCallback(async (nextProfile) => {
    setProfile(nextProfile);
    const saved = await saveProfile(nextProfile);
    setProfile(saved);
    return saved;
  }, []);

  const runAuthAction = async (action) => {
    const sessionUser = await action();
    const currentProfile = await ensureUserProfile(sessionUser);
    setAuthUser(sessionUser);
    setProfile(currentProfile);
    return sessionUser;
  };

  const register = (payload) => runAuthAction(() => registerWithEmail(payload));
  const login = (payload) => runAuthAction(() => loginWithEmail(payload));
  const loginGoogle = (options) => runAuthAction(() => loginWithGoogle(options));

  const logout = async () => {
    await clearSession();
    setAuthUser(null);
    setProfile(null);
  };

  const requestReset = (email, redirectPath) => requestPasswordReset(email, redirectPath);

  const confirmReset = (payload) => runAuthAction(() => confirmPasswordReset(payload));

  const saveScenarioReflection = (moduleId, lessonId, responseText, responseKey = lessonId) => {
    if (!profile) return;

    const moduleState = getModuleState(profile, moduleId);
    const nextProfile = {
      ...profile,
      modules: {
        ...profile.modules,
        [moduleId]: {
          ...moduleState,
          scenarioResponses: {
            ...moduleState.scenarioResponses,
            [responseKey]: responseText,
          },
        },
      },
    };

    persistProfile(nextProfile);
    trackPartnerEvent("scenario_saved", {
      uid: profile.uid,
      email: profile.email,
      moduleId,
      lessonId,
    });
  };

  const submitQuiz = (moduleId, lessonId, answersByQuestion) => {
    if (!profile) return 0;

    const module = partnerCurriculum.modules.find((item) => item.id === moduleId);
    const lesson = module?.lessons.find((item) => item.id === lessonId);
    if (!lesson) return 0;

    const normalizedResponses = normalizeLessonResponses(lesson, answersByQuestion);
    const total = lesson.quiz.length || 1;
    const correct = lesson.quiz.reduce((count, question) => {
      return getQuestionCorrect(question, normalizedResponses[question.id]) ? count + 1 : count;
    }, 0);
    const score = roundPercent((correct / total) * 100);

    const moduleState = getModuleState(profile, moduleId);
    const isAlreadyCompleted = moduleState.completedLessons.includes(lessonId);
    const shouldAutoComplete = !isAlreadyCompleted && score >= 70;
    const completedAt = new Date().toISOString();

    const nextProfile = {
      ...profile,
      modules: {
        ...profile.modules,
        [moduleId]: {
          ...moduleState,
          quizScores: {
            ...moduleState.quizScores,
            [lessonId]: score,
          },
          quizResponses: {
            ...(moduleState.quizResponses || {}),
            [lessonId]: normalizedResponses,
          },
          completedLessons: shouldAutoComplete
            ? [...moduleState.completedLessons, lessonId]
            : moduleState.completedLessons,
        },
      },
      recentlyCompleted: shouldAutoComplete
        ? sortRecent([
            {
              moduleId,
              lessonId,
              completedAt,
            },
            ...(profile.recentlyCompleted || []),
          ]).slice(0, 8)
        : profile.recentlyCompleted,
    };

    persistProfile(nextProfile);
    trackPartnerEvent("quiz_completed", {
      uid: profile.uid,
      email: profile.email,
      moduleId,
      lessonId,
    });
    if (shouldAutoComplete) {
      trackPartnerEvent("lesson_completed", {
        uid: profile.uid,
        email: profile.email,
        moduleId,
        lessonId,
      });
    }
    return score;
  };

  const markLessonCompleted = (moduleId, lessonId) => {
    if (!profile) return false;

    const module = partnerCurriculum.modules.find((item) => item.id === moduleId);
    if (!module) return false;

    if (!isModuleUnlocked(partnerCurriculum.modules, profile, moduleId)) {
      return false;
    }

    const moduleState = getModuleState(profile, moduleId);
    if (!isLessonUnlocked(module, moduleState, lessonId)) {
      return false;
    }

    if (moduleState.completedLessons.includes(lessonId)) {
      return true;
    }

    const completedAt = new Date().toISOString();
    const nextRecentlyCompleted = sortRecent([
      {
        moduleId,
        lessonId,
        completedAt,
      },
      ...(profile.recentlyCompleted || []),
    ]).slice(0, 8);

    const nextProfile = {
      ...profile,
      modules: {
        ...profile.modules,
        [moduleId]: {
          ...moduleState,
          completedLessons: [...moduleState.completedLessons, lessonId],
        },
      },
      recentlyCompleted: nextRecentlyCompleted,
    };

    persistProfile(nextProfile);
    trackPartnerEvent("lesson_completed", {
      uid: profile.uid,
      email: profile.email,
      moduleId,
      lessonId,
    });
    return true;
  };

  const saveVideoHubPreferences = (updates = {}) => {
    if (!profile) return;

    const nextProfile = {
      ...profile,
      videoHub: {
        savedVideoIds: normalizeStringArray(
          updates.savedVideoIds ?? profile.videoHub?.savedVideoIds
        ),
        watchLaterIds: normalizeStringArray(
          updates.watchLaterIds ?? profile.videoHub?.watchLaterIds
        ),
      },
    };

    persistProfile(nextProfile);
  };

  const dashboardMetrics = useMemo(() => {
    if (!profile) {
      return null;
    }

    const modules = partnerCurriculum.modules.map((module) => {
      const moduleState = getModuleState(profile, module.id);
      const completedLessons = getCompletedLessonCount(module, moduleState);
      const completion = roundPercent((completedLessons / module.lessons.length) * 100);
      return {
        id: module.id,
        title: module.title,
        subtitle: module.subtitle,
        completion,
        unlocked: isModuleUnlocked(partnerCurriculum.modules, profile, module.id),
        quizAverage: getQuizAverage(moduleState.quizScores),
        completedLessons,
        totalLessons: module.lessons.length,
      };
    });

    const overallProgress = getOverallProgress(partnerCurriculum.modules, profile);
    const overallQuizAverage = getOverallQuizAverage(partnerCurriculum.modules, profile);
    const nextLesson = getNextRecommendedLesson(partnerCurriculum.modules, profile);

    const currentModule = modules.find((module) => module.unlocked && module.completion < 100) || modules[modules.length - 1];
    const recommendationModuleId = nextLesson.lessonId ? nextLesson.moduleId : currentModule.id;
    const recommendationTargets =
      recommendationsByModule[recommendationModuleId] || recommendationsByModule.prenatal;
    const recommendedGuide =
      partnerInteractiveGuides.find((guide) => guide.id === recommendationTargets.guideId) ||
      partnerInteractiveGuides[0];
    const recommendedVideo =
      videoHubVideos.find((video) => video.id === recommendationTargets.videoId) ||
      videoHubVideos[0];

    const recentlyCompleted = (profile.recentlyCompleted || []).map((entry) => {
      const module = partnerCurriculum.modules.find((item) => item.id === entry.moduleId);
      const lesson = module?.lessons.find((item) => item.id === entry.lessonId);
      return {
        ...entry,
        moduleTitle: module?.title || entry.moduleId,
        lessonTitle: lesson?.title || entry.lessonId,
      };
    });

    return {
      modules,
      overallProgress,
      overallQuizAverage,
      nextLesson,
      nextActions: {
        lesson: nextLesson,
        guide: recommendedGuide,
        video: recommendedVideo,
      },
      currentModule,
      recentlyCompleted,
    };
  }, [profile]);

  const value = {
    authUser,
    profile,
    authLoading,
    curriculum: partnerCurriculum,
    dashboardMetrics,
    register,
    login,
    loginGoogle,
    logout,
    requestReset,
    confirmReset,
    saveScenarioReflection,
    submitQuiz,
    markLessonCompleted,
    saveVideoHubPreferences,
  };

  return <PartnerDashboardContext.Provider value={value}>{children}</PartnerDashboardContext.Provider>;
};

export const usePartnerDashboard = () => {
  const context = useContext(PartnerDashboardContext);
  if (!context) {
    throw new Error("usePartnerDashboard must be used within PartnerDashboardProvider");
  }
  return context;
};
