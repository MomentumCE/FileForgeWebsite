import type { Metadata } from "next";
import { Hero } from "@/components/fileforge-finder/Hero";
// import { Problem } from "@/components/fileforge-finder/Problem";
// import { Benefits } from "@/components/fileforge-finder/Benefits";
// import { Features } from "@/components/fileforge-finder/Features";
// import { HowItWorks } from "@/components/fileforge-finder/HowItWorks";
// import { Privacy } from "@/components/fileforge-finder/Privacy";
// import { Pricing } from "@/components/fileforge-finder/Pricing";
// import { CTA } from "@/components/fileforge-finder/CTA";
import { LegalLinks } from "@/components/fileforge-finder/LegalLinks";

export const metadata: Metadata = {
  title: "FileForge Finder — Search inside your documents, 100% local",
  description:
    "FileForge Finder is a fast, local document finder for records work. Search the words inside PDFs and Word docs, preview without opening, flag sensitive data, and export verifiable records packages. No cloud: your files never leave your device.",
  alternates: { canonical: "/finder" },
  openGraph: {
    title: "FileForge Finder — Search inside your documents, 100% local",
    description:
      "Find files by the words inside them, preview in-app, and export defensible records packages. It runs locally, and your files never leave your device.",
    url: "/finder",
    type: "website",
  },
};

export default function FileForgeFinderPage() {
  return (
    <main className="ff-page">
      <Hero />
      <LegalLinks />
      {/* <Problem /> */}
      {/* <Benefits /> */}
      {/* <Features /> */}
      {/* <HowItWorks /> */}
      {/* <Privacy /> */}
      {/* <Pricing /> */}
      {/* <CTA /> */}
    </main>
  );
}
