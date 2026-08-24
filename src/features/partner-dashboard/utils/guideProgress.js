const STORAGE_VERSION = "v1";
const STORAGE_PREFIX = `dph-guide-progress:${STORAGE_VERSION}`;

const normalizeScope = (scope) => (scope === "demo" ? "demo" : "learner");

export const getGuideProgressStorageKey = (scope = "learner") =>
  `${STORAGE_PREFIX}:${normalizeScope(scope)}`;

const emptyProgress = () => ({ guides: {} });

export const readGuideProgress = (scope = "learner", storage = window.localStorage) => {
  try {
    const parsed = JSON.parse(storage.getItem(getGuideProgressStorageKey(scope)) || "null");
    return parsed && typeof parsed === "object" && parsed.guides && typeof parsed.guides === "object"
      ? parsed
      : emptyProgress();
  } catch {
    return emptyProgress();
  }
};

export const readGuideRecord = (
  scope,
  guideId,
  sectionIds,
  storage = window.localStorage
) => {
  const progress = readGuideProgress(scope, storage);
  const stored = progress.guides[guideId] || {};
  const allowed = new Set(sectionIds);
  const completed = Array.isArray(stored.completed)
    ? stored.completed.filter((sectionId) => allowed.has(sectionId))
    : [];
  const lastSection = allowed.has(stored.lastSection)
    ? stored.lastSection
    : sectionIds[0];

  return { completed, lastSection };
};

export const writeGuideRecord = (
  scope,
  guideId,
  record,
  storage = window.localStorage
) => {
  const progress = readGuideProgress(scope, storage);
  const next = {
    ...progress,
    guides: {
      ...progress.guides,
      [guideId]: {
        completed: [...new Set(record.completed || [])],
        lastSection: record.lastSection,
      },
    },
  };

  try {
    storage.setItem(getGuideProgressStorageKey(scope), JSON.stringify(next));
  } catch {
    // Keep the in-memory guide session usable when device storage is unavailable.
  }
  return next.guides[guideId];
};

export const toggleGuideSectionComplete = (record, sectionId) => {
  const completed = new Set(record.completed || []);
  if (completed.has(sectionId)) completed.delete(sectionId);
  else completed.add(sectionId);
  return { ...record, completed: [...completed] };
};

export const getGuideCompletionPercent = (completed, sectionCount) =>
  sectionCount > 0 ? Math.round((completed.length / sectionCount) * 100) : 0;
