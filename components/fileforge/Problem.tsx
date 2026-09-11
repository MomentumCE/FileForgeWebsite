"use client";

import {
  EyeSlash,
  Clock,
  ShieldWarning,
  Folders,
  Archive,
} from "@phosphor-icons/react";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "./ui/ScrollReveal";

const pains = [
  {
    name: "Invisible to search",
    detail: "Paper can't be searched, shared by email, or opened on a phone. Your best knowledge sits on a shelf.",
    icon: EyeSlash,
  },
  {
    name: "Slow to retrieve",
    detail: "Hours lost every week walking to the file room and flipping through folders.",
    icon: Clock,
  },
  {
    name: "Compliance risk",
    detail: "No audit trail, no offsite backup, no redaction. One leak or fire and it's gone.",
    icon: ShieldWarning,
  },
  {
    name: "Institutional memory fades",
    detail: "Records decay, staff turn over, context disappears. The knowledge was never digital.",
    icon: Folders,
  },
];

export function Problem() {
  return (
    <section className="py-24 md:py-32 brick-wall">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16 items-start">
          <ScrollReveal>
            <div className="space-y-6 lg:sticky lg:top-24">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-200 bg-amber-50 text-sm text-amber-800">
                <Archive size={16} weight="duotone" />
                The paper problem
              </div>
              <h2 className="text-3xl md:text-5xl tracking-tighter leading-[1.05] font-semibold">
                Your knowledge is
                <br />
                trapped in filing cabinets.
              </h2>
              <p className="text-base text-muted leading-relaxed max-w-[50ch]">
                Decades of records - patient charts, tribal rolls, legal files,
                land records, case files - sit on paper. Every year they get
                harder to find, harder to protect, and further from the tools
                your team actually uses.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pains.map((pain) => (
              <StaggerItem key={pain.name}>
                <div className="group relative p-6 rounded-2xl bg-surface border-l-2 border border-surface-border border-l-amber-400 hover:border-foreground/10 hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.08)] transition-all duration-300 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold tracking-tight">
                      {pain.name}
                    </h3>
                    <pain.icon
                      size={22}
                      weight="duotone"
                      className="text-amber-500 shrink-0"
                    />
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    {pain.detail}
                  </p>

                  <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
