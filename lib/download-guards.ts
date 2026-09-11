// Request guards shared by the installer download endpoints.
//
// Every request these routes accept mints a signed CloudFront URL, which is a slice
// of the egress bill and — on the friction-free `free` path — the only thing
// between the internet and an unmetered installer mirror. Two cheap controls
// live here:
//
//   originOk()      — did this request plausibly come from one of our own pages?
//   enforceLimits() — has this client asked too many times?
//
// Neither is a wall, and it's worth being precise about why:
//
//   * A scripted client sets whatever Origin header it likes. The origin check
//     stops a cross-site page POSTing on a visitor's behalf (a browser won't let
//     the attacker forge Origin there) and it stops the low-effort scrapers that
//     send no Origin at all. It does not stop someone who reads this file.
//   * The rate limiter fails open when its store is unreachable — see the note
//     on enforceLimits. A store outage must not become a product outage.
//
// They bound the blast radius. The controls that genuinely cannot be bypassed
// live on the delivery side (CloudFront signed URLs + a WAF rate rule), because
// a minted URL is a bearer token that never touches this code again.

import { createHash } from "node:crypto";
import { getStore } from "@netlify/blobs";
import { NextResponse } from "next/server";
import { chargeTier, type CounterStore, type Tier } from "@/lib/rate-limit";
import { SITE_HOST } from "@/lib/site";

export type { Tier };

// ─────────────────────────────────────────────────────────── origin check ────

// Hosts accepted no matter which domain served the request. The same-origin
// comparison below covers the normal case; this list exists so a request from
// the canonical site is accepted even if it arrives via a host we didn't expect
// (an alias, a proxy that rewrites Host). Derived from SITE_URL in lib/site.ts,
// plus its www. variant.
const BASE_ALLOWED_HOSTS = [
  SITE_HOST,
  SITE_HOST.startsWith("www.") ? SITE_HOST.slice(4) : `www.${SITE_HOST}`,
];

// Extra hosts, comma-separated, for domains added without a code change —
// e.g. DOWNLOAD_ALLOWED_HOSTS="momentumce.com,www.momentumce.com" if the
// Momentum CE site's Finder CTAs keep POSTing to this site's download API.
function extraAllowedHosts(): string[] {
  return (process.env.DOWNLOAD_ALLOWED_HOSTS ?? "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
}

// The host this request actually arrived on. Netlify's CDN sets
// x-forwarded-host; `host` covers local `next dev` and anything else.
function selfHost(req: Request): string | null {
  const raw = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!raw) return null;
  const first = raw.split(",")[0]?.trim().toLowerCase();
  return first || null;
}

// Is `value` (an Origin or Referer header) one of ours? Both are absolute URLs,
// so the host is parsed out rather than string-matched — "https://fileforge.com"
// and "https://fileforge.com/fileforge" both reduce to "fileforge.com". A
// malformed value (including the literal "null" that sandboxed iframes and
// file:// pages send) fails to parse and is rejected.
function hostAllowed(value: string | null, self: string | null): boolean {
  if (!value) return false;
  let host: string;
  try {
    host = new URL(value).host.toLowerCase();
  } catch {
    return false;
  }
  // Same-origin is the overwhelmingly common case. Matching against the request's
  // own host means every domain, alias and Netlify deploy-preview subdomain the
  // site is served on works without being enumerated anywhere — no config to
  // drift out of sync when a domain is added. Note `host` includes the port, so
  // localhost:3000 matches itself in dev.
  if (self && host === self) return true;
  if (BASE_ALLOWED_HOSTS.includes(host)) return true;
  return extraAllowedHosts().includes(host);
}

// Decide whether to accept this request's provenance.
//
// `strict` should be true exactly on unauthenticated paths. It controls what
// happens when there's no Origin header at all:
//
//   strict     — reject. Browsers always send Origin on a POST, so its absence
//                means a non-browser client, and on the free path there's no
//                credential to make up for that.
//   not strict — fall back to Referer, then allow. The request carries a
//                password or a subscriber token, which is the real gate; this
//                keeps `curl` smoke checks and non-browser tooling working.
//
// Either way, an Origin that *is* present must be one of ours.
export function originOk(req: Request, strict: boolean): boolean {
  const self = selfHost(req);
  const origin = req.headers.get("origin");
  if (origin) return hostAllowed(origin, self);
  if (!strict) return true;
  return hostAllowed(req.headers.get("referer"), self);
}

