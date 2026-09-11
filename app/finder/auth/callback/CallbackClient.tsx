"use client";

import type { CSSProperties } from "react";
import { useEffect } from "react";
import { FinderAuthHeader } from "@/components/fileforge-finder/AuthHeader";

// The custom protocol the desktop app registers (must match authClient.js
// CONFIG.scheme in the FileForge Finder repo).
const SCHEME = "fileforge";

// Props come from the server component (page.tsx), which has already traded the
// one-time code for an access token. On success we receive the finished token +
// the original state; otherwise `invalid`. The token never touches the URL of
// THIS page — it only rides the deep link to the desktop app.
type Props =
  | { status: "ok"; token: string; state: string }
  | { status: "invalid"; token?: undefined; state?: undefined };

export function CallbackClient(props: Props) {
  const invalid = props.status !== "ok";

  // Build the deep link during render (pure). Forward ONLY token + state to the
  // desktop app; the app validates state and then persists the token.
  const deepLink =
    props.status === "ok"
      ? `${SCHEME}://callback?token=${encodeURIComponent(props.token)}&state=${encodeURIComponent(props.state)}`
      : null;

  useEffect(() => {
    if (!deepLink) return;
    // Auto-launch the app. Browsers show an "Open FileForge Finder?" prompt; the
    // manual button below is the fallback when a user gesture is required.
    try {
      window.location.href = deepLink;
    } catch {
      /* the button still works */
    }
  }, [deepLink]);

  return (
    <main
      className="ff-page"
     
      style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}
    >
      <div style={{ width: "min(460px, 94vw)", textAlign: "center" }}>
        <FinderAuthHeader
          title={invalid ? "Sign-in didn't complete" : "You're signed in"}
          subtitle={
            invalid
              ? "We couldn't finish signing you in. Return to FileForge Finder and start signing in again."
              : "Returning you to FileForge Finder…"
          }
        />

        {!invalid && deepLink && (
          <>
            <ol style={steps}>
              <li style={step}>
                If your browser shows a popup asking to open FileForge Finder, click{" "}
                <strong>Open</strong>.
              </li>
              <li style={step}>
                If no popup appears, click the <strong>Open FileForge Finder</strong> button
                below.
              </li>
            </ol>
            <a href={deepLink} style={btn}>
              Open FileForge Finder
            </a>
          </>
        )}

        <p style={hint}>
          {invalid
            ? "You can close this tab."
            : "You can close this tab once FileForge Finder reopens."}
        </p>
      </div>
    </main>
  );
}

const steps: CSSProperties = {
  margin: "0 auto 1.25rem",
  padding: "0 0 0 1.25rem",
  maxWidth: 360,
  textAlign: "left",
  color: "#3b4048",
  fontSize: "0.9rem",
  lineHeight: 1.5,
};

const step: CSSProperties = {
  marginBottom: "0.4rem",
};

const btn: CSSProperties = {
  display: "inline-block",
  marginTop: "0.5rem",
  padding: "0.7rem 1.6rem",
  borderRadius: 10,
  background: "#d97706",
  color: "#fff",
  fontWeight: 600,
  fontSize: "0.95rem",
  textDecoration: "none",
};

const hint: CSSProperties = {
  margin: "1.25rem 0 0",
  color: "#5b636e",
  fontSize: "0.85rem",
};
