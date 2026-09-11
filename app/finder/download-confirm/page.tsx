import type { Metadata } from "next";
import { DownloadConfirmClient } from "./DownloadConfirmClient";

export const metadata: Metadata = {
  title: "Download started — FileForge Finder",
  description: "Your FileForge Finder download is on its way.",
  alternates: { canonical: "/finder/download-confirm" },
  robots: { index: false },
};

function one(value: string | string[] | undefined): string | null {
  return Array.isArray(value) ? (value[0] ?? null) : (value ?? null);
}

// The download CTAs pass the visitor's detected platform through the query
// string. Read it here on the server and hand it to the client component as
// props rather than reading it there with useSearchParams: that hook forces the
// page into a Suspense boundary, and a boundary here never hydrates — the
// download would never start. Server-side params also mean the first paint
// already names the right OS.
export default async function DownloadConfirmPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  return (
    <DownloadConfirmClient
      platform={one(params.platform)}
      linuxFormat={one(params.linuxFormat)}
      source={one(params.source)}
    />
  );
}
