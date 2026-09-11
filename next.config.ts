import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this folder. Without it Turbopack walks up looking
  // for lockfiles and can pick a parent directory (there is a stray
  // package-lock.json in the user's home dir), which both spams a warning and,
  // when the project is opened via a Windows 8.3 short path, panics with
  // "leaves the filesystem root" while resolving the PostCSS config.
  turbopack: {
    root: path.resolve(__dirname),
  },

  // The Paper to Digital service page doubles as the home page. It stays
  // addressable at /fileforge-service because the Momentum CE site and existing
  // links use that path; the rewrite just lets the bare domain serve it too. Its
  // canonical URL is /fileforge-service (see app/fileforge-service/page.tsx), so
  // search engines treat the two as one page. FileForge Finder lives at
  // /finder and is reached from the nav, footer and the service page.
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/fileforge-service",
      },
    ];
  },
};

export default nextConfig;
