export const maternalHealthSources = {
  national: {
    label: "CDC NCHS · Final 2024 data",
    href: "https://www.cdc.gov/nchs/data/hestat/hestat113.htm",
  },
  prevention: {
    label: "CDC · Maternal Mortality Prevention",
    href: "https://www.cdc.gov/maternal-mortality/preventing-pregnancy-related-deaths/index.html",
  },
  indiana: {
    label: "Indiana MMRC · 2025 Annual Report",
    href: "https://www.in.gov/health/mch/files/MMRC%20Annual%20Report%202019-2023%20Data.pdf",
  },
};

export const maternalHealthHighlights = [
  {
    id: "national-overview",
    scope: "United States · 2024",
    title: "National overview",
    value: "17.9",
    unit: "maternal deaths per 100,000 live births",
    detail: "649 women died of maternal causes in the United States in 2024.",
    supportAction:
      "Know urgent warning signs and help her contact the care team when something feels wrong.",
    source: maternalHealthSources.national,
    tone: "cyan",
  },
  {
    id: "national-racial-disparity",
    scope: "United States · Racial disparity",
    title: "Black women face the highest reported rate",
    value: "44.8",
    unit: "maternal deaths per 100,000 live births among Black women",
    detail:
      "The 2024 rate was more than three times the White rate of 14.2. The Hispanic rate was 12.1 and the Asian rate was 18.1.",
    supportAction:
      "Listen without minimizing symptoms, document changes, and support her voice if concerns are dismissed.",
    source: maternalHealthSources.national,
    tone: "rose",
    priority: true,
  },
  {
    id: "national-age-disparity",
    scope: "United States · Age disparity",
    title: "Women 40 and older face the highest age-based rate",
    value: "62.3",
    unit: "maternal deaths per 100,000 live births",
    detail:
      "The 2024 rate for women 40 and older was five times the rate for women younger than 25.",
    supportAction:
      "Help keep appointments, maintain an up-to-date medication list, and make urgent-care plans easy to use.",
    source: maternalHealthSources.national,
    tone: "amber",
  },
  {
    id: "indiana-overview",
    scope: "Indiana · 2023",
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
  },
  {
    id: "indiana-racial-disparity",
    scope: "Indiana · 2019–2023",
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
];
