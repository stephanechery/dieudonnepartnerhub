export const DESKTOP_SIDEBAR_STORAGE_KEY = "dph_desktop_sidebar_v1";

export const getInitialDesktopSidebarVisibility = (targetWindow = globalThis.window) => {
  if (!targetWindow?.localStorage) return true;

  try {
    return targetWindow.localStorage.getItem(DESKTOP_SIDEBAR_STORAGE_KEY) !== "hidden";
  } catch {
    return true;
  }
};

export const persistDesktopSidebarVisibility = (
  visible,
  targetWindow = globalThis.window
) => {
  if (!targetWindow?.localStorage) return;

  try {
    targetWindow.localStorage.setItem(
      DESKTOP_SIDEBAR_STORAGE_KEY,
      visible ? "shown" : "hidden"
    );
  } catch {
    // Keep the in-memory preference when browser storage is unavailable.
  }
};
