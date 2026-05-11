"use client";

import { useEffect, useMemo, useState } from "react";

/* Dot-matrix display — Fourmula-inspired with halo "stitching" effect.

   Each frame is a binary shape (1 cell per pixel). Before render we
   DILATE the shape with a distance kernel so each lit cell radiates
   intensity outward — adjacent cells get bright, two cells away get
   medium, three away get a soft glow, four away fade to base. This is
   what gives Fourmula's matrix its diffuse-edge "stitching" feel,
   instead of the hard pixel edge of a naive shape.

   Coordinate system: rows top→bottom, cols left→right. ASCII art:
     '#'  shape pixel (cream)    '*'  shape pixel (accent red)
     '.'  off (still gets faint base intensity from the field)         */

const COLS = 96;
const ROWS = 20;
const DOT_R = 3.2;
const STEP = 14;
const PAD = 12;
const W = COLS * STEP + PAD * 2;
const H = ROWS * STEP + PAD * 2;
const CYCLE_MS = 4500;
const HALO_RADIUS = 3.5; // dot intensity decays linearly to 0 at this distance

type Cell = 0 | 1 | 2;
type CellInfo = { intensity: number; isAccent: boolean };
type ShapeGrid = Cell[][];
type IntensityGrid = CellInfo[][];

function emptyShape(): ShapeGrid {
  return Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(0));
}

/* Stamp ASCII art into a fresh shape grid at (offsetCol, offsetRow). */
function stamp(art: string, offsetCol: number, offsetRow: number): ShapeGrid {
  const g = emptyShape();
  const lines = art.split("\n").filter((l) => l.length > 0);
  for (let r = 0; r < lines.length; r++) {
    const line = lines[r];
    for (let c = 0; c < line.length; c++) {
      const ch = line[c];
      if (ch === "#" || ch === "*") {
        const tr = r + offsetRow;
        const tc = c + offsetCol;
        if (tr >= 0 && tr < ROWS && tc >= 0 && tc < COLS) {
          g[tr][tc] = ch === "*" ? 2 : 1;
        }
      }
    }
  }
  return g;
}

/* Dilate a shape into an intensity field with a soft falloff per cell. */
function dilate(shape: ShapeGrid): IntensityGrid {
  const out: IntensityGrid = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ intensity: 0, isAccent: false })),
  );
  const kernel = Math.ceil(HALO_RADIUS);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let maxI = 0;
      let isAccent = false;
      for (let dr = -kernel; dr <= kernel; dr++) {
        for (let dc = -kernel; dc <= kernel; dc++) {
          const sr = r + dr;
          const sc = c + dc;
          if (sr < 0 || sr >= ROWS || sc < 0 || sc >= COLS) continue;
          const sv = shape[sr][sc];
          if (!sv) continue;
          const dist = Math.sqrt(dr * dr + dc * dc);
          if (dist > HALO_RADIUS) continue;
          const i = 1 - dist / HALO_RADIUS;
          if (i > maxI) {
            maxI = i;
            isAccent = sv === 2;
          }
        }
      }
      out[r][c] = { intensity: maxI, isAccent };
    }
  }
  return out;
}

