// Tests for the fixed-window rate-limit counter in lib/rate-limit.ts.
//
// Netlify Blobs isn't available in local `next dev`, and lib/download-guards.ts
// deliberately fails open when the store is unreachable — so a bug in the counter
// would present as "the limiter silently stops limiting". These exercise it
// against an in-memory store that reproduces the Blobs conditional-write
// contract (onlyIfNew / onlyIfMatch / modified), including a genuinely
// concurrent burst.
//
// Run: npm run test:unit
//
// The module under test is TypeScript with no imports, so it's stripped to JS by
// Node's built-in type stripping — hence the --experimental-strip-types in that
// script (Node 22.6+; unflagged from 23.6, where the flag becomes a no-op). If
// this fails on an older Node, that's the reason.

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  chargeTier,
  CONTENTION_RETRY_SECONDS,
  MAX_CAS_ATTEMPTS,
} from "../lib/rate-limit.ts";

// Minimal stand-in for a Netlify Blobs store: JSON values, monotonic ETags, and
// the same conditional-write semantics (a failed condition returns
// modified: false rather than throwing).
function fakeStore() {
  const entries = new Map(); // key -> { json, etag }
  let nextEtag = 1;
  const stats = { reads: 0, writes: 0, rejectedWrites: 0 };

  return {
    stats,
    entries,
    async getWithMetadata(key) {
      stats.reads += 1;
      const hit = entries.get(key);
      if (!hit) return null;
      return { data: JSON.parse(hit.json), etag: hit.etag };
    },
    async setJSON(key, data, options = {}) {
      const existing = entries.get(key);
      if (options.onlyIfNew && existing) {
        stats.rejectedWrites += 1;
        return { modified: false };
      }
      if (options.onlyIfMatch !== undefined && existing?.etag !== options.onlyIfMatch) {
        stats.rejectedWrites += 1;
        return { modified: false };
      }
      const etag = `etag-${nextEtag++}`;
      entries.set(key, { json: JSON.stringify(data), etag });
      stats.writes += 1;
      return { modified: true, etag };
    },
  };
}

const TIER = { key: "free/abc/10m", limit: 5, windowSeconds: 600 };
const T0 = 1_700_000_000_000; // fixed clock; the module takes `now` as a param

test("first request creates the bucket and is allowed", async () => {
  const store = fakeStore();
  const result = await chargeTier(store, TIER, T0);

  assert.equal(result.ok, true);
  assert.deepEqual(JSON.parse(store.entries.get(TIER.key).json), {
    count: 1,
    resetAt: T0 + 600_000,
  });
});

test("allows exactly `limit` requests, then refuses", async () => {
  const store = fakeStore();
  const verdicts = [];
  for (let i = 0; i < 8; i += 1) {
    verdicts.push((await chargeTier(store, TIER, T0)).ok);
  }
  // 5 allowed, the rest refused — not 6, and not 4.
  assert.deepEqual(verdicts, [true, true, true, true, true, false, false, false]);
});

test("a refusal reports the seconds remaining in the window", async () => {
  const store = fakeStore();
  for (let i = 0; i < 5; i += 1) await chargeTier(store, TIER, T0);

  // 100s into a 600s window, ~500s should remain.
  const refused = await chargeTier(store, TIER, T0 + 100_000);
  assert.equal(refused.ok, false);
  assert.equal(refused.retryAfter, 500);
});

test("retryAfter is never 0 at the very edge of the window", async () => {
  const store = fakeStore();
  for (let i = 0; i < 5; i += 1) await chargeTier(store, TIER, T0);

  // 1ms before expiry: rounding must not produce a 0 that means "retry now".
  const refused = await chargeTier(store, TIER, T0 + 599_999);
  assert.equal(refused.ok, false);
  assert.ok(refused.retryAfter >= 1, `expected >= 1, got ${refused.retryAfter}`);
});

test("an expired window resets the budget", async () => {
  const store = fakeStore();
  for (let i = 0; i < 5; i += 1) await chargeTier(store, TIER, T0);
  assert.equal((await chargeTier(store, TIER, T0)).ok, false);

  // One millisecond past resetAt the bucket is stale and the budget is fresh.
  const after = await chargeTier(store, TIER, T0 + 600_001);
  assert.equal(after.ok, true);
  assert.deepEqual(JSON.parse(store.entries.get(TIER.key).json), {
    count: 1,
    resetAt: T0 + 600_001 + 600_000,
  });
});

