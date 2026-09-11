import type { Metadata } from "next";
import { Hero } from "@/components/fileforge/Hero";
import { Problem } from "@/components/fileforge/Problem";
import { Benefits } from "@/components/fileforge/Benefits";
import { Services } from "@/components/fileforge/Services";
import { Process } from "@/components/fileforge/Process";
import { Pricing } from "@/components/fileforge/Pricing";
import { Trust } from "@/components/fileforge/Trust";
import { CTA } from "@/components/fileforge/CTA";
import { FinderCallout } from "@/components/fileforge/FinderCallout";
import { Contact } from "@/components/Contact";

export const metadata: Metadata = {
  title: "FileForge by Momentum CE - Paper to organized digital files",
  description:
    "FileForge is Momentum CE's digitization service for tribal organizations and SMBs. On-site scanning, OCR, and file organization - one team, end-to-end.",
  alternates: { canonical: "/fileforge-service" },
  openGraph: {
    title: "FileForge by Momentum CE - Paper to organized digital files",
    description:
      "On-site scanning, OCR, and file organization - one Momentum CE team, end-to-end.",
    url: "/fileforge-service",
    type: "website",
  },
};

export default function FileForgePage() {
  return (
    <main className="ff-page">
      <Hero />
      <Problem />
      <Benefits />
      <Services />
      <Process />
      <Pricing />
      <Trust />
      <FinderCallout />
      <CTA />
      <Contact />
    </main>
  );
}
