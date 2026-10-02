// Read-only editorial queue. HTTP success is not content verification.
// Usage: node scripts/review-resource-sources.mjs [--check-links]
import { resourceSources } from "../src/features/partner-dashboard/data/resourcesDashboard.js";
import { maternalHealthSources } from "../src/features/partner-dashboard/data/maternalHealthData.js";
const entries = [...Object.values(resourceSources).filter(x => x.kind === "external"), ...Object.values(maternalHealthSources)];
const now = Date.now();
for (const item of entries) {
  const age = item.checkedOn ? Math.floor((now - Date.parse(item.checkedOn)) / 86400000) : null;
  const queue = age === null ? "date missing: review" : age >= 30 ? "review due" : "within 30-day review window";
  let reachability = "not checked";
  if (process.argv.includes("--check-links")) {
    try {
      const response = await fetch(item.href, { signal: AbortSignal.timeout(10000) });
      reachability = `${response.status}; ${response.redirected ? "redirect: " + response.url : "no redirect"}; content review still required`;
      await response.body?.cancel();
    } catch { reachability = "unverified: blocked, timeout or network failure"; }
  }
  console.log(JSON.stringify({ source: item.label, url: item.href, checkedOn: item.checkedOn || null, queue, reachability }));
}
