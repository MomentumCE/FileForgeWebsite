"use client";

import {
  MagnifyingGlass,
  Eye,
  Lock,
  Keyboard,
  Package,
  Detective,
} from "@phosphor-icons/react";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/fileforge/ui/ScrollReveal";

const benefits = [
  {
    name: "Full-text search",
    icon: MagnifyingGlass,
    detail:
      "Search the words inside PDFs and Word docs as you type. Quoted phrases, any/all-word matching, and page-cited results (p. 41).",
  },
  {
    name: "Preview without opening",
    icon: Eye,
    detail:
      "Press Enter to read any document in-app, page by page, with your matched words highlighted. Never lose your place in a stack of files.",
  },
  {
    name: "Sensitive-data flags",
    icon: Detective,
    detail:
      "Every export scans for SSNs, dates of birth, phone and card numbers - and asks you to confirm before anything leaves.",
  },
  {
    name: "Defensible records packages",
    icon: Package,
    detail:
      "Export checked results as a self-contained package with a SHA-256 manifest and Bates numbering. Anyone can verify nothing was altered.",
  },
  {
    name: "Keyboard-first",
    icon: Keyboard,
    detail:
      "↑/↓ to move, Enter to preview, Ctrl+Enter to open, / to search. Summon the window from anywhere in Windows with Ctrl+Space.",
  },
  {
    name: "Private by design",
    icon: Lock,
    detail:
      "The index and audit log are encrypted at rest with your OS account. Your files and searches never leave the machine: every outside request is blocked at the session layer, apart from checking for updates.",
  },
];

export function Benefits() {
  return (
    <section className="py-24 md:py-32 warm-section">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="max-w-2xl mb-14">
            <p className="text-sm text-accent font-medium tracking-wide uppercase mb-4">
              Why FileForge Finder
            </p>
            <h2 className="text-3xl md:text-5xl tracking-tighter leading-[1.05] font-semibold">
              Built for records work,
              <br />
              not general web search.
            </h2>
            <p className="mt-6 text-base text-muted leading-relaxed max-w-[55ch]">
              Plain-language UI, adjustable text size, and a tamper-evident
              activity log - designed for office staff on modest Windows laptops,
              not power users.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((b) => (
            <StaggerItem key={b.name}>
              <div className="h-full p-6 rounded-2xl bg-surface border border-surface-border hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.06)] transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center mb-4">
                  <b.icon size={22} weight="duotone" className="text-accent" />
                </div>
                <h3 className="text-base font-semibold tracking-tight mb-2">
                  {b.name}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{b.detail}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
