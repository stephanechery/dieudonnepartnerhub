import { useCallback, useEffect, useState } from "react";

const GUIDE_THEME_KEY = "dph-guide-theme";

const getInitialGuideDarkMode = () => {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(GUIDE_THEME_KEY) !== "light";
};

export default function usePartnerGuideTheme(controlledDarkMode, onToggleTheme) {
  const controlled = typeof controlledDarkMode === "boolean";
  const [localDarkMode, setLocalDarkMode] = useState(getInitialGuideDarkMode);
  const darkMode = controlled ? controlledDarkMode : localDarkMode;

  useEffect(() => {
    if (controlled || typeof window === "undefined") return;
    window.localStorage.setItem(GUIDE_THEME_KEY, darkMode ? "dark" : "light");
  }, [controlled, darkMode]);

  const setDarkMode = useCallback(
    (update) => {
      if (controlled) {
        onToggleTheme?.();
        return;
      }
      setLocalDarkMode(update);
    },
    [controlled, onToggleTheme]
  );

  return [darkMode, setDarkMode];
}
