# dieudonnepartnerhub Deployment Guide

## 1) Production stack
- Frontend: Vite + React (this repo)
- Hosting: Vercel
- Auth + DB: Supabase
- Sensitive keys: platform env vars (never committed)

## 2) Create Supabase project
1. Create a new project in Supabase for production.
2. In Supabase SQL Editor, run: `supabase/schema.sql`.
3. In Auth settings:
   - Enable Email/Password.
   - Enable Google provider (optional).
   - Configure site URL and redirect URL(s):
     - `https://<your-domain>/partner-dashboard`

## 3) Configure app env vars
Use `.env.example` as reference.

Required in Vercel project env:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_PROFILES_TABLE=partner_profiles`
- `VITE_GEMINI_API_KEY` (if using Gemini features client-side)

Optional:
- `VITE_GEMINI_TEXT_MODEL`
- `VITE_GEMINI_TTS_MODEL`

## 4) Domain + project naming
- Set Vercel project name to: `dieudonnepartnerhub`
- Attach your custom domain (e.g., `dieudonnepartnerhub.com`) in Vercel Domains.

## 5) Deploy
From repo root:

```bash
npm ci
npm run build
```

Then deploy with Vercel (CLI or Git integration).

If using CLI:

```bash
vercel
vercel --prod
```

## 6) Post-deploy smoke test
1. Open `/` and verify hero + guide navigation.
2. Open `/partner-dashboard`.
3. Register/log in with email.
4. Complete one lesson + quiz.
5. Log out/in and verify:
   - quiz scores persist
   - selected quiz responses persist
   - completed lessons persist

## 7) Security notes
- Partner dashboard profile data is stored in Supabase `partner_profiles` with RLS policies enforcing user ownership.
- Avoid committing `.env.local`.
- Rotate API keys before production cutover if keys were exposed during development.
