export const videoCategories = [
  "All",
  "Doula Basics",
  "Prenatal Education",
  "Labor Support",
  "Postpartum",
  "Mental Health",
  "Newborn Care",
  "Birth Equity",
  "Professional Development",
  "Lactation",
];

const thumbnailFor = (videoId) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
const embedFor = (videoId) =>
  `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&autoplay=1`;

const makeVideo = ({ videoId, ...video }) => ({
  ...video,
  videoId,
  thumbnail: thumbnailFor(videoId),
  embedUrl: embedFor(videoId),
});

export const videoHubVideos = [
  makeVideo({
    id: "doulas-what-you-need-to-know",
    title: "Doulas: What You Need To Know",
    category: "Doula Basics",
    source: "March of Dimes",
    description:
      "A clear introduction to doula support and how partners can work alongside doulas during pregnancy, labor, and postpartum care.",
    duration: "35:07",
    progress: 47,
    videoId: "qXluIjv2w_g",
    sourceUrl: "https://www.marchofdimes.org/itstartswithmom/get-to-know-doulas",
    tags: ["doula", "birth team", "partner role"],
  }),
  makeVideo({
    id: "evidence-on-doulas",
    title: "Evidence on Doulas",
    category: "Doula Basics",
    source: "Evidence Based Birth",
    description:
      "A research-focused session on what doulas do, how continuous support can help, and where partners fit on the care team.",
    duration: "55:47",
    progress: 12,
    videoId: "s2xrpfn-mi4",
    sourceUrl: "https://evidencebasedbirth.com/",
    tags: ["doula", "evidence", "continuous support"],
  }),
  makeVideo({
    id: "healthy-pregnancy-prenatal-care",
    title: "Healthy Pregnancy, Healthy Baby: Prenatal Care",
    category: "Prenatal Education",
    source: "March of Dimes",
    description:
      "A partner-friendly primer on prenatal care, appointment rhythm, and the basic checks that help keep mom and baby safer.",
    duration: "4:58",
    progress: 25,
    videoId: "AK8z9R4R_Lo",
    sourceUrl: "https://www.marchofdimes.org/find-support/topics/planning-baby/prenatal-care-checkups",
    tags: ["pregnancy", "prenatal care", "appointments"],
  }),
  makeVideo({
    id: "prenatal-genetic-testing",
    title: "ACOG Explains: Prenatal Genetic Testing",
    category: "Prenatal Education",
    source: "Every Stage Health and ACOG",
    description:
      "A short, clear explainer on prenatal screening and diagnostic testing so partners can support informed conversations before appointments.",
    duration: "3:41",
    progress: 75,
    videoId: "MhWpmZIsZxw",
    sourceUrl: "https://www.acog.org/womens-health/videos/prenatal-genetic-testing",
    tags: ["pregnancy", "testing", "prenatal"],
  }),
  makeVideo({
    id: "inducing-labor",
    title: "ACOG Explains: Inducing Labor",
    category: "Labor Support",
    source: "Every Stage Health and ACOG",
    description:
      "A practical overview of why induction may be recommended, what partners can ask, and how to stay calm during care decisions.",
    duration: "4:59",
    progress: 40,
    videoId: "BW47iTObHmI",
    sourceUrl: "https://www.acog.org/womens-health/videos/inducing-labor",
    tags: ["labor", "induction", "birth decisions"],
  }),
  makeVideo({
    id: "fetal-monitoring-advocacy",
    title: "Fetal Monitoring Advocacy Tips",
    category: "Labor Support",
    source: "Evidence Based Birth",
    description:
      "A deeper partner-focused advocacy session on monitoring, questions to ask, and respectful decision support during labor.",
    duration: "53:42",
    progress: 0,
    videoId: "tBiWgCcqfFI",
    sourceUrl: "https://evidencebasedbirth.com/",
    tags: ["advocacy", "labor", "monitoring"],
  }),
  makeVideo({
    id: "postpartum-warning-signs",
    title: "Know the Warning Signs During Pregnancy and Postpartum",
    category: "Postpartum",
    source: "March of Dimes",
    description:
      "A full safety session on when symptoms need fast attention during pregnancy and after birth, useful for partners who want clear escalation cues.",
    duration: "60:38",
    progress: 8,
    videoId: "lCMoLEb0rkA",
    sourceUrl: "https://www.marchofdimes.org/find-support/topics/postpartum/postpartum-warning-signs",
    tags: ["postpartum", "warning signs", "safety"],
  }),
  makeVideo({
    id: "urgent-maternal-warning-signs",
    title: "Urgent Maternal Warning Signs",
    category: "Postpartum",
    source: "Shannon M. Clark, MD, CDC Hear Her aligned",
    description:
      "A fast safety review of symptoms partners should take seriously during pregnancy and through the first year after birth.",
    duration: "0:59",
    progress: 60,
    videoId: "RImNNSkpMAc",
    sourceUrl: "https://www.cdc.gov/hearher/maternal-warning-signs/index.html",
    tags: ["postpartum", "recovery", "warning signs"],
  }),
  makeVideo({
    id: "postpartum-discomfort",
    title: "Healthy Pregnancy, Healthy Baby: Postpartum Discomfort",
    category: "Postpartum",
    source: "March of Dimes",
    description:
      "A short review of common recovery discomforts so partners can tell the difference between normal healing and signs to ask about.",
    duration: "4:15",
    progress: 0,
    videoId: "YLVuBAfMxvw",
    sourceUrl: "https://www.marchofdimes.org/find-support/topics/postpartum",
    tags: ["postpartum", "recovery", "comfort"],
  }),
  makeVideo({
    id: "postpartum-birth-control",
    title: "ACOG Explains: Birth Control",
    category: "Postpartum",
    source: "Every Stage Health and ACOG",
    description:
      "A concise overview of birth control options that can help partners support respectful postpartum planning conversations.",
    duration: "5:06",
    progress: 0,
    videoId: "Km5oKwrZQZU",
    sourceUrl: "https://www.acog.org/womens-health",
    tags: ["postpartum", "birth control", "planning"],
  }),
  makeVideo({
    id: "postpartum-depression-need-to-know",
    title: "Postpartum Depression: What You Need to Know",
    category: "Mental Health",
    source: "Mayo Clinic",
    description:
      "A concise overview of postpartum depression signs so partners know when to listen, support, and connect mom with care.",
    duration: "1:17",
    progress: 10,
    videoId: "fBYYr_kEjmo",
    sourceUrl: "https://newsnetwork.mayoclinic.org/discussion/postpartum-depression-what-you-need-to-know/",
    tags: ["mental health", "postpartum depression", "support"],
  }),
  makeVideo({
    id: "postpartum-more-than-baby-blues",
    title: "Postpartum Depression Is More Than Baby Blues",
    category: "Mental Health",
    source: "Mayo Clinic",
    description:
      "A quick explainer partners can watch before a check-in conversation when mood changes seem heavier or longer lasting.",
    duration: "0:58",
    progress: 0,
    videoId: "WhmJuesp9ck",
    sourceUrl: "https://www.mayoclinic.org/diseases-conditions/postpartum-depression/symptoms-causes/syc-20376617",
    tags: ["mental health", "baby blues", "postpartum depression"],
  }),
  makeVideo({
    id: "breastfeeding-basics",
    title: "Breastfeeding Basics for Support People",
    category: "Lactation",
    source: "Stanford Medicine Children's Health",
    description:
      "A careful feeding primer that helps partners understand latch, early feeding patterns, and practical ways to reduce pressure.",
    duration: "11:19",
    progress: 20,
    videoId: "Xx_oglyQd0M",
    sourceUrl: "https://med.stanford.edu/newborns/professional-education/breastfeeding/abcs-of-breastfeeding",
    tags: ["newborn", "feeding", "lactation"],
  }),
  makeVideo({
    id: "safe-sleep-cdc",
    title: "CDC SIDS: Safe Sleep",
    category: "Newborn Care",
    source: "CDC",
    description:
      "A practical safety video on infant sleep positioning, sleep spaces, and what support people should know before baby comes home.",
    duration: "8:11",
    progress: 5,
    videoId: "09kNXxYB_Ko",
    sourceUrl: "https://www.cdc.gov/sids/",
    tags: ["newborn", "safe sleep", "SIDS"],
  }),
  makeVideo({
    id: "safe-sleep-stanford",
    title: "Safe Sleep",
    category: "Newborn Care",
    source: "Stanford EdTech",
    description:
      "A short, direct safe-sleep refresher that can help partners prepare the home setup before delivery.",
    duration: "2:36",
    progress: 0,
    videoId: "wv-k_Sm6p7E",
    sourceUrl: "https://www.stanfordchildrens.org/en/services/pregnancy-newborn",
    tags: ["newborn", "safe sleep", "home setup"],
  }),
  makeVideo({
    id: "sarahs-story-maternal-health",
    title: "Sarah's Story: A Crisis in Maternal Health",
    category: "Birth Equity",
    source: "March of Dimes",
    description:
      "A human story that helps partners understand why listening, follow-up, and respectful care can matter so much.",
    duration: "5:02",
    progress: 0,
    videoId: "zWsIWV3UoH4",
    sourceUrl: "https://www.marchofdimes.org/",
    tags: ["birth equity", "maternal health", "advocacy"],
  }),
  makeVideo({
    id: "hear-takaylas-story",
    title: "Hear Takayla's Story",
    category: "Birth Equity",
    source: "CDC Hear Her",
    description:
      "A CDC Hear Her story that reinforces how support people can listen closely when something feels wrong.",
    duration: "3:29",
    progress: 0,
    videoId: "I-IdfHWjhXo",
    sourceUrl: "https://www.cdc.gov/hearher/",
    tags: ["birth equity", "hear her", "warning signs"],
  }),
  makeVideo({
    id: "black-mamas-matter",
    title: "Black Mamas Matter: Advancing Black Maternal Health",
    category: "Birth Equity",
    source: "Maternal Health Learning & Innovation Center",
    description:
      "A short equity-centered clip that helps partners understand why listening, bias awareness, and respectful care matter.",
    duration: "1:06",
    progress: 0,
    videoId: "UeY9x4gXKmQ",
    sourceUrl: "https://blackmamasmatter.org/our-work/toolkits/",
    tags: ["birth equity", "black maternal health", "advocacy"],
  }),
  makeVideo({
    id: "doulas-nurses-advocating-together",
    title: "Doulas and Nurses Advocating Together",
    category: "Professional Development",
    source: "Evidence Based Birth",
    description:
      "A longer professional session for partners who want to understand care-team collaboration and respectful advocacy.",
    duration: "61:25",
    progress: 0,
    videoId: "TTiNJs0ZXpk",
    sourceUrl: "https://evidencebasedbirth.com/",
    tags: ["professional development", "doula", "care team"],
  }),
];

