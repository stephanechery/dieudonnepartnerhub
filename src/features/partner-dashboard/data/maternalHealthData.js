export const maternalHealthSources = {
  supportGuidance: {
    label: "CDC Hear Her · Support guidance, 2024",
    checkedOn: "2026-10-02",
    href: "https://www.cdc.gov/hearher/caring/index.html",
  },
  maternityAccess2026: {
    label: "March of Dimes · 2026 Nowhere to Go report",
    checkedOn: "2026-10-02",
    href: "https://www.marchofdimes.org/maternity-care-deserts-report",
  },
  mentalHealthStudy: {
    label: "CDC MMWR · 2018 PRAMS, published 2020",
    checkedOn: "2026-10-02",
    href: "https://www.cdc.gov/mmwr/volumes/69/wr/mm6919a2.htm",
  },
  fatherTraining: {
    label: "PubMed · Controlled father-training trial",
    checkedOn: "2026-10-02",
    href: "https://pubmed.ncbi.nlm.nih.gov/16199676/",
  },
  laborCompanion: {
    label: "WHO · Intrapartum care guideline",
    checkedOn: "2026-10-02",
    href: "https://www.who.int/publications/i/item/9789241550215",
  },
  national: {
    label: "CDC NCHS · Final 2024 data, published March 2026",
    checkedOn: "2026-10-02",
    href: "https://www.cdc.gov/nchs/data/hestat/hestat113.htm",
  },
  prevention: {
    label: "CDC · Pregnancy-related death prevention",
    checkedOn: "2026-10-02",
    href: "https://www.cdc.gov/nccdphp/divisions-offices/about-the-division-of-reproductive-health.html",
  },
  hearHer: {
    label: "CDC Hear Her · Support people and warning signs",
    checkedOn: "2026-10-02",
    href: "https://www.cdc.gov/hearher/index.html",
  },
  maternityAccess: {
    label: "March of Dimes · 2024 Nowhere to Go report",
    checkedOn: "2026-10-02",
    href: "https://www.marchofdimes.org/sites/default/files/2024-09/2024_MoD_MCD_Report.pdf",
  },
  indiana: {
    label: "Indiana MMRC · 2025 Annual Report",
    checkedOn: "2026-10-02",
    href: "https://www.in.gov/health/mch/files/MMRC%20Annual%20Report%202019-2023%20Data.pdf",
  },
  indianaReportCard: {
    label: "March of Dimes · 2025 Indiana Report Card",
    checkedOn: "2026-10-02",
    href: "https://www.marchofdimes.org/peristats/assets/s3/reports/reportcard/MarchofDimesReportCard-Indiana.pdf",
  },
};

