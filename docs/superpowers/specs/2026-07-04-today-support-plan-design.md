# Partner Hub Today Support Plan Design

## Purpose

Partner Hub already has a solid signed-in learning base: module progress, lessons, quizzes, scenario reflections, interactive guides, video resources, public partner pages, organization demo access, privacy messaging, and owner-only admin analytics.

The next build lane should make the product useful when a partner or dad comes back tired, uncertain, or short on time. The dashboard should answer one practical question: what kind of support is needed today?

The approved direction is a Today Support Plan with a built-in Situation Helper. It lives at the top of the signed-in dashboard and turns a guided context choice into one practical care action, one safety or watch point when relevant, one sentence the user can say, and one linked resource.

## Scope

Build a first version for signed-in learners only. Keep Partner Hub separate from DieudonneMatch, HRIS, Grants and Budgets, Training Eval, and automations.

Do not change Supabase Auth, RLS policies, production data, deployment settings, or admin access rules for this lane. Stephane remains the only admin unless he explicitly changes that. Organization demo users remain learner-only.

This version should not collect private health notes, symptom diaries, or case records. It should save only small product state needed for continuity and coarse product signals.

## User Experience

The signed-in dashboard opens with a Today card above the current module area, or in the first dashboard position if the existing current module card is adjusted. The first view asks, "What kind of support is needed today?" and shows guided taps:

- Prenatal support
- Appointment prep
- Labor prep
- Postpartum recovery
- Feeding support
- Mood or stress
- Home setup
- Urgent concern

After a context is selected, the card changes into the daily plan view. The plan view shows:

- One practical action to do today
- One watch point when the context needs safety awareness
- One short sentence to say to mom or the care team
- One resource link to a lesson, guide, or video
- A Change context control
- A Mark done button

The tone should be calm, direct, and nonjudgmental. The card should feel like help for the next few minutes, not like another assignment.

For urgent concern, the helper must avoid diagnosis. It should say to contact the care team, seek emergency care for severe warning signs, and open the warning signs or complications guide. For non-urgent contexts, it should stay action-first and connect users to the best learning resource only when helpful.

## Content Model

Plan content should be static app data, similar to the existing curriculum, guide, and video data files. Each plan should have a stable id, context, title, practical action, optional watch point, support phrase, and resource target.

The resource target can point to one of the existing surfaces:

- lesson: module id and lesson id
- guide: guide id
- video: video id
- dashboard fallback when the target is missing

The first content set should be small enough to review carefully. Use one or two plans per context rather than a large library. The chosen plan can be based on the selected context and the learner's current progress.

## Data Flow

The learner profile can store a small `todaySupport` object:

```json
{
  "selectedContext": "postpartum",
  "currentPlanId": "postpartum-recovery-reset",
  "lastViewedAt": "2026-07-04T00:00:00.000Z",
  "lastCompletedAt": "2026-07-04T00:00:00.000Z",
  "recentCompletions": [
    {
      "planId": "postpartum-recovery-reset",
      "context": "postpartum",
      "completedAt": "2026-07-04T00:00:00.000Z"
    }
  ]
}
```

Saving should reuse the existing profile persistence path so the app works locally and with the current Supabase profile storage. The first version does not need a new table.

Product events should stay coarse:

- today_context_selected
- today_plan_viewed
- today_resource_clicked
- today_action_completed

Admin reporting can later summarize context use and follow-through. It must not expose private notes or health details.

## Components

Add a focused Today card rather than spreading logic across the dashboard:

- TodaySupportCard: owns the context picker and plan view.
- TodayContextPicker: shows guided taps.
- TodayPlanView: renders action, watch point, phrase, resource link, and Mark done.
- todaySupport data file: stores static plan content and resource targets.
- progress-aware selector: chooses the best plan for a selected context and current learner profile.

The card should receive callbacks from the existing dashboard context for saving Today state and tracking product events. It should not call auth or Supabase directly.

## Error Handling

If saving context or done state fails, keep the selected plan visible and show a small "Could not save yet" message. The user should still be able to use the plan.

If a linked lesson, guide, or video target is missing, route to the guide library or dashboard rather than showing a dead end.

If a learner has no progress yet, default the plan selector to prenatal foundations, appointment support, or home setup based on the selected context.

If the context is urgent concern, show clear safety language and avoid any wording that sounds like diagnosis.

## Admin And Trust

Owner admin can see aggregate Today Support signals later, such as context counts and action completion counts. Organization demo users must not receive admin access or owner analytics.

The card should reinforce trust through product behavior more than extra copy. It should avoid asking the user to document private health details. It should route safety concerns to care team or emergency guidance and trusted existing resources.

## Testing

Use the smallest useful validation for the first implementation:

- Run the app build.
- Add focused tests for plan selection and Mark done behavior if the repo has a fitting test pattern.
- Use browser or Playwright checks for the signed-in dashboard flow.

Manual or browser checks should verify:

- The Today card appears at the top of the signed-in dashboard.
- Guided taps produce the expected action, watch point, phrase, and resource link.
- Mark done changes state and persists through dashboard refresh when persistence is available.
- Urgent concern shows safety language and opens the warning signs or complications resource.
- Organization demo access remains learner-only and cannot open the owner admin dashboard.

## Out Of Scope

This design does not include chat, AI triage, reminders, caregiver invitations, new admin roles, new Supabase tables, production data changes, deployment, or public homepage changes.

Those can be considered later if the first Today Support Plan proves useful and people return to it.
