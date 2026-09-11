import type { CSSProperties } from "react";
import { FinderDuckLogo, FinderWordmark } from "@/components/fileforge-finder/FinderMark";

// Branded header shown above the Outseta auth/profile widgets on the FileForge
// Finder sign-in, subscribe, and account pages. Its job is to make unmistakably
// clear that these pages — and the account behind them — belong exclusively to
// FileForge Finder, not to any other Momentum CE service.
export function FinderAuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header style={wrap}>
      <div style={brandRow}>
        <FinderDuckLogo size={30} idPrefix="ah" />
        <FinderWordmark size={19} />
      </div>
      <h1 style={heading}>{title}</h1>
      <p style={sub}>{subtitle}</p>
    </header>
  );
}

// A small "already have an account? / new here?" cross-link shown beneath the
// Outseta widget, linking the sign-in and subscribe pages to each other. Uses a
// plain <a> (full page load) so the global Outseta script re-initializes and
// renders the target page's widget on arrival.
export function FinderAuthAltLink({
  prompt,
  linkLabel,
  href,
}: {
  prompt: string;
  linkLabel: string;
  href: string;
}) {
  return (
    <p style={altWrap}>
      {prompt}{" "}
      <a href={href} style={altLink}>
        {linkLabel}
      </a>
    </p>
  );
}

const wrap: CSSProperties = { textAlign: "center", marginBottom: "1.5rem" };
const brandRow: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "0.3rem 0.9rem 0.3rem 0.6rem",
  borderRadius: 999,
  border: "1px solid rgba(0,0,0,0.1)",
  background: "#fff",
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
};
const heading: CSSProperties = {
  margin: "1rem 0 0.4rem",
  fontSize: "1.5rem",
  color: "#1f2937",
  letterSpacing: "-0.01em",
};
const sub: CSSProperties = {
  margin: "0 auto",
  maxWidth: "46ch",
  color: "#5b636e",
  fontSize: "0.95rem",
  lineHeight: 1.55,
};
const altWrap: CSSProperties = {
  margin: "1.25rem 0 0",
  textAlign: "center",
  color: "#5b636e",
  fontSize: "0.9rem",
};
const altLink: CSSProperties = { color: "#d97706", fontWeight: 600, textDecoration: "none" };
