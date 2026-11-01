# Evidence to help: first slice

Release candidate, 2026-11-01. Baseline e24ae5a2bb81fe09bf66df9c3c791d534ede0b0f. User approved push and production deployment after review.

## Changes
- Every maternal finding now has an explicit resource ID. Direct Find help links remain visible inside expanded findings even when a preparation pathway exists; the plan is a secondary link.
- Three existing resources have collapsed Before you contact details: National Maternal Mental Health Hotline, PSI Help for Dads, Indiana Moms Helpline. Call/text actions remain outside disclosure.
- New copy translated into Spanish, French and Haitian Creole. No new navigation, dependencies, accounts, data storage or medical statistics.

## Sources reviewed
- https://mchb.hrsa.gov/programs-impact/national-maternal-mental-health-hotline (audience, counselor support, call/text)
- https://postpartum.net/get-help/help-for-dads/ (peer groups, volunteer callback model)
- https://www.in.gov/health/mch/moms-helpline/ (Indiana 16+ audience, services, weekday Eastern hours)

## Validation
- 154 tests pass; production build and git diff --check pass.
- Mapping test covers every finding and requires the exact resource in its category, without fallback.
- New contact strings have all supported translations; metadata source matches existing resource source.
- Browser: 390/320 mobile contact content without horizontal overflow; desktop light evidence and dark contact view; direct feeding-resource navigation and Back restores expanded finding; no console errors. Organization Demo shows no Admin Dashboard.
- No exhaustive screen-reader or full-language visual matrix claimed. Existing build-size warning remains.

## Changed files
- src/features/partner-dashboard/data/evidenceResourcePaths.js
- src/features/partner-dashboard/data/resourceContactDetails.js
- src/features/partner-dashboard/pages/MaternalDataPage.jsx
- src/features/partner-dashboard/pages/ResourcesDashboardPage.jsx
- src/features/language/support-translations.json
- src/features/partner-dashboard/utils/evidenceResourcePaths.test.js
- src/features/partner-dashboard/utils/contactPreparation.test.js
- docs/contact-preparation-review.md

## Review artifacts
- /tmp/partner-contact-desktop.jpg
- /tmp/partner-contact-mobile.jpg
- /tmp/partner-contact-evidence-light.jpg
- http://127.0.0.1:5200/partner-dashboard/resources/mental-health?resource=maternal-mental-health-hotline

GO for approved release. Refreshed 154 tests, build and production dependency audit pass (zero vulnerabilities). Prior deployment dpl_4d6DDHjc8zknUGNPJybwKJT23F1r is the rollback target. Push and live verification are reported separately.
