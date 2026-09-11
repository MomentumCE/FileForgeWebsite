"use client";

import { DownloadFinderButton } from "@/components/fileforge-finder/DownloadFinderButton";

// The "Download FileForge Finder" CTA that sits beside the theme toggle in the
// page's fixed top-right corner. Split into its own client component so the
// server-rendered landing page (which exports `metadata`) can host it without
// pulling client-only deps (framer-motion, phosphor icons) into the server
// module graph.
export function GetFinderButton() {
  return (
    <DownloadFinderButton
      label="Download FileForge Finder"
      source="nav"
      className="px-6 py-3 bg-[#d97706] !text-white text-base font-medium rounded-full hover:bg-[#b45309]"
    />
  );
}
