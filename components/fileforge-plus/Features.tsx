"use client";

import { TextAa, PencilSimpleLine, FolderSimplePlus } from "@phosphor-icons/react";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/fileforge/ui/ScrollReveal";

const features = [
  {
    name: "Make PDFs Searchable (OCR)",
    icon: TextAa,
    accent: "border-l-amber-500",
    iconBg: "from-amber-500/10 to-amber-500/5",
    description:
      "Read scanned PDFs with OCR and save a searchable copy of each - your originals stay untouched. You choose the folder(s).",
  },
  {
    name: "Automatic File Renaming",
    icon: PencilSimpleLine,
    accent: "border-l-emerald-500",
    iconBg: "from-emerald-500/10 to-emerald-500/5",
    description:
      "Read each document and rename it with the on-device AI, following your instructions. You review every change first.",
  },
  {
    name: "Automatic File Filing",
    icon: FolderSimplePlus,
    accent: "border-l-sky-500",
    iconBg: "from-sky-500/10 to-sky-500/5",
    description:
      "Watch a folder for scans and automatically read (OCR), rename, and file each one - using the on-device AI.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="max-w-3xl mb-16">
            <p className="text-sm text-accent font-medium tracking-wide uppercase mb-4">
              What Finder+ adds
            </p>
            <h2 className="text-3xl md:text-5xl tracking-tighter leading-[1.05] font-semibold">
              On-device AI that reads,
              <br />
              renames, and files for you.
            </h2>
            <p className="mt-6 text-base text-muted leading-relaxed max-w-[60ch]">
              Three power tools that turn a folder of scans into clean, searchable,
              organized records - all on your machine, with you approving every
              change.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f) => (
            <StaggerItem key={f.name}>
              <div
                className={`group relative h-full p-7 md:p-8 rounded-2xl bg-surface border-l-2 border border-surface-border ${f.accent} hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.08)] transition-all duration-300`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.iconBg} flex items-center justify-center mb-5`}
                >
                  <f.icon size={24} weight="duotone" className="text-foreground" />
                </div>

                <h3 className="text-xl font-semibold tracking-tight mb-2">
                  {f.name}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {f.description}
                </p>

                <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
