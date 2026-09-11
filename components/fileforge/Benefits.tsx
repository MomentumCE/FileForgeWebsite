"use client";

import {
  MagnifyingGlass,
  PencilSimple,
  Sparkle,
  Table,
  DeviceMobile,
  CloudArrowUp,
} from "@phosphor-icons/react";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "./ui/ScrollReveal";

const benefits = [
  {
    name: "Searchable in seconds",
    icon: MagnifyingGlass,
    detail:
      "Find any document by what's in it, not just its filename. Ctrl-F across decades of records.",
  },
  {
    name: "Editable source files",
    icon: PencilSimple,
    detail:
      "Turn old memos and forms into Word, Excel, or Google Docs your team can actually update.",
  },
  {
    name: "AI-ready",
    icon: Sparkle,
    detail:
      "The same clean files drop into Claude, Copilot, or any AI tool that takes a PDF - whenever you're ready.",
  },
  {
    name: "Tabulate and analyze",
    icon: Table,
    detail:
      "Pull numbers out of old forms into spreadsheets for reporting, audits, and trend analysis.",
  },
  {
    name: "Access from anywhere",
    icon: DeviceMobile,
    detail:
      "Phone, laptop, field site, or home office. No more driving in to grab a file from the cabinet.",
  },
  {
    name: "Disaster-proof",
    icon: CloudArrowUp,
    detail:
      "Backup and cloud storage mean fires, floods, and office moves can't destroy your records.",
  },
];

export function Benefits() {
  return (
    <section className="py-24 md:py-32 warm-section">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="max-w-2xl mb-14">
            <p className="text-sm text-accent font-medium tracking-wide uppercase mb-4">
              Why digitize
            </p>
            <h2 className="text-3xl md:text-5xl tracking-tighter leading-[1.05] font-semibold">
              What you gain when paper
              <br />
              becomes digital.
            </h2>
            <p className="mt-6 text-base text-muted leading-relaxed max-w-[55ch]">
              One engagement unlocks a whole set of new capabilities - use
              whichever matter most to your team today, and the rest are ready
              when you need them.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((b) => (
            <StaggerItem key={b.name}>
              <div className="h-full p-6 rounded-2xl bg-surface border border-surface-border hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.06)] transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center mb-4">
                  <b.icon
                    size={22}
                    weight="duotone"
                    className="text-accent"
                  />
                </div>
                <h3 className="text-base font-semibold tracking-tight mb-2">
                  {b.name}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {b.detail}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
