"use client";

import {
  BuildingOffice,
  MapPin,
  Handshake,
  ShieldCheck,
} from "@phosphor-icons/react";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "./ui/ScrollReveal";

const pillars = [
  {
    name: "On-site scanning",
    detail:
      "Records never leave your premises. The Momentum CE team brings the hardware, sets up where you work, and scans every page under your roof - so you see exactly what happens to your files.",
    icon: BuildingOffice,
  },
  {
    name: "Data sovereignty",
    detail:
      "Your data stays yours. We delete all working copies on handoff unless you ask us not to.",
    icon: Handshake,
  },
  {
    name: "US-based team",
    detail:
      "No offshore processing, no third-party labelers. Work happens with Momentum CE's team on US soil.",
    icon: MapPin,
  },
  {
    name: "Compliance-aware",
    detail:
      "We design engagements around HIPAA, FERPA, CJIS, and tribal sovereignty requirements.",
    icon: ShieldCheck,
  },
];

export function Trust() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="max-w-2xl mb-14">
            <p className="text-sm text-accent font-medium tracking-wide uppercase mb-4">
              Trust
            </p>
            <h2 className="text-3xl md:text-5xl tracking-tighter leading-[1.05] font-semibold">
              Built for records you
              <br />
              can&apos;t afford to lose.
            </h2>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p) => (
            <StaggerItem key={p.name}>
              <div className="h-full p-6 rounded-2xl bg-surface border border-surface-border">
                <p.icon
                  size={28}
                  weight="duotone"
                  className="text-accent mb-4"
                />
                <h3 className="text-base font-semibold tracking-tight mb-2">
                  {p.name}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {p.detail}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
