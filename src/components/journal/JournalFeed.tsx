"use client";

import { useMemo, useState } from "react";
import type { JournalPost, JournalCategory, JournalSource } from "@/data/types";

const CATEGORIES: { id: JournalCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "climate", label: "Climate" },
  { id: "movement", label: "Movement" },
  { id: "community", label: "Community" },
  { id: "design", label: "Design" },
  { id: "impact", label: "Impact" },
];

const SOURCES: { id: JournalSource | "all"; label: string }[] = [
  { id: "all", label: "All sources" },
  { id: "substack", label: "Substack" },
  { id: "97percent", label: "97%" },
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function JournalFeed({ posts }: { posts: JournalPost[] }) {
  const [category, setCategory] = useState<JournalCategory | "all">("all");
  const [source, setSource] = useState<JournalSource | "all">("all");

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (source !== "all" && p.source !== source) return false;
      return true;
    });
  }, [posts, category, source]);

  const open = (post: JournalPost) =>
    window.dispatchEvent(new CustomEvent("open-journal", { detail: { post } }));

  return (
    <>
      <div
        style={{
          position: "sticky",
          top: 86,
          zIndex: 10,
          background: "var(--bg)",
          padding: "12px 0",
          marginBottom: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius)",
            padding: 8,
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className="tag"
                data-active={category === c.id}
                onClick={() => setCategory(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {SOURCES.map((s) => (
              <button
                key={s.id}
                type="button"
                className="tag"
                data-active={source === s.id}
                onClick={() => setSource(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mono" style={{ marginTop: 12 }}>
          {filtered.length} {filtered.length === 1 ? "post" : "posts"}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 32,
        }}
      >
        {filtered.map((post) => (
          <article
            key={post.slug}
            className="card"
            onClick={() => open(post)}
            style={{ cursor: "pointer", display: "flex", flexDirection: "column" }}
          >
            <div
              className="ph"
              data-tone={post.tone || "ink"}
              style={{ aspectRatio: "4/3" }}
            >
              <span className="ph-tag">
                {post.type} · {post.category ?? "design"}
              </span>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
              <div className="mono">
                {post.source === "substack" ? "Substack" : "97%"} · {formatDate(post.publishedAt)}
                {post.bodyAvailable === "preview-only" ? " · Preview" : ""}
              </div>
              <h3
                style={{
                  margin: 0,
                  fontFamily: "var(--sans)",
                  fontWeight: 600,
                  fontSize: 22,
                  lineHeight: 1.2,
                  letterSpacing: "-0.015em",
                }}
              >
                {post.title}
              </h3>
              <p
                className="body-sm"
                style={{
                  margin: 0,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {post.excerpt}
              </p>
              <div className="mono" style={{ marginTop: "auto" }}>Read →</div>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          style={{
            padding: "96px 0",
            textAlign: "center",
            color: "var(--ink-3)",
            fontFamily: "var(--mono)",
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          No posts match this filter — try another category.
        </div>
      )}
    </>
  );
}
