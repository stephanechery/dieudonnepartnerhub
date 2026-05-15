import { partnerCurriculum } from "../data/curriculum";
import { partnerInteractiveGuides } from "../data/interactiveGuides";
import { videoHubVideos } from "../data/videoHub";
import { getCurrentAccessToken } from "./authService";
import { getAllLocalProfiles } from "./profileService";

const EVENTS_KEY = "dph_learning_events_v1";
const ACTIVE_WINDOW_DAYS = 14;
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();
const SUPABASE_ANALYTICS_TABLE =
  (import.meta.env.VITE_SUPABASE_ANALYTICS_TABLE || "").trim();
const DEFAULT_ADMIN_EMAILS = [
  "stephanchery@gmail.com",
  "stephanechery@dieudonnefoundation.org",
  "stephanechery@dieudonnefoudation.org",
];

const safeJsonParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const isBrowser = () => typeof window !== "undefined";

const readEvents = () => {
  if (!isBrowser()) return [];
  const events = safeJsonParse(window.localStorage.getItem(EVENTS_KEY), []);
  return Array.isArray(events) ? events : [];
};

const writeEvents = (events) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(EVENTS_KEY, JSON.stringify(events.slice(-800)));
};

const isSupabaseAnalyticsEnabled = () =>
  Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_ANALYTICS_TABLE);

const eventToSupabaseRow = (event) => ({
  id: event.id,
  event_name: event.eventName,
  occurred_at: event.occurredAt,
  uid: event.uid,
  email: event.email,
  module_id: event.moduleId,
  lesson_id: event.lessonId,
  guide_id: event.guideId,
  video_id: event.videoId,
  category: event.category,
});

const syncEventToSupabase = async (event) => {
  if (!isSupabaseAnalyticsEnabled()) return;

  const accessToken = getCurrentAccessToken();
  if (!accessToken) return;

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_ANALYTICS_TABLE}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify([eventToSupabaseRow(event)]),
    });
  } catch {
    // Local analytics remains the durable fallback when remote writes are unavailable.
  }
};

const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const configuredAdminEmails = () =>
  [
    ...DEFAULT_ADMIN_EMAILS,
    ...(import.meta.env.VITE_ADMIN_EMAILS || "").split(","),
  ]
    .map(normalizeEmail)
    .filter(Boolean);

export const isAdminUser = (authUser, profile) => {
  const role = String(authUser?.role || profile?.role || "").trim().toLowerCase();
  if (role === "admin" || role === "owner") return true;

  const email = normalizeEmail(authUser?.email || profile?.email);
  if (!email) return false;

  return configuredAdminEmails().includes(email);
};

export const trackPartnerEvent = (eventName, payload = {}) => {
  if (!isBrowser() || !eventName) return;

  const event = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    eventName,
    occurredAt: new Date().toISOString(),
    uid: payload.uid || null,
    email: normalizeEmail(payload.email),
    moduleId: payload.moduleId || null,
    lessonId: payload.lessonId || null,
    guideId: payload.guideId || null,
    videoId: payload.videoId || null,
    category: payload.category || null,
  };

  writeEvents([...readEvents(), event]);
  syncEventToSupabase(event);
  return event;
};

const makeMockProfiles = () => {
  const names = ["R. Carter", "A. Thomas", "M. Green", "J. Lewis", "D. King"];
  return names.map((displayName, index) => {
    const modules = partnerCurriculum.modules.reduce((acc, module, moduleIndex) => {
      const completedCount = Math.max(
        0,
        Math.min(module.lessons.length, 3 - Math.abs(index - moduleIndex))
      );
      const completedLessons = module.lessons.slice(0, completedCount).map((lesson) => lesson.id);
      acc[module.id] = {
        completedLessons,
        quizScores: completedLessons.reduce((scores, lessonId, lessonIndex) => {
          scores[lessonId] = 72 + ((index + lessonIndex + moduleIndex) % 4) * 6;
          return scores;
        }, {}),
        quizResponses: {},
        scenarioResponses: {},
      };
      return acc;
    }, {});

    return {
      uid: `mock-${index + 1}`,
      email: `learner${index + 1}@example.com`,
      displayName,
      createdAt: daysAgo(36 - index * 5),
      lastActiveAt: daysAgo(index * 3),
      modules,
      recentlyCompleted: [],
      videoHub: {
        savedVideoIds: videoHubVideos.slice(index, index + 3).map((video) => video.id),
        watchLaterIds: videoHubVideos.slice(index + 2, index + 5).map((video) => video.id),
      },
    };
  });
};

