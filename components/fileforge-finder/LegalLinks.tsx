import Link from "next/link";

export function LegalLinks() {
  return (
    <section
      aria-label="FileForge Finder legal documents"
      className="py-10"
    >
      <div className="flex items-center justify-center gap-3 text-sm text-muted">
        <Link
          href="/finder/terms"
          className="hover:text-foreground transition-colors underline underline-offset-4"
        >
          Terms of Use
        </Link>
        <span aria-hidden="true">·</span>
        <Link
          href="/finder/privacy"
          className="hover:text-foreground transition-colors underline underline-offset-4"
        >
          Privacy Policy
        </Link>
      </div>
    </section>
  );
}
