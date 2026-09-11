"use client";

import {
  ShieldCheck,
  Lock,
  Prohibit,
  ClipboardText,
} from "@phosphor-icons/react";
import { ScrollReveal } from "@/components/fileforge/ui/ScrollReveal";

const pillars = [
  {
    name: "Nothing leaves the machine",
    detail:
      "All indexing, search, preview, and export happen locally. Content indexing runs in a bundled local indexer - there is no server to talk to.",
    icon: Prohibit,
  },
  {
    name: "Encrypted at rest",
    detail:
      "The searchable-text index and the tamper-evident audit log are sealed with your OS user-account encryption (DPAPI on Windows, Keychain on macOS).",
    icon: Lock,
  },
  {
    name: "Network denied by default",
    detail:
      "Every outside request is blocked at the session layer, and the Trust panel shows a live count of blocked attempts for your IT or council reviewers.",
    icon: ShieldCheck,
  },
  {
    name: "Auditable & verifiable",
    detail:
      "A hash-chained activity log records what was searched and exported, and any records package can be verified in-app against its SHA-256 manifest.",
    icon: ClipboardText,
  },
];

export function Privacy() {
  return (
    <section id="privacy" className="py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-16 items-start">
          <ScrollReveal>
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-sm text-accent">
                <ShieldCheck size={16} weight="duotone" />
                Private — stays on this computer
              </div>
              <h2 className="text-3xl md:text-5xl tracking-tighter leading-[1.05] font-semibold">
                The data never
                <br />
                leaves the building.
              </h2>
              <p className="text-base text-muted leading-relaxed max-w-[46ch]">
                FileForge Finder was built for tribal rolls, patient charts, and
                case files - records you can&apos;t put in the cloud. The Trust panel
                shows exactly where every piece of data lives and produces a
                plain-text privacy report for reviewers.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((p) => (
              <div
                key={p.name}
                className="h-full p-6 rounded-2xl bg-surface border border-surface-border"
              >
                <p.icon size={28} weight="duotone" className="text-accent mb-4" />
                <h3 className="text-base font-semibold tracking-tight mb-2">
                  {p.name}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{p.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