const makeMockEvents = () => {
  const guides = partnerInteractiveGuides.slice(0, 7);
  const videos = videoHubVideos.slice(0, 12);
  const events = [];

  for (let day = 13; day >= 0; day -= 1) {
    const occurredAt = daysAgo(day);
    const module = partnerCurriculum.modules[day % partnerCurriculum.modules.length];
    const lesson = module.lessons[day % module.lessons.length];
    const video = videos[day % videos.length];
    const guide = guides[day % guides.length];

    events.push(
      {
        id: `mock-start-${day}`,
        eventName: "lesson_start",
        occurredAt,
        uid: `mock-${(day % 5) + 1}`,
        moduleId: module.id,
        lessonId: lesson.id,
      },
      {
        id: `mock-video-${day}`,
        eventName: "video_view",
        occurredAt,
        uid: `mock-${((day + 1) % 5) + 1}`,
        videoId: video.id,
        category: video.category,
      },
      {
        id: `mock-guide-${day}`,
        eventName: "guide_open",
        occurredAt,
        uid: `mock-${((day + 2) % 5) + 1}`,
        guideId: guide.id,
      }
    );

    if (day % 3 === 0) {
      events.push({
        id: `mock-video-hub-${day}`,
        eventName: "video_hub_open",
        occurredAt,
        uid: `mock-${((day + 4) % 5) + 1}`,
      });
      events.push({
        id: `mock-recommendation-${day}`,
        eventName: "recommendation_click",
        occurredAt,
        uid: `mock-${((day + 2) % 5) + 1}`,
        moduleId: module.id,
        lessonId: lesson.id,
        guideId: guide.id,
        videoId: video.id,
        category: day % 2 === 0 ? "lesson" : "guide",
      });
    }

    if (day % 4 === 0) {
      events.push({
        id: `mock-video-save-${day}`,
        eventName: "video_save",
        occurredAt,
        uid: `mock-${((day + 2) % 5) + 1}`,
        videoId: video.id,
        category: video.category,
      });
    }

    if (day % 5 === 0) {
      events.push({
        id: `mock-video-watch-later-${day}`,
        eventName: "video_watch_later",
        occurredAt,
        uid: `mock-${((day + 1) % 5) + 1}`,
        videoId: video.id,
        category: video.category,
      });
    }

    if (day % 2 === 0) {
      events.push({
        id: `mock-quiz-${day}`,
        eventName: "quiz_completed",
        occurredAt,
        uid: `mock-${((day + 3) % 5) + 1}`,
        moduleId: module.id,
        lessonId: lesson.id,
      });
    }
  }

  return events;
};

const getModuleState = (profile, moduleId) => profile.modules?.[moduleId] || {};

const countCompletedLessons = (profile) =>
  partnerCurriculum.modules.reduce((count, module) => {
    const moduleState = getModuleState(profile, module.id);
    return count + (moduleState.completedLessons || []).length;
  }, 0);

const countQuizScores = (profile) =>
  partnerCurriculum.modules.reduce((count, module) => {
    const moduleState = getModuleState(profile, module.id);
    return count + Object.keys(moduleState.quizScores || {}).length;
  }, 0);

const activeSince = () => {
  const date = new Date();
  date.setDate(date.getDate() - ACTIVE_WINDOW_DAYS);
  return date.getTime();
};

const increment = (map, key, amount = 1) => {
  if (!key) return;
  map.set(key, (map.get(key) || 0) + amount);
};

const sortMap = (map) =>
  Array.from(map.entries())
    .map(([id, value]) => ({ id, value }))
    .sort((a, b) => b.value - a.value);

const buildTrend = (events) => {
  const rows = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return {
      key: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
      lessons: 0,
      videos: 0,
      guides: 0,
    };
  });

  const rowByKey = new Map(rows.map((row) => [row.key, row]));
  events.forEach((event) => {
    const row = rowByKey.get(String(event.occurredAt || "").slice(0, 10));
    if (!row) return;
    if (event.eventName === "lesson_start" || event.eventName === "lesson_completed") {
      row.lessons += 1;
    }
    if (
      event.eventName === "video_hub_open" ||
      event.eventName === "video_view" ||
      event.eventName === "video_save" ||
      event.eventName === "video_watch_later"
    ) {
      row.videos += 1;
    }
    if (event.eventName === "guide_open") {
      row.guides += 1;
    }
  });

  return rows;
};

const getLessonTitle = (moduleId, lessonId) => {
  const module = partnerCurriculum.modules.find((item) => item.id === moduleId);
  const lesson = module?.lessons.find((item) => item.id === lessonId);
  return {
    moduleTitle: module?.title || moduleId,
    lessonTitle: lesson?.title || lessonId,
  };
};

