import Link from "next/link";
import Image from "next/image";
import { MomentumBylineLink } from "@/components/MomentumByline";
import { CONTACT_HREF, MOMENTUM_URL } from "@/lib/site";

const productLinks = [
  { label: "Paper to Digital service", href: "/fileforge-service" },
  { label: "FileForge Finder", href: "/finder" },
  { label: "FileForge Finder+", href: "/fileforge-plus" },
  { label: "Sign in", href: "/finder/signin" },
];

const supportLinks = [
  { label: "Send feedback", href: "/finder/feedback" },
  { label: "Terms of Use", href: "/finder/terms" },
  { label: "Privacy Policy", href: "/finder/privacy" },
  { label: "Contact us", href: CONTACT_HREF },
  { label: "Momentum CE", href: MOMENTUM_URL, external: true },
];

export function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <div className="footer-brand-logo">
              <span className="brand-lockup">
                <span
                  className="footer-brand-logo-mark footer-brand-logo-mark--wordmark"
                  aria-hidden="true"
                >
                  <Image
                    src="/fileforge/fileforge-logo.png"
                    alt="FileForge logo"
                    width={563}
                    height={176}
                    loading="lazy"
                  />
                </span>
                <MomentumBylineLink
                  className="momentum-byline--on-dark"
                  markWidth={46}
                />
              </span>
            </div>
            <p className="footer-brand-desc">
              <em className="footer-brand-desc-accent">
                Paper to organized digital files.
              </em>{" "}
              FileForge is an end-to-end digitization service: on-site scanning,
              OCR, and file organization by one team. FileForge Finder, our
              desktop app, then searches inside those files, 100% locally. Both
              from{" "}
              <a href={MOMENTUM_URL} target="_blank" rel="noopener noreferrer">
                Momentum CE
              </a>
              .
            </p>
          </div>

          <div>
            <div className="footer-col-title">Products</div>
            <ul className="footer-links" role="list">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Support</div>
            <ul className="footer-links" role="list">
              {supportLinks.map((link) =>
                link.external ? (
                  <li key={link.label}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label}
                    </a>
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; 2026 Momentum CE Inc. All rights reserved.
          </p>
          <address className="footer-location">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Fort Collins, CO, USA
          </address>
        </div>
      </div>
    </footer>
  );
}
