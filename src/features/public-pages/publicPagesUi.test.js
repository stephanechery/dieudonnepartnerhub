import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");
const organizationsSource = read("./OrganizationsPage.jsx");
const demoSource = read("./DemoPage.jsx");
const privacySource = read("./PrivacyPage.jsx");
const headerSource = read("./PublicPageHeader.jsx");
const translations = JSON.parse(read("../language/supplemental-translations.json"));

test("public pages contain audience-facing copy instead of internal rollout notes", () => {
  const publicSource = `${organizationsSource}\n${demoSource}\n${privacySource}`;

  for (const internalPhrase of [
    "Before a broad rollout",
    "Supabase RLS",
    "server-enforced",
    "product decisions",
    "service marketplace",
    "coarse learning signals",
    "pilot path",
  ]) {
    assert.doesNotMatch(publicSource, new RegExp(internalPhrase, "i"));
  }

  assert.match(organizationsSource, /What participants receive/);
  assert.match(organizationsSource, /How organizations can use it/);
  assert.match(demoSource, /Five useful stops/);
  assert.match(privacySource, /Clear limits for a learning platform/);
});

test("guided demo hides credentials and keeps learner-only demo routing", () => {
  assert.doesNotMatch(demoSource, /ORGANIZATION_DEMO_CREDENTIALS|authService|orgdemo@dieudonnepartnerhub\.org|PartnerDemo2026/);
  assert.match(demoSource, /\/partner-dashboard\?org_demo=1/);
  assert.match(demoSource, /href=\{addOrganizationDemoAccess\(step\.href\)\}/);
  assert.match(demoSource, /learner-only preview/);
});

test("public navigation marks the active destination and preserves core routes", () => {
  assert.match(headerSource, /aria-current=\{activePage === link\.id \? "page" : undefined\}/);
  assert.match(headerSource, /href: "\/partner-orgs"/);
  assert.match(headerSource, /href: "\/partner-demo"/);
  assert.match(headerSource, /href: "\/privacy"/);
  assert.match(headerSource, /href="\/partner-dashboard"/);
});

test("new public-page copy is translated in every supported language", () => {
  const publicSource = `${organizationsSource}\n${demoSource}\n${privacySource}\n${headerSource}`;
  const directStrings = Array.from(publicSource.matchAll(/tx\("([^"]+)"\)/g), (match) => match[1]);
  const dataStrings = Array.from(
    publicSource.matchAll(/(?:title|detail|label|value|text):\s*"([^"]+)"/g),
    (match) => match[1]
  );

  for (const locale of ["es", "fr", "ht"]) {
    for (const source of new Set([...directStrings, ...dataStrings])) {
      assert.ok(translations[locale]?.[source], `${locale} is missing public-page text: ${source}`);
    }
  }
});
