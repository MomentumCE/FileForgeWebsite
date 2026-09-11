"use client";

import {
  AppleLogo,
  ArrowRight,
  CheckCircle,
  Desktop,
  DownloadSimple,
  LinuxLogo,
  ShieldCheck,
  WarningCircle,
  WifiHigh,
  WindowsLogo,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { FinderDuckLogo, FinderWordmark } from "@/components/fileforge-finder/FinderMark";
import { requestInstallerUrl } from "@/lib/fileforge-finder";

type Platform = "mac" | "windows" | "linux";
type LinuxFormat = "deb" | "appimage";

function isPlatform(value: string | null): value is Platform {
  return value === "mac" || value === "windows" || value === "linux";
}

// Per-OS copy and iconography for the confirmation card: the human-readable OS
// name, the Phosphor logo shown in the status medallion, the file extension the
// visitor should look for, and the install steps.
const OS: Record<
  Platform,
  {
    label: string;
    Logo: ComponentType<{ size?: number; weight?: "fill" | "duotone" }>;
    steps: string[];
  }
> = {
  windows: {
    label: "Windows",
    Logo: WindowsLogo,
    steps: [
      "Open the downloaded .exe from your Downloads folder.",
      "If Windows shows a SmartScreen notice, choose More info → Run anyway.",
      "Follow the installer, then launch FileForge Finder.",
    ],
  },
  mac: {
    label: "macOS",
    Logo: AppleLogo,
    steps: [
      "Open the downloaded .dmg from your Downloads folder.",
      "Drag FileForge Finder into your Applications folder.",
      "Launch it from Applications — right-click → Open the first time.",
    ],
  },
  linux: {
    label: "Linux",
    Logo: LinuxLogo,
    steps: [
      "Open a terminal in your Downloads folder.",
      "For the .deb, run: sudo apt install ./FileForge-Finder*.deb",
      "For the AppImage, run: chmod +x FileForge-Finder*.AppImage, then launch it.",
    ],
  },
};

// The same privacy promises the landing-page hero makes, repeated here so the
// last page of the funnel reinforces the pitch rather than dropping the visitor
// onto a bare receipt.
const PROMISES = [
  { Icon: ShieldCheck, text: "100% local & private" },
  { Icon: WifiHigh, text: "No cloud processing" },
  { Icon: Desktop, text: "Mac, Windows & Linux" },
];

// Download confirmation page. The CTA buttons no longer navigate straight to the
// signed installer URL — they send the visitor here with the platform they were
// detected on, and this page asks /api/download-ff for the signed URL and starts
// the transfer in a hidden iframe. Because a download response never replaces
// the document, the visitor stays on this page and gets install steps plus a
// manual retry link if their browser blocked the automatic start.
export function DownloadConfirmClient({
  platform: rawPlatform,
  linuxFormat: rawFormat,
  source: rawSource,
}: {
  platform: string | null;
  linuxFormat: string | null;
  source: string | null;
}) {
  const platform: Platform = isPlatform(rawPlatform) ? rawPlatform : "windows";
  const linuxFormat: LinuxFormat | undefined =
    rawFormat === "deb" || rawFormat === "appimage" ? rawFormat : undefined;
  const source = rawSource ?? "unknown";

  const [status, setStatus] = useState<"starting" | "retrying" | "started" | "failed">(
    "starting"
  );
  // The signed URL, kept so the "start it manually" link can reuse it rather
  // than burning a second request against the rate limiter.
  const [url, setUrl] = useState<string | null>(null);
  // React mounts effects twice in dev StrictMode; without this guard the visitor
  // would be charged two downloads (and two rate-limit hits) on every visit.
  //
  // Deliberately no cleanup/cancelled flag to go with it: StrictMode's throwaway
  // unmount would set cancelled on the one request the guard let through, and
  // the page would sit on "Preparing…" forever. Nothing here needs cancelling —
  // the request is fire-and-forget and the component lives as long as the page.
  const requested = useRef(false);

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;

    void (async () => {
      const signed = await requestInstallerUrl(
        {
          free: true,
          platform,
          source: `confirm:${source}`,
          ...(linuxFormat ? { linuxFormat } : {}),
        },
        () => setStatus("retrying")
      );
      if (!signed) {
        setStatus("failed");
        return;
      }
      setUrl(signed);
      setStatus("started");
    })();
  }, [platform, linuxFormat, source]);

  const os = OS[platform];
  const failed = status === "failed";
  const done = status === "started";

  return (
    <main className="ff-page mesh-gradient min-h-[100dvh] flex items-center justify-center px-4 py-16 md:py-20">
      {/* Hidden iframe carries the download so the page itself stays put. */}
      {url ? <iframe src={url} title="Download" className="hidden h-0 w-0 border-0" /> : null}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative w-full max-w-[640px]"
      >
        {/* Warm glow behind the card, echoing the hero's app-preview treatment. */}
        <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-br from-accent/10 to-transparent blur-2xl" />

        <div className="rounded-[2rem] border border-surface-border bg-surface p-8 text-center shadow-[0_28px_60px_-18px_rgba(0,0,0,0.18)] md:p-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-background/60 py-1.5 pl-2.5 pr-4">
            <FinderDuckLogo size={24} idPrefix="ty" />
            <FinderWordmark size={17} />
          </span>

          <StatusMedallion status={status} Logo={os.Logo} />

          <h1 className="gradient-text mt-6 text-3xl font-semibold leading-[1.05] tracking-tighter md:text-4xl">
            {failed ? "We couldn't start your download" : "Your download is on its way"}
          </h1>

          <p className="mx-auto mt-3 max-w-[46ch] leading-relaxed text-muted">
            {failed ? (
              <>
                Something went wrong preparing the {os.label} installer. Try
                again in a moment, or email us and we&apos;ll get you a copy.
              </>
            ) : done ? (
              <>
                The {os.label}{" "}
                installer for FileForge Finder is downloading now — check your
                browser&apos;s Downloads folder.
              </>
            ) : status === "retrying" ? (
              <>Our servers are busy right now — retrying your download…</>
            ) : (
              <>Preparing your {os.label} installer…</>
            )}
          </p>

          {failed ? (
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:support@fileforge.com"
                className="rounded-full bg-[#d97706] px-7 py-3 text-base font-medium !text-white transition-colors hover:bg-[#b45309]"
              >
                Email support
              </a>
              <Link
                href="/finder"
                className="text-sm text-muted underline underline-offset-4 transition-colors hover:text-foreground"
              >
                Back to FileForge Finder
              </Link>
            </div>
          ) : (
            <>
              {done && url ? (
                <p className="mt-4 text-sm text-muted">
                  Download didn&apos;t start?{" "}
                  <a
                    href={url}
                    className="font-semibold text-accent underline underline-offset-4"
                  >
                    Start it manually
                  </a>
                  .
                </p>
              ) : null}

              <div className="mt-9 rounded-2xl border border-surface-border bg-background/60 p-6 text-left md:p-7">
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-muted">
                  <DownloadSimple size={16} weight="duotone" className="text-accent" />
                  Installing on {os.label}
                </h2>
                <ol className="mt-4 space-y-3.5">
                  {os.steps.map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-foreground/80">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
            {PROMISES.map(({ Icon, text }) => (
              <span key={text} className="flex items-center gap-1.5">
                <Icon size={16} weight="duotone" className="text-accent" />
                {text}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
          <a
            href="/fileforge-plus"
            className="flex items-center gap-1.5 underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Need OCR, renaming &amp; filing? Get FileForge Finder+
            <ArrowRight size={14} weight="bold" />
          </a>
          <a
            href="mailto:support@fileforge.com"
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            support@fileforge.com
          </a>
        </div>
      </motion.div>
    </main>
  );
}

// The circular status badge above the headline: the visitor's OS logo while the
// installer URL is being fetched (with a pulsing ring so the wait reads as
// progress), a check once the transfer has started, a warning if it failed.
function StatusMedallion({
  status,
  Logo,
}: {
  status: "starting" | "retrying" | "started" | "failed";
  Logo: ComponentType<{ size?: number; weight?: "fill" | "duotone" }>;
}) {
  const pending = status === "starting" || status === "retrying";
  return (
    <div className="relative mx-auto mt-7 flex h-20 w-20 items-center justify-center">
      {pending ? (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-accent/20"
          animate={{ scale: [1, 1.18, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
      ) : null}
      <motion.span
        key={status === "failed" ? "failed" : status === "started" ? "started" : "pending"}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 18 }}
        className={`relative flex h-20 w-20 items-center justify-center rounded-full border ${
          status === "failed"
            ? "border-red-500/20 bg-red-500/10 text-red-600"
            : "border-accent/20 bg-accent/10 text-accent"
        }`}
      >
        {status === "failed" ? (
          <WarningCircle size={38} weight="duotone" />
        ) : status === "started" ? (
          <CheckCircle size={38} weight="duotone" />
        ) : (
          <Logo size={34} weight="fill" />
        )}
      </motion.span>
    </div>
  );
}
