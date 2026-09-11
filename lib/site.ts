// Site-wide constants for the FileForge site. Everything that used to be a
// hardcoded "https://momentumce.com" on the Momentum site resolves through here
// so the domain can be changed in one place (or per-environment via env).

// The canonical origin, without a trailing slash. Used for metadataBase, the
// sitemap, robots.txt and the download route's origin allowlist. Override with
// NEXT_PUBLIC_SITE_URL (e.g. a Netlify deploy preview or a staging domain).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://fileforge.com"
).replace(/\/+$/, "");

// Bare host of SITE_URL ("fileforge.com"), for places that compare hosts rather
// than URLs.
export const SITE_HOST = new URL(SITE_URL).host;

// Where every "Learn more" CTA (formerly "Start your free discovery call") sends the visitor: the
// contact form (components/Contact.tsx) at the bottom of the service page,
// which is also the home page. Submissions land in Netlify Forms under
// "contact".
export const CONTACT_HREF = "/#contact";

// The consulting company behind FileForge, linked from the footer.
export const MOMENTUM_URL = "https://momentumce.com";
