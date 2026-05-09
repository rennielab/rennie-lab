"use client";

import type { UnifiedFeedItem } from "@/data/journalFeed";

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

export function FeedCard({
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
