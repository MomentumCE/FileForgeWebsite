"use client";

import { useCallback, useEffect, useState } from "react";

// Shape returned by GET /api/download-ff/stats.
type Stats = {
  total: number;
  // Counts over the whole unfiltered set: downloads recorded from the IP
  // viewing this dashboard, and events hand-marked as test downloads. The
  // booleans say which filters produced the numbers alongside them.
  mine: number;
  ignored: number;
  excludingMine: boolean;
  includingIgnored: boolean;
  byPlatform: Record<string, number>;
  byProduct: Record<string, number>;
  byAuthPath: Record<string, number>;
  bySource: Record<string, number>;
  byCountry: Record<string, number>;
  byDay: Record<string, number>;
  recent: Array<{
    key: string; // blob key — the handle for marking this event
    ts: string;
    platform: string;
    product: string;
    authPath: string;
    source: string;
    country: string | null;
    referer: string | null;
    email: string | null;
    isMine: boolean;
    ignored: boolean;
  }>;
};

const KEY_STORAGE = "ff-stats-key";
const EXCLUDE_STORAGE = "ff-stats-exclude-mine";

// Timestamps are stored/served in UTC; this dashboard is viewed from Mountain
// Time, so render them in America/Denver (Intl handles the MST/MDT switch).
const MT_DATETIME = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Denver",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});
function formatMountain(iso: string): string {
  const p = MT_DATETIME.formatToParts(new Date(iso)).reduce<Record<string, string>>(
    (acc, part) => {
      acc[part.type] = part.value;
      return acc;
    },
    {}
  );
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second}`;
}

export default function StatsDashboard() {
  const [key, setKey] = useState<string | null>(null);
  const [keyInput, setKeyInput] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Leave out downloads made from this browser's IP (our own test downloads).
  // Filtering happens server-side, so flipping this refetches.
  const [excludeMine, setExcludeMine] = useState(false);
  // Show events hand-marked as test downloads (so they can be un-marked).
  const [showIgnored, setShowIgnored] = useState(false);
  const [marking, setMarking] = useState(false);

  // The key lives only in this browser's localStorage — never in the repo.
  useEffect(() => {
    setKey(localStorage.getItem(KEY_STORAGE));
    setExcludeMine(localStorage.getItem(EXCLUDE_STORAGE) === "1");
  }, []);

  const load = useCallback(async (k: string, exclude: boolean, withIgnored: boolean) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (exclude) params.set("excludeMine", "1");
      if (withIgnored) params.set("includeIgnored", "1");
      const qs = params.toString();
      const res = await fetch(`/api/download-ff/stats${qs ? `?${qs}` : ""}`, {
        headers: { Authorization: `Bearer ${k}` },
        cache: "no-store",
      });
      if (res.status === 401) {
        setError("That key was rejected (401). Check DOWNLOAD_STATS_KEY.");
        setStats(null);
        return;
      }
      if (res.status === 404) {
        setError(
          "Endpoint disabled (404) — DOWNLOAD_STATS_KEY isn't set on the server."
        );
        setStats(null);
        return;
      }
      if (!res.ok) {
        setError(`Request failed (${res.status}).`);
        setStats(null);
        return;
      }
      setStats((await res.json()) as Stats);
    } catch {
      setError("Network error — couldn't reach the stats endpoint.");
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (key) load(key, excludeMine, showIgnored);
  }, [key, excludeMine, showIgnored, load]);

  function toggleExcludeMine(next: boolean) {
    localStorage.setItem(EXCLUDE_STORAGE, next ? "1" : "0");
    setExcludeMine(next);
  }

  // Flip the `ignored` flag on stored events, then reload so every card and
  // chart reflects the change.
  const mark = useCallback(
    async (keys: string[], ignored: boolean) => {
      if (!key || keys.length === 0) return;
      setMarking(true);
      setError("");
      try {
        const res = await fetch("/api/download-ff/stats", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ keys, ignored }),
        });
        if (!res.ok) {
          setError(`Couldn't update those events (${res.status}).`);
          return;
        }
        await load(key, excludeMine, showIgnored);
      } catch {
        setError("Network error — couldn't update those events.");
      } finally {
        setMarking(false);
      }
    },
    [key, excludeMine, showIgnored, load]
  );

  function saveKey(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = keyInput.trim();
    if (!trimmed) return;
    localStorage.setItem(KEY_STORAGE, trimmed);
    setKey(trimmed);
  }

  function clearKey() {
    localStorage.removeItem(KEY_STORAGE);
    setKey(null);
    setStats(null);
    setKeyInput("");
  }

  // ── Key entry gate ────────────────────────────────────────────────
  if (!key) {
    return (
      <main
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: "var(--bg)" }}
      >
        <form
          onSubmit={saveKey}
          className="w-full max-w-sm rounded-[var(--radius-lg)] p-8"
          style={{
            background: "var(--bg-card)",
            boxShadow: "var(--shadow-md)",
            border: "1px solid var(--border)",
          }}
        >
          <h1
            className="text-2xl mb-1"
            style={{ fontFamily: "var(--font-head)", color: "var(--ink)" }}
          >
            Download Stats
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--ink-muted)" }}>
            Paste the <code>DOWNLOAD_STATS_KEY</code>. It&apos;s stored only in this
            browser.
          </p>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="Stats key"
            autoComplete="off"
            className="w-full rounded-[var(--radius)] px-3 py-2.5 text-sm outline-none mb-4"
            style={{
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--ink)",
            }}
          />
          <button
            type="submit"
            className="w-full rounded-[var(--radius)] px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--accent)" }}
          >
            View stats
          </button>
        </form>
      </main>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────
  const free = stats?.byAuthPath?.free ?? 0;

  return (
    <main
      className="min-h-screen px-6 md:px-10 pb-10"
      style={{ background: "var(--bg)", paddingTop: "92px" }}
    >
      <div className="mx-auto" style={{ maxWidth: "1100px" }}>
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <div>
            <h1
              className="text-3xl"
              style={{ fontFamily: "var(--font-head)", color: "var(--ink)" }}
            >
              FileForge Finder — Downloads
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--ink-muted)" }}>
              Live counts from Netlify Blobs.{" "}
              {loading ? "Refreshing…" : "Up to date."}
            </p>
            <div className="flex flex-col gap-1.5 mt-3">
              {/* Own-IP filter. Matched on a salted digest of the client IP, so
                  only downloads from this network are affected — and only those
                  recorded after the digest started being stored. Older events
                  have to be marked by hand in the table below. */}
              <label
                className="flex items-center gap-2 text-sm cursor-pointer select-none"
                style={{ color: "var(--ink-muted)" }}
              >
                <input
                  type="checkbox"
                  checked={excludeMine}
                  onChange={(e) => toggleExcludeMine(e.target.checked)}
                  style={{ accentColor: "var(--accent)" }}
                />
                Exclude downloads from my IP
                {stats && (
                  <span style={{ color: "var(--ink-faint)" }}>
                    ({stats.mine} {stats.mine === 1 ? "match" : "matches"})
                  </span>
                )}
              </label>
              <label
                className="flex items-center gap-2 text-sm cursor-pointer select-none"
                style={{ color: "var(--ink-muted)" }}
              >
                <input
                  type="checkbox"
                  checked={showIgnored}
                  onChange={(e) => setShowIgnored(e.target.checked)}
                  style={{ accentColor: "var(--accent)" }}
                />
                Show events marked as test
                {stats && (
                  <span style={{ color: "var(--ink-faint)" }}>
                    ({stats.ignored} marked)
                  </span>
                )}
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => key && load(key, excludeMine, showIgnored)}
              disabled={loading}
              className="rounded-[var(--radius)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: "var(--accent)" }}
            >
              {loading ? "Loading…" : "Refresh"}
            </button>
            <button
              onClick={clearKey}
              className="rounded-[var(--radius)] px-4 py-2 text-sm font-medium transition-colors"
              style={{
                border: "1px solid var(--border)",
                color: "var(--ink-muted)",
                background: "var(--bg-card)",
              }}
            >
              Forget key
            </button>
          </div>
        </div>

        {error && (
          <div
            className="rounded-[var(--radius)] p-4 mb-6 text-sm"
            style={{
              background: "#fdecea",
              color: "#a1332c",
              border: "1px solid #f3c6c2",
            }}
          >
            {error}
          </div>
        )}

        {stats && (
          <>
            {/* Headline stat cards */}
            <div
              className="grid gap-4 mb-8"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
            >
              <StatCard label="Free downloads" value={free} highlight />
              <StatCard label="All downloads" value={stats.total} />
              <StatCard
                label="Windows"
                value={stats.byPlatform?.windows ?? 0}
              />
              <StatCard label="macOS" value={stats.byPlatform?.mac ?? 0} />
              <StatCard label="Linux" value={stats.byPlatform?.linux ?? 0} />
            </div>

            {/* Per-day chart */}
            <Panel title="Downloads per day">
              <DayChart byDay={stats.byDay} />
            </Panel>

            {/* Breakdown grid */}
            <div
              className="grid gap-4 mt-6"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
            >
              <Panel title="By button (source)">
                <Breakdown data={stats.bySource} total={stats.total} />
              </Panel>
              <Panel title="By country">
                <Breakdown data={stats.byCountry} total={stats.total} />
              </Panel>
              <Panel title="By auth path">
                <Breakdown data={stats.byAuthPath} total={stats.total} />
              </Panel>
              <Panel title="By product">
                <Breakdown data={stats.byProduct} total={stats.total} />
              </Panel>
            </div>

            {/* Recent events */}
            <Panel
              title={`Recent downloads (${stats.recent.length})`}
              className="mt-6"
              action={
                <button
                  onClick={() =>
                    mark(
                      stats.recent.filter((e) => !e.ignored).map((e) => e.key),
                      true
                    )
                  }
                  disabled={marking || stats.recent.every((e) => e.ignored)}
                  className="rounded-[var(--radius)] px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
                  style={{
                    border: "1px solid var(--border)",
                    color: "var(--ink-muted)",
                    background: "var(--bg)",
                  }}
                >
                  {marking ? "Saving…" : "Mark all shown as test"}
                </button>
              }
            >
              <div style={{ overflowX: "auto" }}>
                <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ color: "var(--ink-faint)", textAlign: "left" }}>
                      <Th>When (MT)</Th>
                      <Th>Platform</Th>
                      <Th>Product</Th>
                      <Th>Auth</Th>
                      <Th>Source</Th>
                      <Th>Country</Th>
                      <Th>Test?</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recent.map((e) => (
                      <tr
                        key={e.key}
                        style={{
                          borderTop: "1px solid var(--border-light)",
                          opacity: e.ignored ? 0.5 : 1,
                        }}
                      >
                        <Td>
                          {formatMountain(e.ts)}
                          {e.isMine && (
                            <span
                              className="ml-2 text-xs"
                              style={{ color: "var(--ink-faint)" }}
                              title="Recorded from the IP you're viewing this page from"
                            >
                              (my IP)
                            </span>
                          )}
                        </Td>
                        <Td>{e.platform}</Td>
                        <Td>{e.product}</Td>
                        <Td>{e.authPath}</Td>
                        <Td>{e.source}</Td>
                        <Td>{e.country ?? "—"}</Td>
                        <Td>
                          <button
                            onClick={() => mark([e.key], !e.ignored)}
                            disabled={marking}
                            className="text-xs underline disabled:opacity-50"
                            style={{ color: "var(--accent)" }}
                          >
                            {e.ignored ? "Un-mark" : "Mark"}
                          </button>
                        </Td>
                      </tr>
                    ))}
                    {stats.recent.length === 0 && (
                      <tr>
                        <Td>No downloads recorded yet.</Td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Panel>
          </>
        )}
      </div>
    </main>
  );
}

