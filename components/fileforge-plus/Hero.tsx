"use client";

import { ArrowRight, ShieldCheck, Cpu, CheckCircle } from "@phosphor-icons/react";
import { MagneticButton } from "@/components/fileforge/ui/MagneticButton";
import { AnimatedHeadline } from "@/components/fileforge/ui/AnimatedText";
import { motion } from "framer-motion";
import { AppPreview } from "@/components/fileforge-finder/AppPreview";

export function Hero() {
  return (
    <section className="min-h-[100dvh] mesh-gradient flex items-center pt-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-center py-16 md:py-24">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100, damping: 20 }}
              className="inline-flex items-center gap-2 pl-2.5 pr-4 py-1.5 rounded-full border border-surface-border bg-surface/60"
            >
              <FinderDuckLogo size={22} />
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 350,
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                }}
              >
                <span style={{ color: "#5b636e" }}>File</span>
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
                  style={{
                    fontStyle: "italic",
                    marginLeft: 3,
                    paddingRight: 2,
                    fontSize: 18,
                    background: "linear-gradient(to bottom, #e0a62e, #b45309)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Finder+
                </span>
              </span>
            </motion.div>

            <AnimatedHeadline
              text="Make every document searchable, renamed, and auto-sorted."
              className="text-4xl md:text-6xl lg:text-7xl tracking-tighter leading-[0.95] font-semibold gradient-text"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 20 }}
              className="text-base md:text-lg text-muted leading-relaxed max-w-[55ch]"
            >
              FileForge Finder+ adds on-device AI power tools on top of FileForge
              Finder: turn scanned PDFs into <em>searchable</em>{" "}
              copies with OCR, rename
              files by what&apos;s actually inside them, and let a watched folder
              read, rename, and file new scans on its own. You review every change
              - and the AI runs locally: no cloud processing, and your files never
              leave your device.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, type: "spring", stiffness: 100, damping: 20 }}
              className="flex flex-wrap items-center gap-4"
            >
              <MagneticButton
                href="/finder/early-access"
                className="px-8 py-3.5 bg-[#d97706] !text-white text-base font-medium rounded-full hover:bg-[#b45309]"
              >
                <span className="flex items-center gap-2">
                  Get FileForge Finder+
                  <ArrowRight size={18} weight="bold" />
                </span>
              </MagneticButton>
              <a
                href="/finder/signin"
                className="text-sm text-muted hover:text-foreground transition-colors underline underline-offset-4"
              >
                Already subscribed? Sign in
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-sm text-muted"
            >
              Available for Mac, Windows and Linux.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted pt-2"
            >
              <span className="flex items-center gap-1.5">
                <Cpu size={16} weight="duotone" className="text-accent" />
                On-device AI
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} weight="duotone" className="text-accent" />
                100% local &amp; private
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle size={16} weight="duotone" className="text-accent" />
                You review every change
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 80, damping: 20 }}
            className="relative"
          >
            <div className="relative aspect-[6/5] rounded-[1.25rem] overflow-hidden bg-white border border-black/10 shadow-[0_28px_60px_-18px_rgba(0,0,0,0.35)] ring-1 ring-black/5">
              <AppPreview plus />
            </div>

            <div className="absolute -z-10 -inset-8 rounded-[3rem] bg-gradient-to-br from-accent/10 to-transparent blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// FileForge Finder's "Sherlock detective-duck" logo, matching the desktop app
// and the auth-page branding so the mark stays consistent across the product.
function FinderDuckLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="FileForge Finder">
      <defs>
        <linearGradient id="heroDuckBody" gradientUnits="userSpaceOnUse" x1="0" y1="4" x2="0" y2="58">
          <stop offset="0" stopColor="#EBB43E" />
          <stop offset="0.55" stopColor="#E0A62E" />
          <stop offset="1" stopColor="#CF9524" />
        </linearGradient>
        <linearGradient id="heroDuckCrown" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CBD0D7" />
          <stop offset="1" stopColor="#59636F" />
        </linearGradient>
        <linearGradient id="heroDuckFlap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#99A2AC" />
          <stop offset="1" stopColor="#525C67" />
        </linearGradient>
      </defs>
      <ellipse cx="29" cy="45" rx="22" ry="14" fill="url(#heroDuckBody)" />
      <circle cx="42" cy="23" r="13" fill="url(#heroDuckBody)" />
      <ellipse cx="37" cy="17" rx="4.5" ry="3" fill="#FFFFFF" opacity="0.28" />
      <path d="M20 42 Q30 35 42 41 Q37 50 24 48 Q19 46 20 42 Z" fill="#C58A20" />
      <path d="M51 19 Q61 18 62 23 Q61 27 51 26 Z" fill="#E08214" />
      <path d="M53 24 Q58 25 61.5 23.2 Q59 27.5 53 26 Z" fill="#C0680E" />
      <circle cx="46" cy="20" r="2.6" fill="#2B2B2B" />
      <circle cx="47" cy="19" r="0.9" fill="#FFFFFF" />
      <path d="M34 12 Q25 11.5 25 14.5 Q26 17.5 35 16 Z" fill="url(#heroDuckFlap)" />
      <path d="M50 12 Q59 11.5 59 14.5 Q58 17.5 49 16 Z" fill="url(#heroDuckFlap)" />
      <path d="M31 14 Q31 2 42 2 Q53 2 53 14 Z" fill="url(#heroDuckCrown)" />
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
