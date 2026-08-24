import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getGuideCompletionPercent,
  readGuideRecord,
  toggleGuideSectionComplete,
  writeGuideRecord,
} from "../utils/guideProgress";

export default function useDeviceGuideProgress({
  guideId,
  sectionIds,
  routeSectionId,
  scope = "learner",
  onNavigateSection,
}) {
  const [record, setRecord] = useState(() =>
    readGuideRecord(scope, guideId, sectionIds)
  );

  useEffect(() => {
    setRecord(readGuideRecord(scope, guideId, sectionIds));
  }, [guideId, scope, sectionIds]);

  const activeSectionId = sectionIds.includes(routeSectionId)
    ? routeSectionId
    : record.lastSection;
  const activeSection = Math.max(0, sectionIds.indexOf(activeSectionId));

  useEffect(() => {
    if (sectionIds.includes(routeSectionId)) return;
    onNavigateSection(activeSectionId, { replace: true });
  }, [activeSectionId, onNavigateSection, routeSectionId, sectionIds]);

  useEffect(() => {
    if (!sectionIds.includes(routeSectionId) || record.lastSection === routeSectionId) return;
    const next = { ...record, lastSection: routeSectionId };
    setRecord(next);
    writeGuideRecord(scope, guideId, next);
  }, [guideId, record, routeSectionId, scope, sectionIds]);

  const selectSection = useCallback(
    (nextSection) => {
      const nextSectionId = sectionIds[nextSection];
      if (!nextSectionId || nextSectionId === activeSectionId) return;
      const next = { ...record, lastSection: nextSectionId };
      setRecord(next);
      writeGuideRecord(scope, guideId, next);
      onNavigateSection(nextSectionId);
    }, [activeSectionId, guideId, onNavigateSection, record, scope, sectionIds]
  );

  const toggleActiveSectionComplete = useCallback(() => {
    const next = toggleGuideSectionComplete(
      { ...record, lastSection: activeSectionId },
      activeSectionId
    );
    setRecord(next);
    writeGuideRecord(scope, guideId, next);
  }, [activeSectionId, guideId, record, scope]);

  const completedSections = useMemo(
    () => new Set(record.completed),
    [record.completed]
  );

  return {
    activeSection,
    activeSectionId,
    completedSections,
    completionPercent: getGuideCompletionPercent(record.completed, sectionIds.length),
    selectSection,
    toggleActiveSectionComplete,
  };
}
