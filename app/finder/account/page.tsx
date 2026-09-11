import type { Metadata } from "next";
import { FinderAuthHeader } from "@/components/fileforge-finder/AuthHeader";
import { DownloadCard } from "@/components/fileforge-finder/DownloadCard";

export const metadata: Metadata = {
  title: "Account — FileForge Finder",
  description: "Manage your FileForge Finder account and subscription.",
  alternates: { canonical: "/finder/account" },
  robots: { index: false },
};

// Account management (profile, subscription, billing) is handled by Outseta. The
// profile widget below is rendered by the global Outseta script (see
// app/layout.tsx); Outseta gates access, prompting sign-in when the visitor
// isn't authenticated.
export default function AccountPage() {
  return (
    <main
      className="ff-page"
     
      style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}
    >
      <div style={{ width: "min(720px, 94vw)" }}>
        <FinderAuthHeader
          title="Your FileForge Finder account"
          subtitle="Manage the subscription and profile for your FileForge Finder account. This account applies only to FileForge Finder."
        />
        <DownloadCard />
        <div data-o-profile="1" data-mode="embed" />
      </div>
    </main>
  );
}
