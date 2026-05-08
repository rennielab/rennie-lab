import { JOURNAL_POSTS } from "@/data/journal";
import { JournalFeed } from "@/components/journal/JournalFeed";

export const metadata = {
  title: "Journal — Rennie Lab",
  description:
    "Notes from the edge of the work — essays, field guides, podcasts and reading. From benrennie.substack.com and 97percent.co.",
};

export default function JournalPage() {
  return (
    <div className="container">
      <section style={{ padding: "40px 0 32px" }}>
        <div className="mono rise" style={{ marginBottom: 32 }}>
          Journal · since 2017 · {JOURNAL_POSTS.length}+ entries
        </div>
        <h1 className="h-1 rise delay-1" style={{ margin: 0, maxWidth: "14ch" }}>
          Notes from the <em style={{ color: "var(--accent)" }}>edge</em> of the work.
        </h1>
        <p className="body-lg rise delay-2" style={{ marginTop: 24, maxWidth: "52ch" }}>
          Essays, field guides, podcasts and the occasional reading list. Everything we
          make and write — collected, tagged, and built to be read in any direction.
        </p>
      </section>

      <JournalFeed posts={JOURNAL_POSTS} />
    </div>
  );
}
