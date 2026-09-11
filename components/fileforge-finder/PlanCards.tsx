"use client";

import { useEffect, useRef, useState } from "react";
import { GET_FINDER_HREF, requestInstallerUrl } from "@/lib/fileforge-finder";

// Outseta is loaded site-wide in app/layout.tsx. This is the minimal slice of
// its JS API we call — auth.open() opens the register/checkout widget as a
// popup, deep-linked to a specific plan so Outseta's own "Select Plan" step is
// skipped (skipPlanOptions). See the FileForge Finder subscribe flow.
type Billing = "year" | "lifetime";

// Yearly and lifetime are separate plans in Outseta (a lifetime plan is a
// one-time-charge plan, not a payment term on the yearly plan), so the paid
// plan carries two plan UIDs and the toggle switches which one checkout opens.
type PlanRate = { uid: string; price: number };

// The FileForge Finder+ paid plan. Its two rates map to the yearly/lifetime
// toggle; the free FileForge Finder tier below is a plain download, not an
// Outseta plan, so it isn't modeled here.
const FINDER_PLUS = {
  name: "FileForge Finder+",
  yearly: { uid: "yWoK3xWD", price: 79 } as PlanRate,
  lifetime: { uid: "jW7wakWq", price: 129 } as PlanRate,
  cta: "Choose Finder+",
  // NOTE: feature bullets are PLACEHOLDERS — swap for the real per-plan copy.
  features: [
    { text: "Everything in Finder" },
    { text: "Feature two" },
    { text: "Feature three" },
    { text: "Feature four" },
    { text: "Feature five" },
  ],
};

// The free FileForge Finder tier. No Outseta plan — the CTA just starts the
// installer download, mirroring the "Download free" button used elsewhere.
const FINDER_FREE = {
  name: "FileForge Finder",
  // NOTE: feature bullets are PLACEHOLDERS — swap for the real per-plan copy.
  features: [
    { text: "Feature one" },
    { text: "Feature two" },
    { text: "Feature three" },
    { text: "Feature four" },
  ],
};

type Platform = "mac" | "windows" | "linux";
// Linux ships two builds (.deb and .AppImage); Linux visitors pick which.
type LinuxFormat = "deb" | "appimage";

// See DownloadFinderButton for the rationale (mac → .dmg, linux → .deb/.AppImage,
// else → .exe; Android excluded from the Linux match).
function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "windows";
  const uaPlatform =
    (navigator as Navigator & { userAgentData?: { platform?: string } })
      .userAgentData?.platform ?? "";
  const hay = `${uaPlatform} ${navigator.platform ?? ""} ${navigator.userAgent ?? ""}`;
  if (/mac/i.test(hay)) return "mac";
  if (/linux/i.test(hay) && !/android/i.test(hay)) return "linux";
  return "windows";
}

function openCheckout(term: Billing) {
  // Pass planUid alone (NOT planFamilyUid) — including the family re-shows
  // Outseta's "Select Plan" screen; planUid + skipPlanOptions deep-links
  // straight to registration/checkout for this exact plan.
  // Lifetime plans are one-time-charge plans in Outseta, so no
  // planPaymentTerm is sent for them — the plan's own (only) rate applies.
  window.Outseta?.auth.open({
    widgetMode: "register",
    planUid: term === "year" ? FINDER_PLUS.yearly.uid : FINDER_PLUS.lifetime.uid,
    ...(term === "year" ? { planPaymentTerm: "year" } : {}),
    skipPlanOptions: true,
    mode: "popup",
  });
}

