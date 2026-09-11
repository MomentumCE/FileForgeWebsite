// Where every "Get FileForge Finder" CTA (and any other link that would land
// on the subscribe page) sends the visitor.
//
// The paid subscribe flow isn't live yet, so production builds point all of
// these CTAs at the early-access lead-capture form instead. In `next dev`
// they keep pointing at /subscribe so the Outseta checkout flow can still be
// worked on locally. Flip this constant (or delete it) when subscriptions
// launch for real.
export const GET_FINDER_HREF =
  process.env.NODE_ENV === "production"
    ? "/finder/early-access"
    : "/finder/subscribe";

// Download confirmation page. Free-download CTAs send the visitor here instead
// of straight to the signed installer URL; the page kicks off the actual
// download and shows install steps.
export const DOWNLOAD_CONFIRM_HREF = "/finder/download-confirm";

// Longest Retry-After we'll sit through before giving up and sending the visitor
// to the fallback page. The limiter's contention refusal is ~5s; an exhausted
// window can report hundreds of seconds, and nobody waits that long staring at a
// button.
const RETRY_AFTER_CAP_SECONDS = 12;

// Ask /api/download-ff for a short-lived signed installer URL.
//
// Shared by every free-download CTA so the 429 handling lives in one place.
//
// The retry is the point. A 429 from the download route is usually not "you are
// blocked" — it's the rate limiter's short contention backoff, which happens when
// many people on one network click at nearly the same moment. That is exactly
// what a conference or classroom demo looks like from the server's side (one IP,
// one shared counter key). Falling straight through to the early-access page
// there would strand a room full of people who did nothing wrong, so honour
// Retry-After once before giving up.
//
// Returns the URL, or null when the caller should use GET_FINDER_HREF instead.
export async function requestInstallerUrl(
  payload: Record<string, unknown>,
  onRetrying?: () => void
): Promise<string | null> {
  const send = () =>
    fetch("/api/download-ff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

  try {
    let res = await send();

    if (res.status === 429) {
      const header = Number(res.headers.get("Retry-After"));
      // Default to the limiter's own contention window when the header is absent
      // or unparseable, rather than abandoning a retry that would likely work.
      const waitSeconds = Number.isFinite(header) && header > 0 ? header : 5;
      if (waitSeconds > RETRY_AFTER_CAP_SECONDS) return null;
      onRetrying?.();
      await new Promise((resolve) => setTimeout(resolve, waitSeconds * 1000));
      res = await send();
    }

    const data = (await res.json().catch(() => ({}))) as { url?: string };
    if (!res.ok || !data.url) return null;
    return data.url;
  } catch {
    return null;
  }
}
