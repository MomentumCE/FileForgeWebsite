import type { Metadata } from "next";
import StatsDashboard from "./StatsDashboard";

// Internal, unlinked dev dashboard for the FileForge Finder download counter.
// The page itself is public HTML, but it renders nothing useful without the
// DOWNLOAD_STATS_KEY — the /api/download-ff/stats endpoint enforces that. Marked
// noindex so it never shows up in search.
export const metadata: Metadata = {
  title: "FF Download Stats",
  robots: { index: false, follow: false },
};

export default function FFStatsPage() {
  return <StatsDashboard />;
}
