// Minting installer download URLs through CloudFront.
//
// A presigned S3 URL points the visitor straight at the bucket: every byte is
// S3 egress, from one region, with no cache in front of it. A CloudFront signed
// URL points at the distribution instead, so the download is served from an
// edge cache and the bucket can sit behind an origin access control.
//
// Every download is routed this way now — the free FileForge Finder edition,
// Finder+, the Shoshone-Bannock accounting installer, and the desktop
// auto-updater's release feeds. Nothing mints presigned S3 URLs any more, which
// is the point: with no presignable access path left, the bucket can be closed
// to everything except the distribution's origin access control.
//
// The flip side is that this file is now a single point of failure for all
// downloads, and that every path signed here needs a cache behaviour with the
// trusted key group attached. A path that reaches the distribution through a
// behaviour *without* "restrict viewer access" is served to anyone who guesses
// the URL — the signature is simply ignored rather than rejected.
//
// The security model is unchanged in shape: the URL is still a bearer token
// with an expiry, so the TTL constants in lib/presign.ts still describe the
// whole blast radius of a leaked link and are still the right lever. What
// changes is who validates it — CloudFront checks the signature against the
// trusted key group instead of S3 checking a SigV4 presign. The caveat noted
// in lib/presign.ts carries over exactly: the signature is checked when the
// request is *received*, so a transfer already in flight runs past the expiry,
// but a paused-and-resumed download manager issuing a fresh ranged GET after
// the window closes is denied.

import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

// Thrown when the distribution isn't configured. Routes catch this and return a
// generic 503 rather than letting a missing env var surface as a stack trace —
// the visitor can't act on the difference, and the message would name our
// infrastructure.
export class CloudFrontConfigError extends Error {}

// Trimmed, because these values are pasted by hand into a dashboard field and a
// trailing space is invisible there. Local dev hides the problem — the dotenv
// parser behind `next dev` trims unquoted values on its own — but Netlify's
// environment UI preserves them verbatim, so an untrimmed read fails only in
// production. A stray space in the domain builds a malformed URL; one in the
// key pair ID makes CloudFront reject every signature.
function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new CloudFrontConfigError(`${name} is not set`);
  }
  return value;
}

// The CloudFront private key, tolerant of how the PEM survived getting into an
// environment variable. Netlify's env UI is effectively single-line, so the key
// arrives either base64-encoded or with its newlines written as the two
// characters backslash-n; node:crypto needs real newlines either way. A PEM
// pasted through verbatim (as in a local .env.local) passes through untouched.
function privateKey(): string {
  const raw = requireEnv("CLOUDFRONT_PRIVATE_KEY");
  const pem = raw.includes("-----BEGIN")
    ? raw
    : Buffer.from(raw, "base64").toString("utf8");
  return pem.replace(/\\n/g, "\n");
}

// Build the distribution URL for an S3 object key. The distribution mirrors the
// bucket 1:1, so the object key doubles as the path.
//
// The encoding here matters more than it looks. Our installer keys contain
// spaces ("FileForge Finder Setup.exe"). Each path segment is percent-encoded,
// so the space becomes %20; CloudFront forwards the encoded path and S3 decodes
// it back to the exact key.
//
// The encoded string is also what gets signed below, and a CloudFront canned
// policy matches the resource *byte for byte* against the URL the viewer
// requests. So this function must produce the URL the browser will actually
// send — encode once, here, and never re-encode downstream.
function distributionUrl(key: string): string {
  const domain = requireEnv("CLOUDFRONT_DOMAIN")
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
  const path = key.split("/").map(encodeURIComponent).join("/");
  return `https://${domain}/${path}`;
}

// Sign a time-limited URL for one installer object.
//
// `expiresIn` is seconds from now and should come from the constants in
// lib/presign.ts — PRESIGN_TTL_IMMEDIATE for the button flows that navigate
// straight to the URL, PRESIGN_TTL_MANUAL for the pages that render a link a
// human has to click.
//
// Uses a canned policy (a bare expiry, no IP restriction), which is what the
// presigned URLs did and what our flows need: the download frequently comes from
// a different address than the page request — mobile networks reassigning
// addresses mid-session, corporate egress pools, IPv6-to-IPv4 fallback — so
// pinning the URL to the requesting IP would break real downloads.
export function signedInstallerUrl(key: string, expiresIn: number): string {
  return getSignedUrl({
    url: distributionUrl(key),
    keyPairId: requireEnv("CLOUDFRONT_KEY_PAIR_ID"),
    privateKey: privateKey(),
    dateLessThan: new Date(Date.now() + expiresIn * 1000).toISOString(),
  });
}

// Sign a time-limited URL for a whole release FOLDER, for the desktop
// auto-updater (see app/api/update-feed/route.ts).
//
// Why a folder and not an object: electron-updater is handed ONE feed URL and
// derives every other request from it — latest*.yml, then the installer, then
// the .blockmap for a differential download. It copies the feed URL's query
// string verbatim onto each of those (`newUrlFromBase` in electron-updater's
// util.js), so a single signature has to be valid for all of them. A canned
// policy can't do that: it pins one exact resource. Hence a custom policy with
// a trailing `*`, scoped to exactly one edition+platform folder.
//
// `prefix` MUST come from a caller-side allowlist, never from raw request input
// — it lands inside the signed policy, so a traversal like "releases/../" would
// mint a signature over a wider slice of the distribution than intended.
//
// `expiresIn` should be SIGNED_TTL_UPDATE_FEED, not the installer TTLs: unlike a
// browser download, the updater keeps issuing fresh requests across the whole
// transfer (each ranged GET of a differential download is separately validated),
// so the window has to outlast a slow download rather than just the redirect.
export function signedFeedUrl(prefix: string, expiresIn: number): string {
  // distributionUrl percent-encodes per segment; a prefix ending in "/" yields a
  // trailing slash, which electron-updater needs on a base URL anyway.
  const folder = distributionUrl(prefix.endsWith("/") ? prefix : `${prefix}/`);
  const policy = JSON.stringify({
    Statement: [
      {
        Resource: `${folder}*`,
        Condition: {
          DateLessThan: { "AWS:EpochTime": Math.floor(Date.now() / 1000) + expiresIn },
        },
      },
    ],
  });
  return getSignedUrl({
    url: folder,
    keyPairId: requireEnv("CLOUDFRONT_KEY_PAIR_ID"),
    privateKey: privateKey(),
    policy,
  });
}
