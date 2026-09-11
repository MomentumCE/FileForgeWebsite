import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { FinderAuthHeader, FinderAuthAltLink } from "@/components/fileforge-finder/AuthHeader";

export const metadata: Metadata = {
  title: "Early access — FileForge Finder",
  description: "Request early access to FileForge Finder.",
  alternates: { canonical: "/finder/early-access" },
  robots: { index: false },
};

// Why someone would want in — kept to one line each so the page stays a quick
// read next to the form.
const highlights = [
  "Search the words inside your files — PDFs, Word docs — not just their names",
  "Preview any match instantly, without opening a single file",
  "Flag sensitive info and export defensible records packages",
  "100% local & private — no cloud, and your files never leave your device",
];

// Early-access sign-up. Every "Get FileForge Finder" CTA points here (see
// lib/fileforge-finder.ts). The page doubles as a mini pitch: a short
// what-it-is / why-you'd-want-it column beside the Outseta register embed for
// the FileForge Early Access plan, which is mounted by the global Outseta
// script loaded in app/layout.tsx.
export default function EarlyAccessPage() {
  return (
    <main
      className="ff-page"
     
      style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}
    >
      <div style={{ width: "min(980px, 94vw)" }}>
        <FinderAuthHeader
          title="Register for early access to FileForge Finder"
          subtitle="FileForge Finder is in the final stretch of development. Sign up below and you'll be among the first to get it the moment it's ready."
        />

        <div style={columns}>
          <section aria-label="About FileForge Finder" style={pitch}>
            <h2 style={pitchHeading}>Find any document by what&apos;s inside it.</h2>
            <p style={pitchBody}>
              FileForge Finder is a Windows desktop app for anyone buried in
              documents. Instead of guessing at file names, you search what the
              files actually say — and everything stays on your computer.
            </p>
            <ul style={list}>
              {highlights.map((item) => (
                <li key={item} style={listItem}>
                  <span aria-hidden="true" style={check}>
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-label="Early access sign up" style={formCard}>
            <div
              data-o-auth="1"
              data-widget-mode="register"
              data-plan-uid="rm080ZmX"
              data-plan-payment-term="month"
              data-skip-plan-options="true"
              data-mode="embed"
            />
          </section>
        </div>

        <FinderAuthAltLink
          prompt="Already have a FileForge Finder account?"
          linkLabel="Sign in"
          href="/finder/signin"
        />
      </div>
    </main>
  );
}

// auto-fit lets the two columns stack on narrow screens without media queries.
const columns: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
  gap: "2rem",
  alignItems: "center",
  marginTop: "2rem",
};
const pitch: CSSProperties = { maxWidth: "48ch" };
const pitchHeading: CSSProperties = {
  margin: 0,
  fontSize: "1.2rem",
  color: "#1f2937",
  letterSpacing: "-0.01em",
};
const pitchBody: CSSProperties = {
  margin: "0.6rem 0 1rem",
  color: "#5b636e",
  fontSize: "0.95rem",
  lineHeight: 1.6,
};
const list: CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "grid",
  gap: "0.55rem",
};
const listItem: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "0.55rem",
  color: "#374151",
  fontSize: "0.92rem",
  lineHeight: 1.5,
};
const check: CSSProperties = { color: "#d97706", fontWeight: 700, lineHeight: 1.5 };
const formCard: CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(0,0,0,0.1)",
  borderRadius: "1rem",
  padding: "1.5rem 1.5rem 0.75rem",
  boxShadow: "0 10px 30px -12px rgba(0,0,0,0.15)",
};
