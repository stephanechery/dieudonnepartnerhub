import {
  Baby,
  Brain,
  CircleDollarSign,
  HeartPulse,
  MessageCircleHeart,
  Milk,
  ShieldAlert,
  Stethoscope,
  UsersRound,
} from "lucide-react";

export const partnerInteractiveGuides = [
  {
    id: "partner-trimester-guide",
    title: "Trimester Body Guide",
    summary:
      "Explore pregnancy anatomy, hormone changes, posture shifts, and trimester checkpoints.",
    phase: "Prenatal",
    accent: "cyan",
    Icon: Stethoscope,
    sectionIds: ["why-you-matter", "first-trimester", "second-trimester", "third-trimester", "labor-prep", "at-the-hospital", "common-mistakes", "partner-wellness"],
  },
  {
    id: "partner-labor-guide",
    title: "Labor Readiness Guide",
    summary:
      "Learn labor signs, stages, pain options, hospital navigation, and decision language.",
    phase: "Labor and Delivery",
    accent: "violet",
    Icon: HeartPulse,
    sectionIds: ["your-role-defined", "reading-the-room", "physical-support", "emotional-support", "what-to-say", "being-her-advocate", "when-plans-change", "after-birth"],
  },
  {
    id: "partner-postpartum-guide",
    title: "Postpartum Recovery Guide",
    summary:
      "Walk through recovery phases, hormones, body systems, warning signs, and partner support.",
    phase: "Postpartum",
    accent: "rose",
    Icon: Baby,
    sectionIds: ["what-is-postpartum", "her-body-is-healing", "postpartum-mood", "protecting-her-sleep", "baby-care-basics", "supporting-breastfeeding", "when-to-get-help", "your-role-summary"],
  },
  {
    id: "partner-communication-guide",
    title: "Communication and Advocacy Guide",
    summary:
      "Practice consent questions, support scripts, advocacy moments, and family communication.",
    phase: "Partner Skills",
    accent: "amber",
    Icon: MessageCircleHeart,
    sectionIds: ["why-talk-now", "birth-preferences", "parenting-values", "managing-fear-together", "hard-conversations", "what-not-to-say", "staying-connected", "discussion-starters"],
  },
  {
    id: "partner-mentalhealth-guide",
    title: "Mental Health Support Guide",
    summary:
      "Recognize emotional warning signs, use supportive language, and connect to help early.",
    phase: "Mental Health",
    accent: "emerald",
    Icon: Brain,
    sectionIds: ["you-matter-too", "paternal-depression", "identity-shift", "relationship-changes", "practical-coping", "when-to-get-help", "supporting-each-other", "moving-forward-together"],
  },
  {
    id: "partner-anatomy-guide",
    title: "Pregnancy Anatomy Guide",
    summary:
      "Understand the pregnant body, cervix, fetal position, monitors, appointments, and clinical language.",
    phase: "Prenatal",
    accent: "cyan",
    Icon: Stethoscope,
    sectionIds: ["the-pregnant-body", "trimester-by-trimester", "the-cervix-explained", "fetal-positioning", "labor-progress", "reading-the-monitors", "navigating-appointments", "medical-glossary"],
  },
  {
    id: "partner-complications-guide",
    title: "Complications and Warning Signs Guide",
    summary:
      "Learn what symptoms need fast action, how to communicate clearly, and when to seek urgent care.",
    phase: "Safety",
    accent: "rose",
    Icon: ShieldAlert,
    sectionIds: ["when-it-gets-hard", "gestational-diabetes", "preeclampsia", "preterm-labor-and-nicu", "bedrest-support", "pregnancy-loss", "high-risk-mindset", "finding-support"],
  },
  {
    id: "partner-feeding-guide",
    title: "Feeding Support Guide",
    summary:
      "Build practical confidence around breastfeeding, pumping, formula, feeding cues, and partner support.",
    phase: "Newborn Care",
    accent: "violet",
    Icon: Milk,
    sectionIds: ["why-feeding-matters-to-you", "how-breastfeeding-works", "what-makes-it-hard", "your-role-at-every-feeding", "latch-supply-and-pumping", "when-formula-is-the-right-choice", "supporting-her-decision", "bottle-feeding-together"],
  },
  {
    id: "partner-finance-guide",
    title: "Baby Budget and Benefits Guide",
    summary:
      "Plan for real newborn costs, leave, insurance, benefits, and household money conversations.",
    phase: "Planning",
    accent: "amber",
    Icon: CircleDollarSign,
    sectionIds: ["what-baby-actually-costs", "parental-leave-know-your-rights", "the-money-conversation", "building-your-90-day-budget", "insurance-and-benefits", "financial-stress-and-mental-health", "protecting-your-household", "moving-forward-financially"],
  },
  {
    id: "partner-village-guide",
    title: "Support Village Guide",
    summary:
      "Design a reliable support circle for visits, meals, boundaries, rest, and recovery needs.",
    phase: "Partner Skills",
    accent: "emerald",
    Icon: UsersRound,
    sectionIds: ["why-this-is-your-job", "managing-family-excitement", "setting-visitor-boundaries", "responding-to-advice", "cultural-traditions-and-respect", "building-the-postpartum-village", "when-family-becomes-stress", "your-village-checklist"],
  },
];

export const getPartnerInteractiveGuide = (guideId) =>
  partnerInteractiveGuides.find((guide) => guide.id === guideId);
