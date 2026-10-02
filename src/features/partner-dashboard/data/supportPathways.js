// Editorial pathways reuse approved evidence and resource IDs, never personal data.
export const supportPathways = [
  { id: "appointment", title: "Prepare for an appointment", evidenceId: "partner-follow-up", resources: ["support-person-role", "health-center", "indiana-transport"], steps: ["Ask which questions she wants help raising.", "Offer to attend and help her ask questions.", "Confirm the follow-up plan with the care team."] },
  { id: "feeding", title: "Support feeding", evidenceId: "partner-breastfeeding", resources: ["feeding-support", "indiana-wic", "food-bank"], steps: ["Ask how she wants to be supported with feeding.", "Share preparation and cleanup.", "Help her prepare questions for skilled feeding support."] },
  { id: "advocacy", title: "Help her be heard", evidenceId: "partner-listening", resources: ["support-person-role", "cdc-hear-her"], steps: ["Listen without minimizing her concerns.", "Help her describe what has changed to the care team.", "For urgent warning signs, seek medical care immediately."] },
];

export const pathwayForEvidence = id => supportPathways.find(path => path.evidenceId === id);

export const evidenceLimit = highlight => {
  const href = highlight.source.href;
  if (href.includes("16199676")) return "This was one father-training study in Italy, not proof that every family will have the same result.";
  if (href.includes("9789241550215")) return "This evidence concerns birth companions, not only fathers. It does not guarantee a shorter labor.";
  if (href.includes("hearher")) return "This is professional support guidance, not a measured reduction in risk.";
  if (href.includes("mm6919a2")) return "These are self-reported survey findings from 2018, not a diagnosis or a current national rate.";
  return "These population figures do not predict one person's outcome or prove that partner support caused the difference. Compare only matching definitions and reporting periods.";
};
