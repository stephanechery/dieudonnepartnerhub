# Dieudonne Partner Hub iOS

Native iOS companion shell for the Dieudonne Partner Hub web application.

The iOS app loads the live Partner Hub at:

```text
https://www.dieudonnepartnerhub.org/
```

This keeps the iOS app aligned with the web product: partner dashboard, lesson flow, reflections, quizzes, video hub, guides, admin gating, and future web releases all stay in one product surface.

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

## Notes

- The app uses `WKWebView` with persistent website storage, so web auth/session behavior can work like Safari-based app storage.
- External non-web links are handed to iOS.
- The native layer owns loading and retry states.
