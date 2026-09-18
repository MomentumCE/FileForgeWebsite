"use client";

import { AppleLogo, LinuxLogo, WindowsLogo } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { MagneticButton } from "@/components/fileforge/ui/MagneticButton";
import { DOWNLOAD_CONFIRM_HREF } from "@/lib/fileforge-finder";

type Platform = "mac" | "windows" | "linux";
// Which Linux package the visitor picked. Linux ships two builds (a Debian
// package and a portable AppImage), so the button lets Linux visitors choose.
type LinuxFormat = "deb" | "appimage";

// Detect the OS so the download serves the right installer: the .dmg on macOS,
// a .deb/.AppImage on Linux, the .exe on Windows. Prefer userAgentData.platform
// where available, falling back to the UA string. The server defaults to
// Windows on anything unrecognized. Android UA strings also contain "Linux", so
// they're excluded — the desktop app has no Android target, and such visitors
// fall through to the Windows default (unchanged from before).
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

// The friction-free "Try for free" CTA: one click, no sign-up form. It asks
// /api/download-ff for a short-lived signed installer URL (free: true) and
// sends the browser straight there. If anything goes wrong we fall back to the
// early-access page (GET_FINDER_HREF) so the visitor is never stranded.
//
// Linux is the exception to one-click: there are two Linux builds (.deb and
// .AppImage), so a Linux visitor's click opens a small menu to pick the format
// before the download starts. mac/Windows visitors are unaffected.
export function DownloadFinderButton({
  className = "",
  wrapperClassName,
  label = "Download free",
  source = "unknown",
}: {
  className?: string;
  wrapperClassName?: string;
  label?: string;
  // Identifies which CTA/placement this button is, so download tracking can
  // attribute the download to a source (e.g. "hero", "pricing", "cta").
  source?: string;
}) {
  const [downloading, setDownloading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Resolve the platform after mount (navigator is client-only). Defaults to
  // "windows" during SSR/first paint so no Linux menu ever renders on the
  // server; it settles to the real value once mounted.
  const [platform, setPlatform] = useState<Platform>("windows");
  // Detection only happens after mount, so the button holds the icon slot empty
  // until then rather than flashing the Windows default at every visitor.
  const [detected, setDetected] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setPlatform(detectPlatform());
    setDetected(true);
  }, []);

  // Close the Linux format menu on an outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setMenuOpen(false);
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

  // Send the visitor to the download confirmation page, which requests the
  // signed URL and starts the transfer. Doing it there rather than here means
  // the visitor lands on a real page with install steps and a manual retry link
  // instead of watching a button spinner. `linuxFormat` is passed along only for
  // Linux; the server ignores it for other platforms.
  const start = (linuxFormat?: LinuxFormat) => {
    if (downloading) return;
    setMenuOpen(false);
    setDownloading(true);
    const query = new URLSearchParams({ platform, source });
    if (linuxFormat) query.set("linuxFormat", linuxFormat);
    window.location.href = `${DOWNLOAD_CONFIRM_HREF}?${query.toString()}`;
  };

  // A Linux visitor picks a format first; everyone else downloads immediately.
  const onClick = () => {
    if (platform === "linux") setMenuOpen((v) => !v);
    else start();
  };

  return (
    <span ref={rootRef} className="relative inline-block">
      <MagneticButton
        onClick={onClick}
        className={`cursor-pointer ${className}`}
        {...(wrapperClassName ? { wrapperClassName } : {})}
      >
        <span className="flex items-center gap-2">
          {downloading ? (
            "Starting download…"
          ) : (
            <>
              {label}
              {/* Only the visitor's own platform is shown — the installer they
                  get is the one this icon names. The slot keeps its width
                  before detection resolves so the label doesn't shift. */}
              <span
                className="flex w-[18px] items-center justify-center opacity-90"
                aria-hidden="true"
              >
                {detected ? <PlatformLogo platform={platform} /> : null}
              </span>
            </>
          )}
        </span>
      </MagneticButton>

      {menuOpen && !downloading ? (
        <div
          role="menu"
          aria-label="Choose Linux package"
          className="absolute left-0 top-full z-50 mt-2 min-w-[240px] overflow-hidden rounded-xl border border-black/10 bg-white p-1.5 text-left shadow-xl"
        >
          <LinuxOption
            title="Debian / Ubuntu"
            ext=".deb"
            onClick={() => start("deb")}
          />
          <LinuxOption
            title="AppImage"
            ext=".AppImage"
            hint="Runs on any distro"
            onClick={() => start("appimage")}
          />
        </div>
      ) : null}
    </span>
  );
}

function PlatformLogo({ platform }: { platform: Platform }) {
  if (platform === "mac") return <AppleLogo size={18} weight="fill" />;
  if (platform === "linux") return <LinuxLogo size={16} weight="fill" />;
  return <WindowsLogo size={16} weight="fill" />;
}

function LinuxOption({
  title,
  ext,
  hint,
  onClick,
}: {
  title: string;
  ext: string;
  hint?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-neutral-100"
    >
      <span className="flex flex-col">
        <span className="text-sm font-medium text-neutral-900">{title}</span>
        {hint ? <span className="text-xs text-neutral-500">{hint}</span> : null}
      </span>
      <span className="text-xs font-medium text-neutral-500">{ext}</span>
    </button>
  );
}
