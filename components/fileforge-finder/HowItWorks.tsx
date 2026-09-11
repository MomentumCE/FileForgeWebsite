"use client";

import { FolderPlus, MagnifyingGlass, Eye, Export } from "@phosphor-icons/react";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/fileforge/ui/ScrollReveal";

const steps = [
  {
    number: "01",
    title: "Index",
    description:
      "On first run, a welcome card explains what happens before anything is scanned. Point it at your home folder, specific folders, or the whole computer.",
    icon: FolderPlus,
    iconBg: "from-amber-500/10 to-amber-500/5",
  },
  {
    number: "02",
    title: "Search",
    description:
      "Type. Names match instantly; content matches follow from an incremental index. Refine with file-kind chips, a date filter, and sorting.",
    icon: MagnifyingGlass,
    iconBg: "from-emerald-500/10 to-emerald-500/5",
  },
  {
    number: "03",
    title: "Preview",
    description:
      "Press Enter to read the document in-app, page by page, with your matched words highlighted - no need to open the source file.",
    icon: Eye,
    iconBg: "from-sky-500/10 to-sky-500/5",
  },
  {
    number: "04",
    title: "Export",
    description:
      "Check what you need and export a records package - files, an Excel summary, or a verifiable bundle with a manifest and Bates numbers.",
    icon: Export,
    iconBg: "from-violet-500/10 to-violet-500/5",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 warm-section">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="max-w-2xl mb-14">
            <p className="text-sm text-accent font-medium tracking-wide uppercase mb-4">
              How it works
            </p>
            <h2 className="text-3xl md:text-5xl tracking-tighter leading-[1.05] font-semibold">
              From install to answer
              <br />
              in four steps.
            </h2>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step) => (
            <StaggerItem key={step.number}>
              <div className="relative h-full p-6 rounded-2xl bg-surface border border-surface-border hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.06)] transition-all duration-300">
                <span className="text-xs font-mono tracking-widest text-accent">
                  {step.number}
                </span>
                <div
                  className={`mt-4 mb-4 w-11 h-11 rounded-xl bg-gradient-to-br ${step.iconBg} flex items-center justify-center`}
                >
                  <step.icon size={22} weight="duotone" className="text-foreground" />
                </div>
                <h3 className="text-base font-semibold tracking-tight mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