// ── Small presentational pieces ─────────────────────────────────────

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className="rounded-[var(--radius-lg)] p-5"
      style={{
        background: highlight ? "var(--accent-dim)" : "var(--bg-card)",
        border: `1px solid ${highlight ? "var(--accent-light)" : "var(--border)"}`,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        className="text-sm font-medium mb-1"
        style={{ color: highlight ? "var(--accent)" : "var(--ink-muted)" }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-head)",
          fontSize: "2.25rem",
          fontWeight: 700,
          lineHeight: 1,
          color: highlight ? "var(--accent)" : "var(--ink)",
        }}
      >
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
  className = "",
  action,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  // Optional control rendered opposite the title (e.g. a bulk action).
  action?: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-[var(--radius-lg)] p-5 ${className}`}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2
          className="text-xs font-bold uppercase"
          style={{ letterSpacing: "0.08em", color: "var(--ink-faint)" }}
        >
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

// Sorted horizontal bars for a { label: count } map.
function Breakdown({
  data,
  total,
}: {
  data: Record<string, number>;
  total: number;
}) {
  const rows = Object.entries(data).sort((a, b) => b[1] - a[1]);
  if (rows.length === 0)
    return (
      <p className="text-sm" style={{ color: "var(--ink-faint)" }}>
        No data.
      </p>
    );
  return (
    <div className="flex flex-col gap-2.5">
      {rows.map(([label, count]) => {
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={label}>
            <div
              className="flex justify-between text-sm mb-1"
              style={{ color: "var(--ink)" }}
            >
              <span>{label}</span>
              <span style={{ color: "var(--ink-muted)" }}>
                {count} · {pct}%
              </span>
            </div>
            <div
              style={{
                height: "6px",
                borderRadius: "999px",
                background: "var(--border-light)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: "var(--accent)",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Vertical bars, one per day, oldest → newest.
function DayChart({ byDay }: { byDay: Record<string, number> }) {
  const days = Object.entries(byDay).sort((a, b) => (a[0] < b[0] ? -1 : 1));
  if (days.length === 0)
    return (
      <p className="text-sm" style={{ color: "var(--ink-faint)" }}>
        No downloads yet.
      </p>
    );
  const max = Math.max(...days.map(([, c]) => c), 1);
  return (
    <div
      className="flex items-end gap-2"
      style={{ height: "160px", overflowX: "auto" }}
    >
      {days.map(([day, count]) => (
        <div
          key={day}
          className="flex flex-col items-center justify-end"
          style={{ minWidth: "42px", flex: 1, height: "100%" }}
          title={`${day}: ${count}`}
        >
          <span
            className="text-xs mb-1"
            style={{ color: "var(--ink-muted)" }}
          >
            {count}
          </span>
          <div
            style={{
              width: "100%",
              maxWidth: "48px",
              height: `${(count / max) * 100}%`,
              minHeight: "3px",
              background: "var(--accent)",
              borderRadius: "6px 6px 0 0",
            }}
          />
          <span
            className="text-xs mt-1.5"
            style={{ color: "var(--ink-faint)", whiteSpace: "nowrap" }}
          >
            {day.slice(5)}
          </span>
        </div>
      ))}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="py-2 pr-4 text-xs font-semibold uppercase" style={{ letterSpacing: "0.05em" }}>
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="py-2 pr-4" style={{ color: "var(--ink)" }}>
      {children}
    </td>
  );
}
