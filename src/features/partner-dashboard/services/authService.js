const USERS_KEY = "dph_users_v1";
const SESSION_KEY = "dph_session_v2";
const LEGACY_SESSION_KEY = "dph_session_v1";
const GOOGLE_SCRIPT_ID = "google-identity-services";

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

const textEncoder = new TextEncoder();

const normalizeEmail = (email) => email.trim().toLowerCase();

const isBrowser = () => typeof window !== "undefined";

const isSupabaseAuthEnabled = () => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const toHex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const randomHex = (length = 16) => {
  const bytes = new Uint8Array(length);
  window.crypto.getRandomValues(bytes);
  return toHex(bytes);
};

const sha256 = async (value) => {
  const hash = await window.crypto.subtle.digest("SHA-256", textEncoder.encode(value));
  return toHex(hash);
};

const hashPassword = async (password, salt) => sha256(`${salt}:${password}`);

const readUsers = () => {
  try {
    return JSON.parse(window.localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
};

const writeUsers = (users) => {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const createSessionUser = (user) => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  provider: user.provider,
});

const normalizeStoredSession = (value) => {
  if (!value) return null;

  // New session shape.
  if (value.user?.uid && value.mode) {
    return value;
  }

  // Legacy shape where session is only the user object.
  if (value.uid) {
    return {
      mode: "local",
      user: {
        uid: value.uid,
        email: value.email,
        displayName: value.displayName,
        provider: value.provider || "password",
      },
      accessToken: null,
      refreshToken: null,
    };
  }

  return null;
};

const readSession = () => {
  if (!isBrowser()) return null;

  try {
    const currentRaw = window.localStorage.getItem(SESSION_KEY);
    const parsed = normalizeStoredSession(currentRaw ? JSON.parse(currentRaw) : null);
    if (parsed) return parsed;
  } catch {
    // ignore parse errors
  }

  // Legacy fallback
  try {
    const legacyRaw = window.localStorage.getItem(LEGACY_SESSION_KEY);
    const parsedLegacy = normalizeStoredSession(legacyRaw ? JSON.parse(legacyRaw) : null);
    if (parsedLegacy) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(parsedLegacy));
      window.localStorage.removeItem(LEGACY_SESSION_KEY);
      return parsedLegacy;
    }
  } catch {
    // ignore parse errors
  }

  return null;
};

const clearStoredSessionOnly = () => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem(LEGACY_SESSION_KEY);
};

const writeSession = ({ mode, user, accessToken = null, refreshToken = null }) => {
  if (!isBrowser()) return;
  const payload = {
    mode,
    user,
    accessToken,
    refreshToken,
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  window.localStorage.removeItem(LEGACY_SESSION_KEY);
};

const supabaseAuthRequest = async (path, { method = "GET", body, accessToken } = {}) => {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    method,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
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
      payload?.error_description ||
      payload?.msg ||
      payload?.error ||
      `Supabase request failed (${response.status})`;
    throw new Error(detail);
  }

  return payload;
};

const mapSupabaseUser = (user, fallbackProvider = "password") => ({
  uid: user?.id || user?.sub,
  email: user?.email || "",
  displayName:
    user?.user_metadata?.display_name ||
    user?.user_metadata?.full_name ||
    user?.identities?.[0]?.identity_data?.full_name ||
    "Partner Learner",
  provider:
    user?.app_metadata?.provider ||
    user?.identities?.[0]?.provider ||
    fallbackProvider,
});

const persistSupabaseSession = ({ accessToken, refreshToken, user, fallbackProvider }) => {
  const sessionUser = mapSupabaseUser(user, fallbackProvider);
  writeSession({
    mode: "supabase",
    user: sessionUser,
    accessToken: accessToken || null,
    refreshToken: refreshToken || null,
  });
  return sessionUser;
};

