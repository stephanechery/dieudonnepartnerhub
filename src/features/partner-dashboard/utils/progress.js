import { moduleOrder } from "../data/curriculum";

export const roundPercent = (value) => Math.max(0, Math.min(100, Math.round(value)));
const PASSING_SCORE = 70;

export const getModuleState = (profile, moduleId) =>
  profile?.modules?.[moduleId] || {
    completedLessons: [],
    quizScores: {},
    quizResponses: {},
    scenarioResponses: {},
  };

export const getModuleCompletion = (module, moduleState) => {
  const totalLessons = module.lessons.length || 1;
  const completedCount = getCompletedLessonCount(module, moduleState);
  return roundPercent((completedCount / totalLessons) * 100);
};

export const isLessonComplete = (moduleState, lessonId) => {
  if (moduleState.completedLessons.includes(lessonId)) {
    return true;
  }
  const score = Number(moduleState.quizScores?.[lessonId]);
  return Number.isFinite(score) && score >= PASSING_SCORE;
};

export const getCompletedLessonCount = (module, moduleState) =>
  module.lessons.reduce((count, lesson) => {
    return count + (isLessonComplete(moduleState, lesson.id) ? 1 : 0);
  }, 0);

export const isModuleUnlocked = (modules, profile, moduleId) => {
  const moduleIndex = modules.findIndex((module) => module.id === moduleId);
  if (moduleIndex <= 0) {
    return true;
  }

  const previousModule = modules[moduleIndex - 1];
  const previousState = getModuleState(profile, previousModule.id);
  return getModuleCompletion(previousModule, previousState) >= 100;
};

export const isLessonUnlocked = (module, moduleState, lessonId) => {
  const lessonIndex = module.lessons.findIndex((lesson) => lesson.id === lessonId);
  if (lessonIndex <= 0) {
    return true;
  }

  const previousLessonId = module.lessons[lessonIndex - 1].id;
  return isLessonComplete(moduleState, previousLessonId);
};

export const getOverallProgress = (modules, profile) => {
  const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0) || 1;
  const completedLessons = modules.reduce((sum, module) => {
    const moduleState = getModuleState(profile, module.id);
    return sum + getCompletedLessonCount(module, moduleState);
  }, 0);

  return roundPercent((completedLessons / totalLessons) * 100);
};

export const getOverallQuizAverage = (modules, profile) => {
  const scores = modules.flatMap((module) => {
    const moduleState = getModuleState(profile, module.id);
    return Object.values(moduleState.quizScores || {});
  });

  if (!scores.length) {
    return 0;
  }

  const total = scores.reduce((sum, score) => sum + Number(score || 0), 0);
  return roundPercent(total / scores.length);
};

export const getModuleProgressList = (modules, profile) =>
  modules.map((module) => {
    const state = getModuleState(profile, module.id);
    const completedLessons = getCompletedLessonCount(module, state);
    return {
      id: module.id,
      title: module.title,
      unlocked: isModuleUnlocked(modules, profile, module.id),
      completion: getModuleCompletion(module, state),
      quizAverage: getQuizAverage(state.quizScores),
      completedLessons,
      totalLessons: module.lessons.length,
    };
  });

export const getQuizAverage = (quizScores = {}) => {
  const values = Object.values(quizScores);
  if (!values.length) {
    return 0;
  }

  const total = values.reduce((sum, score) => sum + score, 0);
  return roundPercent(total / values.length);
};

export const getNextRecommendedLesson = (modules, profile) => {
  for (const module of modules) {
    if (!isModuleUnlocked(modules, profile, module.id)) {
      continue;
    }

    const moduleState = getModuleState(profile, module.id);
    for (const lesson of module.lessons) {
      if (!isLessonComplete(moduleState, lesson.id)) {
        return {
          moduleId: module.id,
          moduleTitle: module.title,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
        };
      }
    }
  }

  const finalModuleId = moduleOrder[moduleOrder.length - 1];
  return {
    moduleId: finalModuleId,
    moduleTitle: "All Modules",
    lessonId: null,
    lessonTitle: "Training complete. Review lessons anytime.",
  };
};
