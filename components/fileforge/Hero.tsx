"use client";

import { ArrowRight, ShieldCheck, BuildingOffice, MapPin } from "@phosphor-icons/react";
import { MagneticButton } from "./ui/MagneticButton";
import { AnimatedHeadline } from "./ui/AnimatedText";
import { motion } from "framer-motion";
import { PaperToDigital } from "./PaperToDigital";
import { CONTACT_HREF } from "@/lib/site";

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
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-surface-border bg-surface/60 text-sm text-muted"
            >
              <MapPin size={16} weight="duotone" />
              A Momentum CE service
            </motion.div>

            <AnimatedHeadline
              text="Paper to digital. We handle everything in between."
              className="text-4xl md:text-6xl lg:text-7xl tracking-tighter leading-[0.95] font-semibold gradient-text"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 20 }}
              className="text-base md:text-lg text-muted leading-relaxed max-w-[55ch]"
            >
              FileForge is Momentum CE&apos;s end-to-end digitization service. Our
              team shows up on-site, scans with professional hardware, runs OCR,
              and delivers clean, organized digital files - named consistently,
              grouped sensibly, and ready for whatever your team needs to do
              next.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, type: "spring", stiffness: 100, damping: 20 }}
              className="flex flex-wrap items-center gap-4"
            >
              <MagneticButton
                href={CONTACT_HREF}
                className="px-8 py-3.5 bg-[#d97706] !text-white text-base font-medium rounded-full hover:bg-[#b45309]"
              >
                <span className="flex items-center gap-2">
                  Learn more
                  <ArrowRight size={18} weight="bold" />
                </span>
              </MagneticButton>
              <a
                href="#services"
                className="text-sm text-muted hover:text-foreground transition-colors underline underline-offset-4"
              >
                See how it works
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
                Secure document handling
              </span>
              <span className="flex items-center gap-1.5">
                <BuildingOffice size={16} weight="duotone" className="text-accent" />
                On-site
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={16} weight="duotone" className="text-accent" />
                US-based team
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 80, damping: 20 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-surface border border-surface-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)]">
              <PaperToDigital />
            </div>

            <div className="absolute -z-10 -inset-8 rounded-[3rem] bg-gradient-to-br from-accent/8 to-transparent blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
