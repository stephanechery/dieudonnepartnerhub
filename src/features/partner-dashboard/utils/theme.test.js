import test from "node:test";
import assert from "node:assert/strict";

import {
  applyPartnerDocumentTheme,
  getInitialPartnerDarkMode,
  persistPartnerTheme,
  subscribeToPartnerSystemTheme,
} from "./theme.js";

const makeWindow = ({ storedTheme = null, systemDark = false } = {}) => {
  const values = new Map();
  if (storedTheme) values.set("dieudonne-theme", storedTheme);

  const listeners = new Set();
  const mediaQuery = {
    matches: systemDark,
    addEventListener: (_, listener) => listeners.add(listener),
    removeEventListener: (_, listener) => listeners.delete(listener),
  };

  return {
    localStorage: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    },
    matchMedia: () => mediaQuery,
    emitSystemTheme: (matches) => {
      mediaQuery.matches = matches;
      listeners.forEach((listener) => listener({ matches }));
    },
  };
};

test("uses a saved preference before the system preference", () => {
  assert.equal(
    getInitialPartnerDarkMode(makeWindow({ storedTheme: "light", systemDark: true })),
    false
  );
  assert.equal(
    getInitialPartnerDarkMode(makeWindow({ storedTheme: "dark", systemDark: false })),
    true
  );
});

test("uses and follows the system preference until a choice is saved", () => {
  const targetWindow = makeWindow({ systemDark: false });
  const changes = [];
  const unsubscribe = subscribeToPartnerSystemTheme(
    (darkMode) => changes.push(darkMode),
    targetWindow
  );

  assert.equal(getInitialPartnerDarkMode(targetWindow), false);
  targetWindow.emitSystemTheme(true);
  assert.deepEqual(changes, [true]);

  persistPartnerTheme(false, targetWindow);
  targetWindow.emitSystemTheme(false);
  assert.deepEqual(changes, [true]);
  unsubscribe();
});

test("applies the resolved appearance before React renders", () => {
  const documentElement = { dataset: {}, style: {} };
  applyPartnerDocumentTheme(true, { documentElement });

  assert.equal(documentElement.dataset.theme, "dark");
  assert.equal(documentElement.style.colorScheme, "dark");
});
