"use client";

import type { FeedItem } from "@/data/feed";

export function FeedCard({ item, large = false }: { item: FeedItem; large?: boolean }) {
  return (
    <article
      className="card"
      style={{ display: "flex", flexDirection: "column", cursor: "pointer" }}
      onClick={() =>
        window.dispatchEvent(new CustomEvent("open-journal", { detail: { item } }))
      }
    >
      <div className="ph" data-tone={item.tone} style={{ aspectRatio: large ? "16/10" : "4/3" }}>
        <span className="ph-tag">
          {item.kind} · {item.cat}
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
          <span>{item.client}</span>
          <span>{item.year}</span>
        </div>
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
          <span className="mono">{item.read}</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent)" }}>
            READ →
          </span>
        </div>
      </div>
    </article>
  );
}
