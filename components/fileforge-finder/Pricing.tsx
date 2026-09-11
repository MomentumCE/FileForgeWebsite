"use client";

import { Check } from "@phosphor-icons/react";
import { ScrollReveal } from "@/components/fileforge/ui/ScrollReveal";
import { DownloadFinderButton } from "@/components/fileforge-finder/DownloadFinderButton";
import { GET_FINDER_HREF } from "@/lib/fileforge-finder";

const included = [
  "Full-text search across PDFs & Word docs",
  "In-app preview with highlighted matches",
  "Sensitive-data scanning on export",
  "Verifiable records packages with Bates numbering",
  "Encrypted index & tamper-evident audit log",
  "Windows & macOS",
  "Runs fully offline",
  "Ongoing updates",
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 warm-section">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="text-sm text-accent font-medium tracking-wide uppercase mb-4">
              Pricing
            </p>
            <h2 className="text-3xl md:text-5xl tracking-tighter leading-[1.05] font-semibold">
              A simple subscription.
            </h2>
            <p className="mt-6 text-base text-muted leading-relaxed">
              Subscribe self-serve and get instant access, or pay by invoice on an
              existing Momentum CE contract. Cancel anytime.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal className="max-w-md mx-auto">
          <div className="rounded-[2rem] bg-surface border border-surface-border p-8 md:p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
            <div className="text-center pb-6 border-b border-surface-border">
              <div className="text-lg font-semibold tracking-tight">
                FileForge Finder
              </div>
              <div className="mt-2 text-4xl font-semibold tracking-tighter">
                Monthly subscription
              </div>
              <div className="mt-2 text-sm text-muted">
                Pricing shown at checkout · cancel anytime
              </div>
            </div>

            <ul className="space-y-3 py-7">
              {included.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-foreground/85"
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

            <DownloadFinderButton
              label="Download FileForge Finder"
              source="pricing"
              wrapperClassName="block"
              className="w-full px-8 py-3.5 bg-[#d97706] !text-white text-base font-medium rounded-full hover:bg-[#b45309]"
            />

            <p className="mt-4 text-center text-xs text-muted">
              Paying by invoice or on a contract?{" "}
              <a
                href={GET_FINDER_HREF}
                className="text-accent underline underline-offset-2"
              >
                Create your account
              </a>{" "}
              and the team will activate it.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
