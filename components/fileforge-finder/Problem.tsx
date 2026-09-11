"use client";

import {
  MagnifyingGlass,
  Clock,
  ShieldWarning,
  CloudSlash,
  Files,
} from "@phosphor-icons/react";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/fileforge/ui/ScrollReveal";

const pains = [
  {
    name: "Name-search isn't enough",
    detail:
      "Windows Search finds a file if you remember its name. It can't find the one paragraph, buried three folders deep, that actually answers the request.",
    icon: MagnifyingGlass,
  },
  {
    name: "Hours lost per request",
    detail:
      "A single records or FOIA request turns into an afternoon of opening files one by one, hoping the right passage is in there somewhere.",
    icon: Clock,
  },
  {
    name: "Sensitive data slips out",
    detail:
      "SSNs, dates of birth, and card numbers hide inside documents you export. Miss one and it's out the door before anyone notices.",
    icon: ShieldWarning,
  },
  {
    name: "Cloud tools you can't use",
    detail:
      "Uploading tribal rolls, patient charts, or case files to a cloud search service isn't an option. So the good tools stay off-limits.",
    icon: CloudSlash,
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
                <Files size={16} weight="duotone" />
                The records problem
              </div>
              <h2 className="text-3xl md:text-5xl tracking-tighter leading-[1.05] font-semibold">
                The file you need is
                <br />
                somewhere on this computer.
              </h2>
              <p className="text-base text-muted leading-relaxed max-w-[50ch]">
                Records officers, enrollment clerks, and finance teams sit on top
                of decades of documents - and finding the right one still means
                clicking through folders and opening files one at a time. It
                shouldn&apos;t, and it shouldn&apos;t require sending anything to the cloud.
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
