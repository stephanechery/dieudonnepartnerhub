import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");
const parse = (path) => JSON.parse(read(path));

const catalogs = [
  parse("./main-guide-translations.json"),
  parse("./main-guide-spanish-translations.json"),
  parse("./learning-card-translations.json"),
  parse("./guide-chrome-translations.json"),
  parse("./partner-platform-translations.json"),
  parse("./partner-content-translations.json"),
  parse("./supplemental-translations.json"),
  parse("./discovery-translations.json"),
];

const mergedCatalog = (locale) =>
  Object.assign({}, ...catalogs.map((catalog) => catalog[locale] || {}));

test("committed catalogs cover critical navigation and safety text", () => {
  for (const locale of ["es", "fr", "ht"]) {
    const catalog = mergedCatalog(locale);
    for (const source of [
      "Learning path",
      "Change",
      "Partner Platform",
      "Today",
      "Training",
      "Guides",
      "Videos",
      "More",
      "Search Partner Platform",
      "Recent maternal health data",
      "National overview and disparities",
      "Indiana overview and disparities",
      "How to read these numbers",
      "Show more results",
      "Show fewer results",
      "Choose maternal data view",
      "Swipe for more",
      "Your impact",
      "What equipped partners can change",
      "Your support matters",
      "National data",
      "Indiana data",
      "What this means for your role",
      "Open only what you need.",
      "Expand all",
      "Collapse all",
      "Urgent warning signs",
      "This platform does not diagnose. Contact the care team for concerning symptoms. Call emergency services for immediate danger.",
      "Do not wait with chest pain, trouble breathing, seizure, severe headache, vision changes, heavy bleeding, fainting, or thoughts of self-harm.",
    ]) {
      assert.ok(catalog[source], `${locale} is missing: ${source}`);
      assert.equal(typeof catalog[source], "string");
      assert.ok(catalog[source].trim().length > 0);
    }
  }
});

test("maternal data and discovery interface are translated in every supported language", () => {
  const discoveryCatalog = parse("./discovery-translations.json");
  const discoverySource = read("../partner-dashboard/components/PartnerPlatformDiscovery.jsx");
  const dataSource = read("../partner-dashboard/data/maternalHealthData.js");
  const interfaceStrings = Array.from(
    discoverySource.matchAll(/tx\("([^"]+)"\)/g),
    (match) => match[1]
  );
  const dataStrings = Array.from(
    dataSource.matchAll(/(?:scope|title|unit|detail|supportAction|label):\s*"([^"]+)"/g),
    (match) => match[1]
  );

  for (const locale of ["es", "fr", "ht"]) {
    for (const source of new Set([...interfaceStrings, ...dataStrings])) {
      assert.ok(discoveryCatalog[locale]?.[source], `${locale} is missing discovery text: ${source}`);
    }
  }
});

test("language preference is durable and does not rely on runtime translation", () => {
  const appSource = read("../../App.jsx");
  const rootSource = read("../../RootApp.jsx");
  const boundarySource = read("./LocalizedDomBoundary.jsx");

  assert.match(appSource, /window\.localStorage\.setItem\(LANGUAGE_STORAGE_KEY/);
  assert.match(appSource, /document\.documentElement\.lang = nextLanguage/);
  assert.match(appSource, /const flushPendingTranslations = useCallback\(async \(\) => \{\}, \[\]\)/);
  assert.match(rootSource, /language=\{language\}/);
  assert.match(rootSource, /onLanguageChange=\{changeLanguage\}/);
  assert.match(boundarySource, /savedSource !== undefined && current !== source/);
  assert.match(boundarySource, /element\.setAttribute\(attribute, source\)/);
});

test("interactive guides share the selected site language", () => {
  const guidePage = read("../partner-dashboard/pages/InteractiveGuidesPage.jsx");
  const dashboardSource = read("../partner-dashboard/index.jsx");
  assert.match(dashboardSource, /<LocalizedDomBoundary key=\{language\}/);
  assert.match(guidePage, /language=\{language\}/);
  assert.match(guidePage, /onLanguageChange=\{onLanguageChange\}/);

  const guideNames = [
    "Anatomy",
    "Communication",
    "Complications",
    "Feeding",
    "Finance",
    "Labor",
    "MentalHealth",
    "Postpartum",
    "Trimester",
    "Village",
  ];
  for (const name of guideNames) {
    const source = read(`../partner-dashboard/interactive-guides/Partner${name}Guide.jsx`);
    assert.match(source, /language = "en"/);
    assert.match(source, /useEffect\(\(\) => setLang\(language\), \[language\]\)/);
    assert.match(source, /onClick=\{changeLanguage\}/);
    assert.match(source, /data-no-translate="true"/);
  }
});

test("every committed localization value is non-empty", () => {
  for (const catalog of catalogs) {
    for (const locale of ["es", "fr", "ht"]) {
      for (const [source, translated] of Object.entries(catalog[locale] || {})) {
        assert.ok(source.trim().length > 0, `${locale} has an empty source key`);
        assert.equal(typeof translated, "string");
        assert.ok(translated.trim().length > 0, `${locale} is blank for: ${source}`);
      }
    }
  }
});

test("new catalog values exclude known unsafe or misleading generated terms", () => {
  const combined = JSON.stringify(
    catalogs.flatMap((catalog) =>
      ["es", "fr", "ht"].flatMap((locale) => Object.values(catalog[locale] || {}))
    )
  );
  for (const unsafe of [
    "fecha de vencimiento",
    "eficiencia laboral",
    "mecánica laboral",
    "ti towo bèf",
    "Fèy cheat sipò travay",
    "panse sou tèt yo bezwen swen ijan",
  ]) {
    assert.doesNotMatch(combined, new RegExp(unsafe, "i"));
  }
});