export const recommendedResources = [
  {
    id: "hospital-bag",
    label: "Practical Guide",
    title: "Hospital Bag Checklist for Partners",
    description:
      "A focused checklist for IDs, comfort items, snacks, chargers, and support tools.",
    action: "Open Checklist",
    details:
      "Pack IDs, insurance cards, chargers, lip balm, a refillable water bottle, snacks, a sweater, a phone tripod if desired, toiletries, a folder for discharge papers, and one comfort item mom chooses.",
  },
  {
    id: "ask-doula",
    label: "Expert Q&A",
    title: "Ask a Doula Anything",
    description:
      "Common questions partners ask about birth rooms, consent, and support roles.",
    action: "View Questions",
    details:
      "Good questions to ask: What does support look like before active labor? How do we handle consent language? When should I call you? What comfort measures can I practice now?",
  },
  {
    id: "birth-plan",
    label: "Quick Watch",
    title: "Birth Plan Basics for Partners",
    description:
      "A short guide to preferences, flexible planning, and how to speak up with care.",
    action: "Watch",
    videoId: "inducing-labor",
  },
  {
    id: "labor-cheat-sheet",
    label: "Partner Tool",
    title: "Labor Support Cheat Sheet",
    description:
      "A bedside reference for positions, pressure, hydration, and calming language.",
    action: "Open Tool",
    details:
      "Try calm reminders, counter-pressure, dim lighting, hydration prompts, quiet advocacy, and short questions: What are the benefits? What are the risks? Can we have a minute?",
  },
  {
    id: "relationship-changes",
    label: "Expert Q&A",
    title: "Postpartum & Relationship Changes",
    description:
      "Warm guidance for communication, intimacy, sleep strain, and shared recovery.",
    action: "Watch",
    videoId: "postpartum-depression-need-to-know",
  },
];

