// Editorial pathways reuse approved evidence and resource IDs, never personal data.
export const supportPathways = [
  { id: "appointment", title: "Prepare for an appointment", evidenceId: "partner-follow-up", resources: ["support-person-role", "health-center", "indiana-transport"], steps: ["Ask which questions she wants help raising.", "Offer to attend and help her ask questions.", "Confirm the follow-up plan with the care team."] },
  { id: "feeding", title: "Support feeding", evidenceId: "partner-breastfeeding", resources: ["feeding-support", "indiana-wic", "food-bank"], steps: ["Ask how she wants to be supported with feeding.", "Share preparation and cleanup.", "Help her prepare questions for skilled feeding support."] },
  { id: "advocacy", title: "Help her be heard", evidenceId: "partner-listening", resources: ["support-person-role", "cdc-hear-her"], steps: ["Listen without minimizing her concerns.", "Help her describe what has changed to the care team.", "For urgent warning signs, seek medical care immediately."] },
];

// Preparation packs extend the same routes and existing content, not Training progress.
export const preparationPacks = {
  appointment: { intro: "Bring her priorities into the conversation, then agree on the next step.", prompt: "Which questions would you like me to help you ask?", checklist: ["Ask which questions she wants help raising.", "Offer to attend and help her ask questions.", "Confirm the follow-up plan with the care team."] },
  birth: { intro: "Prepare together before birth, while keeping her preferences at the center.", prompt: "How would you like me to support you during birth?", checklist: ["Review her support preferences together.", "Confirm the birth location and transport plan with the care team.", "Review leave and coverage questions before birth."] },
  postpartum: { intro: "Share the practical work and make room for rest, follow-up care and emotional support.", prompt: "What can I take off your plate today?", checklist: ["Agree who can help with meals and household tasks.", "Support her feeding choices and follow-up care.", "Ask how she is feeling and listen without judgment."] },
};
supportPathways.splice(1, 0,
  { id: "birth", title: "Preparing for birth", evidenceId: "partner-labor-support", resources: ["birth-companion", "parental-leave", "insurance-benefits"], steps: preparationPacks.birth.checklist },
  { id: "postpartum", title: "The first weeks at home", evidenceId: "partner-practical-help", resources: ["support-village", "feeding-support", "maternal-mental-health-hotline", "dad-support"], steps: preparationPacks.postpartum.checklist },
);

export const preparationForContext = context => context === "urgent" ? null
  : supportPathways.find(path => path.id === ({ "labor-prep": "birth", postpartum: "postpartum", feeding: "postpartum", "home-setup": "postpartum", mood: "postpartum" }[context] || "appointment"));

export const pathwayForEvidence = id => supportPathways.find(path => path.evidenceId === id || (path.id === "advocacy" && ["national-unspoken-concerns", "national-care-discrimination"].includes(id)));

export const evidenceLimit = highlight => {
  if (highlight.limitation) return highlight.limitation;
  const href = highlight.source.href;
  if (href.includes("16199676")) return "This was one father-training study in Italy, not proof that every family will have the same result.";
  if (href.includes("9789241550215")) return "This evidence concerns birth companions, not only fathers. It does not guarantee a shorter labor.";
  if (href.includes("hearher")) return "This is professional support guidance, not a measured reduction in risk.";
  if (href.includes("mm6919a2")) return "These are self-reported survey findings from 2018, not a diagnosis or a current national rate.";
  return "These population figures do not predict one person's outcome or prove that partner support caused the difference. Compare only matching definitions and reporting periods.";
};
