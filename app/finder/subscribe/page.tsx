import type { Metadata } from "next";
import { FinderAuthHeader, FinderAuthAltLink } from "@/components/fileforge-finder/AuthHeader";
import { PlanCards } from "@/components/fileforge-finder/PlanCards";

export const metadata: Metadata = {
  title: "Subscribe — FileForge Finder",
  description: "Create your FileForge Finder account and subscribe.",
  alternates: { canonical: "/finder/subscribe" },
  robots: { index: false },
};

// Outseta owns sign-up + billing, but the plan picker below is our own styled
// UI (PlanCards) instead of Outseta's default "Select Plan" widget. Each card's
// CTA calls Outseta.auth.open() deep-linked to that plan with skipPlanOptions,
// so the visitor lands straight on the registration/checkout step. The global
// Outseta script is loaded in app/layout.tsx.
export default function SubscribePage() {
  return (
    <main
      className="ff-page"
     
      style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}
    >
      <div style={{ width: "min(1000px, 94vw)" }}>
        <FinderAuthHeader
          title="Subscribe to FileForge Finder"
          subtitle="Create your account and choose a plan for FileForge Finder — Momentum CE's private, 100% local document-search app. This subscription is for FileForge Finder only."
        />
        <PlanCards />
        <FinderAuthAltLink
          prompt="Already have a FileForge Finder account?"
          linkLabel="Sign in"
          href="/finder/signin"
        />
      </div>
    </main>
  );
}
