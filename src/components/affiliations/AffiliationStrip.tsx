"use client";

import Link from "next/link";
import { useTheme } from "@/components/chrome/ThemeProvider";

type Affiliation = {
  id: string;
  label: string;
  href: string;
  // Asset(s) — pick whichever variant fits the active theme.
  src?: string;          // single asset that works on both themes (full-colour)
  srcDark?: string;      // asset for dark theme (light-coloured logo)
  srcLight?: string;     // asset for light theme (dark-coloured logo)
  invertOnLight?: boolean; // if true, flip a single light-coloured asset for light theme
  invertOnDark?: boolean;  // if true, flip a single dark-coloured asset for dark theme
  inline?: "d-declares"; // identify inline SVG marks
  // Display tuning
  maxHeight?: number;    // px — cap on logo height inside the cell
};

const AFFILIATIONS: Affiliation[] = [
  {
    id: "bcorp",
    label: "Certified B Corporation",
    href: "https://www.bcorporation.net/",
    srcLight: "/affiliations/bcorp.svg",
    srcDark: "/affiliations/bcorp.svg",
    invertOnDark: true,
    maxHeight: 64,
  },
  {
    id: "onepercent",
    label: "1% for the Planet",
    href: "https://onepercentfortheplanet.org/",
    src: "/affiliations/onepercent.png",
    maxHeight: 38,
  },
  {
    id: "d-declares",
    label: "Design Declares",
    href: "https://designdeclares.com/",
    inline: "d-declares",
    maxHeight: 44,
  },
  {
    id: "clean-creatives",
    label: "Clean Creatives",
    href: "https://cleancreatives.org/",
    srcDark: "/affiliations/cleancreatives-light.png",
    srcLight: "/affiliations/cleancreatives-light.png",
    invertOnLight: true,
    maxHeight: 22,
  },
  {
    id: "lfca",
    label: "Leaders for Climate Action",
    href: "https://lfca.earth/",
    srcDark: "/affiliations/lfca-light.svg",
    srcLight: "/affiliations/lfca-dark.svg",
    maxHeight: 36,
  },
  {
    id: "efwa",
    label: "Eco-Friendly Web Alliance",
    href: "https://ecofriendlyweb.org/",
    src: "/affiliations/efwa.webp",
    maxHeight: 40,
  },
];

type Props = {
  /** Footer treatment is denser, less padding, smaller cells, slightly more muted. */
  variant?: "page" | "footer";
  /** Override the default tone (e.g. on the dark footer where the active theme isn't relevant). */
  forceTheme?: "light" | "dark";
};

export function AffiliationStrip({ variant = "page", forceTheme }: Props) {
  const { theme: activeTheme } = useTheme();
  const theme = forceTheme ?? activeTheme;

  const isFooter = variant === "footer";
  const cellHeight = isFooter ? 56 : 88;
  const cellPadding = isFooter ? "8px 14px" : "16px 20px";
  const restingOpacity = isFooter ? 0.55 : 0.7;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: isFooter ? 8 : 12,
        width: "100%",
      }}
    >
      {AFFILIATIONS.map((a) => {
        let src: string | undefined;
        let invert = false;

        if (a.src) {
          src = a.src;
        } else if (theme === "dark") {
          src = a.srcDark;
          invert = Boolean(a.invertOnDark);
        } else {
          src = a.srcLight;
          invert = Boolean(a.invertOnLight);
        }

        return (
          <Link
            key={a.id}
            href={a.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={a.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: cellHeight,
              padding: cellPadding,
              opacity: restingOpacity,
              transition: "opacity 250ms cubic-bezier(0.22, 1, 0.36, 1)",
              borderRadius: 2,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = String(restingOpacity);
            }}
          >
            {a.inline === "d-declares" ? (
              <DDeclaresMark height={a.maxHeight ?? 40} />
            ) : src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={a.label}
                style={{
                  maxHeight: a.maxHeight ?? 40,
                  maxWidth: "100%",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  filter: invert ? "invert(1)" : undefined,
                }}
              />
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}

// Inline D! Design Declares mark — recreated from the public brand visual
// (a square with the 'D!' wordmark) so we don't need to host an external asset.
// Uses currentColor so it tints to the active text colour automatically.
function DDeclaresMark({ height }: { height: number }) {
  // 220 × 80 viewbox: square block + spaced wordmark to the right.
  return (
    <svg
      viewBox="0 0 220 80"
      xmlns="http://www.w3.org/2000/svg"
      style={{ height, width: "auto", maxWidth: "100%", display: "block" }}
      aria-hidden="true"
    >
      <rect x="0" y="0" width="80" height="80" fill="currentColor" rx="2" />
      {/* D */}
      <path
        d="M22 22h12c10 0 18 7 18 18s-8 18-18 18H22V22zm10 8v20h2c5 0 9-4 9-10s-4-10-9-10h-2z"
        fill="var(--bg-card)"
      />
      {/* ! */}
      <rect x="58" y="22" width="6" height="26" fill="var(--bg-card)" />
      <rect x="58" y="52" width="6" height="6" fill="var(--bg-card)" />
      {/* Wordmark */}
      <text
        x="96"
        y="34"
        fill="currentColor"
        style={{
          fontFamily: "var(--sans), Geist, sans-serif",
          fontWeight: 600,
          fontSize: "14px",
          letterSpacing: "0.06em",
        }}
      >
        DESIGN
      </text>
      <text
        x="96"
        y="58"
        fill="currentColor"
        style={{
          fontFamily: "var(--sans), Geist, sans-serif",
          fontWeight: 600,
          fontSize: "14px",
          letterSpacing: "0.06em",
        }}
      >
        DECLARES
      </text>
    </svg>
  );
}
