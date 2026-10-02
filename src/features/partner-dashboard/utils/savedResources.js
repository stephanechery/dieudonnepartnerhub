export const savedResourcesKey = scope => `partner-hub:saved-resources:v1:${scope === "demo" ? "demo" : "device"}`;

export function readSavedResources(storage, scope, allowedIds) {
  try {
    const raw = storage.getItem(savedResourcesKey(scope));
    if (!raw) return { ids: [], available: true };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return { ids: [], available: true };
    return { ids: [...new Set(parsed.filter(id => typeof id === "string" && allowedIds.includes(id)))], available: true };
  } catch { return { ids: [], available: false }; }
}

export function writeSavedResources(storage, scope, ids, allowedIds) {
  const clean = [...new Set(ids.filter(id => allowedIds.includes(id)))];
  try { storage.setItem(savedResourcesKey(scope), JSON.stringify(clean)); return true; }
  catch { return false; }
}