const parseHashParams = () => {
  if (!isBrowser()) return new URLSearchParams();
  const hash = window.location.hash?.replace(/^#/, "") || "";
  return new URLSearchParams(hash);
};

const clearAuthHash = () => {
  if (!isBrowser()) return;
  if (!window.location.hash) return;
  window.history.replaceState({}, "", `${window.location.pathname}${window.location.search}`);
};

export const hydrateSessionFromUrl = async () => {
  if (!isSupabaseAuthEnabled() || !isBrowser()) return null;

  const params = parseHashParams();
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  if (!accessToken) return null;

  const user = await supabaseAuthRequest("user", { accessToken });
  const sessionUser = persistSupabaseSession({
    accessToken,
    refreshToken,
    user,
    fallbackProvider: "google",
  });
  clearAuthHash();
  return sessionUser;
};

export const getCurrentSession = () => {
  const session = readSession();
  return session?.user || null;
};

export const getCurrentAccessToken = () => {
  const session = readSession();
  return session?.accessToken || null;
};

export const clearSession = async () => {
  const session = readSession();
  if (isSupabaseAuthEnabled() && session?.mode === "supabase" && session.accessToken) {
    try {
      await supabaseAuthRequest("logout", {
        method: "POST",
        accessToken: session.accessToken,
      });
    } catch {
      // Best-effort sign out.
    }
  }

  clearStoredSessionOnly();
};

export const validateSupabaseSession = async () => {
  const session = readSession();
  if (!session) return null;
  if (!isSupabaseAuthEnabled() || session.mode !== "supabase") {
    return session.user;
  }

  if (!session.accessToken) {
    clearStoredSessionOnly();
    return null;
  }

  try {
    const user = await supabaseAuthRequest("user", {
      accessToken: session.accessToken,
    });
    return persistSupabaseSession({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      user,
      fallbackProvider: "password",
    });
  } catch {
    if (!session.refreshToken) {
      clearStoredSessionOnly();
      return null;
    }

    try {
      const refreshed = await supabaseAuthRequest("token?grant_type=refresh_token", {
        method: "POST",
        body: { refresh_token: session.refreshToken },
      });

      return persistSupabaseSession({
        accessToken: refreshed.access_token,
        refreshToken: refreshed.refresh_token,
        user: refreshed.user,
        fallbackProvider: "password",
      });
    } catch {
      clearStoredSessionOnly();
      return null;
    }
  }
};

const registerWithEmailLocal = async ({ displayName, email, password }) => {
  const normalizedEmail = normalizeEmail(email);
  const users = readUsers();

  if (users[normalizedEmail]) {
    throw new Error("An account already exists with this email.");
  }

  const salt = randomHex(16);
  const passwordHash = await hashPassword(password, salt);
  const uid = window.crypto.randomUUID();

  const user = {
    uid,
    email: normalizedEmail,
    displayName: displayName?.trim() || "Partner Learner",
    provider: "password",
    passwordHash,
    salt,
    createdAt: new Date().toISOString(),
    reset: null,
  };

  users[normalizedEmail] = user;
  writeUsers(users);

  const sessionUser = createSessionUser(user);
  writeSession({ mode: "local", user: sessionUser });
  return sessionUser;
};

const loginWithEmailLocal = async ({ email, password }) => {
  const normalizedEmail = normalizeEmail(email);
  const users = readUsers();
  const user = users[normalizedEmail];

  if (!user || user.provider !== "password") {
    throw new Error("Invalid email or password.");
  }

  const attemptedHash = await hashPassword(password, user.salt);
  if (attemptedHash !== user.passwordHash) {
    throw new Error("Invalid email or password.");
  }

  const sessionUser = createSessionUser(user);
  writeSession({ mode: "local", user: sessionUser });
  return sessionUser;
};

export const registerWithEmail = async ({ displayName, email, password }) => {
  if (!isSupabaseAuthEnabled()) {
    return registerWithEmailLocal({ displayName, email, password });
  }

  const normalizedEmail = normalizeEmail(email);
  const signup = await supabaseAuthRequest("signup", {
    method: "POST",
    body: {
      email: normalizedEmail,
      password,
      data: {
        display_name: displayName?.trim() || "Partner Learner",
      },
    },
  });

  // If email confirmation is disabled, signup may already include session.
  if (signup?.session?.access_token && signup?.user) {
    return persistSupabaseSession({
      accessToken: signup.session.access_token,
      refreshToken: signup.session.refresh_token,
      user: signup.user,
      fallbackProvider: "password",
    });
  }

  // Attempt immediate sign-in for projects with confirm email disabled but no session returned.
  try {
    const tokenPayload = await supabaseAuthRequest("token?grant_type=password", {
      method: "POST",
      body: { email: normalizedEmail, password },
    });
    return persistSupabaseSession({
      accessToken: tokenPayload.access_token,
      refreshToken: tokenPayload.refresh_token,
      user: tokenPayload.user,
      fallbackProvider: "password",
    });
  } catch {
    throw new Error(
      "Account created. Check your email to confirm your account, then sign in."
    );
  }
};

export const loginWithEmail = async ({ email, password }) => {
  if (!isSupabaseAuthEnabled()) {
    return loginWithEmailLocal({ email, password });
  }

  const normalizedEmail = normalizeEmail(email);
  const tokenPayload = await supabaseAuthRequest("token?grant_type=password", {
    method: "POST",
    body: { email: normalizedEmail, password },
  });

  return persistSupabaseSession({
    accessToken: tokenPayload.access_token,
    refreshToken: tokenPayload.refresh_token,
    user: tokenPayload.user,
    fallbackProvider: "password",
  });
};

export const requestPasswordReset = async (email) => {
  if (!isSupabaseAuthEnabled()) {
    const normalizedEmail = normalizeEmail(email);
    const users = readUsers();
    const user = users[normalizedEmail];

    if (!user || user.provider !== "password") {
      throw new Error("No email/password account found for this address.");
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    user.reset = {
      code,
      expiresAt: Date.now() + 15 * 60 * 1000,
    };
    users[normalizedEmail] = user;
    writeUsers(users);
    return { code };
  }

  const normalizedEmail = normalizeEmail(email);
  const redirectTo = `${window.location.origin}/partner-dashboard`;
  await supabaseAuthRequest("recover", {
    method: "POST",
    body: { email: normalizedEmail, redirect_to: redirectTo },
  });
  return { code: null };
};

export const confirmPasswordReset = async ({ email, code, newPassword }) => {
  if (!isSupabaseAuthEnabled()) {
    const normalizedEmail = normalizeEmail(email);
    const users = readUsers();
    const user = users[normalizedEmail];

    if (!user || !user.reset) {
      throw new Error("Reset request not found.");
    }

    if (Date.now() > user.reset.expiresAt) {
      throw new Error("Reset code expired. Request a new one.");
    }

    if (String(code).trim() !== String(user.reset.code)) {
      throw new Error("Invalid reset code.");
    }

    user.passwordHash = await hashPassword(newPassword, user.salt);
    user.reset = null;
    users[normalizedEmail] = user;
    writeUsers(users);

    const sessionUser = createSessionUser(user);
    writeSession({ mode: "local", user: sessionUser });
    return sessionUser;
  }

  throw new Error(
    "Password reset is handled via the secure email link. Use the link sent to your inbox."
  );
};

const loadGoogleScript = () => {
  if (window.google?.accounts?.oauth2) {
    return Promise.resolve();
  }

  const existing = document.getElementById(GOOGLE_SCRIPT_ID);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Google OAuth script.")),
        { once: true }
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google OAuth script."));
    document.head.appendChild(script);
  });
};

