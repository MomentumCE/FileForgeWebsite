import { NextRequest, NextResponse } from "next/server";
import { CloudFrontConfigError, signedFeedUrl } from "@/lib/cloudfront";
import { clientKey, enforceLimits, updateFeedTiers } from "@/lib/download-guards";
import { SIGNED_TTL_UPDATE_FEED } from "@/lib/presign";

// Mints the CloudFront signed feed URL that an installed FileForge Finder asks
// for before every update check (see updater.js in the desktop repo).
//
// Why this endpoint exists at all: the release folders behind the distribution
// require a signed request (a trusted key group is attached to the
// releases/fileforge-finder*/* behaviours), and signing needs the CloudFront
// private key — which must never ship inside a desktop app that users can
// unpack. So the app asks for a URL and we sign it here, the same split the
// installer download already uses.
//
// The feed URL baked into each build (the `publish` block in the desktop repo's
// electron-builder.config.js) still points straight at S3 and stays the app's
// FALLBACK. That matters more than it sounds: the baked URL cannot be changed on
// an already-installed copy, so if this endpoint is the only way to update, an
// outage here is unfixable remotely. Keeping the direct-S3 path working as a
// fallback is what makes this endpoint safe to depend on.
//
// GET, not POST: there is no credential to put in a body and no side effect. The
// caller is a Node process in Electron's main process, so there is no Origin
// header to check either — see the note on the rate limit below.

// The only paths that may be signed. Request input selects an entry, it never
// builds one: the chosen prefix goes inside the signed policy, so accepting raw
// input here would let a caller widen the wildcard past its intended folder.
const EDITIONS = {
  finder: "fileforge-finder",
  "finder-plus": "fileforge-finder-plus",
} as const;

const PLATFORMS = ["windows", "mac", "linux"] as const;

type Edition = keyof typeof EDITIONS;
type Platform = (typeof PLATFORMS)[number];

function parseEdition(value: string | null): Edition | null {
  return value !== null && value in EDITIONS ? (value as Edition) : null;
}

function parsePlatform(value: string | null): Platform | null {
  return PLATFORMS.includes(value as Platform) ? (value as Platform) : null;
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const edition = parseEdition(params.get("edition"));
  const platform = parsePlatform(params.get("platform"));

  if (edition === null || platform === null) {
    return NextResponse.json(
      { error: "Unknown edition or platform" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  // Charged before signing, so a flood can't make us do RSA work per request.
  // This is the only control on the endpoint — unlike the download route there
  // is no free/password/token split to branch on, because the free edition has
  // no sign-in to draw a credential from.
  const limited = await enforceLimits(updateFeedTiers(clientKey(req)));
  if (limited) return limited;

  const prefix = `releases/${EDITIONS[edition]}/${platform}/`;

  let url: string;
  try {
    url = signedFeedUrl(prefix, SIGNED_TTL_UPDATE_FEED);
  } catch (err) {
    if (err instanceof CloudFrontConfigError) {
      console.error("CloudFront signing is not configured:", err.message);
      // The app treats any non-200 as "keep using the baked-in feed", so a 503
      // here degrades to updating over direct S3 rather than to no updates.
      return NextResponse.json(
        { error: "Update feed temporarily unavailable" },
        { status: 503, headers: { "Cache-Control": "no-store" } }
      );
    }
    throw err;
  }

  // no-store is essential: the response embeds a signature with a fixed expiry,
  // and a cached copy would keep being handed out after it stopped working.
  return NextResponse.json(
    { url, expiresIn: SIGNED_TTL_UPDATE_FEED },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
