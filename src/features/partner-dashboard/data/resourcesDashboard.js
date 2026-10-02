export const resourceSources = {
  foodBank: { label: "Feeding America · Find a food bank", href: "https://www.feedingamerica.org/find-your-local-foodbank", kind: "external", checkedOn: "2026-10-02", region: "United States" },
  healthCenter: { label: "HRSA · Find a Health Center", href: "https://findahealthcenter.hrsa.gov/", kind: "external", checkedOn: "2026-10-02", region: "United States" },
  transportation: { label: "Indiana Medicaid · Member resources", href: "https://www.in.gov/medicaid/members/member-resources/", kind: "external", checkedOn: "2026-10-02", region: "Indiana" },
  psiDads: {
    label: "Postpartum Support International · Help for Dads",
    href: "https://postpartum.net/get-help/help-for-dads/",
    kind: "external", checkedOn: "2026-10-02", region: "United States",
  },
  cdcSupport: {
    label: "CDC Hear Her · Providing support",
    href: "https://www.cdc.gov/hearher/caring/index.html",
    kind: "external", checkedOn: "2026-10-02", region: "United States",
  },
  partnerFeeding: {
    label: "Feeding Support Guide",
    href: "/partner-dashboard/guides/partner-feeding-guide/supporting-her-decision",
    kind: "internal",
  },
  partnerBirth: {
    label: "Labor Readiness Guide",
    href: "/partner-dashboard/guides/partner-labor-guide/being-her-advocate",
    kind: "internal",
  },
  maternalMentalHealth: {
    label: "HRSA · National Maternal Mental Health Hotline",
    href: "https://mchb.hrsa.gov/programs-impact/national-maternal-mental-health-hotline",
    kind: "external", checkedOn: "2026-10-02", region: "United States",
    serviceLanguages: "English and Spanish; interpreters available for other languages.",
  },
  indianaMoms: {
    label: "Indiana Department of Health · Moms Helpline",
    href: "https://www.in.gov/health/mch/moms-helpline/",
    kind: "external", checkedOn: "2026-10-02", region: "Indiana",
    serviceLanguages: "English and Spanish; interpreters available for other languages.",
  },
  indiana211: {
    label: "Indiana FSSA · Indiana 211",
    href: "https://www.in.gov/fssa/indiana-211/",
    kind: "external",
    checkedOn: "2026-10-02",
  },
  indianaWic: {
    label: "Indiana Department of Health · WIC applications",
    href: "https://www.in.gov/health/wic/how-do-i-apply-for-wic",
    kind: "external",
    checkedOn: "2026-10-02",
  },
  partnerSafetyGuide: {
    label: "Partner Hub · Complications and Warning Signs Guide",
    href: "/partner-dashboard/guides/partner-complications-guide/finding-support",
    kind: "internal",
  },
  partnerPreeclampsiaGuide: {
    label: "Partner Hub · Preeclampsia warning signs",
    href: "/partner-dashboard/guides/partner-complications-guide/preeclampsia",
    kind: "internal",
  },
  partnerPostpartumGuide: {
    label: "Partner Hub · Postpartum warning signs",
    href: "/partner-dashboard/guides/partner-postpartum-guide/when-to-get-help",
    kind: "internal",
  },
  partnerMentalHealthGuide: {
    label: "Partner Hub · Mental Health Support Guide",
    href: "/partner-dashboard/guides/partner-mentalhealth-guide/when-to-get-help",
    kind: "internal",
  },
  partnerVillageGuide: {
    label: "Partner Hub · Build a support village",
    href: "/partner-dashboard/guides/partner-village-guide/building-the-postpartum-village",
    kind: "internal",
  },
  partnerInsuranceGuide: {
    label: "Partner Hub · Insurance and benefits",
    href: "/partner-dashboard/guides/partner-finance-guide/insurance-and-benefits",
    kind: "internal",
  },
  partnerLeaveGuide: {
    label: "Partner Hub · Parental leave planning",
    href: "/partner-dashboard/guides/partner-finance-guide/parental-leave-know-your-rights",
    kind: "internal",
  },
  cdcHearHer: {
    label: "CDC Hear Her · Warning signs and support people",
    href: "https://www.cdc.gov/hearher/index.html",
    kind: "external",
  },
  dieudonneMatch: {
    label: "DieudonneMatch · Doula support intake",
    href: "https://dieudonnematch.org",
    kind: "external",
  },
};

