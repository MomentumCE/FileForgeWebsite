import type { Metadata } from "next";
import { CallbackClient } from "./CallbackClient";

export const metadata: Metadata = {
  title: "Returning to FileForge Finder",
  description: "Completing your FileForge Finder sign-in.",
  alternates: { canonical: "/finder/auth/callback" },
  // Never index this relay — it only exists to hand the sign-in result back to
  // the desktop app.
  robots: { index: false, follow: false },
};

// This relay is per-request (it reads ?code and calls Outseta) — never prerender
// or cache it.
export const dynamic = "force-dynamic";

// OAuth redirect target for the FileForge Finder DESKTOP sign-in. Outseta sends
// the browser here (?code=…&state=…) after the user signs in on Outseta's hosted
// login. We trade that one-time code for an access token SERVER-SIDE — the
// client_secret lives only in this server's env (OUTSETA_CLIENT_SECRET) and never
// reaches the browser or the desktop app — then hand ONLY the access token to the
// app over the fileforge:// deep link (see CallbackClient). The desktop app still
// validates `state` before it trusts the token.
export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; state?: string; error?: string }>;
}) {
  const { code, state, error } = await searchParams;

  // Outseta reported an error, or the link is missing what we need. `state` must
  // be present too — the desktop app needs it for its CSRF check.
  if (error || !code || !state) {
    return <CallbackClient status="invalid" />;
  }

  const token = await exchangeCodeForToken(code);
  if (!token) {
    return <CallbackClient status="invalid" />;
  }

  // Hand the TOKEN (not the code) back to the desktop app.
  return <CallbackClient status="ok" token={token} state={state} />;
}

// Trade the one-time authorization code for an Outseta access token at
// /connect/token, authenticating as the confidential OAuth client with the
// server-only secret. Returns the access token, or null on any failure (the
// caller then shows the retry state). Deliberately never logs the code or token.
async function exchangeCodeForToken(code: string): Promise<string | null> {
  const domain = process.env.OUTSETA_DOMAIN;
  const clientId = process.env.OUTSETA_CLIENT_ID;
  const clientSecret = process.env.OUTSETA_CLIENT_SECRET;
  const redirectUri = process.env.OUTSETA_REDIRECT_URI;
  if (!domain || !clientId || !clientSecret || !redirectUri) {
    console.error("[ff-auth] Outseta relay env not configured");
    return null;
  }

  try {
    const res = await fetch(`https://${domain}/connect/token`, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        accept: "application/json",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }).toString(),
      cache: "no-store",
    });
    if (!res.ok) {
      // Log the status only — the body can echo the code; never log either.
      console.error("[ff-auth] token exchange failed:", res.status);
      return null;
    }
    const json = (await res.json()) as { access_token?: string };
    return json.access_token || null;
  } catch (e) {
    console.error("[ff-auth] token exchange error:", (e as Error).message);
    return null;
  }
}
