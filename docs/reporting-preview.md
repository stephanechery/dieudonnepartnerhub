# Reporting design preview

Run `npm run dev` and open `/reporting-preview.html` on the local server. Opening the HTML file directly with `file://` will not load the React application.

This is an English, synthetic-only design preview with cohort/month filtering, safe sample CSV export, and small-cohort suppression examples. It has no real account, participant, profile, analytics or database connection. It is intentionally not linked from production navigation or included as a Vite production entry. Committing this preview does not activate organization reporting.

Notes/Reminders cross-device sync is a separate candidate. No sync code, migrations, Auth or role changes belong to this preview release.
