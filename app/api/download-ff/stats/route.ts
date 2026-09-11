import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";
import { clientKey } from "@/lib/download-guards";
import type { DownloadEvent } from "@/lib/download-tracking";

// Events are stored in UTC (the source collection). The dashboard is viewed
// from Mountain Time, so the per-day buckets follow America/Denver calendar
// days — Intl handles the MST/MDT (UTC-7/UTC-6) switch automatically.
const MT_DAY = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Denver",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
function mountainDay(iso: string): string {
  return MT_DAY.format(new Date(iso)); // "YYYY-MM-DD" in en-CA
}

// Shared gate for both handlers. Protected by a shared secret: send it as
// `Authorization: Bearer <key>` or `?key=<key>`, matched against
// DOWNLOAD_STATS_KEY. If that env var isn't set, the endpoint is disabled
// entirely (returns 404) so it can't leak data by accident. Returns a response
// to send back when the request is rejected, or null when it may proceed.
function reject(req: NextRequest, url: URL): NextResponse | null {
  const expected = process.env.DOWNLOAD_STATS_KEY;
  if (!expected) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const provided =
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    url.searchParams.get("key") ??
    "";
  if (provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

const truthy = (v: string | null) =>
  ["1", "true", "yes"].includes((v ?? "").toLowerCase());

// Read-only view over the recorded download events.
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const denied = reject(req, url);
  if (denied) return denied;

  const store = getStore("ff-downloads");
  const { blobs } = await store.list({ prefix: "events/" });

  // Pull every event and aggregate. Fine for the volumes a download counter
  // sees; if this ever gets large, switch to date-scoped prefixes. Each event is
  // kept paired with its blob key so the dashboard can address it in a POST.
  const all = (
    await Promise.all(
      blobs.map(async (b) => {
        const event = (await store.get(b.key, { type: "json" })) as DownloadEvent | null;
        return event ? { key: b.key, event } : null;
      })
    )
  ).filter((r): r is { key: string; event: DownloadEvent } => r !== null);

  // Two independent ways to drop our own test downloads:
  //
  //  - `excludeMine` matches the salted IP digest, so it catches anything from
  //    the network viewing this dashboard. Automatic, but only works on events
  //    recorded after that field existed — older ones carry no digest and are
  //    never counted as ours.
  //  - `ignored` is a flag set by hand from the dashboard (see POST). This is
  //    the only way to retire the pre-digest backlog.
  //
  // Ignored events are dropped by default; `includeIgnored=1` brings them back
  // so they can be reviewed and un-marked.
  const viewer = clientKey(req);
  const excludeMine = truthy(url.searchParams.get("excludeMine"));
  const includeIgnored = truthy(url.searchParams.get("includeIgnored"));

  const mine = all.filter((r) => r.event.clientKey === viewer).length;
  const ignored = all.filter((r) => r.event.ignored === true).length;

  const rows = all.filter(
    (r) =>
      (includeIgnored || r.event.ignored !== true) &&
      !(excludeMine && r.event.clientKey === viewer)
  );
  const events = rows.map((r) => r.event);

  const tally = (pick: (e: DownloadEvent) => string | null) =>
    events.reduce<Record<string, number>>((acc, e) => {
      const k = pick(e) ?? "unknown";
      acc[k] = (acc[k] ?? 0) + 1;
      return acc;
    }, {});

  return NextResponse.json({
    total: events.length,
    // Counts over the *unfiltered* set, plus which filters produced the numbers
    // above, so the dashboard can describe what it's showing.
    mine,
    ignored,
    excludingMine: excludeMine,
    includingIgnored: includeIgnored,
    byPlatform: tally((e) => e.platform),
    byProduct: tally((e) => e.product),
    byAuthPath: tally((e) => e.authPath),
    bySource: tally((e) => e.source),
    byCountry: tally((e) => e.country),
    byDay: tally((e) => mountainDay(e.ts)),
    // Newest 100 events, most recent first, for a quick raw look. `key` is the
    // blob key — the handle POST needs to mark the event.
    recent: rows
      .sort((a, b) => (a.event.ts < b.event.ts ? 1 : -1))
      .slice(0, 100)
      .map((r) => ({
        ...r.event,
        key: r.key,
        // Surfaced so the dashboard can label rows; the digest itself stays server-side.
        isMine: r.event.clientKey === viewer,
        ignored: r.event.ignored === true,
      })),
  });
}

// Mark (or un-mark) events as our own test downloads. Body:
// `{ keys: string[], ignored: boolean }`, where each key is a blob key from
// GET's `recent`. Same shared-secret gate as GET. This is the only writer of
// the `ignored` flag; the download path never sets it.
export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const denied = reject(req, url);
  if (denied) return denied;

  const body = (await req.json().catch(() => ({}))) as {
    keys?: unknown;
    ignored?: unknown;
  };
  // Keys come from the client, so constrain them to the event namespace — this
  // endpoint must not become a way to rewrite arbitrary blobs in the store.
  const keys = Array.isArray(body.keys)
    ? body.keys.filter(
        (k): k is string =>
          typeof k === "string" && k.startsWith("events/") && !k.includes("..")
      )
    : [];
  if (keys.length === 0) {
    return NextResponse.json({ error: "No valid event keys" }, { status: 400 });
  }
  const ignored = body.ignored !== false;

  const store = getStore("ff-downloads");
  // Read-modify-write per event. No locking, but these blobs are written once
  // by the download path and then only touched from this dashboard, so there's
  // nothing to race with.
  const updated = (
    await Promise.all(
      keys.map(async (key) => {
        const event = (await store.get(key, { type: "json" })) as DownloadEvent | null;
        if (!event) return null;
        await store.setJSON(key, { ...event, ignored });
        return key;
      })
    )
  ).filter((k): k is string => k !== null);

  return NextResponse.json({ updated: updated.length, ignored });
}