export const trustedResources = [
  {
    id: "cdc-warning-signs",
    source: "CDC",
    title: "Urgent Maternal Warning Signs",
    description:
      "Warning signs that need quick action during pregnancy and after birth.",
    details:
      "Use this as a safety conversation starter. Partners should know severe headache, chest pain, heavy bleeding, trouble breathing, and thoughts of self-harm are urgent.",
    videoId: "urgent-maternal-warning-signs",
  },
  {
    id: "stanford-breastfeeding",
    source: "Stanford Medicine",
    title: "ABCs of Breastfeeding",
    description:
      "Clear feeding education for latch, positioning, and early feeding patterns.",
    details:
      "Helpful for understanding what support looks like during feeding without pressuring the mother or replacing lactation care.",
    videoId: "breastfeeding-basics",
  },
  {
    id: "ebb-brain",
    source: "Evidence Based Birth",
    title: "Advocacy During Labor",
    description:
      "A practical decision-support lane for questions, options, and respectful advocacy.",
    details:
      "Partners can slow down rushed decisions by asking about benefits, risks, alternatives, intuition, and what happens if they wait.",
    videoId: "fetal-monitoring-advocacy",
  },
  {
    id: "bmma-toolkit",
    source: "BMMA",
    title: "Black Maternal Health Toolkit",
    description:
      "Resources centered on equity, safety, advocacy, and community care.",
    details:
      "A strong resource for learning why advocacy, listening, and bias awareness matter in real care settings.",
    videoId: "black-mamas-matter",
  },
  {
    id: "psi-tool",
    source: "Mayo Clinic",
    title: "Postpartum Mental Health Signs",
    description:
      "A short video and conversation guide for postpartum mental health symptoms and next steps.",
    details:
      "Use this to prepare supportive language and know when to connect with professional mental health help.",
    videoId: "postpartum-depression-need-to-know",
  },
];

export const browseTopics = [
  "Doula Basics",
  "Prenatal Education",
  "Labor Support",
  "Postpartum",
  "Mental Health",
  "Newborn Care",
  "Lactation",
  "Birth Equity",
];
