import { moduleOrder, partnerCurriculum } from "../data/curriculum";
import { getCurrentAccessToken, isSupabaseAuthEnabled } from "./authService";

const PROFILES_KEY = "dph_profiles_v1";
const PASSING_SCORE = 70;
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();
const SUPABASE_PROFILES_TABLE =
  (import.meta.env.VITE_SUPABASE_PROFILES_TABLE || "partner_profiles").trim();

const readProfiles = () => {
  try {
    return JSON.parse(window.localStorage.getItem(PROFILES_KEY) || "{}");
  } catch {
    return {};
  }
};

const writeProfiles = (profiles) => {
  window.localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
};

const createEmptyModules = () =>
  moduleOrder.reduce((acc, moduleId) => {
    acc[moduleId] = {
      completedLessons: [],
      quizScores: {},
      quizResponses: {},
      scenarioResponses: {},
    };
    return acc;
  }, {});

const extendProfileModules = (profile) => {
  if (!profile.modules) {
    profile.modules = {};
  }

  for (const module of partnerCurriculum.modules) {
    const existingModule = profile.modules[module.id] || {};
    const quizScores = existingModule.quizScores || {};
    const completedLessons = new Set(existingModule.completedLessons || []);

    Object.entries(quizScores).forEach(([lessonId, score]) => {
      if (typeof score === "number" && score >= PASSING_SCORE) {
        completedLessons.add(lessonId);
      }
    });

    profile.modules[module.id] = {
      completedLessons: Array.from(completedLessons),
      quizScores,
      quizResponses: existingModule.quizResponses || {},
      scenarioResponses: existingModule.scenarioResponses || {},
    };
  }
  return profile;
};

const createBaseProfile = (sessionUser) => ({
  uid: sessionUser.uid,
  email: sessionUser.email,
  displayName: sessionUser.displayName,
  provider: sessionUser.provider,
  createdAt: new Date().toISOString(),
  lastActiveAt: new Date().toISOString(),
  modules: createEmptyModules(),
  recentlyCompleted: [],
});

const cacheProfile = (profile) => {
  const profiles = readProfiles();
  profiles[profile.uid] = profile;
  writeProfiles(profiles);
  return profiles[profile.uid];
};

const getLocalProfile = (uid) => {
  const profiles = readProfiles();
  return profiles[uid] || null;
};

const shouldUseSupabaseProfiles = (sessionUser) =>
  isSupabaseAuthEnabled() &&
  sessionUser?.provider !== "test-mode" &&
  Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const encodeFilterValue = (value) =>
  encodeURIComponent(String(value).replace(/,/g, "\\,"));

const supabaseRestRequest = async (
  path,
  { method = "GET", body, prefer, accessToken } = {}
) => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const detail =
      payload?.message ||
      payload?.hint ||
      `Supabase profile request failed (${response.status})`;
    throw new Error(detail);
  }

  return payload;
};

const rowToProfile = (row, sessionUser) => {
  const fromRow = row?.profile_data || {};
  const profile = {
    ...createBaseProfile(sessionUser),
    ...fromRow,
    uid: sessionUser.uid,
    email: sessionUser.email,
    displayName: fromRow.displayName || sessionUser.displayName,
    provider: sessionUser.provider,
    createdAt: row?.created_at || fromRow.createdAt || new Date().toISOString(),
    lastActiveAt:
      row?.last_active_at || fromRow.lastActiveAt || new Date().toISOString(),
  };
  return extendProfileModules(profile);
};

const profileToRow = (profile) => ({
  uid: profile.uid,
  email: profile.email,
  display_name: profile.displayName,
  provider: profile.provider,
  profile_data: profile,
  last_active_at: new Date().toISOString(),
});

const ensureUserProfileLocal = (sessionUser) => {
  const existing = getLocalProfile(sessionUser.uid);
  if (existing) {
    const normalized = extendProfileModules({
      ...existing,
      lastActiveAt: new Date().toISOString(),
    });
    cacheProfile(normalized);
    return normalized;
  }

  const profile = createBaseProfile(sessionUser);
  return cacheProfile(profile);
};

export const ensureUserProfile = async (sessionUser) => {
  if (!shouldUseSupabaseProfiles(sessionUser)) {
    return ensureUserProfileLocal(sessionUser);
  }

  const accessToken = getCurrentAccessToken();
  if (!accessToken) {
    return ensureUserProfileLocal(sessionUser);
  }

  const filter = encodeFilterValue(sessionUser.uid);

  try {
    const rows = await supabaseRestRequest(
      `${SUPABASE_PROFILES_TABLE}?uid=eq.${filter}&select=*`,
      { accessToken }
    );

    if (Array.isArray(rows) && rows.length) {
      const profile = rowToProfile(rows[0], sessionUser);
      cacheProfile(profile);
      return profile;
    }

    const created = extendProfileModules(createBaseProfile(sessionUser));
    const inserted = await supabaseRestRequest(
      `${SUPABASE_PROFILES_TABLE}?on_conflict=uid`,
      {
        method: "POST",
        body: [profileToRow(created)],
        prefer: "resolution=merge-duplicates,return=representation",
        accessToken,
      }
    );

    const nextProfile = rowToProfile(inserted?.[0] || profileToRow(created), sessionUser);
    cacheProfile(nextProfile);
    return nextProfile;
  } catch {
    // Fallback to local cache if remote is temporarily unavailable.
    return ensureUserProfileLocal(sessionUser);
  }
};

export const saveProfile = async (profile) => {
  const nextProfile = {
    ...profile,
    lastActiveAt: new Date().toISOString(),
  };

  cacheProfile(nextProfile);

  if (!shouldUseSupabaseProfiles(nextProfile)) {
    return nextProfile;
  }

  const accessToken = getCurrentAccessToken();
  if (!accessToken) {
    return nextProfile;
  }

  try {
    const rows = await supabaseRestRequest(
      `${SUPABASE_PROFILES_TABLE}?on_conflict=uid`,
      {
        method: "POST",
        body: [profileToRow(nextProfile)],
        prefer: "resolution=merge-duplicates,return=representation",
        accessToken,
      }
    );

    if (Array.isArray(rows) && rows[0]) {
      const persisted = rowToProfile(rows[0], nextProfile);
      cacheProfile(persisted);
      return persisted;
    }
  } catch {
    // Keep optimistic local cache if remote update fails.
  }

  return nextProfile;
};

export const getProfile = (uid) => getLocalProfile(uid);
