import type { Metadata } from "next";
import { Hero } from "@/components/fileforge-plus/Hero";
import { Features } from "@/components/fileforge-plus/Features";
import { LegalLinks } from "@/components/fileforge-finder/LegalLinks";

export const metadata: Metadata = {
  title: "FileForge Finder+ — On-device AI to OCR, rename & file your documents",
  description:
    "FileForge Finder+ adds on-device AI power tools on top of FileForge Finder: make scanned PDFs searchable with OCR, rename files by what's inside them, and automatically file new scans from a watched folder. You review every change. No cloud processing: your files never leave your device.",
  alternates: { canonical: "/fileforge-plus" },
  openGraph: {
    title: "FileForge Finder+ — On-device AI to OCR, rename & file your documents",
    description:
      "OCR scanned PDFs, rename files by their contents, and auto-file new scans, all with on-device AI. You review every change, and the AI runs locally on your device.",
    url: "/fileforge-plus",
    type: "website",
  },
};

export default function FileForgePlusPage() {
  return (
    <main className="ff-page">
      <div
        style={{
          position: "fixed",
          top: 80,
          left: "2rem",
          zIndex: 50,
        }}
      >
        <a
          href="/finder"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors underline underline-offset-4"
        >
          <span aria-hidden="true">&larr;</span>
          Back to FileForge Finder
        </a>
      </div>
      <Hero />
      <Features />
      <LegalLinks />
    </main>
  );
}
