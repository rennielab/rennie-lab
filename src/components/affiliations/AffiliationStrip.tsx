"use client";

import Link from "next/link";
import { useTheme } from "@/components/chrome/ThemeProvider";

type Affiliation = {
  id: string;
  label: string;
  href: string;
  src: string;
  /** When true, force the source through `brightness(0)` so single-colour logos
   *  render pure black on light theme and pure white on dark theme. */
  monoFilter: boolean;
  external?: boolean;
  maxHeight?: number;
};

const AFFILIATIONS: Affiliation[] = [
  {
    id: "bcorp",
    label: "Certified B Corporation",
    href: "https://www.bcorporation.net/",
    src: "/affiliations/bcorp.webp",
    monoFilter: true,
    maxHeight: 90,
  },
  {
    id: "onepercent",
    label: "1% for the Planet — Environmental Partner",
    href: "https://onepercentfortheplanet.org/",
    src: "/affiliations/onepercent.webp",
    monoFilter: true,
    maxHeight: 84,
  },
  {
    id: "d-declares",
    label: "Design Declares",
    href: "https://designdeclares.com/",
    src: "/affiliations/d-declares.webp",
    monoFilter: true,
    maxHeight: 68,
  },
  {
    id: "clean-creatives",
    label: "Clean Creatives — Approved",
    href: "https://cleancreatives.org/",
    src: "/affiliations/clean-creatives.webp",
    monoFilter: true,
    maxHeight: 84,
  },
  {
    id: "lfca",
    label: "Leaders for Climate Action",
    href: "https://lfca.earth/",
    src: "/affiliations/lfca.webp",
    monoFilter: true,
    maxHeight: 84,
  },
  {
    id: "cityswitch",
    label: "CitySwitch — Green Office Signatory",
    href: "https://www.cityswitch.net.au/",
    src: "/affiliations/cityswitch.webp",
    monoFilter: true,
    maxHeight: 62,
  },
  {
    id: "green-web",
    label: "Green Hosting · verified by The Green Web Foundation",
    href: "https://www.thegreenwebfoundation.org/",
    src: "https://app.greenweb.org/api/v3/greencheckimage/rennielab.com?nocache=true",
    monoFilter: true,
    external: true,
    maxHeight: 78,
  },
];

type Props = {
  /** Footer treatment is denser, less padding, smaller cells, slightly more muted. */
  variant?: "page" | "footer";
  /** Override the active theme — used in the footer where bg is always carbon. */
  forceTheme?: "light" | "dark";
};

export function AffiliationStrip({ variant = "page", forceTheme }: Props) {
  const { theme: activeTheme } = useTheme();
  const theme = forceTheme ?? activeTheme;

  const isFooter = variant === "footer";
  const cellHeight = isFooter ? 90 : 134;
  const restingOpacity = isFooter ? 0.55 : 0.7;

  // brightness(0) → pure black silhouette. invert(1) → flip to white.
  const monoStyle: React.CSSProperties =
    theme === "dark"
      ? { filter: "brightness(0) invert(1)" }
      : { filter: "brightness(0)" };

  if (!isFooter) {
    // Page variant: square tiles matching the homepage client logo strip
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${AFFILIATIONS.length}, 1fr)`,
          gap: 8,
          width: "100%",
        }}
      >
        {AFFILIATIONS.map((a) => (
          <Link
            key={a.id}
            href={a.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={a.label}
            title={a.label}
            style={{
              aspectRatio: "1 / 1",
              background: "var(--bg-soft)",
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              padding: "16px 24px",
              overflow: "hidden",
              opacity: restingOpacity,
              transition: "opacity 250ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = String(restingOpacity);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={a.src}
              alt={a.label}
              style={{
                maxWidth: "70%",
                maxHeight: "56%",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                display: "block",
                ...(a.monoFilter ? monoStyle : {}),
              }}
            />
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${AFFILIATIONS.length}, 1fr)`,
        gap: 8,
        width: "100%",
      }}
    >
      {AFFILIATIONS.map((a) => (
        <Link
          key={a.id}
          href={a.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={a.label}
          title={a.label}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: cellHeight,
            padding: "8px 12px",
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={a.src}
            alt={a.label}
            style={{
              maxHeight: a.maxHeight ?? 48,
              maxWidth: "100%",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              ...(a.monoFilter ? monoStyle : {}),
            }}
          />
        </Link>
      ))}
    </div>
  );
}
