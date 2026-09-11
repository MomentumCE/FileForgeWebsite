import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Generated rather than a static public/robots.txt so the sitemap URL follows
// SITE_URL (lib/site.ts) instead of being hardcoded to one domain.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
