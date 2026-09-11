"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Adds .visible to every .fade-up element as it scrolls into view (the
// section-level entrance animation used by the pricing block and the contact
// form), and nudges the contact form's submit button with the .cta-wiggle
// animation once the #contact section is on screen. Re-runs on route change so
// client-side navigations get the effect too.
export function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    document
      .querySelectorAll(".fade-up:not(.visible)")
      .forEach((el) => fadeObserver.observe(el));

    const wiggleObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const cta = entry.target.querySelector<HTMLElement>(".cta-wiggle-target");
          if (cta) {
            setTimeout(() => {
              cta.classList.add("cta-wiggle");
              cta.addEventListener(
                "animationend",
                () => cta.classList.remove("cta-wiggle"),
                { once: true }
              );
            }, 1500);
          }
          wiggleObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll("#contact").forEach((el) => wiggleObserver.observe(el));

    return () => {
      fadeObserver.disconnect();
      wiggleObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
