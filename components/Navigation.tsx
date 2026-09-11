"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { DownloadFinderButton } from "@/components/fileforge-finder/DownloadFinderButton";
import { CONTACT_HREF } from "@/lib/site";

// A flat list rather than the Momentum site's Services dropdown: this site has
// three destinations, and a menu for three items is one click too many.
const navLinks = [
  { label: "Paper to Digital", href: "/fileforge-service" },
  { label: "FileForge Finder", href: "/finder" },
  { label: "Sign in", href: "/finder/signin" },
];

// Pages that pitch the desktop app. On these the nav CTA is the download
// button; everywhere else (including the home page, which next.config.ts
// rewrites to the service page) it points at the discovery-call form.
const FINDER_PATHS = new Set(["/finder", "/fileforge-plus"]);

export function Navigation() {
  const pathname = usePathname();
  const onFinderPage = FINDER_PATHS.has(pathname ?? "");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        className={`nav${scrolled ? " scrolled" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <Link href="/" className="nav-logo" aria-label="FileForge home">
          <div className="nav-logo-mark nav-logo-mark--wordmark" aria-hidden="true">
            <Image
              src="/fileforge/fileforge-logo.png"
              alt="FileForge logo"
              width={563}
              height={176}
              priority
            />
          </div>
        </Link>

        <ul className="nav-links" role="list">
          <li>
            <Link href="/">Home</Link>
          </li>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
          <li>
            {onFinderPage ? (
              <DownloadFinderButton
                label="Download FileForge Finder"
                source="nav"
                className="nav-cta nav-cta--orange"
              />
            ) : (
              <Link href={CONTACT_HREF} className="nav-cta nav-cta--orange">
                Learn more
              </Link>
            )}
          </li>
        </ul>

        <button
          type="button"
          className="nav-hamburger"
          aria-label="Toggle mobile menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div
        className={`mobile-menu${menuOpen ? " open" : ""}`}
        role="dialog"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <ul className="mobile-menu-links" role="list">
          <li>
            <Link href="/" onClick={closeMenu}>
              Home
            </Link>
          </li>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={closeMenu}>
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            {onFinderPage ? (
              <DownloadFinderButton
                label="Download FileForge Finder"
                source="nav-mobile"
                className="mobile-cta mobile-cta--orange"
                wrapperClassName="block"
              />
            ) : (
              <Link href={CONTACT_HREF} className="mobile-cta mobile-cta--orange" onClick={closeMenu}>
                Learn more
              </Link>
            )}
          </li>
        </ul>
      </div>
    </>
  );
}
