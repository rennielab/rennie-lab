import Link from "next/link";
import { notFound } from "next/navigation";
import { JOURNAL_POSTS } from "@/data/journal";
import { ContactButton } from "@/components/chrome/ContactButton";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return JOURNAL_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: RouteProps) {
  const { slug } = await params;
  const post = JOURNAL_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Journal" };
  return {
    title: `${post.title} — Off Climate`,
    description: post.excerpt,
  };
}

export default async function JournalPostPage({ params }: RouteProps) {
  const { slug } = await params;
  const post = JOURNAL_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const date = new Date(post.publishedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const paragraphs = post.body
    ? post.body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
    : [post.excerpt];

  return (
    <div className="container">
      <article style={{ maxWidth: 880, margin: "0 auto", padding: "32px 0 64px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 48,
          }}
        >
          <Link
            href="/journal"
            className="mono"
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            ← Back to journal
          </Link>
          <a
            href={post.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mono"
            style={{
              padding: "8px 14px",
              border: "1px solid var(--line-2)",
              borderRadius: 3,
            }}
          >
            READ FULL ↗
          </a>
        </div>

        <div className="mono" style={{ marginBottom: 24 }}>
          {post.source === "substack" ? "Ben Rennie · Substack" : "97% · Field"} · {date} ·{" "}
          {post.type}
        </div>
        <h1
          className="h-1"
          style={{ margin: "0 0 24px", maxWidth: "22ch" }}
        >
          {post.title}
        </h1>
        <p className="body-lg" style={{ margin: "0 0 56px", maxWidth: "60ch" }}>
          {post.excerpt}
        </p>

        <div
          className="ph"
          data-tone={post.tone || "ink"}
          style={{
            aspectRatio: "16/9",
            borderRadius: "var(--radius)",
            marginBottom: 56,
          }}
        >
          <span className="ph-tag">
            {post.type} · {post.category ?? "design"}
          </span>
        </div>

        {post.bodyAvailable === "preview-only" && (
          <p
            className="mono"
            style={{
              padding: "16px 18px",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius)",
              color: "var(--ink-3)",
              marginBottom: 32,
            }}
          >
            Preview · the full post lives at the source. Tap READ FULL ↗ to read on
            Substack / 97%.
          </p>
        )}

        <div
          style={{
            fontFamily: "var(--sans)",
            fontSize: 18,
            lineHeight: 1.65,
            color: "var(--ink-2)",
            maxWidth: "64ch",
          }}
        >
          {paragraphs.map((p, i) => (
            <p key={i} style={{ margin: "0 0 24px" }}>
              {p}
            </p>
          ))}
        </div>

        <div
          style={{
            marginTop: 80,
            paddingTop: 32,
            borderTop: "1px solid var(--line)",
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <Link href="/journal" className="btn btn-ghost">
            ← Back to journal
          </Link>
          <ContactButton>
            Talk to the studio <span className="arrow">→</span>
          </ContactButton>
        </div>
      </article>
    </div>
  );
}
