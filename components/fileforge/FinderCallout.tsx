"use client";

import Link from "next/link";
import { ArrowRight, MagnifyingGlass, ShieldCheck } from "@phosphor-icons/react";
import { ScrollReveal } from "./ui/ScrollReveal";
import { FinderDuckLogo, FinderWordmark } from "@/components/fileforge-finder/FinderMark";

// The one place the service page hands off to the desktop app. The service is
// this site's main offer and Finder is secondary, so this stays a single,
// compact band rather than a second pitch: "once your files are digital, here
// is how you search them."
export function FinderCallout() {
  return (
    <section id="finder" className="py-16 md:py-20" aria-labelledby="finder-callout-heading">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-surface-border bg-surface p-8 md:p-12">
            <div className="absolute inset-0 warm-section opacity-70 pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-8 items-center">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-background/70 py-1.5 pl-2.5 pr-4">
                  <FinderDuckLogo size={22} idPrefix="svc" />
                  <FinderWordmark size={16} />
                </span>
                <h2
                  id="finder-callout-heading"
                  className="text-2xl md:text-4xl tracking-tighter leading-[1.05] font-semibold"
                >
                  And then you can search it.
                </h2>
                <p className="text-base text-muted leading-relaxed max-w-[55ch]">
                  FileForge Finder is our free desktop app for the files we
                  deliver, or any files you already have. It searches the words
                  inside PDFs and Word docs, previews matches without opening
                  them, and runs entirely on your own computer.
                </p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
                  <span className="flex items-center gap-1.5">
                    <MagnifyingGlass size={16} weight="duotone" className="text-accent" />
                    Search inside documents
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={16} weight="duotone" className="text-accent" />
                    100% local, no cloud
                  </span>
                </div>
              </div>
              <div className="flex md:justify-end">
                <Link
                  href="/finder"
                  className="inline-flex items-center gap-2 rounded-full bg-[#d97706] px-7 py-3.5 text-base font-medium !text-white transition-colors hover:bg-[#b45309]"
                >
                  Learn about FileForge Finder
                  <ArrowRight size={18} weight="bold" />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