// Standard rejection for a request that failed the origin check. Deliberately
// vague — it tells a misconfigured caller nothing about the allowlist.
export function forbidden(): NextResponse {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// ────────────────────────────────────────────────────────── rate limiting ────

// Opaque per-client identifier: Netlify's real client IP, salted and hashed.
// Nothing here ever writes an IP — the rate-limit store holds only digests,
// which keeps this consistent with the deliberate no-IP stance in
// lib/download-tracking.ts. Set RATE_LIMIT_SALT so the digests aren't a plain
// hash of a 32-bit address (the IPv4 space is small enough to enumerate).
export function clientKey(req: Request): string {
  const ip =
    req.headers.get("x-nf-client-connection-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  return createHash("sha256")
    .update(`${process.env.RATE_LIMIT_SALT ?? "fileforge"}:${ip}`)
    .digest("hex")
    .slice(0, 32);
}

// The Blobs store the counters live in. Strong consistency: an eventually
// consistent read would hand every concurrent request the same stale count and
// the limiter would undercount.
function store(): CounterStore {
  return getStore({ name: "ff-ratelimit", consistency: "strong" });
}

// Charge one request against every tier in order, returning a ready-to-send 429
// as soon as one is exhausted, or null when the request may proceed.
//
// Call this BEFORE validating a password. The point of the secret-path tiers is
// to throttle *wrong* guesses, which only works if the attempt is counted
// whether or not it turns out to be correct.
//
// Fails open on any store error — including Blobs simply not being provisioned,
// as in local `next dev`, where this makes the limiter a no-op. That is a real
// gap: if Blobs breaks in production, rate limiting silently stops happening. The
// AWS-side WAF rate rule is the backstop that can't fail open, which is why it's
// worth having both.
//
// Note the deliberate asymmetry with chargeTier, which fails *closed* when it
// keeps losing the compare-and-swap. A store error says nothing about the caller;
// sustained contention on a single per-client counter says the caller is bursting.
export async function enforceLimits(
  tiers: Tier[],
  message = "Too many requests. Please try again shortly."
): Promise<NextResponse | null> {
  // Constructing the store throws outright when Blobs isn't configured — which
  // is the normal state in local `next dev` — so it's inside the fail-open guard
  // just like the reads and writes are.
  let s: CounterStore;
  try {
    s = store();
  } catch {
    return null;
  }

  // One timestamp for every tier, so a request can't land in one tier's window
  // and just miss another's.
  const now = Date.now();

  for (const tier of tiers) {
    let result: { ok: boolean; retryAfter: number };
    try {
      result = await chargeTier(s, tier, now);
    } catch {
      return null; // see above — fail open
    }
    if (!result.ok) {
      return NextResponse.json(
        { error: message },
        {
          status: 429,
          headers: {
            "Retry-After": String(result.retryAfter),
            // Don't let a 429 get cached and served to unrelated visitors.
            "Cache-Control": "no-store",
          },
        }
      );
    }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────── tier sets ────

// Limits are tuned to be invisible to humans first and inconvenient to scripts
// second — in that order, deliberately. The free-path numbers are env-overridable
// so an event or a launch spike can be absorbed without a code change.
//
// Why the free-path numbers are generous rather than tight:
//
// A per-IP counter cannot tell a crowd from a script, because behind one NAT they
// are the same thing — one address making many requests. The case that decides the
// numbers is a conference or classroom demo: a few hundred people on one wifi,
// downloading within minutes of each other. Under the original limits (5 per 10
// minutes) the sixth person in the room got a 429, which is a far worse outcome
// than the egress a script could pull in the same window.
//
// So this tier is sized for the crowd, and the egress ceiling is left to the two
// layers that can actually see bytes: the site-wide breaker below, and the WAF
// rate rule on the distribution. That is the same division of labour described at
// the top of this file — a minted URL never touches this code again, so limiting
// how many get minted was never the thing that bounds the bill.
//
// Concretely, FF_FREE_LIMIT_10M = 300 admits a 300-seat room clicking at once, or
// a 100-seat room where everyone retries twice.
function envLimit(name: string, fallback: number): number {
  const raw = Number(process.env[name]);
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : fallback;
}

// The site-wide circuit breaker is split across shards. A single global key would
// be the one blob every concurrent free download contends on, and losing that CAS
// race repeatedly makes the tier refuse exactly when it matters.
//
// The shard is picked at RANDOM per request rather than derived from the client
// hash. Deriving it from the client sounds tidier — a given caller always lands on
// the same shard — but it concentrates precisely the traffic we least want to
// refuse: everyone behind one NAT hashes identically, so a conference room, an
// office or a school would pile into a single shard, exhaust 1/Nth of the
// site-wide budget between them, and take unrelated visitors on that shard down
// too. Random assignment spreads any burst evenly, so the sum of the shard budgets
// behaves like the single global limit it is meant to be.
//
// Nothing is lost by this: catching traffic concentrated in one IP is the per-IP
// tiers' job, not the site-wide breaker's.
const GLOBAL_SHARDS = 8;

function globalShard(): number {
  return Math.floor(Math.random() * GLOBAL_SHARDS);
}

// The unauthenticated `free` path — the one that carries no credential at all.
//
// Tier order is intentional: cheapest and most specific first, so an exhausted
// per-IP budget short-circuits before a request is charged against the shared
// site-wide breaker. Charging the global tier for a request the per-IP tier was
// going to refuse anyway would let one abusive IP drain everyone's budget.
export function freeTiers(id: string): Tier[] {
  const globalPerHour = envLimit("FF_FREE_LIMIT_GLOBAL_1H", 5_000);
  return [
    { key: `free/${id}/10m`, limit: envLimit("FF_FREE_LIMIT_10M", 300), windowSeconds: 600 },
    { key: `free/${id}/24h`, limit: envLimit("FF_FREE_LIMIT_24H", 1_500), windowSeconds: 86_400 },
    {
      key: `free/global/${globalShard()}/1h`,
      limit: Math.ceil(globalPerHour / GLOBAL_SHARDS),
      windowSeconds: 3_600,
    },
  ];
}

// Shared-secret paths (the password download pages, the account dev-gate, the
// stats key). Tight, because behind each is a single static secret with no
// lockout of its own — before this, guesses were unlimited. `scope` keeps each
// secret's attempts in a separate budget so a brute-force run against one page
// can't lock a legitimate user out of another.
export function secretTiers(scope: string, id: string): Tier[] {
  return [
    { key: `${scope}/${id}/15m`, limit: 5, windowSeconds: 900 },
    { key: `${scope}/${id}/24h`, limit: 30, windowSeconds: 86_400 },
  ];
}

// Signed-in subscribers. Outseta already gates this path, so the only thing left
// to limit is a stolen token being used as a download mirror — hence a ceiling
// well above any real use rather than a tight throttle.
export function tokenTiers(id: string): Tier[] {
  return [{ key: `token/${id}/10m`, limit: 20, windowSeconds: 600 }];
}

// Installed desktop apps asking for a signed auto-update feed URL.
//
// This path carries no credential and can't: the free FileForge Finder edition
// ships no sign-in at all, so there is nothing for it to present. The limit is
// therefore the only control on it, and it's sized against real behaviour rather
// than as a gate — an install checks on launch and every 6 h after, so a handful
// per 10 minutes is already generous for one machine behind one address, while a
// shared corporate egress IP with many installs still fits.
//
// Roomier than the other unauthenticated tier (freeTiers) would be wrong here:
// what's handed back is scoped to one release folder that the public download
// button serves anyway, so the thing being rationed is signing work, not access.
//
// `scope` separates the budgets of apps that share this tier shape — FileForge
// Finder (the default) and the accounting app ("acct"). Without it, an office
// running both would have the two apps' checks charged to one per-IP counter and
// 429 each other, since the limits are sized per machine rather than per app.
export function updateFeedTiers(id: string, scope = "feed"): Tier[] {
  return [
    { key: `${scope}/${id}/10m`, limit: envLimit("FF_FEED_LIMIT_10M", 60), windowSeconds: 600 },
    { key: `${scope}/${id}/24h`, limit: envLimit("FF_FEED_LIMIT_24H", 400), windowSeconds: 86_400 },
  ];
}

// The stats dashboard is read with a shared key and refreshed by hand, so it
// wants more headroom than a password form while still capping guesses at a rate
// that's hopeless against a high-entropy key.
export function statsTiers(id: string): Tier[] {
  return [
    { key: `stats/${id}/15m`, limit: 20, windowSeconds: 900 },
    { key: `stats/${id}/24h`, limit: 200, windowSeconds: 86_400 },
  ];
}