test("replacing an expired bucket uses onlyIfMatch, not onlyIfNew", async () => {
  // Regression guard: the key still exists when the window rolls over, so a
  // create-only write would be rejected forever and the counter would wedge.
  const store = fakeStore();
  await chargeTier(store, TIER, T0);
  store.stats.rejectedWrites = 0;

  const after = await chargeTier(store, TIER, T0 + 600_001);
  assert.equal(after.ok, true);
  assert.equal(store.stats.rejectedWrites, 0, "expired-bucket replacement was rejected");
});

test("a concurrent burst never exceeds the limit", async () => {
  // The whole point of the compare-and-swap, and the reason CAS exhaustion fails
  // closed. All 20 requests read before any write lands, so a naive
  // read-modify-write would let all 20 through; failing open on lost races would
  // do the same, making a parallel burst the cheapest bypass of the limiter.
  const store = fakeStore();
  const results = await Promise.all(
    Array.from({ length: 20 }, () => chargeTier(store, TIER, T0))
  );

  const allowed = results.filter((r) => r.ok).length;
  assert.ok(allowed <= TIER.limit, `burst let ${allowed} through, limit is ${TIER.limit}`);
  assert.ok(allowed > 0, "burst blocked everything");
  assert.ok(store.stats.rejectedWrites > 0, "expected CAS retries under contention");

  // The stored count must also never exceed the limit.
  const stored = JSON.parse(store.entries.get(TIER.key).json);
  assert.ok(stored.count <= TIER.limit, `stored count ${stored.count} exceeds limit`);
});

test("a sequential burst is counted exactly, with no contention refusals", async () => {
  // The realistic case: requests arriving one after another. Every allow/refuse
  // must come from the budget, never from a lost race.
  const store = fakeStore();
  const verdicts = [];
  for (let i = 0; i < 7; i += 1) {
    verdicts.push(await chargeTier(store, TIER, T0));
  }
  assert.deepEqual(
    verdicts.map((v) => v.ok),
    [true, true, true, true, true, false, false]
  );
  // Refusals here are window refusals, not the 5s contention backoff.
  assert.equal(verdicts[5].retryAfter, 600);
  assert.equal(store.stats.rejectedWrites, 0, "sequential calls should never lose a CAS");
});

test("unparseable stored data is replaced rather than trusted", async () => {
  const store = fakeStore();
  store.entries.set(TIER.key, { json: JSON.stringify({ nonsense: true }), etag: "etag-0" });

  const result = await chargeTier(store, TIER, T0);
  assert.equal(result.ok, true);
  assert.deepEqual(JSON.parse(store.entries.get(TIER.key).json), {
    count: 1,
    resetAt: T0 + 600_000,
  });
});

test("a key with no ETag still writes (degrades to unconditional)", async () => {
  const store = fakeStore();
  // Blobs types etag as optional; make sure that path isn't a silent no-op.
  store.entries.set(TIER.key, {
    json: JSON.stringify({ count: 1, resetAt: T0 + 600_000 }),
    etag: undefined,
  });

  const result = await chargeTier(store, TIER, T0);
  assert.equal(result.ok, true);
  assert.equal(JSON.parse(store.entries.get(TIER.key).json).count, 2);
});

