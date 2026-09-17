"use client";

import { ArrowUpRight } from "@phosphor-icons/react";
import { ScrollReveal } from "./ui/ScrollReveal";
import { MomentumByline } from "@/components/MomentumByline";
import { MOMENTUM_URL } from "@/lib/site";

// FileForge is one of Momentum CE's offerings, and visitors who land here from
// search have no other way back to the parent company's site. This is the one
// place that says so at length; everywhere else (nav, hero badge, footer) is a
// bare link. Deliberately lighter than FinderCallout so it reads as context
// rather than a second pitch competing with the CTA below it.
export function MomentumCallout() {
  return (
    <section
      className="py-12 md:py-16"
      aria-labelledby="momentum-callout-heading"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="rounded-[2rem] border border-surface-border bg-surface p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6 md:gap-8 items-center">
              <div className="space-y-3">
                {/* The lockup itself is the heading here - the section is about
                    exactly the relationship it spells out. The visually
                    smaller byline is still read in full by a screen reader. */}
                <h2
                  id="momentum-callout-heading"
                  className="brand-lockup"
                  aria-label="FileForge by Momentum CE"
                >
                  <span className="text-4xl md:text-5xl tracking-tighter leading-none font-semibold">
                    FileForge
                  </span>
                  <MomentumByline markWidth={54} className="momentum-byline--lg" />
                </h2>
                <p className="text-base text-muted leading-relaxed max-w-[60ch]">
                  Momentum CE is a Fort Collins consulting firm working with
                  tribal organizations and small businesses on the operational
                  side of their work. FileForge is our records practice - if you
                  need help beyond paper and files, that is where the rest of it
                  lives.
                </p>
              </div>
              <div className="flex md:justify-end">
                <a
                  href={MOMENTUM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-background px-7 py-3.5 text-base font-medium transition-colors hover:border-accent hover:text-accent"
                >
                  Visit Momentum CE
                  <ArrowUpRight size={18} weight="bold" />
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