const nextResumePoint = (profile) => {
  for (const module of partnerCurriculum.modules) {
    const completed = new Set(getModuleState(profile, module.id).completedLessons || []);
    const nextLesson = module.lessons.find((lesson) => !completed.has(lesson.id));
    if (nextLesson && completed.size > 0) {
      return { moduleId: module.id, lessonId: nextLesson.id };
    }
  }
  return null;
};

const buildInsights = ({ moduleProgress, dropOffs, topicInterest, guideUsage }) => {
  const weakestModule = [...moduleProgress].sort((a, b) => a.completion - b.completion)[0];
  const topDrop = dropOffs[0];
  const topTopic = topicInterest[0];
  const topGuide = guideUsage[0];

  return [
    {
      title: "Clarify the next step after the first weak module",
      signal: `${weakestModule?.title || "A module"} averages ${weakestModule?.completion || 0}% completion.`,
      action: "Add a short recap, one checkpoint question, and a clearer resume action at that point.",
    },
    {
      title: "Reduce friction at the largest drop-off",
      signal: topDrop
        ? `${topDrop.lessonTitle} has the highest incomplete-start count.`
        : "No drop-off signal yet.",
      action: "Review the lesson length, quiz timing, and whether the scenario asks too much at once.",
    },
    {
      title: "Lean into current interest",
      signal: topTopic
        ? `${topTopic.label} is the strongest video topic.`
        : "Video topic interest is still building.",
      action: topGuide
        ? `Pair it with the ${topGuide.label} guide in the overview.`
        : "Promote the matching guide once guide usage rises.",
    },
  ];
};

const buildContentHealth = ({ moduleProgress, dropOffs, mostUsedVideos, recommendationClicks }) => {
  const weakestModule = [...moduleProgress].sort((a, b) => a.completion - b.completion)[0];
  const topDrop = dropOffs[0];
  const topVideo = mostUsedVideos[0];
  const totalRecommendationClicks = recommendationClicks.reduce((count, item) => count + item.value, 0);
  const topRecommendation = recommendationClicks[0];

  return [
    {
      id: "weak-module",
      label: "Weakest module",
      value: `${weakestModule?.completion || 0}%`,
      detail: weakestModule?.title || "No module signal yet",
      action: "Tighten the next lesson prompt and add a short recap before the quiz.",
    },
    {
      id: "drop-off",
      label: "Largest drop-off",
      value: formatHealthValue(topDrop?.value),
      detail: topDrop?.lessonTitle || "No drop-off signal yet",
      action: "Review lesson length, quiz timing, and the first action after the lesson opens.",
    },
    {
      id: "video-interest",
      label: "Top video signal",
      value: formatHealthValue(topVideo?.value),
      detail: topVideo?.label || "No video signal yet",
      action: "Pair this video with the matching module and companion guide.",
    },
    {
      id: "recommendations",
      label: "Recommendation clicks",
      value: formatHealthValue(totalRecommendationClicks),
      detail: topRecommendation
        ? `${topRecommendation.label} recommendations lead right now`
        : "No recommendation clicks yet",
      action: "Keep the highest-clicked recommendation visible above the module grid on mobile.",
    },
  ];
};

const formatHealthValue = (value) => String(value || 0);

