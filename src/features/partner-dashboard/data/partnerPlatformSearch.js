import { partnerInteractiveGuides } from "./interactiveGuides.js";
import { maternalHealthHighlights } from "./maternalHealthData.js";
import { videoHubVideos } from "./videoHub.js";

const SAFETY_TERMS = new Set([
  "bleeding",
  "breathing",
  "emergency",
  "fainting",
  "headache",
  "preeclampsia",
  "safety",
  "seizure",
  "swelling",
  "urgent",
  "vision",
  "warning",
]);

export const normalizePartnerPlatformSearchText = (value) =>
  `${value || ""}`
    .toLocaleLowerCase("en")
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const flattenText = (value) => {
  if (value == null) return [];
  if (typeof value === "string" || typeof value === "number") return [`${value}`];
  if (Array.isArray(value)) return value.flatMap(flattenText);
  if (typeof value === "object") return Object.values(value).flatMap(flattenText);
  return [];
};

const makeEntry = (entry) => ({
  ...entry,
  searchText: normalizePartnerPlatformSearchText(
    [entry.title, entry.description, entry.category, entry.keywords]
      .flatMap(flattenText)
      .join(" ")
  ),
});

export const buildPartnerPlatformSearchIndex = (curriculum) => {
  const lessons = (curriculum?.modules || []).flatMap((module) =>
    (module.lessons || []).map((lesson) =>
      makeEntry({
        id: `lesson:${module.id}:${lesson.id}`,
        kind: "lesson",
        title: lesson.title,
        description: lesson.summary || lesson.learningOutcome || module.subtitle,
        category: module.title,
        keywords: flattenText(lesson),
        moduleId: module.id,
        lessonId: lesson.id,
        safety: normalizePartnerPlatformSearchText(flattenText(lesson).join(" ")).includes("urgent"),
      })
    )
  );

  const guides = partnerInteractiveGuides.map((guide) =>
    makeEntry({
      id: `guide:${guide.id}`,
      kind: "guide",
      title: guide.title,
      description: guide.summary,
      category: guide.phase,
      keywords: [guide.phase, guide.summary],
      guideId: guide.id,
      safety: guide.phase === "Safety" || guide.id.includes("complications"),
    })
  );

  const videos = videoHubVideos.map((video) =>
    makeEntry({
      id: `video:${video.id}`,
      kind: "video",
      title: video.title,
      description: video.description,
      category: video.category,
      keywords: [video.tags, video.source],
      videoId: video.id,
      safety: video.tags?.includes("warning signs") || video.id.includes("warning-signs"),
    })
  );

  const data = maternalHealthHighlights.map((highlight) =>
    makeEntry({
      id: `data:${highlight.id}`,
      kind: "data",
      title: highlight.title,
      description: `${highlight.value} ${highlight.unit}. ${highlight.detail}`,
      category: "Maternal health data",
      keywords: [
        highlight.scope,
        highlight.supportAction,
        "statistics disparities equity Indiana national father partner impact equipped support involvement breastfeeding labor",
      ],
      localizableSearchValues: [
        highlight.scope,
        highlight.unit,
        highlight.detail,
        highlight.supportAction,
      ],
      value: highlight.value,
      unit: highlight.unit,
      detail: highlight.detail,
      highlightId: highlight.id,
      safety: false,
    })
  );

  return [...lessons, ...guides, ...videos, ...data];
};

export const localizePartnerPlatformSearchIndex = (index, translateText) =>
  index.map((entry) => ({
    ...entry,
    searchText: normalizePartnerPlatformSearchText(
      [
        entry.searchText,
        translateText(entry.title),
        translateText(entry.description),
        translateText(entry.category),
        ...(entry.localizableSearchValues || []).map(translateText),
      ].join(" ")
    ),
  }));

const scoreEntry = (entry, query, terms, safetyIntent) => {
  if (!terms.every((term) => entry.searchText.includes(term))) return 0;

  const title = normalizePartnerPlatformSearchText(entry.title);
  let score = 1;
  if (title === query) score += 12;
  if (title.startsWith(query)) score += 8;
  if (title.includes(query)) score += 5;
  score += terms.filter((term) => title.includes(term)).length * 3;
  if (safetyIntent && entry.safety) score += 10;
  if (entry.kind === "data" && terms.some((term) => ["data", "death", "disparity", "indiana", "mortality", "rate"].includes(term))) score += 4;
  return score;
};

export const searchPartnerPlatform = (index, rawQuery, limit = 8) => {
  const query = normalizePartnerPlatformSearchText(rawQuery);
  if (query.length < 2) return [];

  const terms = query.split(" ").filter(Boolean);
  const safetyIntent = terms.some((term) => SAFETY_TERMS.has(term));

  return index
    .map((entry) => ({ entry, score: scoreEntry(entry, query, terms, safetyIntent) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, limit)
    .map(({ entry }) => entry);
};
