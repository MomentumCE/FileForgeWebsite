"use client";

import {
  Printer,
  TextT,
  Folders,
  Check,
} from "@phosphor-icons/react";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "./ui/ScrollReveal";

const services = [
  {
    name: "On-site scanning",
    icon: Printer,
    accent: "border-l-amber-500",
    iconBg: "from-amber-500/10 to-amber-500/5",
    description:
      "We bring our team and scanning hardware to your site. Your records stay on your premises the whole time - under documented chain-of-custody from box to scan.",
    deliverables: [
      "Scanning at your location",
      "Volume from a single box to whole archives",
    ],
  },
  {
    name: "OCR & document processing",
    icon: TextT,
    accent: "border-l-emerald-500",
    iconBg: "from-emerald-500/10 to-emerald-500/5",
    description:
      "Every page becomes searchable text. We classify, deskew, clean up, and apply redaction where required.",
    deliverables: [
      "Searchable PDF/A with text layer",
      "Metadata for search & filtering",
    ],
  },
  {
    name: "File organization & smart naming",
    icon: Folders,
    accent: "border-l-sky-500",
    iconBg: "from-sky-500/10 to-sky-500/5",
    description:
      "We rename files with consistent conventions, classify by type, build a sensible folder structure, and flag duplicates - so your team (or any tool you plug in) can actually find what they need.",
    deliverables: [
      "Automatic classification & naming",
      "Consistent naming conventions",
      "Logical folder hierarchy",
      "Duplicate detection & cleanup",
    ],
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="max-w-3xl mb-16">
            <p className="text-sm text-accent font-medium tracking-wide uppercase mb-4">
              Services
            </p>
            <h2 className="text-3xl md:text-5xl tracking-tighter leading-[1.05] font-semibold">
              One partner. A turnkey solution
              <br />
              to convert paper to organized digital files.
            </h2>
            <p className="mt-6 text-base text-muted leading-relaxed max-w-[60ch]">
              Pick the full engagement or just the piece you need. Either way,
              one team owns the outcome end-to-end.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((service) => (
            <StaggerItem key={service.name}>
              <div
                className={`group relative h-full p-7 md:p-8 rounded-2xl bg-surface border-l-2 border border-surface-border ${service.accent} hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.08)] transition-all duration-300`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.iconBg} flex items-center justify-center mb-5`}
                >
                  <service.icon
                    size={24}
                    weight="duotone"
                    className="text-foreground"
                  />
                </div>

                <h3 className="text-xl font-semibold tracking-tight mb-2">
                  {service.name}
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-5">
                  {service.description}
                </p>

                <ul className="space-y-2">
                  {service.deliverables.map((item) => (
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
