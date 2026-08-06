export const PARTNER_THEME_STORAGE_KEY = "dieudonne-theme";

const isThemeValue = (value) => value === "dark" || value === "light";

export const getStoredTheme = (targetWindow = globalThis.window) => {
  if (!targetWindow?.localStorage) return null;

  try {
    const value = targetWindow.localStorage.getItem(PARTNER_THEME_STORAGE_KEY);
    return isThemeValue(value) ? value : null;
  } catch {
    return null;
  }
};

export const getSystemDarkMode = (targetWindow = globalThis.window) => {
  if (!targetWindow?.matchMedia) return false;
  return targetWindow.matchMedia("(prefers-color-scheme: dark)").matches;
};

export const getInitialPartnerDarkMode = (targetWindow = globalThis.window) => {
  const storedTheme = getStoredTheme(targetWindow);
  if (storedTheme) return storedTheme === "dark";
  return getSystemDarkMode(targetWindow);
};

export const persistPartnerTheme = (darkMode, targetWindow = globalThis.window) => {
  if (!targetWindow?.localStorage) return;

  try {
    targetWindow.localStorage.setItem(
      PARTNER_THEME_STORAGE_KEY,
      darkMode ? "dark" : "light"
    );
  } catch {
    // Keep the in-memory theme usable when storage is unavailable.
  }
};

export const applyPartnerDocumentTheme = (
  darkMode,
  targetDocument = globalThis.document
) => {
  if (!targetDocument?.documentElement) return;

  const theme = darkMode ? "dark" : "light";
  targetDocument.documentElement.dataset.theme = theme;
  targetDocument.documentElement.style.colorScheme = theme;
};

export const subscribeToPartnerSystemTheme = (
  onChange,
  targetWindow = globalThis.window
) => {
  if (!targetWindow?.matchMedia) return () => {};

  const mediaQuery = targetWindow.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = (event) => {
    if (!getStoredTheme(targetWindow)) {
      onChange(event.matches);
    }
  };

  mediaQuery.addEventListener?.("change", handleChange);
  return () => mediaQuery.removeEventListener?.("change", handleChange);
};
