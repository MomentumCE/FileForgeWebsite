"use client";

import { ShieldCheck, WifiHigh, Desktop } from "@phosphor-icons/react";
import { AnimatedHeadline } from "@/components/fileforge/ui/AnimatedText";
import { motion } from "framer-motion";
import { AppPreview } from "./AppPreview";
import { DownloadFinderButton } from "@/components/fileforge-finder/DownloadFinderButton";
import { FinderDuckLogo, FinderWordmark } from "@/components/fileforge-finder/FinderMark";

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
              <FinderDuckLogo size={22} idPrefix="hero" />
              <FinderWordmark size={17} />
            </motion.div>

            <AnimatedHeadline
              text="Find any document by its name or what's inside it."
              className="text-4xl md:text-6xl lg:text-7xl tracking-tighter leading-[0.95] font-semibold gradient-text"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 20 }}
              className="text-base md:text-lg text-muted leading-relaxed max-w-[55ch]"
            >
              FileForge Finder searches the words <em>inside</em> your files - PDFs
              and Word docs - as well as their names. Peek at any document without
              opening it, flag sensitive info, and export defensible records
              packages. It all runs locally: no cloud, and your files never leave your
              device.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, type: "spring", stiffness: 100, damping: 20 }}
              className="flex flex-wrap items-center gap-4"
            >
              <DownloadFinderButton
                label="Download FileForge Finder"
                source="hero"
                className="px-8 py-3.5 bg-[#d97706] !text-white text-base font-medium rounded-full hover:bg-[#b45309]"
              />
              <a
                href="/fileforge-plus"
                className="text-sm text-muted hover:text-foreground transition-colors underline underline-offset-4"
              >
                Need OCR, renaming &amp; filing? Get FileForge Finder+
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted pt-2"
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} weight="duotone" className="text-accent" />
                100% local &amp; private
              </span>
              <span className="flex items-center gap-1.5">
                <WifiHigh size={16} weight="duotone" className="text-accent" />
                No cloud processing
              </span>
              <span className="flex items-center gap-1.5">
                <Desktop size={16} weight="duotone" className="text-accent" />
                Available for Mac, Windows &amp; Linux
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
              <AppPreview />
            </div>

            <div className="absolute -z-10 -inset-8 rounded-[3rem] bg-gradient-to-br from-accent/10 to-transparent blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
