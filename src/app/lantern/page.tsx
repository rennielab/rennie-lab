import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Lantern — scam protection for the whole family",
  description:
    "Forward any suspicious text, email or call to Lantern and get a calm, plain-language verdict in seconds — shared with your whole family.",
  robots: { index: false }, // lab preview — unlist until launch
};

export default function LanternPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.glow} aria-hidden />
        <p className={styles.brandMark}>● Lantern</p>
        <h1 className={styles.heroTitle}>
          Keep the people you love out of the dark.
        </h1>
        <p className={styles.heroSub}>
          Forward any suspicious text, email or phone call to Lantern. In
          seconds you get a calm, plain-language verdict — is it a scam, and
          exactly what to do — shared with your whole family.
        </p>
        <span className={styles.heroCta}>Protect your family</span>
        <p className={styles.heroFine}>
          iOS &amp; Android · One plan covers the whole family
        </p>
      </section>

      <section className={styles.section}>
        <div className={styles.split}>
          <div>
            <h2 className={styles.sectionTitle}>
              Mum gets a weird text. You get the answer.
            </h2>
            <p className={styles.sectionLede}>
              Share the message to Lantern from your phone — or let Mum
              forward it by SMS, no app needed. Lantern names the scam,
              explains the tell-tale signs in plain words, and posts the
              outcome to your family circle so nobody handles it alone.
            </p>
          </div>

          <div className={styles.phone} aria-label="Lantern app preview">
            <div className={styles.phoneHeader}>
              <div className={styles.phoneBrand}>
                <span className={styles.phoneDot}>●</span> Lantern
              </div>
              <div className={styles.phoneSub}>
                Keep the people you love out of the dark
              </div>
            </div>
            <div className={styles.phoneScreen}>
              <div className={styles.verdictBanner}>
                This is a scam
                <span className={styles.verdictBannerSub}>
                  Fake Medicare renewal
                </span>
              </div>
              <div className={styles.verdictBody}>
                <p className={styles.verdictHeadline}>
                  Medicare never asks you to “re-validate your card” by text.
                  This link steals card details.
                </p>
                <p className={styles.stepsLabel}>What to do now</p>
                <div className={styles.step}>
                  <span className={styles.stepNum}>1</span>
                  <span>Do not tap the link.</span>
                </div>
                <div className={styles.step}>
                  <span className={styles.stepNum}>2</span>
                  <span>Delete the message.</span>
                </div>
                <div className={styles.step}>
                  <span className={styles.stepNum}>3</span>
                  <span>
                    If you already tapped it, call your bank on the number on
                    your card.
                  </span>
                </div>
                <div className={styles.familyPing}>
                  <span className={styles.familyPingLabel}>
                    Shared with your family
                  </span>
                  Scam blocked: fake Medicare renewal text targeting Mum.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>✓</div>
            <h3 className={styles.cardTitle}>A verdict in seconds</h3>
            <p className={styles.cardBody}>
              Paste a message, share a screenshot, or describe a call. Lantern
              recognises gift-card scripts, fake deliveries, “grandchild in
              trouble” calls, webcam-bluff emails and hundreds more patterns.
            </p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}>♥</div>
            <h3 className={styles.cardTitle}>The family circle</h3>
            <p className={styles.cardBody}>
              Every check is shared with the people who care. “3 scams blocked
              this week” beats finding out after the money is gone — and nobody
              has to feel embarrassed asking.
            </p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}>☎</div>
            <h3 className={styles.cardTitle}>No app needed for Mum</h3>
            <p className={styles.cardBody}>
              Protected members can simply forward texts to a Lantern number
              and get the verdict back by SMS. The big buttons and large type
              are there if they want the app.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.pricing}>
          <h2 className={styles.sectionTitle} style={{ margin: "0 auto" }}>
            One plan. The whole family.
          </h2>
          <p className={styles.price}>
            $59<span className={styles.priceUnit}>/year</span>
          </p>
          <p className={styles.priceLine}>
            Unlimited checks for up to six family members, on iPhone and
            Android. Less than the cost of one gift-card scam, forever.
          </p>
        </div>

        <div className={styles.palette} aria-label="Brand palette">
          <div
            className={styles.swatch}
            style={{ background: "#16243D", color: "#FAF6EF" }}
          >
            INDIGO 16243D
          </div>
          <div
            className={styles.swatch}
            style={{ background: "#F2A33C", color: "#16243D" }}
          >
            AMBER F2A33C
          </div>
          <div
            className={styles.swatch}
            style={{
              background: "#FAF6EF",
              color: "#16243D",
              border: "1px solid rgba(22,36,61,0.12)",
            }}
          >
            CREAM FAF6EF
          </div>
          <div
            className={styles.swatch}
            style={{ background: "#2E7D5B", color: "#FAF6EF" }}
          >
            SAFE 2E7D5B
          </div>
          <div
            className={styles.swatch}
            style={{ background: "#B03A2E", color: "#FAF6EF" }}
          >
            SCAM B03A2E
          </div>
        </div>
      </section>
    </main>
  );
}
