import type { CSSProperties } from "react";

// FileForge Finder's brand marks, in one place so the app's "Sherlock
// detective-duck" logo and the FileForge Finder wordmark stay identical
// everywhere they appear (hero, auth pages, download confirmation).
//
// Both are plain server-safe components — no hooks — so server-rendered pages
// can use them. The SVG's gradients need document-unique ids, so callers pass an
// `idPrefix` rather than the component reaching for useId().

export function FinderDuckLogo({
  size = 30,
  idPrefix,
}: {
  size?: number;
  idPrefix: string;
}) {
  const body = `${idPrefix}Body`;
  const crown = `${idPrefix}Crown`;
  const flap = `${idPrefix}Flap`;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="FileForge Finder">
      <defs>
        <linearGradient id={body} gradientUnits="userSpaceOnUse" x1="0" y1="4" x2="0" y2="58">
          <stop offset="0" stopColor="#EBB43E" />
          <stop offset="0.55" stopColor="#E0A62E" />
          <stop offset="1" stopColor="#CF9524" />
        </linearGradient>
        <linearGradient id={crown} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CBD0D7" />
          <stop offset="1" stopColor="#59636F" />
        </linearGradient>
        <linearGradient id={flap} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#99A2AC" />
          <stop offset="1" stopColor="#525C67" />
        </linearGradient>
      </defs>
      <ellipse cx="29" cy="45" rx="22" ry="14" fill={`url(#${body})`} />
      <circle cx="42" cy="23" r="13" fill={`url(#${body})`} />
      <ellipse cx="37" cy="17" rx="4.5" ry="3" fill="#FFFFFF" opacity="0.28" />
      <path d="M20 42 Q30 35 42 41 Q37 50 24 48 Q19 46 20 42 Z" fill="#C58A20" />
      <path d="M51 19 Q61 18 62 23 Q61 27 51 26 Z" fill="#E08214" />
      <path d="M53 24 Q58 25 61.5 23.2 Q59 27.5 53 26 Z" fill="#C0680E" />
      <circle cx="46" cy="20" r="2.6" fill="#2B2B2B" />
      <circle cx="47" cy="19" r="0.9" fill="#FFFFFF" />
      <path d="M34 12 Q25 11.5 25 14.5 Q26 17.5 35 16 Z" fill={`url(#${flap})`} />
      <path d="M50 12 Q59 11.5 59 14.5 Q58 17.5 49 16 Z" fill={`url(#${flap})`} />
      <path d="M31 14 Q31 2 42 2 Q53 2 53 14 Z" fill={`url(#${crown})`} />
      <ellipse cx="38" cy="7" rx="3" ry="2" fill="#FFFFFF" opacity="0.22" />
      <path d="M31 14 Q42 16 53 14 L53 11.5 Q42 13.5 31 11.5 Z" fill="#4E5863" />
      <circle cx="42" cy="3" r="1.7" fill="#6B7580" />
      <line x1="57.5" y1="49.5" x2="62.5" y2="54.5" stroke="#6B7580" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="53" cy="45" r="8" fill="#CDE8FA" opacity="0.5" />
      <circle cx="53" cy="45" r="8" fill="none" stroke="#46525E" strokeWidth="2.6" />
      <path d="M49 41 Q50.5 39 53.5 39" fill="none" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

// The "FileForge Finder" wordmark: grey "File", orange-to-navy "Forge", and an
// italic silver "Finder". `size` is the base font size in px; "Finder" runs one
// pixel larger, as in the desktop app's lockup.
export function FinderWordmark({ size = 19 }: { size?: number }) {
  return (
    <span style={{ ...wordmark, fontSize: size }}>
      <span style={{ color: "#5b636e" }}>File</span>
      <span style={forge}>Forge</span>
      <span style={{ ...finder, fontSize: size + 1 }}>Finder</span>
    </span>
  );
}

const wordmark: CSSProperties = {
  fontWeight: 350,
  letterSpacing: "-0.01em",
  lineHeight: 1,
  whiteSpace: "nowrap",
};
const forge: CSSProperties = {
  background: "linear-gradient(to bottom, orange, #274767)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
};
const finder: CSSProperties = {
  fontStyle: "italic",
  marginLeft: 3,
  paddingRight: 3,
  background: "linear-gradient(to bottom, #9a9a9a, #5a5a5a)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
};
