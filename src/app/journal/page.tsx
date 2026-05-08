import { JOURNAL_POSTS } from "@/data/journal";
import { JournalFeed } from "@/components/journal/JournalFeed";

export const metadata = {
  title: "Journal — Rennie Lab",
  description:
    "Notes on creativity, climate, community and the slow craft of designing things that matter. From benrennie.substack.com and 97percent.co.",
};

export default function JournalPage() {
  return (
    <div className="container">
      <section style={{ paddingTop: 64, paddingBottom: 48 }}>
        <div className="mono" style={{ marginBottom: 32 }}>05 — Journal</div>
        <h1 className="h-display rise" style={{ maxWidth: "12ch" }}>
          Field notes.
        </h1>
        <p className="body-lg rise delay-1" style={{ maxWidth: "60ch", marginTop: 48 }}>
          Writing from the studio and Ben&apos;s personal Substack — climate, creative
          practice, the long arc of building things that hold up. Tap a card for a
          preview; the source link sits in the top-right of the drawer.
        </p>
      </section>

      <JournalFeed posts={JOURNAL_POSTS} />
    </div>
  );
}
