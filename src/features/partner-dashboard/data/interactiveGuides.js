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
  {
    id: "partner-anatomy-guide",
    title: "Pregnancy Anatomy Guide",
    summary:
      "Understand the pregnant body, cervix, fetal position, monitors, appointments, and clinical language.",
    phase: "Prenatal",
    accent: "cyan",
    Icon: Stethoscope,
  },
  {
    id: "partner-complications-guide",
    title: "Complications and Warning Signs Guide",
    summary:
      "Learn what symptoms need fast action, how to communicate clearly, and when to seek urgent care.",
    phase: "Safety",
    accent: "rose",
    Icon: ShieldAlert,
  },
  {
    id: "partner-feeding-guide",
    title: "Feeding Support Guide",
    summary:
      "Build practical confidence around breastfeeding, pumping, formula, feeding cues, and partner support.",
    phase: "Newborn Care",
    accent: "violet",
    Icon: Milk,
  },
  {
    id: "partner-finance-guide",
    title: "Baby Budget and Benefits Guide",
    summary:
      "Plan for real newborn costs, leave, insurance, benefits, and household money conversations.",
    phase: "Planning",
    accent: "amber",
    Icon: CircleDollarSign,
  },
  {
    id: "partner-village-guide",
    title: "Support Village Guide",
    summary:
      "Design a reliable support circle for visits, meals, boundaries, rest, and recovery needs.",
    phase: "Partner Skills",
    accent: "emerald",
    Icon: UsersRound,
  },
];

export const getPartnerInteractiveGuide = (guideId) =>
  partnerInteractiveGuides.find((guide) => guide.id === guideId);
