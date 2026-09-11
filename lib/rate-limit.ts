// Fixed-window rate-limit counter.
//
// Deliberately free of imports: the store it writes to is injected, so this
// logic can be exercised against an in-memory fake. That matters more here than
// in most modules — Netlify Blobs isn't available in local `next dev`, and the
// caller (lib/download-guards.ts) fails open when the store is unreachable. A
// bug in this file would therefore present as "the limiter silently stops
// limiting", which is exactly the failure you don't notice until the bill
// arrives. See tests/rate-limit.test.mjs.

// One fixed-window budget.
export type Tier = {
  // Store key. Reused across windows rather than embedding the window start —
  // the stored bucket carries its own expiry — so the store holds one entry per
  // client per tier instead of growing one entry per window forever.
  key: string;
  limit: number;
  windowSeconds: number;
};

// What's persisted per tier: a count and the instant the window closes.
export type Bucket = { count: number; resetAt: number };

// The slice of a Netlify Blobs store this needs. Structural, so the real store
// satisfies it without this module importing @netlify/blobs.
export type CounterStore = {
  getWithMetadata(
    key: string,
    options: { type: "json" }
  ): Promise<{ data: unknown; etag?: string } | null>;
  setJSON(
    key: string,
    data: unknown,
    options?: { onlyIfNew?: boolean } | { onlyIfMatch?: string }
  ): Promise<{ modified: boolean; etag?: string }>;
};

export type ChargeResult = {
  ok: boolean;
  // Seconds until the window resets. Only meaningful when ok is false.
  retryAfter: number;
};

// A lost compare-and-swap means another request updated the same counter first,
// so our read is stale and the whole read/increment/write is retried. Five is
// generous for the contention these keys actually see; the site-wide tier is
// sharded (see freeTiers) specifically to keep that contention low.
//
// Five stays correct even for a large crowd sharing one key (a conference on one
// NAT) because of the jittered backoff below, which is what actually clears a
// burst. Measured against the zero-latency fake store — perfectly simultaneous,
// so harsher than production — 5 attempts plus jitter admits a 300-way burst in
// full, identically to 20 attempts. Raising this number is not the lever; the
// backoff is. See tests/rate-limit.test.mjs.
export const MAX_CAS_ATTEMPTS = 5;

// Base for the jittered pause between CAS attempts. Ceilings double per attempt
// up to 8x, so ~5ms, 10, 20, 40, 40, … — averaging ~20ms per retry.
export const BACKOFF_BASE_MS = 5;

// What a request is told when it loses the CAS race MAX_CAS_ATTEMPTS times.
// Short, because this is momentary contention rather than an exhausted window.
export const CONTENTION_RETRY_SECONDS = 5;

// Jittered pause before re-reading after a lost CAS.
//
// Without this the retry is a tight spin: every request that lost the race
// re-reads immediately, collides again, and the herd stays in lockstep. The
// jitter is what breaks the lockstep — a burst on one key can only clear if the
// losers spread out in time. Full jitter (uniform across the whole window rather
// than a fixed delay plus noise) de-synchronizes a herd fastest.
//
// Deliberately uses only globals, keeping this module import-free so Node's type
// stripping can run it directly from tests/rate-limit.test.mjs.
function casBackoff(attempt: number): Promise<void> {
  const ceiling = BACKOFF_BASE_MS * 2 ** Math.min(attempt, 3);
  return new Promise((resolve) => setTimeout(resolve, Math.random() * ceiling));
}

function isBucket(value: unknown): value is Bucket {
  if (typeof value !== "object" || value === null) return false;
  const b = value as Partial<Bucket>;
  return typeof b.count === "number" && typeof b.resetAt === "number";
}

// Charge one request against one tier.
//
// Implemented as an atomic compare-and-swap: read the bucket with its ETag, then
// write back conditionally (`onlyIfMatch`, or `onlyIfNew` when the key didn't
// exist). If the condition fails, another request beat us to it, so re-read and
// try again. Without this a burst of concurrent requests would all read the same
// count and all write count+1, and the effective limit would be roughly
// "limit × concurrency" rather than "limit".
//
// Throws whatever the store throws; the caller decides how to fail.
export async function chargeTier(
  store: CounterStore,
  tier: Tier,
  now: number
): Promise<ChargeResult> {
  for (let attempt = 0; attempt < MAX_CAS_ATTEMPTS; attempt += 1) {
    const current = await store.getWithMetadata(tier.key, { type: "json" });
    const stored = current && isBucket(current.data) ? current.data : null;
    // An expired bucket counts as absent: the window has rolled over. Anything
    // unparseable is treated the same way rather than trusted.
    const live = stored && stored.resetAt > now ? stored : null;

    if (live && live.count >= tier.limit) {
      return {
        ok: false,
        retryAfter: Math.max(1, Math.ceil((live.resetAt - now) / 1000)),
      };
    }

    const next: Bucket = live
      ? { count: live.count + 1, resetAt: live.resetAt }
      : { count: 1, resetAt: now + tier.windowSeconds * 1000 };

    // `current` decides the condition, not `live`: an expired bucket is still an
    // existing key, so replacing it is an ETag-matched update, not a create.
    const write =
      current && current.etag !== undefined
        ? await store.setJSON(tier.key, next, { onlyIfMatch: current.etag })
        : current
          ? await store.setJSON(tier.key, next) // key exists but no ETag — unconditional
          : await store.setJSON(tier.key, next, { onlyIfNew: true });

    if (write.modified) return { ok: true, retryAfter: 0 };

    // Lost the race. Pause before re-reading so the herd de-synchronizes instead
    // of colliding again immediately. Skipped after the final attempt — there is
    // nothing left to retry, and it would only delay the refusal.
    if (attempt < MAX_CAS_ATTEMPTS - 1) await casBackoff(attempt);
  }

  // Contention we couldn't win in MAX_CAS_ATTEMPTS tries — refuse.
  //
  // Failing *closed* here is deliberate, and it's the opposite of what
  // enforceLimits does when the store is unreachable. The distinction:
  //
  //   store unreachable  — affects everyone, tells us nothing about the caller,
  //                        so allow (an outage must not break downloads).
  //   lost CAS repeatedly — means many requests are hitting *this one counter*
  //                        at once. These keys are per-client (or a shard of the
  //                        site-wide breaker), and a real visitor clicks once,
  //                        so sustained contention on a single key is itself the
  //                        burst the limiter exists to stop.
  //
  // Allowing here would have made a parallel burst the cheapest way around the
  // whole limiter: fire N requests at once, and the ones that lose the race sail
  // through. A legitimate caller that lands in a genuine race is told to retry in
  // a few seconds and succeeds on the next click.
  return { ok: false, retryAfter: CONTENTION_RETRY_SECONDS };
}
