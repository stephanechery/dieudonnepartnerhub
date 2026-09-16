import { maternalHealthHighlights } from "./maternalHealthData.js";

export const facilitatorPacks = [
  {
    id: "everyday-support",
    title: "Practice everyday support",
    highlightId: "partner-breastfeeding",
    context: "2005 study in Naples, Italy. These results do not predict an individual family's outcome.",
    scenario: "Practice scenario: a family is tired and feeding feels difficult. The support person wants to help without taking over.",
    prompt: "What could you ask before offering help? Which practical task could you take on?",
    activity: "Practice a short conversation: ask what would help, listen, and agree on one task. Use the linked guide for more ideas.",
    resourceSection: "practical-support",
    guideHref: "/partner-dashboard/guides/partner-village-guide/building-the-postpartum-village",
  },
  {
    id: "planning-for-care",
    title: "Practice planning for care",
    highlightId: "national-travel-time",
    context: "2024 report. Travel estimates do not include traffic or a family's specific care needs.",
    scenario: "Practice scenario: a family is planning travel to birth care and wants a backup plan before it is needed.",
    prompt: "What would you confirm with the care team? Who could help with transportation or other practical needs?",
    activity: "List questions to ask the care team and identify one resource to contact. Do not share personal health details during the group activity.",
    resourceSection: "practical-support",
    guideHref: "/partner-dashboard/guides/partner-complications-guide/finding-support",
  },
];

export const evidenceForPack = (pack) => maternalHealthHighlights.find(({ id }) => id === pack.highlightId);

export function sessionPackText(pack, tx = (value) => value) {
  const evidence = evidenceForPack(pack);
  return [
    tx(pack.title), tx("Practice scenarios only. Sharing is optional. Do not record personal or medical details."),
    tx("Key finding"), `${evidence.value} ${tx(evidence.unit)}`, tx(evidence.title), tx(evidence.detail), tx(pack.context),
    tx("Source details"), tx(evidence.source.label), evidence.source.href,
    tx("Practice scenario"), tx(pack.scenario), tx("Discuss"), tx(pack.prompt),
    tx("Try together"), tx(pack.activity), tx("What you can do"), tx(evidence.supportAction),
    tx("Open guide"), `https://www.dieudonnepartnerhub.org${pack.guideHref}`,
    tx("Find help"), `https://www.dieudonnepartnerhub.org/partner-dashboard/resources/${pack.resourceSection}`,
    tx("Educational guidance only. Partner Hub does not diagnose."),
  ].join("\n\n");
}