export function PlanCards() {
  const [billing, setBilling] = useState<Billing>("year");
  const [downloading, setDownloading] = useState(false);
  const [platform, setPlatform] = useState<Platform>("windows");
  const [menuOpen, setMenuOpen] = useState(false);
  const freeCtaRef = useRef<HTMLDivElement>(null);
  const isYear = billing === "year";

  // Resolve platform after mount (navigator is client-only); defaults to
  // "windows" during SSR so the Linux menu never renders server-side.
  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  // Close the Linux format menu on an outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (!freeCtaRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const plusPrice = isYear ? FINDER_PLUS.yearly.price : FINDER_PLUS.lifetime.price;
  const plusPer = isYear ? "/year" : " one-time";
  const plusSave = isYear
    ? `$${(FINDER_PLUS.yearly.price / 12).toFixed(2)}/mo billed yearly`
    : "pay once — never billed again";

  // Free tier: ask /api/download-ff for a short-lived signed installer URL
  // and send the browser straight there. Falls back to the early-access page.
  // `linuxFormat` is sent only for Linux and ignored by the server otherwise.
  const startDownload = async (linuxFormat?: LinuxFormat) => {
    if (downloading) return;
    setMenuOpen(false);
    setDownloading(true);
    const url = await requestInstallerUrl({
      free: true,
      platform,
      source: "subscribe",
      ...(linuxFormat ? { linuxFormat } : {}),
    });
    window.location.href = url ?? GET_FINDER_HREF;
  };

  // Linux visitors pick a package first; everyone else downloads immediately.
  const onFreeClick = () => {
    if (platform === "linux") setMenuOpen((v) => !v);
    else void startDownload();
  };

  return (
    <div className="ff-plans">
      {/* Billing period toggle — applies to FileForge Finder+ only */}
      <div className="ff-plans-bar">
        <div className="ff-plans-toggle" role="group" aria-label="Billing period">
          <button
            type="button"
            className={`ff-plans-seg${isYear ? " is-active" : ""}`}
            aria-pressed={isYear}
            onClick={() => setBilling("year")}
          >
            Yearly
          </button>
          <button
            type="button"
            className={`ff-plans-seg${!isYear ? " is-active" : ""}`}
            aria-pressed={!isYear}
            onClick={() => setBilling("lifetime")}
          >
            Lifetime <span className="ff-save-hint">pay once</span>
          </button>
        </div>
      </div>
      <p className="ff-plans-note">
        {isYear
          ? "Finder+ billed once a year. Cancel anytime."
          : "Finder+ one-time payment — yours forever. No renewals."}
      </p>

      {/* Plan cards */}
      <div className="ff-plan-grid ff-plan-grid--two">
        {/* Free tier */}
        <div className="ff-plan-card">
          <div className="ff-plan-name">{FINDER_FREE.name}</div>
          <div className="ff-plan-price">
            <span className="ff-plan-amount">Free</span>
          </div>
          <div className="ff-plan-save">No account needed</div>
          <ul className="ff-plan-feats">
            {FINDER_FREE.features.map((f, i) => (
              <li key={i}>
                <CheckIcon />
                <span>{f.text}</span>
              </li>
            ))}
          </ul>
          <div className="ff-plan-cta-wrap" ref={freeCtaRef}>
            <button
              type="button"
              className="ff-plan-cta is-secondary"
              onClick={onFreeClick}
              aria-haspopup={platform === "linux" ? "menu" : undefined}
              aria-expanded={platform === "linux" ? menuOpen : undefined}
            >
              {downloading ? "Starting download…" : "Download free"}
            </button>
            {menuOpen && !downloading ? (
              <div role="menu" aria-label="Choose Linux package" className="ff-linux-menu">
                <button
                  type="button"
                  role="menuitem"
                  className="ff-linux-opt"
                  onClick={() => void startDownload("deb")}
                >
                  <span className="ff-linux-opt-title">Debian / Ubuntu</span>
                  <span className="ff-linux-opt-ext">.deb</span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="ff-linux-opt"
                  onClick={() => void startDownload("appimage")}
                >
                  <span className="ff-linux-opt-title">
                    AppImage
                    <span className="ff-linux-opt-hint">Runs on any distro</span>
                  </span>
                  <span className="ff-linux-opt-ext">.AppImage</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Paid tier */}
        <div className="ff-plan-card is-featured">
          <span className="ff-plan-ribbon">Best value</span>
          <div className="ff-plan-name">{FINDER_PLUS.name}</div>
          <div className="ff-plan-price">
            <span className="ff-plan-amount">${plusPrice}</span>
            <span className="ff-plan-per">{plusPer}</span>
          </div>
          <div className="ff-plan-save">{plusSave}</div>
          <ul className="ff-plan-feats">
            {FINDER_PLUS.features.map((f, i) => (
              <li key={i}>
                <CheckIcon />
                <span>{f.text}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="ff-plan-cta"
            onClick={() => openCheckout(billing)}
          >
            {FINDER_PLUS.cta}
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
