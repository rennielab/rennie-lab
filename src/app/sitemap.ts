import type { MetadataRoute } from "next";
import { JOURNAL_POSTS } from "@/data/journal";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rennielab.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const top = [
    { url: `${BASE_URL}/`, priority: 1.0 },
    { url: `${BASE_URL}/story`, priority: 0.8 },
    { url: `${BASE_URL}/services`, priority: 0.8 },
    { url: `${BASE_URL}/projects`, priority: 0.9 },
    { url: `${BASE_URL}/impact`, priority: 0.7 },
    { url: `${BASE_URL}/journal`, priority: 0.8 },
  ].map((entry) => ({
    ...entry,
    lastModified,
    changeFrequency: "monthly" as const,
  }));

  const journal = JOURNAL_POSTS.map((post) => ({
    url: `${BASE_URL}/journal/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...top, ...journal];
}
