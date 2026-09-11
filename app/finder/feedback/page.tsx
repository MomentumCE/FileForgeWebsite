import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { FinderAuthHeader } from "@/components/fileforge-finder/AuthHeader";
import { FeedbackForm } from "@/components/fileforge-finder/FeedbackForm";

export const metadata: Metadata = {
  title: "Send feedback — FileForge Finder",
  description:
    "Send feedback, a bug report, or a feature request for FileForge Finder.",
  alternates: { canonical: "/finder/feedback" },
  openGraph: {
    title: "Send feedback — FileForge Finder",
    description:
      "Send feedback, a bug report, or a feature request for FileForge Finder.",
    url: "/finder/feedback",
    type: "website",
  },
};

// User feedback page for FileForge Finder. Deliberately not gated behind
// Outseta: anyone running the app — trial, subscriber, or evaluator — should be
// able to reach it, and name/email are optional so a report costs nothing to
// send. Submissions land in Netlify Forms under "fileforge-feedback".
export default function FeedbackPage() {
  return (
    <main className="ff-page" style={pageStyle}>
      <div style={{ width: "min(600px, 94vw)" }}>
        <FinderAuthHeader
          title="Send feedback"
          subtitle="Bug reports, feature requests, or anything that isn't working the way you'd expect. Only the topic and your message are required."
        />

        <section aria-label="Feedback form" style={formCard}>
          <FeedbackForm />
        </section>
      </div>
    </main>
  );
}

// Top padding clears the fixed MomentumCE nav (68px tall) that app/layout.tsx
// renders over every page.
const pageStyle: CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: "7rem 2rem 4rem",
};
const formCard: CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(0,0,0,0.1)",
  borderRadius: "1rem",
  padding: "1.5rem",
  boxShadow: "0 10px 30px -12px rgba(0,0,0,0.15)",
};
