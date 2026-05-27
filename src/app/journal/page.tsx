import { FEED_ITEMS } from "@/data/journalFeed";
import { JournalFeed } from "@/components/journal/JournalFeed";

export const metadata = {
  title: "Off Climate",
  description:
    "Off Climate is the Rennie Lab journal — essays, field guides, podcasts and the studio's case studies in one feed.",
};

export default function JournalPage() {
  return (
    <div className="container">
      <section style={{ padding: "40px 0 32px" }}>
        <div className="mono rise" style={{ marginBottom: 32 }}>
          Off Climate · the Rennie Lab journal · {FEED_ITEMS.length} entries
        </div>
        <h1 className="h-1 rise delay-1" style={{ margin: 0, maxWidth: "14ch" }}>
          Off Climate.
        </h1>
        <p className="body-lg rise delay-2" style={{ marginTop: 24, maxWidth: "52ch" }}>
          Essays, field guides, case studies and impact projects — everything the
          studio makes and writes, collected in one feed. Filter by what matters,
          read in any direction.
        </p>
      </section>

      <JournalFeed items={FEED_ITEMS} />
    </div>
  );
}
