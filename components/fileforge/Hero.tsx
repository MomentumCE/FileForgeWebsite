"use client";

import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  BuildingOffice,
  MapPin,
} from "@phosphor-icons/react";
import { MomentumMark } from "@/components/MomentumByline";
import { MagneticButton } from "./ui/MagneticButton";
import { AnimatedHeadline } from "./ui/AnimatedText";
import { motion } from "framer-motion";
import { PaperToDigital } from "./PaperToDigital";
import { CONTACT_HREF, MOMENTUM_URL } from "@/lib/site";

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
              className="inline-block"
            >
              <a
                href={MOMENTUM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-surface-border bg-surface/60 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <MomentumMark width={34} />
                A Momentum CE service
                <ArrowUpRight
                  size={14}
                  weight="bold"
                  className="opacity-50 transition-opacity group-hover:opacity-100"
                />
              </a>
            </motion.div>

            {/* A customer's words lead the hero, so the quote gets the display
                type. The service statement stays the page's h1 for search and
                screen readers, just set smaller beneath it. */}
            <figure className="space-y-5">
              <blockquote>
                <AnimatedHeadline
                  as="p"
                  text="“I have been amazed with my ability to find information quickly.”"
                  className="font-head text-4xl md:text-6xl lg:text-[4.25rem] tracking-tight leading-[1.08] pb-[0.12em] font-semibold gradient-text"
                />
              </blockquote>
              <motion.figcaption
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, type: "spring", stiffness: 100, damping: 20 }}
                className="flex flex-wrap items-center gap-x-4 gap-y-2"
              >
                <span className="flex items-center gap-3">
                  <span aria-hidden="true" className="h-px w-8 bg-accent" />
                  <span className="text-sm md:text-base">
                    <span className="font-semibold text-foreground">David Ames</span>
                    <span className="text-muted">
                      , Secretary of the Trappers Point HOA
                    </span>
                  </span>
                </span>
                <a
                  href="#testimonial"
                  className="group inline-flex items-center gap-1 text-sm font-medium !text-accent hover:underline underline-offset-4"
                >
                  Read the full letter
                  <ArrowDown
                    size={14}
                    weight="bold"
                    className="transition-transform group-hover:translate-y-0.5"
                  />
                </a>
              </motion.figcaption>
            </figure>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, type: "spring", stiffness: 100, damping: 20 }}
              className="space-y-3"
            >
              <h1 className="text-2xl md:text-3xl tracking-tight leading-tight font-semibold">
                Paper to digital. We handle everything in between.
              </h1>
              <p className="text-base md:text-lg text-muted leading-relaxed max-w-[55ch]">
                FileForge is Momentum CE&apos;s end-to-end digitization service. Our
                team shows up on-site, scans with professional hardware, runs OCR,
                and delivers clean, organized digital files - named consistently,
                grouped sensibly, and ready for whatever your team needs to do
                next.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, type: "spring", stiffness: 100, damping: 20 }}
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
              transition={{ delay: 1.2 }}
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
