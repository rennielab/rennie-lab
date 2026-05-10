"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import type { JournalPost } from "@/data/types";
import type { FeedItem } from "@/data/feed";

type DrawerData = {
  title: string;
  excerpt: string;
  body: string[];
  bodyAvailable?: "full" | "preview-only" | "none";
  client: string;
  date: string;
  kind: string;
  cat: string;
  tone: string;
  sourceUrl?: string;
  image?: string;
  /** When true, render full body. When false, truncate to a 200-char preview. */
  fullBody?: boolean;
};

function fromJournalPost(post: JournalPost): DrawerData {
  const date = new Date(post.publishedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const paragraphs = post.body
    ? post.body
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [post.excerpt];
  const isNative = post.source === "rennie-lab";
  return {
    title: post.title,
    excerpt: post.excerpt,
    body: paragraphs,
    bodyAvailable: post.bodyAvailable,
    client:
      post.source === "substack"
        ? "Ben Rennie · Substack"
        : post.source === "97percent"
          ? "97% · Field notes"
          : "Rennie Lab · Journal",
    date,
    kind: post.type,
    cat: post.category ?? "design",
    tone: post.tone ?? "ink",
    sourceUrl: isNative ? undefined : post.sourceUrl,
    image: post.image,
    fullBody: isNative,
  };
}

function fromFeedItem(item: FeedItem): DrawerData {
  return {
    title: item.title,
    excerpt: item.desc,
    body: [
      `${item.desc} The piece sits inside a longer arc of work the studio has been thinking about for the better part of a year — what it actually means to design things that hold up across cycles, not just launches.`,
      `Five things stood out. First, that brand isn't a coat of paint — it's the operating logic. Second, that the most useful work is usually the slowest. Third, that you cannot subcontract conviction. Fourth, that consistency is a compounding asset. And fifth, that good design respects the user's time more than it respects the brief.`,
      `We've been lucky to do this work alongside ${item.client.split("·")[0]!.trim()} and a handful of partners who are willing to play the long game.`,
    ],
    client: item.client,
    date: String(item.year),
    kind: item.kind,
    cat: item.cat,
    tone: item.tone,
  };
}

type OpenJournalEvent = CustomEvent<{ post?: JournalPost; item?: FeedItem }>;

export function JournalPostDrawer() {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<DrawerData | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as OpenJournalEvent).detail;
      if (detail.post) setData(fromJournalPost(detail.post));
      else if (detail.item) setData(fromFeedItem(detail.item));
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

  return (
    <>
      <div
        className="contact-shade"
        data-open={open}
        onClick={() => setOpen(false)}
      ></div>
      <aside
        className="contact-panel is-journal-post"
        data-open={open}
        data-theme={theme}
      >
        {data && (
          <>
            <header className="jp-head">
              <div className="jp-chip">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="jp-chip-img logo-asset"
                  src="/r-icon.png"
                  alt="Rennie Lab"
                  width={44}
                  height={44}
                />
                <div>
                  <div className="jp-chip-t">{data.client}</div>
                  <div className="jp-chip-d mono">{data.date}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                {data.sourceUrl ? (
                  <a
                    className="jp-cta mono"
                    href={data.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    READ FULL <span aria-hidden>↗</span>
                  </a>
                ) : null}
                <button
                  type="button"
                  className="drawer-close drawer-close-inline"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </header>
            <div className="jp-scroll">
              <div className="jp-scroll-inner">
              <h1 className="jp-title">{data.title}</h1>
              <p className="jp-lede">{data.excerpt}</p>
              <div
                className="jp-hero ph"
                data-tone={data.tone}
                style={
                  data.image
                    ? {
                        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0) 55%), url(${data.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
              >
                <span className="ph-tag">
                  {data.kind} · {data.cat}
                </span>
              </div>
              {data.bodyAvailable === "preview-only" && (
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
              <div className="jp-body">
                {data.fullBody ? (
                  data.body.map((p, i) => <p key={i}>{p}</p>)
                ) : (
                  (() => {
                    const joined = data.body.join(" ").trim();
                    const preview =
                      joined.length > 200 ? joined.slice(0, 200).trimEnd() + "…" : joined;
                    return <p>{preview}</p>;
                  })()
                )}
              </div>
              <div className="jp-foot">
                <button type="button" className="btn" onClick={() => setOpen(false)}>
                  ← Back to journal
                </button>
                {data.sourceUrl ? (
                  <a
                    className="btn btn-primary"
                    href={data.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read the full post <span className="arrow">↗</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setOpen(false);
                      window.dispatchEvent(new CustomEvent("open-contact"));
                    }}
                  >
                    Talk to the studio →
                  </button>
                )}
              </div>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
