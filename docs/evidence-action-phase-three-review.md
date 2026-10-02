# Phase 3: Evidence into Action

Status: local review candidate, October 2, 2026. No commit, push or deployment.

## Scope and baseline

Partner Hub only. Isolated branch `codex/evidence-action-phase-three`, based on verified remote main `5c9abf0b3a448aa52ebe2abd69a534a81c2ef660`. The dirty primary checkout and DieudonneMatch were not edited. No authentication, permissions, API, environment, provider, dependency or production-data changes.

## Implemented

- Compact Maternal Data and Resources utility headers on desktop and mobile. Other dashboard headers retain their existing behavior.
- Three initial findings, with practical actions visible without expansion. The larger evidence collection has a topic filter.
- Specific resource links for feeding, birth preparation, emotional support, care access and practical support. Browser Back returns to the originating finding.
- Resources starts with a needs chooser. Desktop uses a category rail; narrow screens use a labeled selector. Contact actions remain visible; source details use native disclosure.
- Geography/type filters distinguish Indiana, national resources and internal guides. Unverified coverage is not labeled nationwide.
- Added PSI support for dads, existing Partner Hub feeding and birth-companion guide entry points, and direct CDC support-person guidance.
- Two CDC guidance entries broaden Your impact beyond older feeding research. Guidance is explicitly not an outcome estimate.
- English, Spanish, French and Haitian Creole catalog coverage. External service language information is separate from interface language.

## Source review register

Links reviewed October 2, 2026. A source-link check is not a new study date. Exact populations, units, actions and linked destinations remain attached to the individual records in `maternalHealthData.js` and `evidenceResourcePaths.js`.

| Source | Records / period | Review decision and limits |
|---|---|---|
| [CDC final mortality](https://www.cdc.gov/nchs/data/hestat/hestat113.htm) | National rate, race and age; 2024 | Retain final data. No provisional trend or individual-risk claim. |
| [CDC prevention overview](https://www.cdc.gov/nccdphp/divisions-offices/about-the-division-of-reproductive-health.html) | National preventability; findings released 2022 | Add release-year label. Review-committee prevention opportunities are not effects attributable to fathers. |
| [CDC PRAMS](https://www.cdc.gov/mmwr/volumes/69/wr/mm6919a2.htm) | Depression symptoms and screening; 2018, 31 sites | Retain historical survey labels, not diagnosis or a current national estimate. |
| [Father-training trial](https://pubmed.ncbi.nlm.nih.gov/16199676/) | Two feeding findings; 2005, Naples, 280 couples | Identify the same controlled trial on both findings. Not two independent studies or a guaranteed result. |
| [WHO intrapartum guideline](https://www.who.int/publications/i/item/9789241550215) | Continuous support; 2018 guideline | Birth companions included multiple types of supporters. Do not relabel as a father-only effect. |
| [CDC Hear Her support](https://www.cdc.gov/hearher/caring/index.html) | Listening and follow-up; 2024 guidance | Two new practical guidance entries, no percentage outcome claim. Support complements care and does not alone remove systemic inequities. |
| [March of Dimes access](https://www.marchofdimes.org/maternity-care-deserts-report) | Three access findings; 2026 report | Refresh county share, population/birth counts and travel comparison. Counties are not people; annual births are not a population total; travel is not an address-level estimate. |
| [March of Dimes 2024 report](https://www.marchofdimes.org/sites/default/files/2024-09/2024_MoD_MCD_Report.pdf) | Preterm/access, Indigenous access, prenatal disparity; 2020–2022 or 2022 | Retain original periods instead of relabeling older findings as 2026. Associations do not establish individual causation. |
| [Indiana MMRC](https://www.in.gov/health/mch/files/MMRC%20Annual%20Report%202019-2023%20Data.pdf) | Six review findings; 2019–2023 and 2023 cohort | Retain pregnancy-associated versus pregnancy-related distinction. Do not compare directly with national 42-day mortality. |
| [Indiana report card](https://www.marchofdimes.org/peristats/assets/s3/reports/reportcard/MarchofDimesReportCard-Indiana.pdf) | Mortality 2019–2023; inadequate prenatal care 2024 | Correct the overall prenatal-care period to 2024. The racial breakdown uses a separate 2022–2024 period. |

## Contacts and service boundaries

- [PSI Help for Dads](https://postpartum.net/get-help/help-for-dads/): peer support and resource navigation. No invented meeting time, cost or emergency availability.
- [HRSA hotline](https://mchb.hrsa.gov/programs-impact/national-maternal-mental-health-hotline): existing call/text number, free confidential 24/7 support, loved ones eligible; English/Spanish plus interpreters. Emergency care remains distinct.
- [Moms Helpline](https://www.in.gov/health/mch/moms-helpline/): existing Indiana contact and eligibility rechecked against the official indexed page after direct retrieval timed out. English/Spanish and interpreters confirmed. No promise of service placement.
- [Indiana 211](https://www.in.gov/fssa/indiana-211/) and [WIC application steps](https://www.in.gov/health/wic/how-do-i-apply-for-wic): contact/application paths rechecked; receiving a resource is not eligibility approval.
- [988](https://988lifeline.org/): existing crisis call/text path retained. No calls or messages were sent during testing.
- Existing internal guide links are tested against the guide registry and section IDs.

## Content held back

- Indiana Dads to Doulas appears on the state initiative page, but current enrollment and availability were not established. It is not presented as an active referral.
- The father infant-care survey candidate is not added without full appraisal. No father-attributed maternal-mortality reduction percentage is claimed.
- Translation coverage and rendering are checked; this is not certification by a medical translator or a clinical reviewer.
- Proposed maintenance: quarterly source/contact review, earlier for urgent contact changes. No scheduled automation created.

## Validation and review

- 129 Node tests passed. Production build passed. Production dependency audit: 0 vulnerabilities. `git diff --check` passed; scoped secret-pattern scan found 0 matches.
- Browser QA in the local Organization Demo: EN/ES/FR/HT, light/dark, sampled 1440/1280 desktop and 390/320 mobile, exact-resource focus, Back/reload, topic and resource filtering, keyboard disclosure, no observed horizontal overflow or console errors.
- Organization Demo exposes no owner-admin link, and direct `/owner-admin` navigation showed "This dashboard is restricted." Authenticated owner sessions and production are not exercised by this local UI review.
- Build retains the existing large-bundle and outdated Browserslist-data warnings. There is no configured lint or TypeScript check in this JavaScript project.

Review URL: http://127.0.0.1:5197/partner-demo

Screenshots are in `/Users/stephanechery/.codex/visualizations/2026/07/09/019f4822-f119-7aa3-b146-12fa62186248/evidence-action-phase-three/`.

Recommendation: review the local candidate before a separately authorized production release.
