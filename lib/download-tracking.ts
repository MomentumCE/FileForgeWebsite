import { getStore } from "@netlify/blobs";
import type { NextRequest } from "next/server";
import { clientKey } from "./download-guards";

// One recorded download. Everything here is non-identifying. `clientKey` is the
// one IP-derived field, and it is a salted digest, not an address: it can't be
// reversed to an IP, only compared against the digest of whoever is asking.
// That's enough for the stats dashboard to recognize (and exclude) its own test
// downloads.
//
// Deliberately NOT recorded: the signed-in subscriber's email. The download
// route knows it (it resolves an Outseta profile to authorize the paid build),
// but attributing a download to a named person is not something the counter
// needs, and keeping it would put an email-linked record under the retention
// and data-subject-rights commitments in the privacy policy. Don't add it back
// without updating content/legal/fileforge-finder-privacy-policy.md.
export type DownloadEvent = {
  ts: string; // ISO timestamp
  platform: "mac" | "windows" | "linux";
  // Which build was served: the standard Finder, or the paid Finder+ handed to
  // signed-in subscribers.
  product: "finder" | "finder-plus";
  // How the download was authorized: the friction-free public download,
  // a shared password page, or a signed-in subscriber.
  authPath: "free" | "password" | "token";
  // Which CTA / page the click came from (e.g. "hero", "pricing", "cta",
  // "top-nav", "account-card", "early-access"). Set by the caller; falls back
  // to "unknown".
  source: string;
  country: string | null; // country code only, from Netlify geo — never IP
  referer: string | null;
  // Salted digest of the client IP (same function the rate limiter uses).
  // Null on events recorded before this field existed.
  clientKey?: string | null;
  // Set from the stats dashboard to mark an event as one of our own test
  // downloads. Never written by the download path — only by an authorized
  // POST to /api/download-ff/stats. Absent means "not marked".
  ignored?: boolean;
};

// Country-level geo from Netlify's `x-nf-geo` header (base64-encoded JSON).
// Returns null anywhere that header is absent (local dev, other hosts).
function countryFromRequest(req: NextRequest): string | null {
  const raw = req.headers.get("x-nf-geo");
  if (!raw) return null;
  try {
    const geo = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
    return typeof geo?.country?.code === "string" ? geo.country.code : null;
  } catch {
    return null;
  }
}

// Best-effort: record one download event to Netlify Blobs. This must never
// throw into the download path — a tracking failure should never stop a user
// from getting the installer, so everything is wrapped and swallowed. In local
// `next dev` (where Blobs isn't provisioned) this simply no-ops.
export async function recordDownload(
  req: NextRequest,
  fields: {
    platform: "mac" | "windows" | "linux";
    product: DownloadEvent["product"];
    authPath: DownloadEvent["authPath"];
    source: string;
  }
): Promise<void> {
  try {
    const event: DownloadEvent = {
      ts: new Date().toISOString(),
      platform: fields.platform,
      product: fields.product,
      authPath: fields.authPath,
      source: fields.source || "unknown",
      country: countryFromRequest(req),
      referer: req.headers.get("referer"),
      clientKey: clientKey(req),
    };

    const store = getStore("ff-downloads");
    // One blob per event, keyed by date + a random id. Storing individual
    // events (rather than incrementing a shared counter) avoids the lost-update
    // races that concurrent downloads would otherwise cause; totals are
    // computed by listing/reading on the stats side.
    const day = event.ts.slice(0, 10); // YYYY-MM-DD
    const key = `events/${day}/${crypto.randomUUID()}`;
    await store.setJSON(key, event);
  } catch {
    // swallow — tracking is best-effort and must not affect the download
  }
}
