import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpenCheck,
  CalendarDays,
  Eye,
  Filter,
  Lightbulb,
  LineChart,
  Lock,
  Moon,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sun,
  Users,
  Video,
} from "lucide-react";
import dieudonneDarkLogo from "../../assets/Dieudonne_Dark_Logo.png";
import AuthPanel from "../partner-dashboard/components/AuthPanel";
import { PartnerDashboardProvider, usePartnerDashboard } from "../partner-dashboard/state/PartnerDashboardContext";
import { getAdminDashboardData, isAdminUser } from "../partner-dashboard/services/analyticsService";

const formatNumber = (value) => new Intl.NumberFormat().format(value || 0);

const maxValue = (rows, key) => Math.max(1, ...rows.map((row) => row[key] || 0));

function KpiTile({ icon: Icon, label, value, detail, tone = "cyan", darkMode = true }) {
  const toneClass = {
    cyan: darkMode ? "text-cyan-200 border-cyan-300/20 bg-cyan-300/10" : "text-cyan-700 border-cyan-200 bg-cyan-50",
    emerald: darkMode ? "text-emerald-200 border-emerald-300/20 bg-emerald-300/10" : "text-emerald-700 border-emerald-200 bg-emerald-50",
    violet: darkMode ? "text-violet-200 border-violet-300/20 bg-violet-300/10" : "text-violet-700 border-violet-200 bg-violet-50",
    rose: darkMode ? "text-rose-200 border-rose-300/20 bg-rose-300/10" : "text-rose-700 border-rose-200 bg-rose-50",
  }[tone];

  return (
    <article className={`rounded-2xl border p-4 transition hover:-translate-y-0.5 ${
      darkMode
        ? "border-white/10 bg-white/[0.045] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:bg-white/[0.065]"
        : "border-slate-200 bg-white shadow-sm hover:border-cyan-200"
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-[11px] font-black uppercase tracking-[0.16em] ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
            {label}
          </p>
          <p className={`mt-2 text-2xl font-black tracking-tight ${darkMode ? "text-white" : "text-slate-950"}`}>{value}</p>
        </div>
        <span className={`rounded-2xl border p-2.5 ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className={`mt-3 min-h-10 text-xs font-semibold leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{detail}</p>
    </article>
  );
}

function SectionPanel({ title, eyebrow, children, className = "", darkMode = true }) {
  return (
    <section className={`rounded-[1.6rem] border p-4 ${
      darkMode ? "border-white/10 bg-slate-900/72 shadow-xl shadow-black/15" : "border-slate-200 bg-white shadow-sm"
    } ${className}`}>
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>{eyebrow}</p>
          <h2 className={`mt-1 text-lg font-black tracking-tight ${darkMode ? "text-white" : "text-slate-950"}`}>{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

function ProgressRow({ label, detail, value, darkMode = true }) {
  return (
    <div className={`rounded-2xl border p-3 ${darkMode ? "border-white/10 bg-white/[0.035]" : "border-slate-200 bg-slate-50"}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className={`truncate text-sm font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{label}</p>
          <p className="mt-0.5 truncate text-xs font-semibold text-slate-500">{detail}</p>
        </div>
        <span className={`text-sm font-black ${darkMode ? "text-cyan-200" : "text-cyan-700"}`}>{value}%</span>
      </div>
      <div className={`mt-3 h-2 rounded-full ${darkMode ? "bg-slate-800" : "bg-slate-200"}`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-300"
          style={{ width: `${Math.max(4, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

function TrendChart({ rows, darkMode = true }) {
  const lessonsMax = maxValue(rows, "lessons");
  const videosMax = maxValue(rows, "videos");
  const guidesMax = maxValue(rows, "guides");

  return (
    <div className={`grid h-64 grid-cols-7 items-end gap-2 rounded-2xl border p-4 ${darkMode ? "border-white/10 bg-slate-950/70" : "border-slate-200 bg-slate-50"}`}>
      {rows.map((row) => (
        <div key={row.key} className="flex h-full min-w-0 flex-col justify-end gap-2">
          <div className="flex flex-1 items-end justify-center gap-1">
            <span
              className="w-2 rounded-t-full bg-cyan-300"
              style={{ height: `${Math.max(7, (row.lessons / lessonsMax) * 100)}%` }}
              title={`${row.lessons} lesson events`}
            />
            <span
              className="w-2 rounded-t-full bg-violet-300"
              style={{ height: `${Math.max(7, (row.videos / videosMax) * 100)}%` }}
              title={`${row.videos} video views`}
            />
            <span
              className="w-2 rounded-t-full bg-emerald-300"
              style={{ height: `${Math.max(7, (row.guides / guidesMax) * 100)}%` }}
              title={`${row.guides} guide opens`}
            />
          </div>
          <p className="truncate text-center text-[10px] font-black uppercase text-slate-500">{row.label}</p>
        </div>
      ))}
    </div>
  );
}

function RankedList({ rows, emptyLabel, valueLabel = "signals", darkMode = true }) {
  if (!rows.length) {
    return (
      <div className={`rounded-2xl border border-dashed p-5 text-sm font-semibold text-slate-500 ${darkMode ? "border-white/10 bg-white/[0.025]" : "border-slate-300 bg-slate-50"}`}>
        {emptyLabel}
      </div>
    );
  }

  const max = Math.max(1, ...rows.map((row) => row.value || 0));

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div key={`${row.id}-${index}`} className={`rounded-2xl border p-3 ${darkMode ? "border-white/10 bg-white/[0.035]" : "border-slate-200 bg-slate-50"}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className={`truncate text-sm font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{row.label || row.lessonTitle}</p>
              <p className="mt-0.5 truncate text-xs font-semibold text-slate-500">
                {row.category || row.moduleTitle || valueLabel}
              </p>
            </div>
            <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${darkMode ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-100" : "border-cyan-200 bg-cyan-50 text-cyan-700"}`}>
              {formatNumber(row.value)}
            </span>
          </div>
          <div className={`mt-3 h-1.5 rounded-full ${darkMode ? "bg-slate-800" : "bg-slate-200"}`}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-300"
              style={{ width: `${Math.max(8, (row.value / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function AccessDenied({ authUser, onBack }) {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-2xl rounded-[1.8rem] border border-amber-300/20 bg-amber-300/10 p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <span className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-3 text-amber-100">
            <Lock className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-200">Admin access required</p>
            <h1 className="mt-2 text-2xl font-black text-white">This dashboard is restricted.</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Signed in as {authUser?.email || "an unknown user"}. Add this email to
              VITE_ADMIN_EMAILS, set the profile role to admin, or add the email to the local admin allowlist for development.
            </p>
            <button
              type="button"
              onClick={onBack}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-black text-white transition hover:bg-white/[0.1]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Partner Hub
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function AdminDashboardInner({ navigate }) {
  const { authUser, authLoading, profile, logout } = usePartnerDashboard();
  const [range, setRange] = useState("14d");
  const [query, setQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.localStorage.getItem("dieudonne-theme") !== "light";
  });

  const data = useMemo(() => getAdminDashboardData(), [refreshKey]);
  const allowed = isAdminUser(authUser, profile);

  useEffect(() => {
    window.localStorage.setItem("dieudonne-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const filteredVideos = data.mostUsedVideos.filter((video) =>
    `${video.label} ${video.category}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  if (authLoading) {
    return (
      <main className={`min-h-screen px-4 py-10 text-center ${darkMode ? "bg-slate-950 text-slate-300" : "bg-slate-50 text-slate-600"}`}>
        Loading admin dashboard...
      </main>
    );
  }

  if (!authUser) {
    return (
      <main className={`min-h-screen px-4 py-8 ${darkMode ? "bg-slate-950" : "bg-slate-50"}`}>
        <div className="mx-auto max-w-5xl">
          <AuthPanel darkMode={darkMode} />
        </div>
      </main>
    );
  }

  if (!allowed) {
    return <AccessDenied authUser={authUser} onBack={() => navigate("/partner-dashboard")} />;
  }

  return (
    <main className={`min-h-screen overflow-hidden ${darkMode ? "bg-[#050914] text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <div className={`pointer-events-none fixed inset-0 ${
        darkMode
          ? "bg-[radial-gradient(circle_at_16%_10%,rgba(34,211,238,0.13),transparent_30%),radial-gradient(circle_at_82%_4%,rgba(167,139,250,0.13),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.38),rgba(2,6,23,0.96))]"
          : "bg-[radial-gradient(circle_at_14%_8%,rgba(14,165,233,0.12),transparent_30%),radial-gradient(circle_at_82%_6%,rgba(99,102,241,0.09),transparent_28%),linear-gradient(180deg,rgba(248,250,252,0.92),rgba(241,245,249,0.98))]"
      }`} />
      <div className="relative mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
        <header className={`mb-5 rounded-[1.7rem] border p-4 backdrop-blur-xl ${
          darkMode ? "border-white/10 bg-slate-950/72 shadow-2xl shadow-black/25" : "border-slate-200 bg-white/88 shadow-sm"
        }`}>
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <img
                src={dieudonneDarkLogo}
                alt="Dieudonne logo"
                className={`h-12 w-auto rounded-xl border p-1 ${darkMode ? "border-white/10 bg-slate-950" : "border-slate-200 bg-slate-950"}`}
              />
              <div className="min-w-0">
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
                  Dieudonne Partner Hub
                </p>
                <h1 className={`mt-1 text-2xl font-black tracking-tight sm:text-3xl ${darkMode ? "text-white" : "text-slate-950"}`}>
                  Admin Dashboard
                </h1>
                <p className={`mt-1 max-w-3xl text-sm font-semibold leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Product signals for learning progress, guide usage, video interest, and content decisions.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className={`inline-flex rounded-2xl border p-1 ${darkMode ? "border-white/10 bg-white/[0.04]" : "border-slate-200 bg-slate-100"}`}>
                {["7d", "14d", "30d"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRange(item)}
                    className={`rounded-xl px-3 py-2 text-xs font-black uppercase tracking-wide transition ${
                      range === item
                        ? "bg-cyan-300 text-slate-950"
                        : darkMode
                          ? "text-slate-400 hover:text-white"
                          : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setDarkMode((current) => !current)}
                aria-pressed={darkMode}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2 text-sm font-black transition ${
                  darkMode
                    ? "border-white/10 bg-white/[0.04] text-amber-200 hover:bg-white/[0.08]"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
              <button
                type="button"
                onClick={() => setRefreshKey((value) => value + 1)}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2 text-sm font-black transition ${
                  darkMode ? "border-white/10 bg-white/[0.04] text-slate-100 hover:bg-white/[0.08]" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </button>
              <button
                type="button"
                onClick={() => navigate("/partner-dashboard")}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2 text-sm font-black transition ${
                  darkMode ? "border-white/10 bg-white/[0.04] text-slate-100 hover:bg-white/[0.08]" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                Partner Hub
              </button>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-500 px-4 py-2 text-sm font-black text-white transition hover:bg-rose-400"
              >
                Log out
              </button>
            </div>
          </div>
        </header>

        {data.usingMockData && (
          <div className="mb-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm font-semibold text-amber-100">
            <AlertTriangle className="mr-2 inline h-4 w-4" />
            Some analytics are using local mock data until enough real product events exist.
          </div>
        )}

        <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiTile
            icon={Users}
            label="Total users"
            value={formatNumber(data.totals.totalUsers)}
            detail={`${formatNumber(data.totals.activeUsers)} active in the current activity window.`}
            tone="cyan"
            darkMode={darkMode}
          />
          <KpiTile
            icon={BookOpenCheck}
            label="Lesson activity"
            value={formatNumber(data.totals.lessonStarts)}
            detail={`${formatNumber(data.totals.lessonCompletions)} completions and ${formatNumber(data.totals.quizCompletions)} quiz submissions.`}
            tone="emerald"
            darkMode={darkMode}
          />
          <KpiTile
            icon={ShieldCheck}
            label="Guide opens"
            value={formatNumber(data.totals.guideOpens)}
            detail="Guide usage helps decide which companion tools should move into the main path."
            tone="violet"
            darkMode={darkMode}
          />
          <KpiTile
            icon={Video}
            label="Video hub"
            value={formatNumber(data.totals.videoViews)}
            detail={`${formatNumber(data.totals.savedVideos)} saves and ${formatNumber(data.totals.watchLaterAdds)} watch-later adds.`}
            tone="rose"
            darkMode={darkMode}
          />
        </section>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.25fr_0.75fr]">
          <SectionPanel title="Recent Activity Trends" eyebrow="Activity" darkMode={darkMode}>
            <div className="mb-3 flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-wide text-slate-500">
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-cyan-300" /> Lessons</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-violet-300" /> Videos</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-300" /> Guides</span>
            </div>
            <TrendChart rows={data.trends} darkMode={darkMode} />
          </SectionPanel>

          <SectionPanel title="What To Improve Next" eyebrow="Insights" darkMode={darkMode}>
            <div className="space-y-3">
              {data.insights.map((insight) => (
                <article key={insight.title} className={`rounded-2xl border p-4 ${darkMode ? "border-white/10 bg-white/[0.04]" : "border-slate-200 bg-slate-50"}`}>
                  <p className={`flex items-center gap-2 text-sm font-black ${darkMode ? "text-white" : "text-slate-900"}`}>
                    <Lightbulb className="h-4 w-4 text-amber-200" />
                    {insight.title}
                  </p>
                  <p className={`mt-2 text-xs font-semibold leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{insight.signal}</p>
                  <p className={`mt-3 rounded-xl border p-3 text-xs font-bold leading-relaxed ${darkMode ? "border-cyan-300/15 bg-cyan-300/10 text-cyan-100" : "border-cyan-200 bg-cyan-50 text-cyan-800"}`}>
                    {insight.action}
                  </p>
                </article>
              ))}
            </div>
          </SectionPanel>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
          <SectionPanel title="Module Progress" eyebrow="Learning" className="xl:col-span-2" darkMode={darkMode}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {data.moduleProgress.map((module) => (
                <ProgressRow
                  key={module.id}
                  label={module.title}
                  detail={module.subtitle}
                  value={module.completion}
                  darkMode={darkMode}
                />
              ))}
            </div>
          </SectionPanel>

          <SectionPanel title="Common Resume Points" eyebrow="Return behavior" darkMode={darkMode}>
            <RankedList rows={data.resumePoints} emptyLabel="No resume point signal yet." valueLabel="users" darkMode={darkMode} />
          </SectionPanel>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
          <SectionPanel title="Most-Used Guides" eyebrow="Interactive guides" darkMode={darkMode}>
            <RankedList rows={data.guideUsage.slice(0, 6)} emptyLabel="No guide opens tracked yet." valueLabel="opens" darkMode={darkMode} />
          </SectionPanel>

          <SectionPanel title="Topic Interest" eyebrow="Video hub" darkMode={darkMode}>
            <RankedList rows={data.topicInterest.slice(0, 6)} emptyLabel="No video topic signal yet." valueLabel="signals" darkMode={darkMode} />
          </SectionPanel>

          <SectionPanel title="Drop-Off Areas" eyebrow="Content risk" darkMode={darkMode}>
            <RankedList rows={data.dropOffs} emptyLabel="No drop-off pattern detected yet." valueLabel="starts without completion" darkMode={darkMode} />
          </SectionPanel>
        </div>

        <SectionPanel title="Video Decision Table" eyebrow="Content library" className="mt-5" darkMode={darkMode}>
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <label className="relative block min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter videos or topics"
                className={`h-11 w-full rounded-2xl border pl-11 pr-4 text-sm font-bold outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 ${
                  darkMode ? "border-white/10 bg-white/[0.04] text-slate-100" : "border-slate-200 bg-slate-50 text-slate-900"
                }`}
              />
            </label>
            <div className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-black uppercase tracking-wide ${
              darkMode ? "border-white/10 bg-white/[0.04] text-slate-400" : "border-slate-200 bg-slate-50 text-slate-500"
            }`}>
              <Filter className="h-4 w-4" />
              Coarse learning signals only
            </div>
          </div>

          <div className={`overflow-hidden rounded-2xl border ${darkMode ? "border-white/10" : "border-slate-200"}`}>
            <div className={`grid grid-cols-[1.5fr_0.8fr_0.4fr] px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 ${
              darkMode ? "bg-white/[0.06]" : "bg-slate-50"
            }`}>
              <span>Video</span>
              <span>Topic</span>
              <span className="text-right">Signals</span>
            </div>
            {filteredVideos.length ? (
              filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className={`grid grid-cols-[1.5fr_0.8fr_0.4fr] items-center gap-3 border-t px-4 py-3 text-sm ${darkMode ? "border-white/10" : "border-slate-200"}`}
                >
                  <span className={`min-w-0 truncate font-black ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{video.label}</span>
                  <span className={`min-w-0 truncate font-semibold ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{video.category}</span>
                  <span className={`text-right font-black ${darkMode ? "text-cyan-100" : "text-cyan-700"}`}>{formatNumber(video.value)}</span>
                </div>
              ))
            ) : (
              <div className={`border-t px-4 py-8 text-center text-sm font-semibold text-slate-500 ${darkMode ? "border-white/10" : "border-slate-200"}`}>
                No videos match that filter.
              </div>
            )}
          </div>
        </SectionPanel>

        <footer className="flex flex-col gap-2 py-6 text-xs font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Last updated {new Date(data.lastUpdatedAt).toLocaleString()}
          </span>
          <span className="inline-flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1"><LineChart className="h-4 w-4" /> Product analytics</span>
            <span className="inline-flex items-center gap-1"><Eye className="h-4 w-4" /> Learning signals only</span>
          </span>
        </footer>
      </div>
    </main>
  );
}

export default function AdminDashboardApp({ navigate }) {
  return (
    <PartnerDashboardProvider>
      <AdminDashboardInner navigate={navigate} />
    </PartnerDashboardProvider>
  );
}
