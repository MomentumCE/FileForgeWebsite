"use client";

import { useEffect, useState, type CSSProperties, type FormEvent } from "react";

// Outseta billing stages that still grant product access, and so should see the
// download button. Values from Outseta's AccountStage enum: Trialing=2,
// Subscribing=3, Cancelling=4 (still active until period end), PastDue=7 (still
// current). Deliberately excludes Expired=5 and TrialExpired=6.
const ACTIVE_ACCOUNT_STAGES = new Set([2, 3, 4, 7]);

// Detect the OS so the download serves the right installer: the .dmg on macOS,
// the AppImage on Linux, the .exe on Windows. Prefer userAgentData.platform
// where available, falling back to the UA string; the server defaults to
// Windows on anything unrecognized. Android UA strings also contain "Linux" and
// are excluded (no Android target).
type Platform = "mac" | "windows" | "linux";
function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "windows";
  const uaPlatform =
    (navigator as Navigator & { userAgentData?: { platform?: string } })
      .userAgentData?.platform ?? "";
  const hay = `${uaPlatform} ${navigator.platform ?? ""} ${navigator.userAgent ?? ""}`;
  if (/mac/i.test(hay)) return "mac";
  if (/linux/i.test(hay) && !/android/i.test(hay)) return "linux";
  return "windows";
}

// Human-readable OS name for the download card copy.
function osLabel(platform: Platform): string {
  return platform === "mac" ? "macOS" : platform === "linux" ? "Linux" : "Windows";
}

