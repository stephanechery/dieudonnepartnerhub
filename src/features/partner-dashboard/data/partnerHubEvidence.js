import { partnerCurriculum } from "./curriculum.js";
import { partnerInteractiveGuides } from "./interactiveGuides.js";
import { maternalHealthHighlights } from "./maternalHealthData.js";
import { videoHubVideos } from "./videoHub.js";

const MAX_EVIDENCE_EXCERPT_LENGTH = 1_200;
const MAX_RETRIEVED_SOURCES = 5;

const STOP_WORDS = new Set([
  "about",
  "after",
  "and",
  "are",
  "can",
  "could",
  "does",
  "for",
  "from",
  "have",
  "help",
  "how",
  "into",
  "more",
  "should",
  "that",
  "the",
  "their",
  "this",
  "what",
  "when",
  "where",
  "which",
  "with",
  "would",
  "your",
]);

export const normalizePartnerHubEvidenceText = (value) =>
  String(value || "")
    .toLocaleLowerCase("en")
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const flattenStrings = (value) => {
  if (value == null) return [];
  if (typeof value === "string" || typeof value === "number") return [String(value)];
  if (Array.isArray(value)) return value.flatMap(flattenStrings);
  if (typeof value === "object") return Object.values(value).flatMap(flattenStrings);
  return [];
};

const compactExcerpt = (parts) =>
  parts
    .flatMap(flattenStrings)
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .slice(0, MAX_EVIDENCE_EXCERPT_LENGTH)
    .trim();

const compactFragments = (parts) =>
  [...new Set(
    parts
      .flatMap(flattenStrings)
      .map((part) => part.trim().replace(/\s+/g, " "))
      .filter(Boolean)
  )];

const createEvidence = (entry) => {
  const fragments = compactFragments(entry.fragments || [entry.excerpt]);
  const excerpt = compactExcerpt(fragments);
  return {
    ...entry,
    fragments,
    excerpt,
    searchText: normalizePartnerHubEvidenceText(
      [entry.title, entry.category, excerpt, entry.searchTerms].flatMap(flattenStrings).join(" ")
    ),
  };
};

const lessonEvidence = partnerCurriculum.modules.flatMap((module) =>
  module.lessons.map((lesson) =>
    createEvidence({
      id: `lesson:${module.id}:${lesson.id}`,
      kind: "lesson",
      title: lesson.title,
      category: module.title,
      href: `/partner-dashboard/module/${module.id}/lesson/${lesson.id}`,
      fragments: [
        lesson.summary,
        lesson.learningOutcome,
        lesson.mission?.sayThis,
        lesson.mission?.checklist,
        lesson.course?.sections?.flatMap((section) => [
          section.summary,
          section.teachingPoints,
          section.appliedExamples,
        ]),
        lesson.clinicalContent,
        lesson.culturalNotes,
      ],
      searchTerms: [module.subtitle, module.objective, lesson.mission?.action],
      safety: compactExcerpt([lesson.summary, lesson.learningOutcome, lesson.clinicalContent])
        .toLowerCase()
        .includes("urgent"),
    })
  )
);

const guideEvidence = partnerInteractiveGuides.map((guide) =>
  createEvidence({
    id: `guide:${guide.id}`,
    kind: "guide",
    title: guide.title,
    category: guide.phase,
    href: `/partner-dashboard/guides/${guide.id}`,
    fragments: [guide.summary],
    searchTerms: [guide.phase, guide.id],
    safety: guide.phase === "Safety" || guide.id.includes("complications"),
  })
);

const videoEvidence = videoHubVideos.map((video) =>
  createEvidence({
    id: `video:${video.id}`,
    kind: "video",
    title: video.title,
    category: video.category,
    href: `/partner-dashboard/video-hub?video=${encodeURIComponent(video.id)}`,
    fragments: [video.description],
    searchTerms: [video.category, video.tags, video.source],
    safety: video.tags?.includes("warning signs") || video.id.includes("warning-signs"),
  })
);

const maternalDataEvidence = maternalHealthHighlights.map((highlight) =>
  createEvidence({
    id: `data:${highlight.id}`,
    kind: "data",
    title: highlight.title,
    category: highlight.scope,
    href: `/partner-dashboard/maternal-data?highlight=${encodeURIComponent(highlight.id)}`,
    fragments: [
      `${highlight.value} ${highlight.unit}`,
      highlight.detail,
      highlight.supportAction,
    ],
    searchTerms: [highlight.group, highlight.scope, highlight.source?.label],
    sourceLabel: highlight.source?.label || "",
    sourceHref: highlight.source?.href || "",
    safety: false,
  })
);

export const partnerHubEvidence = Object.freeze([
  ...lessonEvidence,
  ...guideEvidence,
  ...videoEvidence,
  ...maternalDataEvidence,
]);

const evidenceById = new Map(partnerHubEvidence.map((entry) => [entry.id, entry]));

const queryTerms = (question) =>
  normalizePartnerHubEvidenceText(question)
    .split(" ")
    .filter((term) => term.length >= 3 && !STOP_WORDS.has(term));

const evidenceScore = (entry, terms) => {
  if (!terms.length) return 0;
  let score = 0;
  const title = normalizePartnerHubEvidenceText(entry.title);

  for (const term of terms) {
    if (title.includes(term)) score += 6;
    else if (entry.searchText.includes(term)) score += 2;
  }

  if (entry.safety && terms.some((term) => ["bleeding", "breathing", "headache", "seizure", "urgent", "warning"].includes(term))) {
    score += 10;
  }

  return score;
};

export const retrievePartnerHubEvidence = ({
  question,
  candidateIds = [],
  limit = MAX_RETRIEVED_SOURCES,
} = {}) => {
  const boundedLimit = Math.max(1, Math.min(Number(limit) || MAX_RETRIEVED_SOURCES, MAX_RETRIEVED_SOURCES));
  const selected = [];
  const selectedIds = new Set();

  for (const candidateId of candidateIds.slice(0, 8)) {
    const evidence = evidenceById.get(String(candidateId));
    if (!evidence || selectedIds.has(evidence.id)) continue;
    selected.push(evidence);
    selectedIds.add(evidence.id);
    if (selected.length >= boundedLimit) return selected;
  }

  const terms = queryTerms(question);
  const ranked = partnerHubEvidence
    .map((entry) => ({ entry, score: evidenceScore(entry, terms) }))
    .filter(({ entry, score }) => score > 0 && !selectedIds.has(entry.id))
    .sort((left, right) => right.score - left.score || left.entry.title.localeCompare(right.entry.title));

  for (const { entry } of ranked) {
    selected.push(entry);
    selectedIds.add(entry.id);
    if (selected.length >= boundedLimit) break;
  }

  return selected;
};

export const toPartnerHubEvidencePacket = (entries) =>
  entries.map(({ id, kind, title, category, href, excerpt, sourceLabel, sourceHref }) => ({
    id,
    kind,
    title,
    category,
    href,
    excerpt,
    ...(sourceLabel ? { sourceLabel } : {}),
    ...(sourceHref ? { sourceHref } : {}),
  }));