/* ---- Pixel font · 5 wide × 7 tall ---- */
const FONT: Record<string, string[]> = {
  "0": [".###.", "#...#", "#..##", "#.#.#", "##..#", "#...#", ".###."],
  "1": ["..#..", ".##..", "..#..", "..#..", "..#..", "..#..", ".###."],
  "2": [".###.", "#...#", "....#", "...#.", "..#..", ".#...", "#####"],
  "3": [".###.", "#...#", "....#", "..##.", "....#", "#...#", ".###."],
  "4": ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."],
  "5": ["#####", "#....", "####.", "....#", "....#", "#...#", ".###."],
  "6": [".###.", "#....", "#....", "####.", "#...#", "#...#", ".###."],
  "7": ["#####", "....#", "...#.", "..#..", ".#...", ".#...", ".#..."],
  "8": [".###.", "#...#", "#...#", ".###.", "#...#", "#...#", ".###."],
  "9": [".###.", "#...#", "#...#", ".####", "....#", "....#", ".###."],
  "%": ["##..#", "##.#.", "...#.", "..#..", ".#...", ".#.##", "#..##"],
  L: ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
  O: [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  V: ["#...#", "#...#", "#...#", "#...#", ".#.#.", ".#.#.", "..#.."],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  " ": [".....", ".....", ".....", ".....", ".....", ".....", "....."],
};

/* Render a string at 5×7 with N empty cols between chars. accentChars
   is a set of characters to render as accent red (only those characters
   inside the string get '*' instead of '#').                            */
function buildText(text: string, charSpacing = 1, accentChars?: Set<string>): { lines: string[]; width: number } {
  const chars = text.toUpperCase().split("").filter((c) => FONT[c]);
  if (chars.length === 0) return { lines: [], width: 0 };
  const lines: string[] = [];
  for (let r = 0; r < 7; r++) {
    let line = "";
    chars.forEach((c, i) => {
      const isAccent = accentChars?.has(c) ?? false;
      const sym = isAccent ? "*" : "#";
      line += FONT[c][r].replace(/#/g, sym);
      if (i < chars.length - 1) line += ".".repeat(charSpacing);
    });
    lines.push(line);
  }
  return { lines, width: lines[0].length };
}

function stampText(text: string, accentChars?: Set<string>, charSpacing = 1, scale = 2): ShapeGrid {
  const { lines, width } = buildText(text, charSpacing, accentChars);
  // Scale up the bitmap by repeating each pixel `scale` times in both axes.
  const scaledLines: string[] = [];
  for (const line of lines) {
    let scaled = "";
    for (const ch of line) scaled += ch.repeat(scale);
    for (let s = 0; s < scale; s++) scaledLines.push(scaled);
  }
  const scaledWidth = width * scale;
  const scaledHeight = 7 * scale;
  const offsetCol = Math.floor((COLS - scaledWidth) / 2);
  const offsetRow = Math.floor((ROWS - scaledHeight) / 2);
  return stamp(scaledLines.join("\n"), offsetCol, offsetRow);
}

/* ---- Shape art ---- larger now (28-30 wide) for the bigger 96-col grid */

const HEART = `
.....######......######.....
....########....########....
..############..############
..##########################
..##########################
..##########################
..##########################
..##########################
...########################.
....######################..
.....####################...
......##################....
.......################.....
........##############......
.........############.......
..........##########........
...........########.........
............######..........
.............####...........
..............##............
`;

const LEAF = `
..............##............
............######..........
..........##########........
.........############.......
........##############......
.......################.....
......##################....
.....####################...
....######################..
...########################.
..##########################
..########################..
..######################....
.######################.....
.####################.......
.##################.........
.################...........
.##############.............
.############...............
.##########.................
`;

const TREE = `
.............####...........
............######..........
...........########.........
..........##########........
.........############.......
........##############......
.......################.....
......##################....
.....####################...
....######################..
...########################.
..##########################
.############################
########********########.
######************######....
.....****************.......
.....****************.......
.....****************.......
.....****************.......
.....****************.......
`;

const FRAMES: ShapeGrid[] = [
  stamp(HEART, Math.floor((COLS - 28) / 2), 0),       // heart cream by default
  stamp(LEAF, Math.floor((COLS - 28) / 2), 0),
  stamp(TREE, Math.floor((COLS - 30) / 2), 0),        // tree (cream foliage + red trunk via *)
  stampText("91%", new Set(["%"]), 1, 2),
  stampText("40%", new Set(["%"]), 1, 2),
  stampText("LOVE", undefined, 1, 2),
  stampText("2026", undefined, 1, 2),
];

/* Convert HEART to all-accent for the love frame (overrides default cream) */
const HEART_RED: ShapeGrid = stamp(HEART.replace(/#/g, "*"), Math.floor((COLS - 28) / 2), 0);
FRAMES[0] = HEART_RED;

const FRAME_NAMES = ["love", "leaf", "tree", "lighter than", "impact, by capacity", "love", "year"];

export function FooterDots() {
  const [frameIdx, setFrameIdx] = useState(0);

  // Precompute the dilated intensity grid for every frame once.
  const fields = useMemo(() => FRAMES.map(dilate), []);

  useEffect(() => {
    const t = setInterval(() => {
      setFrameIdx((i) => (i + 1) % FRAMES.length);
    }, CYCLE_MS);
    return () => clearInterval(t);
  }, []);

  const field = fields[frameIdx];

  return (
    <div className="footer-dots-wrap" aria-hidden="true">
      <svg
        className="footer-dots-svg"
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {field.flatMap((row, r) =>
          row.map((cell, c) => {
            const cx = PAD + c * STEP + STEP / 2;
            const cy = PAD + r * STEP + STEP / 2;
            // Base faint grey under everything, shape lifts intensity.
            const opacity = 0.08 + cell.intensity * 0.92;
            const fill = cell.isAccent ? "#e84d4d" : "#fbfbf7";
            // Slightly grow the dot under heavy intensity for extra punch.
            const r2 = DOT_R * (0.85 + cell.intensity * 0.25);
            return (
              <circle
                key={`${r}-${c}`}
                cx={cx}
                cy={cy}
                r={r2}
                fill={fill}
                style={{
                  transition:
                    "opacity 700ms cubic-bezier(0.22,1,0.36,1), r 700ms cubic-bezier(0.22,1,0.36,1), fill 700ms cubic-bezier(0.22,1,0.36,1)",
                  opacity,
                }}
              />
            );
          }),
        )}
      </svg>
      <div className="footer-dots-caption mono">{FRAME_NAMES[frameIdx]}</div>
    </div>
  );
}
