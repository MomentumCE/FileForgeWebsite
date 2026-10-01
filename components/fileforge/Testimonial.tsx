"use client";

import { Quotes } from "@phosphor-icons/react";
import { ScrollReveal } from "./ui/ScrollReveal";

// The full letter from Trappers Point HOA. The hero pulls one line from it and
// links here (#testimonial), so keep the id stable. The letter is reproduced as
// written - only whitespace has been tidied.
const paragraphs = [
  "I have spent some time searching and reading Trappers Point HOA minutes, newsletters and budgets from our past 30 or more years and I have been amazed with my ability to find information quickly. Searching through 4 boxes of old records assembled by multiple HOA officers was basically impossible until you digitized and provided a search format.",
  "Having boxes of old records in the basement was useless but having a searchable records database on my computer is a valuable tool for our HOA. Using the FileForge search engine is seamless and user friendly.",
  "On behalf of Trappers Point HOA, thank you.",
];

export function Testimonial() {
  return (
    <section
      id="testimonial"
      className="py-24 md:py-32 scroll-mt-20"
      aria-labelledby="testimonial-heading"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="max-w-2xl mb-14">
            <p className="text-sm text-accent font-medium tracking-wide uppercase mb-4">
              In their words
            </p>
            <h2
              id="testimonial-heading"
              className="text-3xl md:text-5xl tracking-tighter leading-[1.05] font-semibold"
            >
              Four boxes in the basement,
              <br />
              searchable in seconds.
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <figure className="relative max-w-4xl rounded-[2rem] bg-surface border border-surface-border p-8 md:p-12">
            <Quotes
              size={40}
              weight="duotone"
              className="text-accent mb-6"
              aria-hidden="true"
            />
            <blockquote className="space-y-5 text-lg md:text-xl leading-relaxed">
              {paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </blockquote>
            <figcaption className="mt-8 pt-6 border-t border-surface-border text-sm text-muted">
              <span className="block text-base font-semibold text-foreground">
                David Ames
              </span>
              Secretary, Trappers Point HOA
            </figcaption>
          </figure>
        </ScrollReveal>
      </div>
    </section>
  );
}
