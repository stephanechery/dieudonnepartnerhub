# Partner readiness review

Status: local validation passed; approved for production release November 1, 2026.

Baseline: origin/main 08b648128c4c235f6746adbf306edafd5b366314, fetched November 1, 2026.
Worktree: .worktrees/partner-readiness, branch codex/partner-readiness.
The primary checkout's staged deletions and unrelated files were not changed.

## Scope delivered

- Three preparation packs within existing Resources support-plan routes: appointment, birth, and the first weeks at home.
- Compact desktop list, mobile chooser, conversation prompts and collapsed native checklists. Checks are temporary, reset on leaving the plan, and never update Training or account progress.
- One Today recommendation based on the existing selected support situation. Urgent context suppresses this recommendation.
- Birth and practical-help evidence link to the matching preparation pack. Six access-to-care findings link to the existing HRSA care finder rather than insurance or generic warning signs.
- Searchable external PSI loss/grief and 4Kira4Dads education listings with dated sources and clear service boundaries.
- English, Spanish, French and Haitian Creole copy. Existing navigation, statistics, source evidence, Auth, admin boundaries and storage behavior preserved.

## Source review, November 1, 2026

- https://www.cdc.gov/hearher/caring/index.html supports listening, appointment support and follow-up. Appointment checklist reuses approved Partner Hub copy.
- Birth preparation uses existing Labor Readiness, parental-leave and insurance guides. Postpartum preparation uses existing support-village, feeding and mental-health resources. New questions are editorial conversation examples, not clinical advice.
- https://postpartum.net/get-help/loss-grief-in-pregnancy-postpartum/ lists bereaved-parent support groups and contacts. Listing sends users to current provider options, with no emergency-care promise.
- https://www.4kira4dads.com/news/quarter-2 is a published program overview, not evidence of current event availability. Listing directs readers to check current courses and account requirements. No partnership, referral, certification or outcome claim is made.
- MMRT was not added: geographic coverage and current service eligibility were not sufficiently established. No 24-hour promise imported.
- DOL FAQ fetch returned 403; no new leave entitlement claim was added. Existing approved leave guide retained.

## Validation

- All 147 source tests pass, including six new readiness tests.
- Production build passes. Existing outdated Browserslist and bundle-size warnings remain.
- npm audit --omit=dev --audit-level=moderate: zero reported vulnerabilities.
- git diff --check passes.
- Scoped pattern scan across nine changed/new source files: zero flagged files. This is not a full security audit; no trust boundary changed.
- No lint or TypeScript check script is configured in package.json.

## Review URLs

Local server: http://127.0.0.1:5199/

- /partner-dashboard/resources/pathways
- /partner-dashboard/resources/path-appointment
- /partner-dashboard/resources/path-birth
- /partner-dashboard/resources/path-postpartum
- /partner-dashboard/resources/mental-health?resource=loss-grief
- /partner-dashboard/resources/benefits-planning?resource=father-education
- /partner-dashboard/maternal-data/national?highlight=national-care-deserts

Use the existing demo or sign-in flow. No credentials or environment files were copied.

## Rendered validation

Fresh Organization Demo browser checks passed at desktop 1280px and mobile 390px/320px. Document scroll width stayed within the actual viewport. Light and dark layouts were inspected. Native keyboard disclosure, checklist reset, mobile section chooser, Back and reload worked. New plan copy rendered in English, Spanish, French and Haitian Creole. Grief search returned the new source-bound resource. No admin control was present in Organization Demo; no console errors were captured. The existing French homepage footer retains English wording, outside this release scope.

Production target confirmed: dieudonnepartnerhub, prj_xeEKsbPdcRLKixzNnCDuic01gk18. Pre-release rollback deployment: dpl_2a4UJVd54DxW8Y2MDVi5bhmwrFmK (READY, production).
