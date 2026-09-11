"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

// Outseta — auth, profile & billing widgets, loaded site-wide. The embed pages
// under /finder render data-o-auth / data-o-profile containers that
// this script mounts widgets into. o_options must exist before outseta.min.js
// runs, so it's defined beforeInteractive. monitorDom:'true' is required
// because this is a Next.js SPA: without it Outseta only scans the DOM once
// when the script loads, so an embed reached via client-side navigation
// (Link/router/back-forward) would never get a widget. monitorDom keeps
// Outseta watching for the containers and mounts them whenever they appear.
//
// The same script also patches scrollIntoView (before Outseta loads) to stop
// Outseta auto-scrolling embed fields into view during validation — see the
// inline comment below.
//
// EXCLUDED on the desktop-app auth callback relay (/finder/auth/callback):
// that page's whole job is to forward a one-time authorization code to the
// fileforge:// deep link untouched. Outseta's script actively watches the DOM
// (monitorDom) and is built to react to auth-related state on any page it
// loads on — with the code sitting right there in the URL, it's a plausible
// (and cheap-to-remove) source of the code getting consumed/invalidated
// before our own exchange call runs. That page has no embeds and no other use
// for Outseta, so it loses nothing by skipping it.
export function OutsetaScripts() {
  const pathname = usePathname();
  if (pathname?.startsWith("/finder/auth/callback")) return null;

  return (
    <>
      <Script id="outseta-options" strategy="beforeInteractive">
        {`var o_options = {
  domain: 'momentum-ce.outseta.com',
  load: 'auth,customForm,emailList,leadCapture,nocode,profile,support',
  monitorDom: 'true'
};
// When an embed field fails validation (e.g. the "Please enter a valid email
// address" notice on the sign-in page), Outseta calls scrollIntoView() on the
// field and its error element; with html { scroll-behavior: smooth } that
// visibly scrolls the whole window down. The embed widgets (data-o-auth login,
// data-o-profile account) are small and always fully on screen, so scrolling
// them into view is never needed. Suppress scrollIntoView only for elements
// inside those embed containers; every other scrollIntoView on the site — and
// Outseta's own popups — is left untouched.
(function () {
  var nativeScrollIntoView = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = function () {
    try {
      if (this.closest && this.closest('[data-o-auth], [data-o-profile]')) return;
    } catch (e) {}
    return nativeScrollIntoView.apply(this, arguments);
  };
})();`}
      </Script>
      <Script
        id="outseta-script"
        src="https://cdn.outseta.com/outseta.min.js"
        data-options="o_options"
        strategy="afterInteractive"
      />
    </>
  );
}