export const getAdminDashboardData = () => {
  const localProfiles = getAllLocalProfiles();
  const profiles = localProfiles.length ? localProfiles : makeMockProfiles();
  const events = readEvents().length ? readEvents() : makeMockEvents();
  const usingMockData = !localProfiles.length || !readEvents().length;
  const activeCutoff = activeSince();
  const profileIds = new Set(profiles.map((profile) => profile.uid));

  const uniqueActiveUsers = new Set(
    events
      .filter((event) => new Date(event.occurredAt).getTime() >= activeCutoff)
      .map((event) => event.uid)
      .filter((uid) => uid && profileIds.has(uid))
  );

  profiles.forEach((profile) => {
    if (new Date(profile.lastActiveAt).getTime() >= activeCutoff) {
      uniqueActiveUsers.add(profile.uid);
    }
  });

  const moduleProgress = partnerCurriculum.modules.map((module) => {
    const totalLessons = module.lessons.length * profiles.length || 1;
    const completed = profiles.reduce((count, profile) => {
      return count + (getModuleState(profile, module.id).completedLessons || []).length;
    }, 0);
    return {
      id: module.id,
      title: module.title,
      subtitle: module.subtitle,
      completion: Math.round((completed / totalLessons) * 100),
      completed,
      totalLessons,
    };
  });

  const guideMap = new Map(partnerInteractiveGuides.map((guide) => [guide.id, 0]));
  const topicMap = new Map();
  const videoMap = new Map(videoHubVideos.map((video) => [video.id, 0]));
  const recommendationMap = new Map([
    ["lesson", 0],
    ["guide", 0],
    ["video", 0],
  ]);
  const resumeMap = new Map();
  const dropOffMap = new Map();

  events.forEach((event) => {
    if (event.eventName === "guide_open") increment(guideMap, event.guideId);
    if (
      event.eventName === "video_view" ||
      event.eventName === "video_save" ||
      event.eventName === "video_watch_later"
    ) {
      increment(videoMap, event.videoId);
      increment(topicMap, event.category);
    }
    if (event.eventName === "lesson_start") {
      increment(dropOffMap, `${event.moduleId}:${event.lessonId}`);
    }
    if (event.eventName === "lesson_completed") {
      increment(dropOffMap, `${event.moduleId}:${event.lessonId}`, -1);
    }
    if (event.eventName === "recommendation_click") {
      increment(recommendationMap, event.category);
    }
  });

  profiles.forEach((profile) => {
    const resumePoint = nextResumePoint(profile);
    if (resumePoint) increment(resumeMap, `${resumePoint.moduleId}:${resumePoint.lessonId}`);

    (profile.videoHub?.savedVideoIds || []).forEach((videoId) => {
      const video = videoHubVideos.find((item) => item.id === videoId);
      increment(videoMap, videoId);
      increment(topicMap, video?.category);
    });

    (profile.videoHub?.watchLaterIds || []).forEach((videoId) => {
      const video = videoHubVideos.find((item) => item.id === videoId);
      increment(topicMap, video?.category);
    });
  });

  const lessonStarts = events.filter((event) => event.eventName === "lesson_start").length;
  const lessonCompletions =
    profiles.reduce((count, profile) => count + countCompletedLessons(profile), 0) +
    events.filter((event) => event.eventName === "lesson_completed").length;
  const quizCompletions =
    profiles.reduce((count, profile) => count + countQuizScores(profile), 0) +
    events.filter((event) => event.eventName === "quiz_completed").length;
  const videoHubViews = events.filter((event) => event.eventName === "video_hub_open").length;
  const videoViews = events.filter((event) => event.eventName === "video_view").length;
  const savedVideoEvents = events.filter((event) => event.eventName === "video_save").length;
  const watchLaterEvents = events.filter((event) => event.eventName === "video_watch_later").length;
  const savedVideos = savedVideoEvents || profiles.reduce(
    (count, profile) => count + (profile.videoHub?.savedVideoIds || []).length,
    0
  );
  const watchLaterAdds = watchLaterEvents || profiles.reduce(
    (count, profile) => count + (profile.videoHub?.watchLaterIds || []).length,
    0
  );

  const guideUsage = sortMap(guideMap).map((item) => ({
    ...item,
    label: partnerInteractiveGuides.find((guide) => guide.id === item.id)?.title || item.id,
  }));

  const topicInterest = sortMap(topicMap).map((item) => ({
    ...item,
    label: item.id,
  }));

  const mostUsedVideos = sortMap(videoMap)
    .slice(0, 6)
    .map((item) => ({
      ...item,
      label: videoHubVideos.find((video) => video.id === item.id)?.title || item.id,
      category: videoHubVideos.find((video) => video.id === item.id)?.category || "Video",
    }));
  const recommendationClicks = sortMap(recommendationMap)
    .filter((item) => item.value > 0)
    .map((item) => ({
      ...item,
      label:
        item.id === "lesson"
          ? "Lesson"
          : item.id === "guide"
            ? "Guide"
            : "Video",
    }));

  const resumePoints = sortMap(resumeMap)
    .slice(0, 5)
    .map((item) => {
      const [moduleId, lessonId] = item.id.split(":");
      return { ...item, ...getLessonTitle(moduleId, lessonId) };
    });

  const dropOffs = sortMap(dropOffMap)
    .filter((item) => item.value > 0)
    .slice(0, 5)
    .map((item) => {
      const [moduleId, lessonId] = item.id.split(":");
      return { ...item, ...getLessonTitle(moduleId, lessonId) };
    });

  const data = {
    usingMockData,
    lastUpdatedAt: new Date().toISOString(),
    totals: {
      totalUsers: profiles.length,
      activeUsers: uniqueActiveUsers.size,
      lessonStarts,
      lessonCompletions,
      quizCompletions,
      guideOpens: events.filter((event) => event.eventName === "guide_open").length,
      videoHubViews,
      videoViews,
      savedVideos,
      watchLaterAdds,
    },
    moduleProgress,
    guideUsage,
    topicInterest,
    mostUsedVideos,
    recommendationClicks,
    resumePoints,
    dropOffs,
    trends: buildTrend(events),
  };

  return {
    ...data,
    insights: buildInsights(data),
    contentHealth: buildContentHealth(data),
  };
};
