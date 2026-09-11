"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  MagnifyingGlass,
  FilePdf,
  FileDoc,
  FileXls,
} from "@phosphor-icons/react";

// The app is laid out at this natural width, then uniformly scaled to fill
// the hero frame. Keeping it small means the scale stays near 1:1, so the
// text renders large and readable rather than shrunk down.
const DESIGN_W = 720;

type Row = {
  icon: typeof FilePdf;
  tint: string;
  name: string;
  snippet: string;
  page?: string;
  folder: string;
  meta: string;
  dupe?: boolean;
};

const rows: Row[] = [
  {
    icon: FilePdf,
    tint: "#ef4444",
    name: "2024 lease agreement.pdf",
    snippet:
      "…the tenant shall remit the enrollment deposit on or before the first of each month, in accordance with Section 4 of this agreement…",
    page: "p. 41",
    folder: "Enrollment / 2024",
    meta: "PDF · 2.1 MB · Mar 4, 2024",
  },
  {
    icon: FileDoc,
    tint: "#3b82f6",
    name: "council minutes — enrollment.docx",
    snippet:
      "…motion to approve enrollment for the 2024 season carried 5–0; the clerk was directed to notify all pending applicants by month's end…",
    folder: "Records / Council",
    meta: "Word · 88 KB · Jan 12, 2024",
  },
  {
    icon: FilePdf,
    tint: "#ef4444",
    name: "grant closeout FY23.pdf",
    snippet:
      "…the program reported a final enrollment count of 1,204 individuals served under the FY23 award, exceeding the target of 1,000…",
    page: "p. 6",
    folder: "Finance / Grants",
    meta: "PDF · 640 KB · Nov 2, 2023",
    dupe: true,
  },
  {
    icon: FileXls,
    tint: "#16a34a",
    name: "enrollment tracker FY24.xlsx",
    snippet:
      "…summary tab lists a total enrollment of 1,204 across all sites, with month-by-month counts broken out by program and category…",
    folder: "Finance / Reports",
    meta: "Excel · 320 KB · Feb 2, 2024",
  },
];