export const maternalHealthHighlights = [
  {
    id: "national-postpartum-depression", group: "national",
    scope: "United States · 2018 PRAMS · 31 sites",
    title: "Emotional support belongs in postpartum care",
    value: "13.2%", unit: "reported postpartum depressive symptoms",
    detail: "In this 2018 survey across 31 PRAMS sites, women with a recent live birth reported depressive symptoms. This is not a diagnosis or a current national estimate.",
    supportAction: "Listen without judgment and help her contact the care team. Partners can also contact the National Maternal Mental Health Hotline for support.",
    source: maternalHealthSources.mentalHealthStudy, tone: "cyan",
  },
  {
    id: "national-depression-screening", group: "national",
    scope: "United States · 2018 PRAMS · 31 sites",
    title: "Make space to ask about emotional health",
    value: "20.9%", unit: "were not asked about depression at prenatal visits",
    detail: "Among surveyed women who received prenatal care, 79.1% reported a provider asking about depression. The remaining 20.9% did not. These are self-reported 2018 findings, not current screening rates.",
    supportAction: "Ask whether emotional health can be discussed at the next visit. Let her decide what to share and offer help arranging support.",
    source: maternalHealthSources.mentalHealthStudy, tone: "cyan",
  },
  {
    id: "partner-breastfeeding",
    group: "partner",
    scope: "Fathers · 2005 controlled trial · Italy",
    title: "Father training helped sustain full breastfeeding",
    value: "25% vs 15%",
    unit: "full breastfeeding at 6 months",
    detail:
      "A 2005 controlled trial in Naples included 280 couples considering breastfeeding. This single study is not a current population estimate or a guarantee for every family.",
    supportAction:
      "Learn the feeding plan, watch for common challenges, and help connect mom with skilled lactation support early.",
    source: maternalHealthSources.fatherTraining,
    tone: "emerald",
    priority: true,
  },
  {
    id: "partner-practical-help",
    group: "partner",
    scope: "Fathers · Same 2005 trial · Italy",
    title: "More mothers reported useful partner help",
    value: "91% vs 34%",
    unit: "mothers reporting help with infant feeding",
    detail:
      "In the same controlled trial, mothers whose partners received training reported much more relevant help with feeding management.",
    supportAction:
      "Ask what would make feeding easier, handle setup and cleanup, and reinforce the care plan without taking control away from mom.",
    source: maternalHealthSources.fatherTraining,
    tone: "cyan",
  },
  {
    id: "partner-labor-support",
    group: "partner",
    scope: "Birth companions · WHO guideline, 2018",
    title: "Continuous support was linked to shorter labor",
    value: "≈41 min",
    unit: "shorter labor on average",
    detail:
      "WHO found an average 0.69-hour reduction across 13 trials involving 5,429 women. Companions varied and could include a partner, relative, friend, doula, or professional.",
    supportAction:
      "Prepare comfort measures, stay calm and present, help communicate preferences, and follow the clinical team's safety guidance.",
    source: maternalHealthSources.laborCompanion,
    tone: "indigo",
  },
  {
    id: "partner-listening", group: "partner",
    scope: "Support people · CDC guidance, 2024",
    title: "Take her concerns seriously",
    value: "Listen first", unit: "professional guidance, not an effect estimate",
    detail: "CDC recommends listening, helping her ask questions and supporting access to care. Partner support complements clinical care; it cannot remove systemic inequities on its own.",
    supportAction: "Ask what she needs. Help her get immediate medical care for urgent warning signs and tell the team about a pregnancy within the past year.",
    source: maternalHealthSources.supportGuidance, tone: "cyan",
  },
  {
    id: "partner-follow-up", group: "partner",
    scope: "Support people · CDC guidance, 2024",
    title: "Keep showing up after the appointment",
    value: "Follow through", unit: "professional guidance, not an effect estimate",
    detail: "CDC includes help with visits, questions and follow-up care in the support person's role. There is no percentage outcome claim attached to this guidance.",
    supportAction: "With her agreement, help organize follow-up visits and write down questions for the care team.",
    source: maternalHealthSources.supportGuidance, tone: "cyan",
  },
  {
    id: "national-preventability",
    group: "national",
    scope: "United States · Review findings released 2022",
    title: "Most pregnancy-related deaths have a prevention opportunity",
    value: ">80%",
    unit: "determined preventable by maternal mortality review committees",
    detail:
      "CDC reviews found that pregnancy-related deaths occur during pregnancy, delivery, and through the first year after pregnancy.",
    supportAction:
      "Know the urgent warning signs, listen when she says something is wrong, and help her get timely care.",
    source: maternalHealthSources.prevention,
    tone: "emerald",
    priority: true,
  },
  {
    id: "national-overview",
    group: "national",
    scope: "United States · 2024 final data",
    title: "National maternal mortality rate",
    value: "17.9",
    unit: "maternal deaths per 100,000 live births",
    detail: "649 women died of maternal causes in the United States in 2024.",
    supportAction:
      "Keep a short health history and medication list ready, and help her contact the care team when something feels wrong.",
    source: maternalHealthSources.national,
    tone: "cyan",
  },
  {
    id: "national-racial-disparity",
    group: "national",
    scope: "United States · 2024 racial disparity",
    title: "Black women had the highest reported maternal mortality rate",
    value: "44.8 vs 14.2",
    unit: "deaths per 100,000 live births for Black women versus White women",
    detail:
      "The 2024 rate for Black women was also higher than the Hispanic rate of 12.1 and the Asian rate of 18.1.",
    supportAction:
      "Listen without minimizing symptoms, document changes, and support her voice if concerns are dismissed.",
    source: maternalHealthSources.national,
    tone: "rose",
    priority: true,
  },
  {
    id: "national-age-disparity",
    group: "national",
    scope: "United States · 2024 age disparity",
    title: "Maternal mortality was highest among women age 40 and older",
    value: "62.3",
    unit: "deaths per 100,000 live births for women age 40 and older",
    detail:
      "CDC reported a rate of 62.3 for women age 40 and older, about five times the rate for women younger than 25.",
    supportAction:
      "Share a complete health and medication history, attend key visits when invited, and ask the care team to explain the warning signs and follow-up plan.",
    source: maternalHealthSources.national,
    tone: "amber",
  },
  {
    id: "national-care-deserts",
    group: "national",
    scope: "United States · 2026 access report",
    title: "More than one third of U.S. counties are maternity care deserts",
    value: "34.6%",
    unit: "of counties have no birthing facility or obstetric clinician",
    detail:
      "The 2026 March of Dimes report classifies about one third of U.S. counties as maternity care deserts. This is a share of counties, not a share of people.",
    supportAction:
      "Confirm the planned birth location, backup hospital, travel time, and transportation plan before labor begins.",
    source: maternalHealthSources.maternityAccess2026,
    tone: "amber",
    priority: true,
  },
  {
    id: "national-desert-population",
    group: "national",
    scope: "United States · 2026 access report",
    title: "Millions live where maternity care is unavailable",
    value: "2.4M + 149K",
    unit: "women of reproductive age and babies born in maternity care deserts",
    detail:
      "The 2026 report describes 2.4 million women of reproductive age living in maternity care deserts and about 149,000 births annually. These are different population measures, not a combined total.",
    supportAction:
      "Ask the care team when to leave for the hospital and where to go if the planned facility cannot receive patients.",
    source: maternalHealthSources.maternityAccess2026,
    tone: "indigo",
  },
  {
    id: "national-travel-time",
    group: "national",
    scope: "United States · 2026 access report",
    title: "Families in maternity care deserts travel much longer for birth care",
    value: "≈3×",
    unit: "longer travel time than families in full-access counties",
    detail:
      "The 2026 report describes roughly three times longer travel to labor and delivery care in maternity care deserts than in full-access counties. This is not a travel estimate for your address.",
    supportAction:
      "Save the route, fuel the car, arrange a backup ride, and keep the hospital bag and key phone numbers ready.",
    source: maternalHealthSources.maternityAccess2026,
    tone: "amber",
  },
  {
    id: "national-access-preterm",
    group: "national",
    scope: "United States · 2020–2022 · 2024 report",
    title: "Living in a maternity care desert is linked to higher preterm birth risk",
    value: "+13%",
    unit: "higher risk than living in a full-access county",
    detail:
      "March of Dimes estimated more than 10,000 excess preterm births in maternity care deserts and limited-access counties from 2020 through 2022.",
    supportAction:
      "Protect time for prenatal visits, help solve transportation or work conflicts, and ask how to reach the care team after hours.",
    source: maternalHealthSources.maternityAccess,
    tone: "rose",
  },
  {
    id: "national-indigenous-access",
    group: "national",
    scope: "United States · 2022 · 2024 report",
    title: "American Indian and Alaska Native families face major access gaps",
    value: "1 in 5",
    unit: "births were to people living in counties without full maternity care access",
    detail:
      "The 2024 report found that nearly one in five births among American Indian and Alaska Native women in 2022 occurred in counties without full access.",
    supportAction:
      "Identify the closest trusted care options early and ask about transportation, telehealth, and community-based support.",
    source: maternalHealthSources.maternityAccess,
    tone: "rose",
  },
  {
    id: "national-prenatal-disparity",
    group: "national",
    scope: "United States · Prenatal care disparity",
    title: "Black women were almost twice as likely to receive inadequate prenatal care",
    value: "21.9% vs 11.1%",
    unit: "inadequate prenatal care for Black women versus White women, 2020–2022",
    detail:
      "The report links access to place, insurance, resources, and experiences of racism within maternity care systems.",
    supportAction:
      "Help protect appointment time, write down questions, and ask for a clear follow-up plan before leaving each visit.",
    source: maternalHealthSources.maternityAccess,
    tone: "rose",
  },
  {
    id: "indiana-overview",
    group: "indiana",
    scope: "Indiana · 2023 review cohort",
    title: "Indiana pregnancy-associated deaths",
    value: "69",
    unit: "deaths during pregnancy or within one year of pregnancy",
    detail:
      "Indiana recorded 69 pregnancy-associated deaths in 2023. Twenty-three were determined to be pregnancy-related.",
    supportAction:
      "Keep support active through the first year after pregnancy, including postpartum appointments and mental-health check-ins.",
    source: maternalHealthSources.indiana,
    tone: "indigo",
  },
  {
    id: "indiana-preventability",
    group: "indiana",
    scope: "Indiana · 2019–2023",
    title: "Most reviewed deaths had a prevention opportunity",
    value: "78%",
    unit: "of pregnancy-associated deaths were determined preventable",
    detail:
      "Indiana's review committee found a good or some chance to alter the outcome in most reviewed deaths.",
    supportAction:
      "Act early on warning signs, help remove transportation barriers, and make follow-up care easier to reach.",
    source: maternalHealthSources.indiana,
    tone: "emerald",
    priority: true,
  },
  {
    id: "indiana-postpartum-timing",
    group: "indiana",
    scope: "Indiana · 2019–2023",
    title: "The greatest share of pregnancy-associated deaths occurred months after birth",
    value: "58%",
    unit: "occurred 43 days to one year after pregnancy",
    detail:
      "The postpartum period remains medically important long after the first six-week visit.",
    supportAction:
      "Keep checking in, help schedule follow-up care, and take new physical or mental-health symptoms seriously for a full year.",
    source: maternalHealthSources.indiana,
    tone: "amber",
    priority: true,
  },
  {
    id: "indiana-racial-disparity",
    group: "indiana",
    scope: "Indiana · 2019–2023 racial disparity",
    title: "Black Hoosier mothers were overrepresented in deaths",
    value: "13% → 21%",
    unit: "of live births compared with pregnancy-associated deaths",
    detail:
      "Black women represented 13% of Indiana live births and 21% of pregnancy-associated deaths during 2019–2023.",
    supportAction:
      "Believe concerns, ask the care team to explain the next step, and stay present during handoffs between providers.",
    source: maternalHealthSources.indiana,
    tone: "rose",
    priority: true,
  },
  {
    id: "indiana-medicaid-disparity",
    group: "indiana",
    scope: "Indiana · 2019–2023 insurance disparity",
    title: "Medicaid-covered mothers were overrepresented in reviewed deaths",
    value: "40% → 65%",
    unit: "of live births compared with pregnancy-associated deaths among cases with a delivery",
    detail:
      "The committee cautions that this comparison applies only to reviewed deaths with a recorded delivery and does not measure individual risk.",
    supportAction:
      "Help keep coverage information current, ask for covered referrals, and contact the care team before a missed visit becomes a gap in care.",
    source: maternalHealthSources.indiana,
    tone: "rose",
  },
  {
    id: "indiana-maternal-mortality",
    group: "indiana",
    scope: "Indiana · 2019–2023 mortality data",
    title: "Indiana's maternal mortality rate remains above the national target",
    value: "31.4",
    unit: "maternal deaths per 100,000 births",
    detail:
      "The 2025 March of Dimes Indiana Report Card lists a Healthy People 2030 target of 15.7 deaths per 100,000 births.",
    supportAction:
      "Use prenatal and postpartum visits to ask about blood pressure, heart symptoms, bleeding, medications, and the emergency plan.",
    source: maternalHealthSources.indianaReportCard,
    tone: "amber",
  },
  {
    id: "indiana-prenatal-care",
    group: "indiana",
    scope: "Indiana · 2024 prenatal care",
    title: "Too many Indiana families started care late or received too few visits",
    value: "16.1%",
    unit: "of births involved inadequate prenatal care",
    detail:
      "This measure includes care beginning in the fifth month or later, or fewer than half of the expected visits for gestational age.",
    supportAction:
      "Help schedule visits early, plan transportation and childcare, and ask the clinic about options when work or distance creates a barrier.",
    source: maternalHealthSources.indianaReportCard,
    tone: "cyan",
  },
];

export const maternalHealthGroups = {
  partner: maternalHealthHighlights.filter((item) => item.group === "partner"),
  national: maternalHealthHighlights.filter((item) => item.group === "national"),
  indiana: maternalHealthHighlights.filter((item) => item.group === "indiana"),
};
