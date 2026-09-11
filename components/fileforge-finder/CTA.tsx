"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ScrollReveal } from "@/components/fileforge/ui/ScrollReveal";
import { DownloadFinderButton } from "@/components/fileforge-finder/DownloadFinderButton";

function WiggleButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      animate={
        isInView
          ? {
              rotate: [0, -2, 2, -2, 2, -1, 1, 0],
              scale: [1, 1.03, 1.03, 1.03, 1.03, 1.02, 1.01, 1],
            }
          : {}
      }
      transition={{ delay: 1.2, duration: 0.6, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

export function CTA() {
  return (
    <section id="get-started" className="py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="relative rounded-[2.5rem] bg-surface border border-surface-border p-12 md:p-20 text-center overflow-hidden">
            <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl tracking-tighter leading-[1.05] font-semibold">
                Stop opening files
                <br />
                one at a time.
              </h2>
              <p className="text-base text-muted leading-relaxed">
                Subscribe, install FileForge Finder, and search the words inside
                every document on your computer - without a single byte leaving it.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <WiggleButton>
                  <DownloadFinderButton
                    label="Download FileForge Finder"
                    source="cta"
                    className="px-8 py-3.5 bg-[#d97706] !text-white text-base font-medium rounded-full hover:bg-[#b45309]"
                  />
                </WiggleButton>
                <a
                  href="/finder/signin"
                  className="text-sm text-muted hover:text-foreground transition-colors underline underline-offset-4"
                >
                  Already subscribed? Sign in
                </a>
              </div>
            </div>

            <div className="absolute inset-0 mesh-gradient opacity-80 pointer-events-none" />

            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
