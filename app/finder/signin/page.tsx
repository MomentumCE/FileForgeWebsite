import type { Metadata } from "next";
import { FinderAuthHeader, FinderAuthAltLink } from "@/components/fileforge-finder/AuthHeader";
import { GET_FINDER_HREF } from "@/lib/fileforge-finder";

export const metadata: Metadata = {
  title: "Sign in — FileForge Finder",
  description: "Sign in to manage your FileForge Finder account.",
  alternates: { canonical: "/finder/signin" },
  robots: { index: false },
};

// Login is handled by Outseta. The login widget below is rendered by the global
// Outseta script (see app/layout.tsx), which mounts the widget into this
// data-o-auth container on page load.
export default function SignInPage() {
  return (
    <main
      className="ff-page"
     
      style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}
    >
      <div style={{ width: "min(460px, 94vw)" }}>
        <FinderAuthHeader
          title="Sign in to FileForge Finder"
          subtitle="Sign in to manage your FileForge Finder account. These credentials work only with FileForge Finder — not other Momentum CE services."
        />
        <div data-o-auth="1" data-mode="embed" data-widget-mode="login" />
        <FinderAuthAltLink
          prompt="New to FileForge Finder?"
          linkLabel="Create an account"
          href={GET_FINDER_HREF}
        />
      </div>
    </main>
  );
}
