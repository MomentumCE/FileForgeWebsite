"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MagneticButton } from "./ui/MagneticButton";
import { ScrollReveal } from "./ui/ScrollReveal";
import { CONTACT_HREF } from "@/lib/site";

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
      transition={{
        delay: 1.2,
        duration: 0.6,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

export function CTA() {
  return (
    <section id="contact-cta" className="py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="relative rounded-[2.5rem] bg-surface border border-surface-border p-12 md:p-20 text-center overflow-hidden">
            <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl tracking-tighter leading-[1.05] font-semibold">
                Ready to turn paper
                <br />
                into answers?
              </h2>
              <p className="text-base text-muted leading-relaxed">
                Book a free consultation. We&apos;ll scope the project, estimate
                timeline and cost, and map out how your team will use the files
                once they&apos;re digital.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <WiggleButton>
                  <MagneticButton
                    href={CONTACT_HREF}
                    className="px-8 py-3.5 bg-[#d97706] !text-white text-base font-medium rounded-full hover:bg-[#b45309]"
                  >
                    <span className="flex items-center gap-2">
                      Learn more
                      <ArrowRight size={18} weight="bold" />
                    </span>
                  </MagneticButton>
                </WiggleButton>
                <a
                  href="#services"
                  className="text-sm text-muted hover:text-foreground transition-colors underline underline-offset-4"
                >
                  Browse services
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
