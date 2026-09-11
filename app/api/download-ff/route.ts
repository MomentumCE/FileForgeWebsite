import { NextRequest, NextResponse } from "next/server";
import { CloudFrontConfigError, signedInstallerUrl } from "@/lib/cloudfront";
import {
  clientKey,
  enforceLimits,
  forbidden,
  freeTiers,
  originOk,
  secretTiers,
  tokenTiers,
} from "@/lib/download-guards";
import { recordDownload, type DownloadEvent } from "@/lib/download-tracking";
import { PRESIGN_TTL_IMMEDIATE, PRESIGN_TTL_MANUAL } from "@/lib/presign";

// Must match the Outseta domain configured in app/layout.tsx.
const OUTSETA_DOMAIN = "momentum-ce.outseta.com";

// Each edition and platform gets its own S3 folder, and the installer files no
// longer carry a version number — electron-builder overwrites the same object
// key on every release, and the version lives only inside the latest*.yml the
// auto-updater reads. Layout (matches FileForge Finder's electron-builder
// config): releases/<edition>/<platform>/<installer>, where <edition> is
// "fileforge-finder" (free) or "fileforge-finder-plus" (paid) and <platform>
// is "windows" / "mac" / "linux". Because the filenames are version-less,
// there is nothing to bump here when a new build is published.
const RELEASE_ROOT = "releases";

// Resolve the S3 object key for a given product + platform. This doubles as the
// path under the CloudFront distribution, which mirrors the bucket 1:1. The
// mac/Windows files use the artifact base name
// "FileForge Finder"/"FileForge Finder+"; the Linux builds instead use
// electron-builder's lowercase package names ("fileforge-finder"/
// "fileforge-finder-plus") with an arch suffix. Linux ships two builds (a Debian
// package and a portable AppImage); `linuxFormat` selects which, and is ignored
// for mac/Windows.
//
// The paid build's artifacts carry a literal "+" ("FileForge Finder+ Setup.exe",
// "FileForge Finder+-arm64.dmg"), matching what is actually in the bucket today.
//
// That "+" is safe *here* but not everywhere, and the difference is who builds the
// URL. A raw "+" in an S3 URL path is decoded by S3 as a space — verified: the
// same object returns 200 as "FileForge%20Finder%2B..." and 403 as
// "FileForge%20Finder+...". This route is fine because lib/cloudfront.ts runs every
// path segment through encodeURIComponent, so the "+" is signed and sent as %2B
// (also verified end-to-end against the distribution). The desktop auto-updater is
// not fine: it resolves filenames out of latest*.yml with `new URL()`, leaving the
// "+" raw, so Finder+ can detect an update and then 403 on the download.
//
// The fix for the updater is renaming the artifacts to "FileForge Finder Plus" in
// the desktop repo's electron-builder.config.js (`artifactBase`). Until a build
// with those names is actually PUBLISHED to the bucket, this constant must keep
// the "+" — flipping it early points the download at keys that don't exist and
// 403s every Finder+ mac/Windows download. Flip it in the same release that
// publishes the renamed artifacts, not before.
function installerKey(
  product: "finder" | "finder-plus",
  platform: "mac" | "windows" | "linux",
  linuxFormat: "deb" | "appimage" = "appimage"
): string {
  // <edition> folder ("fileforge-finder" / "fileforge-finder-plus") and the
  // lowercase package base used in the Linux filenames are the same string.
  const edition = product === "finder-plus" ? "fileforge-finder-plus" : "fileforge-finder";
  const dir = `${RELEASE_ROOT}/${edition}`;
  const plus = product === "finder-plus" ? "+" : "";
  if (platform === "mac") {
    return `${dir}/mac/FileForge Finder${plus}-arm64.dmg`;
  }
  if (platform === "linux") {
    // e.g. fileforge-finder-plus-amd64.deb
    //      fileforge-finder-x86_64.AppImage
    return linuxFormat === "deb"
      ? `${dir}/linux/${edition}-amd64.deb`
      : `${dir}/linux/${edition}-x86_64.AppImage`;
  }
  return `${dir}/windows/FileForge Finder${plus} Setup.exe`;
}

