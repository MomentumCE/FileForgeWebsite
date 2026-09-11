"use client";

import { MagnifyingGlass, Eye, Export, Check } from "@phosphor-icons/react";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/fileforge/ui/ScrollReveal";

const features = [
  {
    name: "Search & refine",
    icon: MagnifyingGlass,
    accent: "border-l-amber-500",
    iconBg: "from-amber-500/10 to-amber-500/5",
    description:
      "Instant search of names and paths as you type, plus BM25 content search once you add folders. A keyword in a parent folder surfaces the file inside it.",
    points: [
      "File-kind chips, date filter & sorting",
      "Quoted phrases and any/all-word matching",
      "One-click recent-search chips",
      "Matched words highlighted in names & snippets",
    ],
  },
  {
    name: "Preview & review",
    icon: Eye,
    accent: "border-l-emerald-500",
    iconBg: "from-emerald-500/10 to-emerald-500/5",
    description:
      "Read any document in-app - per-page text with highlighted matches and prev/next navigation. The app tells you the truth about what it can and can't read.",
    points: [
      "Page-cited PDF matches (p. 41)",
      "Scanned PDFs flagged honestly",
      "Unreadable-scans review list",
      "“≈ possible dupes” badges",
    ],
  },
  {
    name: "Export & prove",
    icon: Export,
    accent: "border-l-sky-500",
    iconBg: "from-sky-500/10 to-sky-500/5",
    description:
      "Export the checked results as copied files, an Excel summary, or a self-contained records package - with a sensitive-data scan and confirm step first.",
    points: [
      "SHA-256 manifest per package",
      "Bates numbering that never repeats",
      "In-app package verification",
      "Originating query recorded in the audit log",
    ],
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="max-w-3xl mb-16">
            <p className="text-sm text-accent font-medium tracking-wide uppercase mb-4">
              What it does
            </p>
            <h2 className="text-3xl md:text-5xl tracking-tighter leading-[1.05] font-semibold">
              Find it, read it,
              <br />
              and prove what you sent.
            </h2>
            <p className="mt-6 text-base text-muted leading-relaxed max-w-[60ch]">
              Three things every records request needs - all in one window, all on
              your machine.
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
                <p className="text-sm text-muted leading-relaxed mb-5">
                  {f.description}
                </p>

                <ul className="space-y-2">
                  {f.points.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-foreground/80"
                    >
                      <Check
                        size={16}
                        weight="bold"
                        className="text-accent shrink-0 mt-0.5"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