export function AppPreview({ plus = false }: { plus?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.87);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / DESIGN_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="w-full h-full relative overflow-hidden bg-[#eef2f7]">
      <div
        style={{
          width: DESIGN_W,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
        className="absolute top-0 left-0 flex flex-col bg-[#eef2f7] text-[#1f2937] select-none"
      >
        {/* Title bar */}
        <header className="flex items-center gap-2.5 px-5 h-[52px] bg-white border-b border-[#e6e9ee] shrink-0">
          <DuckLogo className="w-[26px] h-[26px] shrink-0" />
          <span
            className="text-[18px] tracking-tight leading-none"
            style={{ fontWeight: 350 }}
          >
            <span className="text-[#5b636e]">File</span>
            <span
              style={{
                background: "linear-gradient(to bottom, orange, #274767)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Forge
            </span>
            <span
              className="italic ml-[3px] pr-[4px] text-[19px]"
              style={{
                background: "linear-gradient(to bottom, #9a9a9a, #5a5a5a)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Finder
            </span>
            {plus && (
              <span
                className="italic ml-[-4px] pr-[5px] text-[19px]"
                style={{
                  background: "linear-gradient(to bottom, #e0a62e, #b45309)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                +
              </span>
            )}
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-[12.5px] text-[#1a9d54]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a9d54]" />
            Private — stays on this computer
          </span>
        </header>

        {/* Body */}
        <div className="px-5 pt-4 pb-4 flex flex-col gap-3.5">
          {/* Search */}
          <div className="flex items-center gap-3 h-[46px] px-4 rounded-xl border border-[#d5dbe4] bg-white shadow-[0_1px_2px_rgba(17,26,17,0.03)]">
            <MagnifyingGlass size={20} weight="bold" className="text-[#9aa1ab] shrink-0" />
            <span className="text-[16.5px] font-medium">enrollment</span>
            <motion.span
              aria-hidden
              className="w-px h-[18px] bg-[#2f6ae0]"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
            <span className="ml-auto text-[12.5px] text-[#98a1ad] font-mono">
              142 results · 0.03s
            </span>
          </div>

          {/* Results */}
          <div className="flex flex-col gap-2.5">
            {rows.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2 + i * 0.09,
                  type: "spring",
                  stiffness: 120,
                  damping: 20,
                }}
                className="flex items-start gap-3.5 px-4 py-3 rounded-xl bg-white border border-[#e9ecf1] shadow-[0_1px_2px_rgba(17,26,17,0.04)]"
              >
                <div
                  className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: `${r.tint}1a` }}
                >
                  <r.icon size={20} weight="duotone" style={{ color: r.tint }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[15.5px] font-semibold text-[#111827] truncate max-w-full">
                      {highlight(r.name, "amber")}
                    </span>
                    {r.dupe && (
                      <span className="shrink-0 px-2 py-[2px] rounded text-[11px] font-medium bg-[#fbe6c9] text-[#b06a0f]">
                        ≈ possible dupes
                      </span>
                    )}
                  </div>
                  <p className="text-[14px] text-[#5b636e] leading-snug mt-1 line-clamp-1">
                    {highlight(r.snippet, "slate")}
                  </p>
                  <p className="text-[12.5px] text-[#98a1ad] mt-1.5 font-mono truncate">
                    {r.folder} · {r.meta}
                    {r.page && <span className="text-[#2f6ae0]/80"> · {r.page}</span>}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Status strip */}
        <footer className="mt-auto shrink-0 flex items-center gap-3 px-5 h-[34px] border-t border-[#e6e9ee] bg-white text-[12px] text-[#98a1ad]">
          <span>142,318 files indexed</span>
          <span className="text-[#d5dbe4]">|</span>
          <span>0 network attempts</span>
          <span className="ml-auto text-[#2f6ae0]">↑↓ move · Enter preview</span>
        </footer>
      </div>
    </div>
  );
}

// FileForge Finder's "Sherlock detective-duck" logo, taken verbatim from the
// desktop app (src/index.html / expired.html) and inlined so it scales cleanly.
function DuckLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label="FileForge Finder" className={className}>
      <defs>
        <linearGradient id="obBody" gradientUnits="userSpaceOnUse" x1="0" y1="4" x2="0" y2="58">
          <stop offset="0" stopColor="#EBB43E" />
          <stop offset="0.55" stopColor="#E0A62E" />
          <stop offset="1" stopColor="#CF9524" />
        </linearGradient>
        <linearGradient id="obCrown" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CBD0D7" />
          <stop offset="1" stopColor="#59636F" />
        </linearGradient>
        <linearGradient id="obFlap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#99A2AC" />
          <stop offset="1" stopColor="#525C67" />
        </linearGradient>
      </defs>
      <ellipse cx="29" cy="45" rx="22" ry="14" fill="url(#obBody)" />
      <circle cx="42" cy="23" r="13" fill="url(#obBody)" />
      <ellipse cx="37" cy="17" rx="4.5" ry="3" fill="#FFFFFF" opacity="0.28" />
      <path d="M20 42 Q30 35 42 41 Q37 50 24 48 Q19 46 20 42 Z" fill="#C58A20" />
      <path d="M51 19 Q61 18 62 23 Q61 27 51 26 Z" fill="#E08214" />
      <path d="M53 24 Q58 25 61.5 23.2 Q59 27.5 53 26 Z" fill="#C0680E" />
      <circle cx="46" cy="20" r="2.6" fill="#2B2B2B" />
      <circle cx="47" cy="19" r="0.9" fill="#FFFFFF" />
      <path d="M34 12 Q25 11.5 25 14.5 Q26 17.5 35 16 Z" fill="url(#obFlap)" />
      <path d="M50 12 Q59 11.5 59 14.5 Q58 17.5 49 16 Z" fill="url(#obFlap)" />
      <path d="M31 14 Q31 2 42 2 Q53 2 53 14 Z" fill="url(#obCrown)" />
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

// Highlight the matched term ("enrollment") inside filenames and snippets.
function highlight(text: string, variant: "amber" | "slate") {
  const cls =
    variant === "amber"
      ? "bg-[#fde68a]/70 text-[#78350f]"
      : "bg-[#dfe3f3] text-[#374151]";
  return text.split(/(enrollment)/gi).map((p, i) =>
    p.toLowerCase() === "enrollment" ? (
      <mark key={i} className={`rounded-[2px] px-[1px] ${cls}`}>
        {p}
      </mark>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}
