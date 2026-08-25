export const resourceSources = {
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
        source: resourceSources.cdcHearHer,
        actions: [{ label: "Open CDC support guidance", href: resourceSources.cdcHearHer.href, kind: "external" }],
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
