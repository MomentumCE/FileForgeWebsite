// How long a signed installer URL stays valid.
//
// A signed URL is a bearer token: anyone holding it can download the object,
// unlimited times, until it expires. So the expiry window is the whole blast
// radius of a leaked link — someone who pastes one into a chat has published
// that much open egress. These were 3600s (an hour), which is far longer than
// any real download flow needs.
//
// These constants predate routing downloads through CloudFront (see
// lib/cloudfront.ts) and carried over unchanged when the last presigned S3 URL
// went away, because the reasoning never depended on who checks the signature.
// The PRESIGN_ names are now historical — every one of these signs a CloudFront
// URL.
// Shortening this is safe because the signature is validated when the request
// is *received*, not continuously: once the GET is accepted and bytes start
// flowing, the transfer may run well past the expiry. A visitor on a slow
// connection still gets the full installer.
//
// The one real caveat: a browser download manager that pauses and later
// *resumes* (a fresh ranged GET) will be denied once the window has closed. In
// practice the visitor retries the button and gets a new URL.

// For flows that hand the URL straight to `window.location.href` — the public
// "Download free" CTAs and the signed-in account card. The gap between minting
// and use is milliseconds; two minutes is pure headroom for a slow round trip
// or an immediate browser retry.
export const PRESIGN_TTL_IMMEDIATE = 120;

// For the internal password-gated pages, which render a link that a *human*
// then clicks. That needs a window wide enough to survive someone typing the
// password and getting distracted for a minute. Only ever granted on the
// password/token paths, never the friction-free `free` path.
export const PRESIGN_TTL_MANUAL = 600;

// For the desktop auto-updater's feed URL (app/api/update-feed/route.ts), which
// is a different animal from the two above and needs a much wider window.
//
// The reasoning that makes 120s safe for a browser download — "the signature is
// checked when the request is received, so bytes already flowing keep flowing" —
// does NOT hold here. electron-updater issues a *sequence* of requests from one
// signed URL: latest*.yml, then the installer, then repeated ranged GETs of the
// .blockmap and the changed blocks when it does a differential update. Every one
// of those is validated on arrival, so the window has to outlast the entire
// download, not just its first byte. A ~250 MB installer on a slow line, paused
// by a sleeping laptop, is the case to survive.
//
// Six hours matches the app's own re-check interval (CHECK_INTERVAL_MS in the
// desktop repo's updater.js), so a signature is never usefully reusable past the
// cycle that minted it. The blast radius of a leaked one is narrower than it
// looks: unlike the installer URLs, this signature is scoped by a wildcard to a
// single edition+platform release folder, whose contents the download button
// hands to anyone who asks anyway.
export const SIGNED_TTL_UPDATE_FEED = 6 * 3600;

// Human-readable form of a TTL, for the "your link expires in …" copy on the
// manual-click pages. Keeps that text honest instead of hardcoding a duration
// that drifts out of sync with the constants above.
export function formatTtl(seconds: number): string {
  if (seconds % 60 === 0) {
    const mins = seconds / 60;
    return mins === 1 ? "1 minute" : `${mins} minutes`;
  }
  return `${seconds} seconds`;
}
