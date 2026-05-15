# Dieudonne Partner Hub iOS

Native SwiftUI starter app for the Dieudonne Partner Hub learning product.

## What is included

- Today tab with progress and next lesson.
- Lessons tab with prenatal, labor, and postpartum starter lessons.
- Reflection saving for each lesson in local app state.
- Quiz review that shows the selected answer, correct answer, and teaching note.
- Guides tab with practical support guides.
- Review tab for completed lessons and saved guides.

## Open in Xcode

Open:

```sh
ios-native/DieudonnePartnerHub/DieudonnePartnerHub.xcodeproj
```

Scheme:

```sh
DieudonnePartnerHub
```

Bundle identifier:

```sh
org.dieudonne.partnerhub
```

The app currently uses bundled local content and in-memory progress. The next step is to connect authentication and profile persistence to the same Supabase pattern used by the web Partner Dashboard.
