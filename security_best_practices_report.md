# Security Best Practices Report

Executive summary: The app is stronger after the readiness pass. Gemini calls now go through a serverless proxy, local fallback auth fails closed outside development unless explicitly enabled, and Vercel security headers are defined in repo config. I did not find obvious DOM XSS sinks, unsafe `dangerouslySetInnerHTML`, dynamic code execution, unsafe external-link handling, or production dependency vulnerabilities. The remaining production risks are mostly around server-enforced authorization, browser token storage, Supabase RLS, and free-text privacy.

## Recently Fixed

### SEC-1: Gemini API key exposure in the browser bundle

Status: Fixed in this pass.

Evidence:

```js
const response = await fetch('/api/gemini', {
```

The browser now calls `/api/gemini`, and `api/gemini.js` reads `process.env.GEMINI_API_KEY` server-side. Keep `GEMINI_API_KEY` in Vercel environment variables, not in `VITE_` variables.

### SEC-2: Local fallback auth was available whenever Supabase env vars were missing

Status: Fixed in this pass.

Evidence:

```js
const LOCAL_AUTH_ENABLED =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_LOCAL_AUTH === "true";
```

Production now fails closed unless `VITE_ENABLE_LOCAL_AUTH=true` is explicitly set.

### SEC-3: Security headers were not visible in repo config

Status: Fixed in this pass.

Evidence:

```json
"key": "Content-Security-Policy"
```

`vercel.json` now defines CSP, referrer policy, content type sniffing protection, permissions policy, and `frame-ancestors 'none'`.

## Medium Severity

### SEC-4: Admin access still needs server enforcement

Location: `src/features/partner-dashboard/services/analyticsService.js`

Evidence:

```js
if (role === "admin" || role === "owner") return true;
return configuredAdminEmails().includes(email);
```

Impact: Client checks help route the UI, but Supabase RLS or a server endpoint must enforce access before the admin hub reads real production analytics.

Fix: Add a Supabase `admin_users` table or server-trusted profile role, then enforce reads with RLS policies. Keep the client check as UX only.

Mitigation: Keep admin analytics coarse and non-sensitive until server enforcement is live.

### SEC-5: Supabase access and refresh tokens are stored in localStorage

Location: `src/features/partner-dashboard/services/authService.js`

Evidence:

```js
window.localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
```

Impact: If an XSS issue or malicious browser extension runs on the site, tokens can be read and used as the user.

Fix: Long term, use an auth pattern with HttpOnly secure cookies through a backend or Supabase server-side auth helpers.

Mitigation: Keep CSP strict, avoid raw HTML insertion, use short token lifetimes, and ensure RLS is strict.

### SEC-6: Profile persistence may store sensitive free-text reflections

Location: `src/features/partner-dashboard/services/profileService.js`

Evidence:

```js
scenarioResponses: existingModule.scenarioResponses || {},
profile_data: profile,
```

Impact: Scenario reflections are free text. A user could enter private medical, family, or relationship details.

Fix: Treat reflections as sensitive. Either keep them local-only, encrypt them client-side with a user-held key, or replace free text with structured choices before a broad rollout.

Mitigation: Keep the new privacy page visible, add a short in-product warning near free-text prompts, and confirm each user can read and write only their own profile row.

## Low Severity

### SEC-7: Analytics events include email

Location: `src/features/partner-dashboard/services/analyticsService.js`

Evidence:

```js
email: normalizeEmail(payload.email),
```

Impact: Email is personally identifiable. The admin dashboard does not need email to calculate content health or drop-off trends.

Fix: Store only `uid` in analytics events, or use a one-way hash if cross-system deduplication is needed.

Mitigation: Avoid exporting raw event rows and keep admin views aggregated.

## Positive Findings

- No `dangerouslySetInnerHTML`, `innerHTML`, `document.write`, `eval`, or `new Function` usage found in `src`.
- External links using `target="_blank"` include `rel="noopener noreferrer"`.
- `npm audit --omit=dev --json` reports zero production dependency vulnerabilities.
- Admin analytics are coarse product signals, not client notes or medical case records.