const upsertGoogleUserLocal = (profile) => {
  const users = readUsers();
  const normalizedEmail = normalizeEmail(profile.email);
  const existing = users[normalizedEmail];

  if (existing) {
    existing.displayName = profile.name || existing.displayName;
    existing.provider = "google";
    users[normalizedEmail] = existing;
    writeUsers(users);
    return existing;
  }

  const user = {
    uid: profile.sub || window.crypto.randomUUID(),
    email: normalizedEmail,
    displayName: profile.name || "Google Partner Learner",
    provider: "google",
    createdAt: new Date().toISOString(),
    reset: null,
  };

  users[normalizedEmail] = user;
  writeUsers(users);
  return user;
};

export const loginWithGoogle = async () => {
  if (isSupabaseAuthEnabled()) {
    const redirectTo = `${window.location.origin}/partner-dashboard`;
    const authorizeUrl = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(
      redirectTo
    )}`;
    window.location.assign(authorizeUrl);
    return new Promise(() => {});
  }

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error(
      "Google sign-in is not configured. Set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY (recommended) or set VITE_GOOGLE_CLIENT_ID for local-only OAuth."
    );
  }

  await loadGoogleScript();

  const token = await new Promise((resolve, reject) => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "openid email profile",
      callback: (response) => {
        if (response.error) {
          reject(new Error(response.error));
          return;
        }
        resolve(response.access_token);
      },
    });

    tokenClient.requestAccessToken({ prompt: "consent" });
  });

  const userInfoResponse = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!userInfoResponse.ok) {
    throw new Error("Unable to retrieve Google profile.");
  }

  const googleProfile = await userInfoResponse.json();
  const user = upsertGoogleUserLocal(googleProfile);
  const sessionUser = createSessionUser(user);
  writeSession({ mode: "local", user: sessionUser });
  return sessionUser;
};

export const isGoogleLoginConfigured = () => {
  if (isSupabaseAuthEnabled()) return true;
  const clientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim();
  return Boolean(clientId);
};

export { isSupabaseAuthEnabled };
