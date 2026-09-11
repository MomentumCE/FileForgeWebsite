import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getLegalDoc } from "@/lib/legal";

export const metadata: Metadata = {
  title: "FileForge Finder & Finder+ - Terms of Use",
  description:
    "Terms of Use governing installation and use of FileForge Finder and FileForge Finder+, the local-first desktop records tools from Momentum CE Inc.",
  alternates: { canonical: "/finder/terms" },
  openGraph: {
    title: "FileForge Finder & Finder+ - Terms of Use",
    description:
      "Terms of Use governing installation and use of FileForge Finder and FileForge Finder+, the local-first desktop records tools from Momentum CE Inc.",
    url: "/finder/terms",
    type: "article",
  },
};

function BreadcrumbIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M13 8H3M7 4L3 8l4 4" />
    </svg>
  );
}

export default function FileForgeFinderTermsPage() {
  const content = getLegalDoc("fileforge-finder-terms-of-use");
  if (!content) notFound();

  return (
    <main>
      <section className="article-hero">
        <div className="article-hero-inner">
          <Link href="/finder" className="article-breadcrumb">
            <BreadcrumbIcon />
            Back to FileForge Finder
          </Link>
        </div>
      </section>

      <section className="article-body-section">
        <article className="article-body">
          <MDXRemote
            source={content}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </article>
      </section>
    </main>
  );
}