// Resolves an Outseta access token to the signed-in subscriber's profile.
// Returns the profile JSON when the token is valid, or null when Outseta
// rejects it (invalid/expired) or the request fails — callers treat null as
// "not a valid subscriber". The profile's only job is that authorization
// decision — the email on it is deliberately NOT passed to download tracking
// (see lib/download-tracking.ts).
async function getOutsetaProfile(
  token: string
): Promise<{ Email?: string } | null> {
  try {
    const res = await fetch(`https://${OUTSETA_DOMAIN}/api/v1/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json().catch(() => null)) as { Email?: string } | null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  // Three ways in, in order of friction:
  //  - `free: true` — the friction-free public download on the landing page.
  //  - a shared password (the early-access download page's
  //    DOWNLOAD_PASSWORD_FILEFORGE, or the account page's dev-gate
  //    FF_DEV_PASSWORD).
  //  - a signed-in subscriber's Outseta access token.
  //
  // Which path is being *attempted* is decided from the request's shape alone,
  // before any credential is checked. The guards below depend on that ordering:
  // a rate limit that only counted successful passwords would leave brute-force
  // guessing unlimited, which is the whole point of the secret tiers.
  const attemptingFree = body.free === true;
  const attemptingToken =
    !attemptingFree &&
    !(typeof body.password === "string" && body.password.length > 0) &&
    typeof body.token === "string" &&
    body.token.length > 0;

  // Provenance. Strict only on the free path: browsers always send Origin on a
  // POST, so its absence there means a non-browser client with no credential to
  // make up for it. The credentialed paths fall back to Referer and then allow,
  // which keeps curl smoke checks and non-browser tooling working.
  if (!originOk(req, attemptingFree)) return forbidden();

  // Charge the request against its tier set before doing any work — before the
  // password comparison, and before the Outseta round trip, so a flood can't
  // make us pay for outbound requests either.
  //
  // A request carrying neither `free` nor a token is treated as a password
  // attempt (the tight tier), so probing with an empty body is charged as the
  // guess it is rather than falling into the roomier token budget.
  const id = clientKey(req);
  const limited = await enforceLimits(
    attemptingFree
      ? freeTiers(id)
      : attemptingToken
        ? tokenTiers(id)
        : secretTiers("ff-download", id)
  );
  if (limited) return limited;

  const freeOk = attemptingFree;
  const passwordOk =
    !freeOk &&
    typeof body.password === "string" &&
    body.password.length > 0 &&
    (body.password === process.env.DOWNLOAD_PASSWORD_FILEFORGE ||
      body.password === process.env.FF_DEV_PASSWORD);
  const profile =
    !freeOk && !passwordOk && typeof body.token === "string" && body.token.length > 0
      ? await getOutsetaProfile(body.token)
      : null;
  const tokenOk = profile !== null;

  if (!freeOk && !passwordOk && !tokenOk) {
    return NextResponse.json(
      { error: body.token ? "Your session has expired. Please sign in again." : "Incorrect password" },
      { status: 401 }
    );
  }

  const authPath: DownloadEvent["authPath"] = freeOk
    ? "free"
    : passwordOk
      ? "password"
      : "token";

  // Mac visitors get the arm64 .dmg, Linux visitors the AppImage; everyone else
  // gets the Windows installer. The client reports its platform; default to
  // Windows when unknown.
  const platform: "mac" | "windows" | "linux" =
    body.platform === "mac" ? "mac" : body.platform === "linux" ? "linux" : "windows";

  // Which Linux build to serve when platform is "linux": the Debian package or
  // the portable AppImage. Defaults to the universal AppImage on anything else.
  const linuxFormat: "deb" | "appimage" = body.linuxFormat === "deb" ? "deb" : "appimage";

  // Finder+ is the paid build handed to signed-in subscribers (the account
  // card). It must never be served on the friction-free `free` path — a free
  // request asking for finder-plus is downgraded to the standard installer so
  // the paid build can't be pulled without authorization. Password/token
  // requests (the account dev-gate) may request it.
  const requestedProduct: "finder" | "finder-plus" =
    body.product === "finder-plus" ? "finder-plus" : "finder";
  const product: "finder" | "finder-plus" =
    requestedProduct === "finder-plus" && !freeOk ? "finder-plus" : "finder";

  const key = installerKey(product, platform, linuxFormat);

  // How long the minted URL stays valid. Default to the short window: every
  // button flow (the public CTAs, the account card) hands the URL straight to
  // `window.location.href`, so the gap between minting and use is milliseconds.
  // A caller that instead *renders* the link for a human to click asks for the
  // longer window with `manualLink`.
  //
  // Same shape as the finder-plus downgrade above: the flag is client-supplied,
  // so it's honored only on the credentialed paths. A `free` request can't widen
  // its own expiry by adding a field.
  const expiresIn =
    body.manualLink === true && !freeOk ? PRESIGN_TTL_MANUAL : PRESIGN_TTL_IMMEDIATE;

  // Both editions are signed against the CloudFront distribution — the free
  // download for the edge-cache and egress win, Finder+ so that the bucket needs
  // no presignable access path at all and can sit entirely behind an origin
  // access control. Finder+ used to mint a presigned S3 URL instead, which meant
  // one route still had to hold S3 credentials.
  //
  // Note what this couples: a CloudFront misconfiguration now takes down the
  // paid download too, and the trusted key group has to be attached to the
  // releases/fileforge-finder-plus/* behaviour as well or its signatures are
  // ignored. See lib/cloudfront.ts.
  //
  // Minting happens before the download is recorded so a misconfigured
  // distribution can't inflate the counter with downloads that never started.
  let url: string;
  try {
    url = signedInstallerUrl(key, expiresIn);
  } catch (err) {
    if (err instanceof CloudFrontConfigError) {
      console.error("CloudFront signing is not configured:", err.message);
      return NextResponse.json(
        { error: "Downloads are temporarily unavailable. Please try again shortly." },
        { status: 503 }
      );
    }
    throw err;
  }

  // Record the download for the counter. We await it so the write actually
  // lands before this serverless function freezes — a fire-and-forget call can
  // be killed mid-write once the response returns. It's safe to await: it
  // swallows all its own errors and never rejects, so a tracking failure can
  // never break the download path.
  await recordDownload(req, {
    platform,
    product,
    authPath,
    source: typeof body.source === "string" ? body.source : "unknown",
  });

  return NextResponse.json({ url });
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
