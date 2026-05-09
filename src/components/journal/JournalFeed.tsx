"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  FeedItemCategory,
  FeedItemKind,
  UnifiedFeedItem,
} from "@/data/journalFeed";

const CATS: { id: FeedItemCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "climate", label: "Climate" },
  { id: "movement", label: "Movement" },
  { id: "community", label: "Community" },
  { id: "design", label: "Design" },
  { id: "impact", label: "Impact" },
];

const KINDS: { id: FeedItemKind | "all"; label: string }[] = [
  { id: "all", label: "All formats" },
  { id: "newsletter", label: "Essays" },
  { id: "field-guide", label: "Field Guides" },
  { id: "podcast", label: "Podcasts" },
  { id: "reading", label: "Reading" },
  { id: "project", label: "Projects" },
  { id: "impact", label: "Impact" },
];

function openItem(item: UnifiedFeedItem) {
  if (item.origin === "journal" && item.journalPost) {
    window.dispatchEvent(
      new CustomEvent("open-journal", { detail: { post: item.journalPost } }),
    );
    return;
  }
  if (item.origin === "project" && item.project) {
    window.dispatchEvent(
      new CustomEvent("open-case", { detail: { project: item.project } }),
    );
    return;
  }
  if (item.origin === "impact" && item.caseStudy) {
    window.dispatchEvent(
      new CustomEvent("open-impact-case", {
        detail: { caseStudy: item.caseStudy },
      }),
    );
  }
}

function FeedCardItem({
  item,
  large = false,
}: {
  item: UnifiedFeedItem;
  large?: boolean;
}) {
  const readMin = Math.max(2, Math.round(item.bodyLength / 1200));
  const kindLabel =
    item.kind === "project"
      ? "case study"
      : item.kind === "impact"
        ? "impact"
        : item.kind;
  return (
    <article
      className="card"
      style={{ display: "flex", flexDirection: "column", cursor: "pointer" }}
      onClick={() => openItem(item)}
    >
      <div
        className="ph"
        data-tone={item.tone || "ink"}
        style={{
          aspectRatio: large ? "16/10" : "4/3",
          ...(item.image
            ? {
                backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0) 55%), url(${item.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}),
        }}
      >
        <span className="ph-tag">
          {kindLabel} · {item.category}
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
        <div className="mono">{item.source}</div>
        <h3 className={large ? "h-2" : "h-3"} style={{ margin: 0 }}>
          {item.title}
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
            {item.origin === "project"
              ? "OPEN →"
              : item.origin === "impact"
                ? "OPEN →"
                : "READ →"}
          </span>
        </div>
      </div>
    </article>
  );
}

export function JournalFeed({ items }: { items: UnifiedFeedItem[] }) {
  const [cat, setCat] = useState<FeedItemCategory | "all">("all");
  const [kind, setKind] = useState<FeedItemKind | "all">("all");
  const [count, setCount] = useState(9);
  const sentinel = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () =>
      items.filter(
        (it) =>
          (cat === "all" || it.category === cat) &&
          (kind === "all" || it.kind === kind),
      ),
    [items, cat, kind],
  );

  const visible = useMemo(() => {
    const base = filtered.length ? filtered : items;
    return base.slice(0, count);
  }, [filtered, items, count]);

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
          margin: "8px 0 32px",
          padding: "10px 16px",
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
        {visible.map((item, i) => {
          const n = i % 6;
          const span = n === 0 ? 4 : 2;
          const isLarge = n === 0;
          return (
            <div key={`${item.id}-${i}`} style={{ gridColumn: `span ${span}` }}>
              <FeedCardItem item={item} large={isLarge} />
            </div>
          );
        })}
      </div>

      {visible.length < (filtered.length || items.length) && (
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
      )}
    </>
  );
}