test("gives up after MAX_CAS_ATTEMPTS and fails closed", async () => {
  // A store that never accepts a conditional write, simulating pathological
  // contention. The limiter must refuse (see the comment at the end of
  // chargeTier) and must stop rather than spin.
  //
  // The tier's limit must stay clear of MAX_CAS_ATTEMPTS. The fake store below
  // persists every write even while reporting it as rejected, so the count climbs
  // once per attempt; if the budget were the smaller of the two it would run out
  // first and this would assert a *window* refusal while claiming to test
  // contention. Sizing the limit off the constant keeps the two from ever
  // coupling again.
  const CONTENDED = {
    key: "free/contended/10m",
    limit: MAX_CAS_ATTEMPTS + 10,
    windowSeconds: 600,
  };
  const store = fakeStore();
  const realSet = store.setJSON.bind(store);
  let attempts = 0;
  store.setJSON = async (...args) => {
    attempts += 1;
    await realSet(...args); // keep the entry present so the loop re-reads
    return { modified: false };
  };

  const result = await chargeTier(store, CONTENDED, T0);
  assert.equal(result.ok, false, "must fail closed — an open burst is the bypass");
  assert.equal(
    result.retryAfter,
    CONTENTION_RETRY_SECONDS,
    "must be the contention backoff, not a window refusal"
  );
  assert.equal(attempts, MAX_CAS_ATTEMPTS, "must stop after MAX_CAS_ATTEMPTS");
});

// ───────────────────────────────────────────── the shared-NAT / conference case ────
//
// The scenario these guard: the app is demoed to a room, and a few hundred people
// on one wifi download it within minutes. They all share an IP, so they all share
// ONE per-IP counter key — which stresses the limiter in two separate ways. Both
// have to hold or the room gets 429s.

const CONFERENCE_TIER = { key: "free/nat-abc/10m", limit: 300, windowSeconds: 600 };

test("a 300-person room on one IP is admitted in full", async () => {
  // Failure mode 1: budget. The old default was 5 per 10 minutes, which refused
  // the sixth person in the room. Nothing here should be refused.
  const store = fakeStore();
  const verdicts = [];
  for (let i = 0; i < 300; i += 1) {
    verdicts.push((await chargeTier(store, CONFERENCE_TIER, T0)).ok);
  }

  assert.equal(
    verdicts.filter((ok) => ok).length,
    300,
    "every attendee must get through"
  );
  assert.equal(store.stats.rejectedWrites, 0, "sequential arrivals should never lose a CAS");
});

test("the 301st request in the window is refused, not silently allowed", async () => {
  // The limit must still bind — generous is not the same as absent.
  const store = fakeStore();
  for (let i = 0; i < 300; i += 1) await chargeTier(store, CONFERENCE_TIER, T0);

  const refused = await chargeTier(store, CONFERENCE_TIER, T0);
  assert.equal(refused.ok, false);
  assert.equal(refused.retryAfter, 600);
});

test("a simultaneous click-burst on one shared key is not refused", async () => {
  // Failure mode 2, and the subtle one: contention, not budget.
  //
  // A hot counter serializes by construction — N simultaneous requests need N
  // successful writes in sequence. This fake store has zero latency, which makes
  // the burst perfectly lockstep and therefore *harsher* than production, where
  // Blobs write latency spreads arrivals out on its own.
  //
  // What makes this pass is the jittered backoff in chargeTier, not the CAS
  // attempt count. Measured with the backoff removed, exactly 5 of these 15 got
  // through and the other 10 were told to retry in 5 seconds — while the
  // 300-request budget sat almost untouched. With jitter, 5 attempts clears a
  // 300-way burst. That asymmetry is the reason the backoff exists.
  const store = fakeStore();
  const burst = 15;
  const results = await Promise.all(
    Array.from({ length: burst }, () => chargeTier(store, CONFERENCE_TIER, T0))
  );

  const allowed = results.filter((r) => r.ok).length;
  assert.equal(
    allowed,
    burst,
    `a ${burst}-way burst well inside budget must all be allowed, got ${allowed}`
  );
  assert.ok(store.stats.rejectedWrites > 0, "expected genuine CAS contention in this test");
  assert.equal(JSON.parse(store.entries.get(CONFERENCE_TIER.key).json).count, burst);
});

test("tiers with distinct keys hold independent budgets", async () => {
  const store = fakeStore();
  const a = { key: "free/aaa/10m", limit: 2, windowSeconds: 600 };
  const b = { key: "free/bbb/10m", limit: 2, windowSeconds: 600 };

  await chargeTier(store, a, T0);
  await chargeTier(store, a, T0);
  assert.equal((await chargeTier(store, a, T0)).ok, false, "a should be exhausted");
  assert.equal((await chargeTier(store, b, T0)).ok, true, "b must be unaffected");
});
