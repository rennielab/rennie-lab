/**
 * Lantern brand tokens.
 * Working name "Lantern" — rename here once the trademark search clears.
 * Type sizes run larger than typical app defaults: protected members
 * are often 70+, so 18pt body / 44pt+ touch targets are the floor.
 */
export const colors = {
  indigo: "#16243D",
  indigoSoft: "#22335A",
  amber: "#F2A33C",
  amberDeep: "#D97E0F",
  cream: "#FAF6EF",
  card: "#FFFFFF",
  line: "rgba(22, 36, 61, 0.12)",
  inkOnDark: "#FAF6EF",
  inkFaintOnDark: "rgba(250, 246, 239, 0.65)",
  ink: "#16243D",
  inkSoft: "rgba(22, 36, 61, 0.65)",
  safe: "#2E7D5B",
  caution: "#B45309",
  scam: "#B03A2E",
} as const;

export const type = {
  display: 32,
  title: 24,
  body: 18,
  small: 15,
} as const;

export const space = {
  xs: 6,
  s: 12,
  m: 18,
  l: 28,
  xl: 40,
} as const;

export const radius = {
  card: 18,
  button: 14,
  chip: 999,
} as const;
