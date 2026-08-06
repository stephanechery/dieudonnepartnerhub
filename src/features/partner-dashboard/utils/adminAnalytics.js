const DAY_MS = 24 * 60 * 60 * 1000;

export const ADMIN_RANGE_OPTIONS = ["7d", "14d", "30d", "all"];

export const normalizeAdminRange = (range) =>
  ADMIN_RANGE_OPTIONS.includes(range) ? range : "7d";

export const getAdminRangeLabel = (range) => {
  const normalized = normalizeAdminRange(range);
  return normalized === "all" ? "all time" : `the last ${normalized.slice(0, -1)} days`;
};

export const getAdminRangeCutoff = (range, now = new Date()) => {
  const normalized = normalizeAdminRange(range);
  if (normalized === "all") return null;

  const days = Number(normalized.slice(0, -1));
  const cutoff = new Date(now);
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - (days - 1));
  return cutoff.getTime();
};

const getEventTime = (event) => new Date(event?.occurredAt || 0).getTime();

export const filterEventsForAdminRange = (events, range, now = new Date()) => {
  const cutoff = getAdminRangeCutoff(range, now);
  const end = new Date(now).getTime();

  return (events || []).filter((event) => {
    const occurredAt = getEventTime(event);
    return Number.isFinite(occurredAt) && occurredAt > 0 && occurredAt <= end && (cutoff === null || occurredAt >= cutoff);
  });
};

export const getProfileCompletionEvents = (profiles) =>
  (profiles || []).flatMap((profile) =>
    (profile.recentlyCompleted || [])
      .filter((item) => item?.completedAt && item?.moduleId && item?.lessonId)
      .map((item) => ({
        id: `profile-completion-${profile.uid}-${item.moduleId}-${item.lessonId}`,
        eventName: "lesson_completed",
        occurredAt: item.completedAt,
        uid: profile.uid,
        moduleId: item.moduleId,
        lessonId: item.lessonId,
        source: "profile",
      }))
  );

export const getProfileProgressTotals = (profiles) =>
  (profiles || []).reduce(
    (totals, profile) => {
      Object.values(profile.modules || {}).forEach((moduleState) => {
        totals.lessonCompletions += Array.isArray(moduleState?.completedLessons)
          ? moduleState.completedLessons.length
          : 0;
        totals.quizResults += Object.keys(moduleState?.quizScores || {}).length;
      });
      return totals;
    },
    { lessonCompletions: 0, quizResults: 0 }
  );

const completionKey = (event) =>
  `${event?.uid || "unknown"}:${event?.moduleId || "unknown"}:${event?.lessonId || "unknown"}`;

export const mergeProfileCompletionEvents = (events, profiles) => {
  const tracked = [...(events || [])];
  const trackedCompletions = new Set(
    tracked
      .filter((event) => event.eventName === "lesson_completed")
      .map(completionKey)
  );

  getProfileCompletionEvents(profiles).forEach((event) => {
    if (!trackedCompletions.has(completionKey(event))) tracked.push(event);
  });

  return tracked;
};

const getTrendStart = (events, range, now) => {
  const cutoff = getAdminRangeCutoff(range, now);
  if (cutoff !== null) return cutoff;

  const eventTimes = (events || [])
    .map(getEventTime)
    .filter((value) => Number.isFinite(value) && value > 0);
  if (!eventTimes.length) {
    const fallback = new Date(now);
    fallback.setHours(0, 0, 0, 0);
    fallback.setDate(fallback.getDate() - 6);
    return fallback.getTime();
  }
  return Math.min(...eventTimes);
};

export const buildAdminTrend = (events, range, now = new Date()) => {
  const normalized = normalizeAdminRange(range);
  const end = new Date(now).getTime();
  const start = getTrendStart(events, normalized, now);
  const bucketCount = 7;
  const span = Math.max(DAY_MS, end - start + 1);
  const bucketSize = span / bucketCount;
  const showWeekday = normalized === "7d";

  const rows = Array.from({ length: bucketCount }, (_, index) => {
    const bucketStart = new Date(start + index * bucketSize);
    return {
      key: `${normalized}-${index}`,
      label: bucketStart.toLocaleDateString(undefined, showWeekday
        ? { weekday: "short" }
        : { month: "numeric", day: "numeric" }),
      lessons: 0,
      videos: 0,
      guides: 0,
    };
  });

  filterEventsForAdminRange(events, normalized, now).forEach((event) => {
    const occurredAt = getEventTime(event);
    const index = Math.min(bucketCount - 1, Math.max(0, Math.floor((occurredAt - start) / bucketSize)));
    const row = rows[index];
    if (event.eventName === "lesson_start" || event.eventName === "lesson_completed") row.lessons += 1;
    if (["video_hub_open", "video_view", "video_save", "video_watch_later"].includes(event.eventName)) row.videos += 1;
    if (event.eventName === "guide_open") row.guides += 1;
  });

  return rows;
};
