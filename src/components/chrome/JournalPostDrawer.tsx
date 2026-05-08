"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import type { JournalPost } from "@/data/types";

type OpenJournalEvent = CustomEvent<{ post: JournalPost }>;

export function JournalPostDrawer() {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState<JournalPost | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as OpenJournalEvent).detail;
      setPost(detail.post);
      setOpen(true);
    };
    window.addEventListener("open-journal", onOpen);
    return () => window.removeEventListener("open-journal", onOpen);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const date = post
    ? new Date(post.publishedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  const paragraphs = post?.body
    ? post.body
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="jp-wrap" data-open={open} data-theme={theme}>
      <div className="jp-back" onClick={() => setOpen(false)} aria-hidden>
        <button
          className="jp-close"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
          aria-label="Close"
        >
          ✕
        </button>
      </div>
      <aside className="jp-panel">
        {post && (
          <>
            <header className="jp-head">
              <div className="jp-chip">
                <div className="jp-chip-img ph" data-tone={post.tone || "ink"}></div>
                <div>
                  <div className="jp-chip-t">
                    {post.source === "substack" ? "Ben Rennie · Substack" : "97% · Ghost"}
                  </div>
                  <div className="jp-chip-d mono">{date}</div>
                </div>
              </div>
              <a
                className="jp-cta mono"
                href={post.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                READ FULL <span aria-hidden>↗</span>
              </a>
            </header>
            <div className="jp-scroll">
              <h1 className="jp-title">{post.title}</h1>
              <p className="jp-lede">{post.excerpt}</p>
              <div className="jp-hero ph" data-tone={post.tone || "ink"}>
                <span className="ph-tag">
                  {post.type} · {post.category ?? "design"}
                </span>
              </div>
              <div className="jp-body">
                {post.bodyAvailable === "preview-only" && (
                  <p
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--ink-3)",
                      marginBottom: 32,
                      paddingBottom: 12,
                      borderBottom: "1px solid var(--line)",
                    }}
                  >
                    Preview · the full post lives at the source
                  </p>
                )}
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="jp-foot">
                <button type="button" className="btn" onClick={() => setOpen(false)}>
                  ← Back to journal
                </button>
                <a
                  className="btn btn-primary"
                  href={post.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read the full post <span className="arrow">↗</span>
                </a>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
