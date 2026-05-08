"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { JournalPost, JournalCategory, JournalKind } from "@/data/types";

const CATS: { id: JournalCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "climate", label: "Climate" },
  { id: "movement", label: "Movement" },
  { id: "community", label: "Community" },
  { id: "design", label: "Design" },
  { id: "impact", label: "Impact" },
];

const KINDS: { id: JournalKind | "all"; label: string }[] = [
  { id: "all", label: "All formats" },
  { id: "newsletter", label: "Essays" },
  { id: "field-guide", label: "Field Guides" },
  { id: "podcast", label: "Podcasts" },
  { id: "reading", label: "Reading" },
];

function JournalCard({ post, large = false }: { post: JournalPost; large?: boolean }) {
  const date = new Date(post.publishedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const readMin = Math.max(2, Math.round(post.body.length / 1200));
  return (
    <article
      className="card"
      style={{ display: "flex", flexDirection: "column", cursor: "pointer" }}
      onClick={() =>
        window.dispatchEvent(new CustomEvent("open-journal", { detail: { post } }))
      }
    >
      <div
        className="ph"
        data-tone={post.tone || "ink"}
        style={{ aspectRatio: large ? "16/10" : "4/3" }}
      >
        <span className="ph-tag">
          {post.type} · {post.category ?? "design"}
        </span>
      </div>
      <div
        style={{
          padding: large ? 28 : 20,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          flex: 1,
        }}
      >
        <div className="mono" style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{post.source === "substack" ? "Ben Rennie · Substack" : "97% · Field"}</span>
          <span>{date}</span>
        </div>
        <h3 className={large ? "h-2" : "h-3"} style={{ margin: 0 }}>
          {post.title}
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "auto",
          }}
        >
          <span className="mono">{readMin} min read</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent)" }}>
            READ →
          </span>
        </div>
      </div>
    </article>
  );
}

export function JournalFeed({ posts }: { posts: JournalPost[] }) {
  const [cat, setCat] = useState<JournalCategory | "all">("all");
  const [kind, setKind] = useState<JournalKind | "all">("all");
  const [count, setCount] = useState(9);
  const sentinel = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () =>
      posts.filter(
        (it) => (cat === "all" || it.category === cat) && (kind === "all" || it.type === kind),
      ),
    [posts, cat, kind],
  );

  // duplicate to simulate forever scroll, like the prototype
  const items = useMemo(() => {
    const base = filtered.length ? filtered : posts;
    const out: { post: JournalPost; key: string }[] = [];
    for (let i = 0; i < count; i++) {
      const post = base[i % base.length]!;
      out.push({ post, key: `${post.slug}-${i}` });
    }
    return out;
  }, [filtered, posts, count]);

  useEffect(() => {
    if (!sentinel.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setCount((c) => c + 6);
      },
      { rootMargin: "300px" },
    );
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div
        style={{
          position: "sticky",
          top: 84,
          zIndex: 30,
          background: "color-mix(in oklab, var(--bg-card) 92%, transparent)",
          backdropFilter: "blur(20px)",
          margin: "24px 0 32px",
          padding: "14px 18px",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius)",
        }}
      >
        <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <span className="mono" style={{ color: "var(--ink-4)" }}>Filter</span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATS.map((s) => (
              <button
                key={s.id}
                type="button"
                className="tag"
                data-active={cat === s.id}
                onClick={() => {
                  setCat(s.id);
                  setCount(9);
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }}></div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {KINDS.map((k) => (
              <button
                key={k.id}
                type="button"
                className="tag"
                data-active={kind === k.id}
                onClick={() => {
                  setKind(k.id);
                  setCount(9);
                }}
              >
                {k.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 24,
          marginBottom: 64,
        }}
      >
        {items.map(({ post, key }, i) => {
          const n = i % 6;
          const span = n === 0 ? 4 : 2;
          const isLarge = n === 0;
          return (
            <div key={key} style={{ gridColumn: `span ${span}` }}>
              <JournalCard post={post} large={isLarge} />
            </div>
          );
        })}
      </div>

      <div
        ref={sentinel}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "48px 0",
          gap: 12,
        }}
      >
        <span className="dot dot-pulse" style={{ background: "var(--ink-3)" }}></span>
        <span className="mono">Loading more from the archive…</span>
      </div>
    </>
  );
}
