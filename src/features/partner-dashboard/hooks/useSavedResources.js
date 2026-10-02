import { useEffect, useState } from "react";
import { resourceSections } from "../data/resourcesDashboard";
import { readSavedResources, writeSavedResources } from "../utils/savedResources";

const allowed = resourceSections.flatMap(section => section.resources.map(item => item.id));
export default function useSavedResources(scope) {
  const [state, setState] = useState({ ids: [], available: true, scope });
  useEffect(() => {
    const load = () => {
      try { setState({ ...readSavedResources(window.localStorage, scope, allowed), scope }); }
      catch { setState({ ids: [], available: false, scope }); }
    };
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, [scope]);
  const toggle = id => {
    try {
      const current = readSavedResources(window.localStorage, scope, allowed);
      if (!current.available) { setState({ ...current, scope }); return; }
      const ids = current.ids.includes(id) ? current.ids.filter(item => item !== id) : [...current.ids, id];
      const available = writeSavedResources(window.localStorage, scope, ids, allowed);
      setState({ ids: available ? ids : current.ids, available, scope });
    } catch { setState(previous => ({ ...previous, available: false })); }
  };
  return { ids: state.scope === scope ? state.ids : [], available: state.available, toggle };
}
