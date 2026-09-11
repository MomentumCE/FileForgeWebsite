"use client";

import { useRef, useState, useEffect } from "react";
import {
  ChatCircleText,
  Scan,
  Database,
} from "@phosphor-icons/react";
import { ProcessAnimation } from "./ProcessAnimation";

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "Free consultation. We walk your space, assess document volume and condition, and scope the engagement with firm timeline and pricing.",
    icon: ChatCircleText,
    accent: "border-l-amber-500",
    iconBg: "from-amber-500/10 to-amber-500/5",
  },
  {
    number: "02",
    title: "Digitize",
    description:
      "We bring our scanners to your site, capture every page, and run OCR. You get status updates and sample batches along the way.",
    icon: Scan,
    accent: "border-l-emerald-500",
    iconBg: "from-emerald-500/10 to-emerald-500/5",
  },
  {
    number: "03",
    title: "Deliver",
    description:
      "Clean, organized files - named consistently, grouped into a sensible folder structure, and handed off to your systems (SharePoint, Drive, your network drive, or the tool of your choice).",
    icon: Database,
    accent: "border-l-sky-500",
    iconBg: "from-sky-500/10 to-sky-500/5",
  },
];

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = el.scrollHeight - window.innerHeight;
      const p = clamp(-rect.top / scrollable, 0, 1);
      setProgress(p);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const activeStep = progress < 0.33 ? 0 : progress < 0.66 ? 1 : 2;

  return (
    <section id="process" ref={sectionRef} className="h-[1800px] relative warm-section">
      <div className="sticky top-0 h-[100dvh] overflow-hidden flex flex-col">
        {/* Header - inside the sticky frame */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 w-full pt-16 pb-4">
          <p className="text-sm text-accent font-medium tracking-wide uppercase mb-3">
            How we work
          </p>
          <h2 className="text-3xl md:text-4xl tracking-tighter leading-[1.05] font-semibold">
            Three phases to organized digital files.
          </h2>
        </div>

        {/* Animation + cards */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 w-full flex-1 min-h-0 pb-4">
          {/* Desktop: side by side */}
          <div className="hidden lg:grid grid-cols-[1.2fr_1fr] gap-10 h-full items-center">
            {/* Left: Canvas animation */}
            <div className="relative h-[72vh] rounded-[2rem] overflow-hidden bg-background">
              <ProcessAnimation progress={progress} />
            </div>

            {/* Right: Progress line + Step cards */}
            <div className="flex gap-6 min-w-0">
              {/* Vertical progress track */}
              <div className="relative flex flex-col items-center py-8 shrink-0">
                {/* Track background */}
                <div className="absolute top-8 bottom-8 w-px bg-surface-border" />
                {/* Track fill */}
                <div
                  className="absolute top-8 w-px bg-accent transition-all duration-300 ease-out"
                  style={{ height: `${progress * 100}%`, maxHeight: "calc(100% - 4rem)" }}
                />
                {/* Step dots */}
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className="relative z-10 flex-1 flex items-center"
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-500 ${
                        activeStep >= i
                          ? "border-accent bg-accent"
                          : "border-surface-border bg-background"
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Step cards */}
              <div className="flex flex-col gap-3 flex-1">
              {steps.map((step, i) => {
                const isActive = activeStep === i;
                return (
                  <div
                    key={step.number}
                    className={`relative p-5 md:p-6 rounded-2xl border-l-2 border border-surface-border transition-all duration-500 ${
                      isActive
                        ? `${step.accent} bg-surface shadow-[0_12px_30px_-10px_rgba(0,0,0,0.06)] scale-[1.02] opacity-100`
                        : "border-l-transparent bg-surface/50 opacity-40 scale-100"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${step.iconBg} flex items-center justify-center transition-transform duration-500 ${
                          isActive ? "scale-110" : ""
                        }`}
                      >
                        <step.icon
                          size={20}
                          weight="duotone"
                          className="text-foreground"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span
                            className={`text-xs font-mono tracking-widest transition-colors duration-300 ${
                              isActive ? "text-accent" : "text-muted"
                            }`}
                          >
                            {step.number}
                          </span>
                          <h3 className="text-base font-semibold tracking-tight">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-sm text-muted leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          </div>

          {/* Mobile: stacked */}
          <div className="lg:hidden flex flex-col gap-6 h-full justify-center">
            <div className="relative h-[45vh] rounded-[1.5rem] overflow-hidden bg-background">
              <ProcessAnimation progress={progress} />
            </div>
            <div className="flex flex-col gap-2">
              {steps.map((step, i) => {
                const isActive = activeStep === i;
                return (
                  <div
                    key={step.number}
                    className={`p-4 rounded-xl border-l-2 border border-surface-border transition-all duration-500 ${
                      isActive
                        ? `${step.accent} bg-surface opacity-100`
                        : "border-l-transparent bg-surface/50 opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <step.icon
                        size={18}
                        weight="duotone"
                        className="text-foreground shrink-0"
                      />
                      <span className="text-xs font-mono text-muted tracking-widest">
                        {step.number}
                      </span>
                      <h3 className="text-base font-semibold tracking-tight">
                        {step.title}
                      </h3>
                    </div>
                    {isActive && (
                      <p className="mt-2 text-sm text-muted leading-relaxed pl-[42px]">
                        {step.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scroll indicator - fades out as user scrolls */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-opacity duration-500"
          style={{ opacity: progress < 0.85 ? 0.4 : 0 }}
        >
          <span className="text-[11px] font-mono text-muted tracking-wider">
            scroll
          </span>
          <svg
            width="16"
            height="24"
            viewBox="0 0 16 24"
            fill="none"
            className="text-muted animate-bounce"
          >
            <path
              d="M8 4v12m0 0l-4-4m4 4l4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
