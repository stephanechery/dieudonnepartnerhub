import {
  Baby,
  Brain,
  HeartPulse,
  MessageCircleHeart,
  Stethoscope,
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
  },
  {
    id: "partner-labor-guide",
    title: "Labor Readiness Guide",
    summary:
      "Learn labor signs, stages, pain options, hospital navigation, and decision language.",
    phase: "Labor and Delivery",
    accent: "violet",
    Icon: HeartPulse,
  },
  {
    id: "partner-postpartum-guide",
    title: "Postpartum Recovery Guide",
    summary:
      "Walk through recovery phases, hormones, body systems, warning signs, and partner support.",
    phase: "Postpartum",
    accent: "rose",
    Icon: Baby,
  },
  {
    id: "partner-communication-guide",
    title: "Communication and Advocacy Guide",
    summary:
      "Practice consent questions, support scripts, advocacy moments, and family communication.",
    phase: "Partner Skills",
    accent: "amber",
    Icon: MessageCircleHeart,
  },
  {
    id: "partner-mentalhealth-guide",
    title: "Mental Health Support Guide",
    summary:
      "Recognize emotional warning signs, use supportive language, and connect to help early.",
    phase: "Mental Health",
    accent: "emerald",
    Icon: Brain,
  },
];

export const getPartnerInteractiveGuide = (guideId) =>
  partnerInteractiveGuides.find((guide) => guide.id === guideId);
