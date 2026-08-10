const DEFAULT_DURATION_MINUTES = 8;
const DEFAULT_CHECKLIST = [
  "Ask what feels hardest right now",
  "Handle one practical task",
  "Agree on when to call the care team",
];

const normalizeChecklist = (value) => {
  if (!Array.isArray(value)) return DEFAULT_CHECKLIST;
  const items = value
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .slice(0, 5);
  return items.length ? items : DEFAULT_CHECKLIST;
};

const normalizeCompletedItems = (value, checklistLength) => {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value
        .map((item) => Number(item))
        .filter(
          (item) =>
            Number.isInteger(item) && item >= 0 && item < checklistLength
        )
    )
  ).sort((left, right) => left - right);
};

const normalizeTimestamp = (value) => {
  if (!value) return null;
  const timestamp = new Date(value);
  return Number.isNaN(timestamp.getTime()) ? null : timestamp.toISOString();
};

export const getLessonMission = (lesson = {}) => {
  const checklist = normalizeChecklist(lesson.mission?.checklist);
  const durationMinutes = Number(lesson.durationMinutes);

  return {
    durationMinutes:
      Number.isFinite(durationMinutes) && durationMinutes > 0
        ? Math.round(durationMinutes)
        : DEFAULT_DURATION_MINUTES,
    required: lesson.required !== false,
    learningOutcome:
      String(lesson.learningOutcome || lesson.summary || "").trim() ||
      "Turn this lesson into one useful support action.",
    action:
      String(lesson.mission?.action || "Put one lesson idea into practice today").trim(),
    sayThis:
      String(
        lesson.mission?.sayThis ||
          "What feels hardest right now, and what can I take care of for you?"
      ).trim(),
    checklist,
  };
};

export const normalizeLessonMissionRecord = (value, checklistLength = 3) => ({
  completedItems: normalizeCompletedItems(value?.completedItems, checklistLength),
  completedAt: normalizeTimestamp(value?.completedAt),
});

export const buildLessonMissionRecord = ({
  completedItems,
  checklistLength = 3,
  completedAt = new Date().toISOString(),
}) => ({
  completedItems: normalizeCompletedItems(completedItems, checklistLength),
  completedAt: normalizeTimestamp(completedAt),
});

export const normalizeLessonMissions = (value, lessons = []) => {
  const source = value && typeof value === "object" ? value : {};
  return lessons.reduce((acc, lesson) => {
    if (!Object.prototype.hasOwnProperty.call(source, lesson.id)) return acc;
    const mission = getLessonMission(lesson);
    const record = normalizeLessonMissionRecord(
      source[lesson.id],
      mission.checklist.length
    );
    if (record.completedAt || record.completedItems.length) {
      acc[lesson.id] = record;
    }
    return acc;
  }, {});
};
