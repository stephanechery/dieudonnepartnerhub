import { resourceRegion } from "../data/resourcesDashboard.js";

export const normalizeResourceQuery = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();

// Public catalog only. Queries stay in component memory, never in URLs or storage.
export function searchResources(sections, { query = "", region = "All resources", need = "", translateText = value => value } = {}) {
  const tokens = normalizeResourceQuery(query).split(" ").filter(Boolean);
  const seen = new Set();
  return sections.flatMap(section => section.resources.map(resource => ({ resource, section })))
    .filter(({ resource, section }) => {
      if (need && section.id !== need) return false;
      if (region !== "All resources" && resourceRegion(resource) !== region) return false;
      const fields = [resource.title, resource.description, section.label, resourceRegion(resource), ...resource.actions.map(action => action.label)];
      const text = normalizeResourceQuery(fields.flatMap(value => [value, translateText(value)]).join(" "));
      if (!tokens.every(token => text.includes(token)) || seen.has(resource.id)) return false;
      seen.add(resource.id);
      return true;
    });
}