const resource = ({ id, title, description, source, actions }) => ({
  id,
  title,
  description,
  source,
  actions,
});

export const resourceSections = [
  {
    id: "urgent-help",
    label: "Urgent help",
    title: "Get help now when safety is at risk",
    description:
      "Use emergency or crisis support when someone is in immediate danger. Do not wait for an online resource to respond.",
    tone: "urgent",
    resources: [
      resource({
        id: "call-911",
        title: "Call 911",
        description:
          "For immediate danger or life-threatening symptoms such as chest pain, trouble breathing, seizure, heavy bleeding, or fainting.",
        source: resourceSources.partnerSafetyGuide,
        actions: [{ label: "Call 911", href: "tel:911", kind: "call" }],
      }),
      resource({
        id: "call-text-988",
        title: "Call or text 988",
        description:
          "For mental health crisis support in the United States, including thoughts of self-harm.",
        source: resourceSources.partnerMentalHealthGuide,
        actions: [
          { label: "Call 988", href: "tel:988", kind: "call" },
          { label: "Text 988", href: "sms:988", kind: "text" },
        ],
      }),
      resource({
        id: "urgent-warning-signs",
        title: "Review urgent maternal warning signs",
        description:
          "CDC Hear Her explains warning signs during pregnancy and in the year after delivery, plus how support people can help.",
        source: resourceSources.cdcHearHer,
        actions: [{ label: "Open CDC Hear Her", href: resourceSources.cdcHearHer.href, kind: "external" }],
      }),
    ],
  },
  {
    id: "warning-signs",
    label: "Warning signs",
    title: "Know what needs a fast call to the care team",
    description:
      "Use verified warning-sign guidance, then contact the care team promptly when symptoms are concerning or changing quickly.",
    tone: "warning",
    resources: [
      resource({
        id: "cdc-hear-her",
        title: "CDC Hear Her warning signs",
        description:
          "Review urgent maternal warning signs and practical guidance for friends and family.",
        source: resourceSources.cdcHearHer,
        actions: [{ label: "Open CDC Hear Her", href: resourceSources.cdcHearHer.href, kind: "external" }],
      }),
      resource({
        id: "pregnancy-warning-guide",
        title: "Pregnancy complications and preeclampsia",
        description:
          "Use Partner Hub's focused guide to recognize warning signs and prepare clear questions for the care team.",
        source: resourceSources.partnerPreeclampsiaGuide,
        actions: [{ label: "Open pregnancy warning guide", href: resourceSources.partnerPreeclampsiaGuide.href, kind: "internal" }],
      }),
      resource({
        id: "postpartum-warning-guide",
        title: "Postpartum warning signs",
        description:
          "Review recovery and mood warning signs, including when immediate help is needed.",
        source: resourceSources.partnerPostpartumGuide,
        actions: [{ label: "Open postpartum warning guide", href: resourceSources.partnerPostpartumGuide.href, kind: "internal" }],
      }),
    ],
  },
  {
    id: "mental-health",
    label: "Mental health",
    title: "Connect to mental health support early",
    description:
      "Use crisis support for immediate risk and Partner Hub guidance to recognize when you or your partner needs more help.",
    tone: "mental",
    resources: [
      resource({
        id: "dad-support", title: "Support for dads",
        description: "PSI offers peer support and resources for dads. Check current group times and registration. This is not emergency care.",
        source: resourceSources.psiDads,
        actions: [{ label: "Explore support for dads", href: resourceSources.psiDads.href, kind: "external" }],
      }),
      resource({
        id: "maternal-mental-health-hotline",
        title: "National Maternal Mental Health Hotline",
        description: "Free, confidential support, 24/7. Pregnant and postpartum people, partners, and family can call or text. This does not replace emergency care.",
        source: resourceSources.maternalMentalHealth,
        actions: [
          { label: "Call 1-833-852-6262", href: "tel:18338526262", kind: "call" },
          { label: "Text 1-833-852-6262", href: "sms:18338526262", kind: "text" },
          { label: "Visit hotline website", href: resourceSources.maternalMentalHealth.href, kind: "external" },
        ],
      }),
      resource({
        id: "mental-health-988",
        title: "988 Suicide & Crisis Lifeline",
        description:
          "Call or text 988 in the United States for mental health crisis support, including thoughts of self-harm.",
        source: resourceSources.partnerMentalHealthGuide,
        actions: [
          { label: "Call 988", href: "tel:988", kind: "call" },
          { label: "Text 988", href: "sms:988", kind: "text" },
        ],
      }),
      resource({
        id: "partner-mental-health",
        title: "Mental health support for partners",
        description:
          "Recognize emotional warning signs, use supportive language, and know when to contact a clinician or crisis support.",
        source: resourceSources.partnerMentalHealthGuide,
        actions: [{ label: "Open mental health guide", href: resourceSources.partnerMentalHealthGuide.href, kind: "internal" }],
      }),
      resource({
        id: "postpartum-mood",
        title: "Postpartum mood and recovery support",
        description:
          "Learn which changes need attention and how to help without minimizing what she is experiencing.",
        source: resourceSources.partnerPostpartumGuide,
        actions: [{ label: "Open postpartum support guide", href: resourceSources.partnerPostpartumGuide.href, kind: "internal" }],
      }),
    ],
  },
  {
    id: "practical-support",
    label: "Practical support",
    title: "Build hands-on support around the family",
    description:
      "Use the tools already verified in Partner Hub to plan professional and everyday support before the family is overwhelmed.",
    tone: "support",
    resources: [
      resource({ id: "food-bank", title: "Find food support", description: "Search Feeding America's network by ZIP code. Contact the local provider to confirm hours, services and requirements.", source: resourceSources.foodBank, actions: [{ label: "Find a food bank", href: resourceSources.foodBank.href, kind: "external" }] }),
      resource({ id: "health-center", title: "Find a health center", description: "Use HRSA's locator to find nearby health centers. Ask the center about prenatal services, appointments and costs.", source: resourceSources.healthCenter, actions: [{ label: "Open health center finder", href: resourceSources.healthCenter.href, kind: "external" }] }),
      resource({ id: "indiana-transport", title: "Plan transportation to care", description: "Indiana Medicaid's member resources explain non-emergency transportation for Traditional Medicaid. If you have a managed care plan, ask your plan about its transport service. Confirm coverage before booking.", source: resourceSources.transportation, actions: [{ label: "Review transportation guidance", href: resourceSources.transportation.href, kind: "external" }] }),
      resource({
        id: "feeding-support", title: "Feeding support",
        description: "Support her feeding decisions, share preparation and cleanup, and prepare questions for skilled feeding support.",
        source: resourceSources.partnerFeeding,
        actions: [{ label: "Feeding Support Guide", href: resourceSources.partnerFeeding.href, kind: "internal" }],
      }),
      resource({
        id: "birth-companion", title: "Prepare to be a birth companion",
        description: "Practice listening, comfort measures and advocacy while respecting her choices and the care team's guidance.",
        source: resourceSources.partnerBirth,
        actions: [{ label: "Labor Readiness Guide", href: resourceSources.partnerBirth.href, kind: "internal" }],
      }),
      resource({
        id: "indiana-moms-helpline", title: "Indiana Moms Helpline",
        description: "Find prenatal care, baby supplies, insurance, and local support. Anyone in Indiana age 16 or older can contact this free service. Check the website for hours and availability.",
        source: resourceSources.indianaMoms,
        actions: [
          { label: "Call 1-844-624-6667", href: "tel:18446246667", kind: "call" },
          { label: "Visit Moms Helpline", href: resourceSources.indianaMoms.href, kind: "external" },
        ],
      }),
      resource({
        id: "indiana-211",
        title: "Indiana 211 · Find local support",
        description: "Indiana residents can connect with a navigator for health and human-service resources. Ask about options near you; services and eligibility vary.",
        source: resourceSources.indiana211,
        actions: [
          { label: "Call Indiana 211", href: "tel:8662119966", kind: "call" },
          { label: "Visit Indiana 211", href: resourceSources.indiana211.href, kind: "external" },
        ],
      }),
      resource({
        id: "doula-support",
        title: "Match mom with a doula",
        description:
          "Open DieudonneMatch to request hands-on birth or recovery support while continuing your Partner Hub learning.",
        source: resourceSources.dieudonneMatch,
        actions: [{ label: "Open DieudonneMatch", href: resourceSources.dieudonneMatch.href, kind: "external" }],
      }),
      resource({
        id: "support-village",
        title: "Build a support village",
        description:
          "Plan meals, visits, rest, childcare, and professional support, then save the care team's after-hours contact in both phones.",
        source: resourceSources.partnerVillageGuide,
        actions: [{ label: "Open support village guide", href: resourceSources.partnerVillageGuide.href, kind: "internal" }],
      }),
      resource({
        id: "support-person-role",
        title: "Learn how support people can help",
        description:
          "CDC Hear Her offers practical guidance for listening, speaking up, and helping someone get care.",
        source: resourceSources.cdcSupport,
        actions: [{ label: "Open CDC support guidance", href: resourceSources.cdcSupport.href, kind: "external" }],
      }),
    ],
  },
  {
    id: "benefits-planning",
    label: "Benefits & planning",
    title: "Prepare the contacts and paperwork you control",
    description:
      "Partner Hub can help you prepare questions for an employer, insurer, or care team. Eligibility and local contacts still need confirmation from the responsible organization.",
    tone: "planning",
    resources: [
      resource({
        id: "indiana-wic",
        title: "Indiana WIC · Application help",
        description: "Review eligibility, contact a local WIC clinic, and prepare for a certification appointment. A parent, guardian, or caregiver can help an infant or child apply. The clinic confirms eligibility.",
        source: resourceSources.indianaWic,
        actions: [{ label: "Review WIC application steps", href: resourceSources.indianaWic.href, kind: "external" }],
      }),
      resource({
        id: "insurance-benefits",
        title: "Insurance and benefits checklist",
        description:
          "Review coverage questions for adding the baby, lactation support, mental health services, and other family benefits.",
        source: resourceSources.partnerInsuranceGuide,
        actions: [{ label: "Open insurance and benefits guide", href: resourceSources.partnerInsuranceGuide.href, kind: "internal" }],
      }),
      resource({
        id: "parental-leave",
        title: "Parental leave planning",
        description:
          "Prepare for a conversation with HR and review the questions to ask before leave begins.",
        source: resourceSources.partnerLeaveGuide,
        actions: [{ label: "Open parental leave guide", href: resourceSources.partnerLeaveGuide.href, kind: "internal" }],
      }),
    ],
  },
];

export const getResourceSection = (sectionId = "") =>
  resourceSections.find((section) => section.id === sectionId) || resourceSections[0];

export const resourceRegion = (item) => ["call-911", "call-text-988", "mental-health-988"].includes(item.id) ? "United States"
  : item.source.kind === "internal" ? "Partner Hub guide"
  : item.source.region || (item.source.href.includes("in.gov") ? "Indiana" : "External resource");

export function filterResources(items, region = "All resources") {
  return region === "All resources" ? items : items.filter(item => resourceRegion(item) === region);
}

export function findResourceTarget(sectionId, resourceId) {
  const section = getResourceSection(sectionId);
  return section.resources.find(item => item.id === resourceId) || section.resources[0];
}
