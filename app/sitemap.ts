import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Only the public, indexable pages. The funnel pages under /finder (signin,
// account, subscribe, early-access, download-confirm, auth/callback) and the
// internal /ff-stats dashboard are all marked noindex in their own metadata and
// are deliberately left out here.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${SITE_URL}/fileforge-service`, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${SITE_URL}/finder`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/fileforge-plus`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/finder/feedback`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/finder/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/finder/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];
}
