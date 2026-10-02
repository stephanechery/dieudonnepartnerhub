# Phase 4: Put support into practice

## Boundary
Partner Hub only. Baseline main 9480992. No Auth, API, roles, membership, server data, dependency or provider changes. Existing dirty primary checkout untouched.

## Audit and design
Phase 3 already has a needs chooser, direct contacts and targeted evidence links. Remaining gaps were a practical sequence between evidence and help, a quick way back to useful contacts, and explanations of study limits. Preserve the compact starting view and semantic slate/cyan themes. Add a short tool row, not a second dashboard. Desktop pathways use a selection column and reading panel; mobile stacks those controls. No new tab, completion score, sensitive notes or time estimate.

## Content audit, October 2, 2026
- Father support: PSI Help for Dads remains available. No unverified local-group enrollment claims added.
- Food: Feeding America's official food-bank finder explains ZIP lookup and direct confirmation of local hours, services and requirements. Added https://www.feedingamerica.org/find-your-local-foodbank.
- Care access: HRSA's locator and https://bphc.hrsa.gov/about-health-center-program/what-health-center support a health-center finder. Added https://findahealthcenter.hrsa.gov/. Prenatal services, appointment availability and costs must be confirmed locally.
- Transport: https://www.in.gov/medicaid/members/member-resources/ links Traditional Medicaid non-emergency transportation. https://www.in.gov/medicaid/providers/clinical-services/nonemergency-medical-transportation/ distinguishes managed-care transport. Added member guidance, no invented phone, eligibility guarantee or booking action.
- Pathways: appointment and advocacy steps grounded in https://www.cdc.gov/hearher/caring/index.html; feeding steps reuse the existing approved Feeding Support Guide. No new clinical intervention or outcome claim.
- Remaining gaps: county-specific availability, transport for uninsured families, father-group enrollment and service-language guarantees require provider confirmation. Existing Indiana 211 remains the navigator, not a promise of a specific service.

## Evidence interpretation
Expanded evidence explains what the finding does not establish. Distinguish father training from broader birth-companion evidence, professional guidance from measured effects, and population findings from individual prediction. Preserve every statistic and existing citation.

## Device-only saves
Only allowlisted public resource IDs are stored. Demo and device keys are separate. No profile identifiers, notes, location or health narratives. Shared-browser visibility and browser-clearing behavior are disclosed. Storage failures show an honest unavailable state. No account sync or offline-availability claim.

## Source maintenance procedure
Run `node scripts/review-resource-sources.mjs --check-links` monthly and before a content release. Review crisis contacts and eligibility/language claims each month; review static evidence at least quarterly and when an official update is announced. A successful HTTP request is not source verification. A blocked request stays unverified. Confirm publisher, year, population, denominator and scope manually before changing checked dates. If content is obsolete, correct or retire it and update affected pathways/tests; do not silently substitute a source. Keep urgent-help alternatives visible. The script is read-only and no recurring automation or external commitment has been created.

## Validation
134 tests passed, production build passed, production dependency audit found 0 vulnerabilities, diff check passed and scoped secret-pattern check found 0 matches. No configured lint/typecheck script in this JavaScript/Vite repository. Browser QA used local Organization Demo at 1440x1000 and 1280x900 desktop, 390x844 and 320x844 mobile, both themes, and EN/ES/FR/HT samples. Save/reload/remove, exact-resource focus, native mobile chooser, history Back, and translated evidence links were exercised. No observed horizontal overflow or console errors. Rendered QA caught a missing translation-pack merge; fixed and covered by a regression assertion. Storage-denial/malformed-data/demo separation are unit-tested; no private learner account was accessed. External link checks returned HTTP 200 except PubMed 203, which remains a manual content-review signal. Two existing resources lack checked dates and stay in the review queue. No production release claimed.
