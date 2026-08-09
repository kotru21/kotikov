import type { MetadataRoute } from "next";

/** Stable last-modified for the static homepage (avoid per-build churn). */
const SITE_LAST_MODIFIED = new Date("2026-08-01T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://ktkv.me",
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
