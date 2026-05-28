import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rennielab.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  // "Off Climate" (/journal + posts) is hidden for now — kept out of the
  // sitemap so it isn't indexed. Restore the /journal entry and a
  // JOURNAL_POSTS map here when the journal is switched back on.
  const top = [
    { url: `${BASE_URL}/`, priority: 1.0 },
    { url: `${BASE_URL}/story`, priority: 0.8 },
    { url: `${BASE_URL}/services`, priority: 0.8 },
    { url: `${BASE_URL}/projects`, priority: 0.9 },
    { url: `${BASE_URL}/impact`, priority: 0.7 },
  ].map((entry) => ({
    ...entry,
    lastModified,
    changeFrequency: "monthly" as const,
  }));

  return [...top];
}
