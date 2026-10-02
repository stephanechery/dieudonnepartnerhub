// Editorial filters, not clinical categories or risk scores.
export const evidenceTopics = {
  "Your support": ["partner-breastfeeding", "partner-practical-help", "partner-labor-support", "partner-listening", "partner-follow-up"],
  "Access to care": ["national-care-deserts", "national-desert-population", "national-travel-time", "national-access-preterm", "national-indigenous-access", "national-prenatal-disparity", "indiana-medicaid-disparity", "indiana-prenatal-care"],
  "Outcomes and disparities": ["national-preventability", "national-overview", "national-racial-disparity", "national-age-disparity", "indiana-overview", "indiana-preventability", "indiana-postpartum-timing", "indiana-racial-disparity", "indiana-maternal-mortality"],
  "Mental health": ["national-postpartum-depression", "national-depression-screening"],
};

export const filterEvidence = (items, topic) => topic === "All topics"
  ? items
  : items.filter(item => evidenceTopics[topic]?.includes(item.id));
