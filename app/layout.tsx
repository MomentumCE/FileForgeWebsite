import type { Metadata } from "next";
import { Source_Serif_4, DM_Sans, Geist, Geist_Mono } from "next/font/google";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { OutsetaScripts } from "@/components/OutsetaScripts";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// Same font stack as the Momentum CE site so the shared chrome (nav, footer,
// pricing card, legal pages) renders identically. Full variable fonts (no
// `weight` array) so the opsz axis works; style: ["normal", "italic"] pulls real
// italic glyphs for <em>.
const sourceSerif = Source_Serif_4({
  variable: "--font-head",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

// Geist is the FileForge product typeface, used inside every .ff-page.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Every page's canonical and openGraph.url is relative and resolves against
  // this, so the domain lives in one place (lib/site.ts).
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FileForge",
    template: "%s | FileForge",
  },
  description:
    "FileForge turns paper archives into organized, searchable digital files: on-site scanning, OCR, and file organization by one Momentum CE team. FileForge Finder, our desktop app, searches inside those files 100% locally.",
  // The favicon is app/icon.svg (the FileForge Finder duck), picked up by Next
  // automatically.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${dmSans.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <OutsetaScripts />
        <Navigation />
        {children}
        <Footer />
        <RevealOnScroll />
      </body>
    </html>
  );
}