// Download card shown on the account page above the Outseta profile widget.
// Only rendered for a signed-in visitor whose account is in an active billing
// stage — signed-out visitors and expired accounts never see it.
//
// The installer is still gated during development, so the button prompts for a
// shared dev password (validated server-side against FF_DEV_PASSWORD) and, on
// success, opens the short-lived signed installer URL from /api/download-ff.
export function DownloadCard() {
  const [access, setAccess] = useState<"checking" | "active" | "inactive">("checking");
  const [prompting, setPrompting] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [platform, setPlatform] = useState<Platform>("windows");
  // Which Linux build to serve. Only used when platform is "linux"; the visitor
  // chooses via the selector shown for Linux. Defaults to the universal
  // AppImage.
  const [linuxFormat, setLinuxFormat] = useState<"deb" | "appimage">("appimage");

  // Resolve the platform after mount (navigator is client-only) so the copy and
  // the download request target the right installer.
  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  // Determine whether the current visitor is signed in with an active account.
  // Outseta loads afterInteractive, so poll until window.Outseta appears, then
  // re-check on every auth change (login/logout) via the accessToken.set event.
  useEffect(() => {
    let cancelled = false;
    let registered: OutsetaApi | null = null;

    const evaluate = async (outseta: OutsetaApi) => {
      try {
        const token = outseta.getAccessToken?.();
        if (!token || !outseta.getUser) {
          if (!cancelled) setAccess("inactive");
          return;
        }
        const profile = await outseta.getUser();
        const stage = profile?.Account?.AccountStage;
        const ok = typeof stage === "number" && ACTIVE_ACCOUNT_STAGES.has(stage);
        if (!cancelled) setAccess(ok ? "active" : "inactive");
      } catch {
        if (!cancelled) setAccess("inactive");
      }
    };

    const onChange = () => {
      if (registered) void evaluate(registered);
    };

    let tries = 0;
    const timer = setInterval(() => {
      const outseta = window.Outseta;
      if (outseta) {
        clearInterval(timer);
        registered = outseta;
        outseta.on?.("accessToken.set", onChange);
        void evaluate(outseta);
      } else if (++tries > 40) {
        // ~10s with no Outseta on the page — treat as signed out.
        clearInterval(timer);
        if (!cancelled) setAccess("inactive");
      }
    }, 250);

    return () => {
      cancelled = true;
      clearInterval(timer);
      registered?.off?.("accessToken.set", onChange);
    };
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/download-ff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          platform,
          ...(platform === "linux" ? { linuxFormat } : {}),
          product: "finder-plus",
          source: "account-card",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        setError(data.error || "Download failed. Please try again.");
        return;
      }
      setStarted(true);
      window.location.href = data.url;
    } catch {
      setError("Download failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Always render a stable wrapper element so React never inserts or removes a
  // node adjacent to the Outseta-managed profile widget that follows this card
  // in the DOM. Outseta mutates that subtree directly, and toggling this card's
  // presence there triggers React's "insertBefore … not a child" crash on the
  // account page. The card contents are shown only for an active account.
  return (
    <div style={wrap}>
      {access === "active" ? (
        <section style={card}>
          <div style={textCol}>
            <h2 style={heading}>Download FileForge Finder+</h2>
            <p style={sub}>
              {started
                ? "Your download will begin shortly."
                : prompting
                  ? `Enter the access password to download the ${osLabel(platform)} installer.`
                  : `Get the ${osLabel(platform)} FileForge Finder+ installer for your subscription.`}
            </p>
          </div>
          {started ? null : prompting ? (
            <form onSubmit={submit} style={form}>
              {platform === "linux" ? (
                <div
                  role="radiogroup"
                  aria-label="Linux package format"
                  style={segGroup}
                >
                  {(
                    [
                      { value: "deb", label: "Debian / Ubuntu (.deb)" },
                      { value: "appimage", label: "AppImage (.AppImage)" },
                    ] as const
                  ).map((opt) => {
                    const active = linuxFormat === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setLinuxFormat(opt.value)}
                        style={active ? { ...segBtn, ...segBtnActive } : segBtn}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Access password"
                autoFocus
                aria-label="Access password"
                style={input}
              />
              <button type="submit" disabled={loading || !password} style={button}>
                {loading ? "Verifying…" : "Download"}
              </button>
              {error ? <p style={errorText}>{error}</p> : null}
            </form>
          ) : (
            <button type="button" onClick={() => setPrompting(true)} style={button}>
              Download
            </button>
          )}
          <p style={supportText}>
            Questions? Contact{" "}
            <a href="mailto:support@fileforge.com" style={supportLink}>
              support@fileforge.com
            </a>
            .
          </p>
        </section>
      ) : null}
    </div>
  );
}

const wrap: CSSProperties = { width: "100%" };
const card: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  padding: "1.25rem 1.5rem",
  marginBottom: "1.5rem",
  borderRadius: 16,
  border: "1px solid rgba(0,0,0,0.1)",
  background: "#fff",
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
};
const textCol: CSSProperties = { flex: "1 1 260px" };
const heading: CSSProperties = {
  margin: 0,
  fontSize: "1.05rem",
  color: "#1f2937",
  letterSpacing: "-0.01em",
};
const sub: CSSProperties = {
  margin: "0.3rem 0 0",
  color: "#5b636e",
  fontSize: "0.9rem",
  lineHeight: 1.5,
};
const button: CSSProperties = {
  padding: "0.7rem 1.4rem",
  borderRadius: 999,
  border: "none",
  background: "#d97706",
  color: "#fff",
  fontSize: "0.9rem",
  fontWeight: 600,
  cursor: "pointer",
  whiteSpace: "nowrap",
};
const form: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "0.5rem",
  flex: "1 1 260px",
  justifyContent: "flex-end",
};
const input: CSSProperties = {
  padding: "0.65rem 0.9rem",
  borderRadius: 999,
  border: "1px solid rgba(0,0,0,0.15)",
  fontSize: "0.9rem",
  minWidth: 0,
  flex: "1 1 160px",
};
// Linux-only .deb / .AppImage selector. Full-width row above the password field
// so it never competes with the input for horizontal space.
const segGroup: CSSProperties = {
  flexBasis: "100%",
  display: "flex",
  gap: "0.4rem",
};
const segBtn: CSSProperties = {
  flex: "1 1 0",
  padding: "0.5rem 0.75rem",
  borderRadius: 999,
  border: "1px solid rgba(0,0,0,0.15)",
  background: "#fff",
  color: "#5b636e",
  fontSize: "0.82rem",
  fontWeight: 600,
  cursor: "pointer",
  whiteSpace: "nowrap",
};
const segBtnActive: CSSProperties = {
  border: "1px solid #d97706",
  background: "#fff7ed",
  color: "#b45309",
};
const supportText: CSSProperties = {
  flexBasis: "100%",
  margin: "0.25rem 0 0",
  color: "#5b636e",
  fontSize: "0.82rem",
};
const supportLink: CSSProperties = {
  color: "#d97706",
  fontWeight: 600,
  textDecoration: "none",
};
const errorText: CSSProperties = {
  flexBasis: "100%",
  margin: 0,
  textAlign: "right",
  color: "#b91c1c",
  fontSize: "0.82rem",
};
