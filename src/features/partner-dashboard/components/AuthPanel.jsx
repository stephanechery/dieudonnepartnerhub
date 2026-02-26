import React, { useState } from "react";
import { KeyRound, Mail, ShieldCheck } from "lucide-react";
import { usePartnerDashboard } from "../state/PartnerDashboardContext";
import { isGoogleLoginConfigured, isSupabaseAuthEnabled } from "../services/authService";

const initialLogin = { email: "", password: "" };
const initialRegister = { displayName: "", email: "", password: "", confirmPassword: "" };

export default function AuthPanel({ darkMode = false, translateText = (value) => value }) {
  const tx = (value) => translateText(value);
  const managedAuthMode = isSupabaseAuthEnabled();
  const googleLoginConfigured = isGoogleLoginConfigured();
  const { login, register, loginGoogle, requestReset, confirmReset } =
    usePartnerDashboard();
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [registerForm, setRegisterForm] = useState(initialRegister);
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [pendingResetCode, setPendingResetCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const labelClass = `block text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`;
  const inputClass = `mt-1 w-full rounded-xl border px-3 py-2 ${darkMode ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500" : "border-slate-300"}`;
  const primaryBtnClass = `rounded-xl px-4 py-2 text-sm font-bold text-white transition ${
    darkMode
      ? "bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400"
      : "bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-700"
  }`;
  const secondaryBtnClass = `rounded-xl border px-4 py-2 text-sm font-bold ${darkMode ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800" : "border-slate-300 text-slate-700 hover:bg-slate-100"}`;

  const run = async (action) => {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await action();
    } catch (err) {
      setError(err.message || tx("Authentication failed."));
    } finally {
      setLoading(false);
    }
  };

  const onLogin = (event) => {
    event.preventDefault();
    run(() => login(loginForm));
  };

  const onRegister = (event) => {
    event.preventDefault();

    if (registerForm.password !== registerForm.confirmPassword) {
      setError(tx("Passwords do not match."));
      return;
    }

    run(() => register(registerForm));
  };

  const onRequestReset = (event) => {
    event.preventDefault();
    run(async () => {
      const response = await requestReset(resetEmail);
      if (response?.code) {
        setPendingResetCode(response.code);
        setMessage(`${tx("Reset code generated")}: ${response.code}. ${tx("In production this code should be emailed securely.")}`);
        return;
      }
      setMessage(tx("Password reset email sent. Use the secure link in your inbox to continue."));
    });
  };

  const onConfirmReset = (event) => {
    event.preventDefault();
    run(async () => {
      await confirmReset({
        email: resetEmail,
        code: resetCode,
        newPassword: resetPassword,
      });
      setMessage(tx("Password reset successful. You are now signed in."));
    });
  };

  return (
    <div className={`mx-auto w-full max-w-3xl rounded-[2rem] border p-6 md:p-8 ${darkMode ? "border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 shadow-xl" : "border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm"}`}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx("Partner Education Dashboard")}</h1>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            {tx("Secure sign-in to track module progress, quiz scores, and lesson completion.")}
          </p>
        </div>
        <div className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ${darkMode ? "border-emerald-900/50 bg-emerald-900/30 text-emerald-300" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
          <ShieldCheck className="h-4 w-4" /> {tx("User Scoped")}
        </div>
      </div>

      <div className={`mb-6 grid grid-cols-3 gap-2 rounded-2xl p-1 ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}>
        {[
          ["login", tx("Log In")],
          ["register", tx("Register")],
          ["reset", tx("Reset")],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
              mode === value
                ? darkMode
                  ? "bg-slate-700 text-slate-100 shadow-sm"
                  : "bg-white text-slate-900 shadow-sm"
                : darkMode
                  ? "text-slate-400"
                  : "text-slate-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && <p className={`mb-4 rounded-xl border px-3 py-2 text-sm ${darkMode ? "border-rose-900/50 bg-rose-950/30 text-rose-200" : "border-rose-200 bg-rose-50 text-rose-700"}`}>{error}</p>}
      {message && <p className={`mb-4 rounded-xl border px-3 py-2 text-sm ${darkMode ? "border-emerald-900/50 bg-emerald-950/30 text-emerald-200" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{message}</p>}

      {mode === "login" && (
        <form className="space-y-4" onSubmit={onLogin}>
          <label className={labelClass}>
            {tx("Email")}
            <input
              className={inputClass}
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </label>
          <label className={labelClass}>
            {tx("Password")}
            <input
              className={inputClass}
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
              required
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className={primaryBtnClass}
              disabled={loading}
            >
              {loading ? tx("Signing in...") : tx("Log In")}
            </button>
            <button
              type="button"
              className={secondaryBtnClass}
              disabled={loading || !googleLoginConfigured}
              onClick={() => run(() => loginGoogle())}
              title={
                googleLoginConfigured
                  ? tx("Continue with Google")
                  : tx("Configure Google login first")
              }
            >
              {tx("Continue with Google")}
            </button>
          </div>
          {!googleLoginConfigured && (
            <p className={`text-xs ${darkMode ? "text-amber-300" : "text-amber-700"}`}>
              {tx(
                "Google login not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (recommended) or VITE_GOOGLE_CLIENT_ID in .env.local."
              )}
            </p>
          )}
        </form>
      )}

      {mode === "register" && (
        <form className="space-y-4" onSubmit={onRegister}>
          <label className={labelClass}>
            {tx("Name")}
            <input
              className={inputClass}
              value={registerForm.displayName}
              onChange={(e) => setRegisterForm((prev) => ({ ...prev, displayName: e.target.value }))}
              required
            />
          </label>
          <label className={labelClass}>
            {tx("Email")}
            <input
              className={inputClass}
              type="email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </label>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className={labelClass}>
              {tx("Password")}
              <input
                className={inputClass}
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
                minLength={8}
                required
              />
            </label>
            <label className={labelClass}>
              {tx("Confirm Password")}
              <input
                className={inputClass}
                type="password"
                value={registerForm.confirmPassword}
                onChange={(e) =>
                  setRegisterForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                }
                minLength={8}
                required
              />
            </label>
          </div>
          <button
            type="submit"
            className={primaryBtnClass}
            disabled={loading}
          >
            {loading ? tx("Creating account...") : tx("Create Account")}
          </button>
        </form>
      )}

      {mode === "reset" &&
        (managedAuthMode ? (
          <form className="space-y-4" onSubmit={onRequestReset}>
            <h3 className={`flex items-center gap-2 text-sm font-black uppercase ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
              <Mail className="h-4 w-4" /> {tx("Request Password Reset Email")}
            </h3>
            <label className={labelClass}>
              {tx("Email")}
              <input
                className={inputClass}
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </label>
            <p className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-600"}`}>
              {tx("A secure reset link will be sent to this email address.")}
            </p>
            <button
              type="submit"
              className={primaryBtnClass}
              disabled={loading}
            >
              {tx("Send Reset Email")}
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <form className="space-y-4" onSubmit={onRequestReset}>
              <h3 className={`flex items-center gap-2 text-sm font-black uppercase ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                <Mail className="h-4 w-4" /> {tx("Request Reset Code")}
              </h3>
              <label className={labelClass}>
                {tx("Email")}
                <input
                  className={inputClass}
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </label>
              <button
                type="submit"
                className={primaryBtnClass}
                disabled={loading}
              >
                {tx("Generate Code")}
              </button>
            </form>

            <form className="space-y-4" onSubmit={onConfirmReset}>
              <h3 className={`flex items-center gap-2 text-sm font-black uppercase ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                <KeyRound className="h-4 w-4" /> {tx("Complete Reset")}
              </h3>
              <label className={labelClass}>
                {tx("Reset Code")}
                <input
                  className={inputClass}
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder={pendingResetCode ? `${tx("Try")} ${pendingResetCode}` : tx("Enter code")}
                  required
                />
              </label>
              <label className={labelClass}>
                {tx("New Password")}
                <input
                  className={inputClass}
                  type="password"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </label>
              <button
                type="submit"
                className={primaryBtnClass}
                disabled={loading}
              >
                {tx("Reset Password")}
              </button>
            </form>
          </div>
        ))}
    </div>
  );
}
