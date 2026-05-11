"use client";

import { useEffect, useState } from "react";

/* Dot-matrix display — Fourmula style.
   Hard-edged shape (no halo), uniform dot size, with a deterministic
   mid-tone scatter across the dead field giving the matrix that quiet
   printed-page density. ASCII art:
     '#'  shape pixel (cream, fully lit)
     '*'  shape pixel (accent red, fully lit)
     '.'  off (will pick up the static scatter or stay at base)         */

const COLS = 96;
const ROWS = 20;
const DOT_R = 3.2;
const STEP = 14;
const PAD = 12;
const W = COLS * STEP + PAD * 2;
const H = ROWS * STEP + PAD * 2;
const CYCLE_MS = 4500;

type Cell = 0 | 1 | 2;
type ShapeGrid = Cell[][];

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

/* Deterministic mid-tone scatter — the quiet density Fourmula uses to
   make the dead field feel alive. Two-tier intensity (light + darker)
   so the scatter has visible variety like Fourmula's halftone field.
   Generated once at module load with a seeded PRNG so it's stable.     */
type ScatterCell = { lit: boolean; intensity: number };

function makeScatter(seed: number, density: number): ScatterCell[][] {
  let s = seed | 0;
  const rng = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => {
      const roll = rng();
      const tierRoll = rng();
      // 22% of scattered cells are "dark" (heavier weight), the rest "light"
      const intensity = tierRoll < 0.22
        ? 0.48 + (rng() * 0.18) // 0.48–0.66 (darker)
        : 0.18 + (rng() * 0.18); // 0.18–0.36 (lighter)
      return { lit: roll < density, intensity };
    }),
  );
}

const SCATTER = makeScatter(73, 0.20);

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

/* ---- shape art ---- 28-30 wide for the 96-col grid */

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
  stamp(HEART.replace(/#/g, "*"), Math.floor((COLS - 28) / 2), 0), // heart in red
  stamp(LEAF, Math.floor((COLS - 28) / 2), 0),
  stamp(TREE, Math.floor((COLS - 30) / 2), 0),
  stampText("91%", new Set(["%"]), 1, 2),
  stampText("40%", new Set(["%"]), 1, 2),
  stampText("LOVE", undefined, 1, 2),
  stampText("2026", undefined, 1, 2),
];

const FRAME_NAMES = ["love", "leaf", "tree", "lighter than", "impact, by capacity", "love", "year"];

export function FooterDots() {
  const [frameIdx, setFrameIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setFrameIdx((i) => (i + 1) % FRAMES.length);
    }, CYCLE_MS);
    return () => clearInterval(t);
  }, []);

  const shape = FRAMES[frameIdx];

  return (
    <div className="footer-dots-wrap" aria-hidden="true">
      <svg
        className="footer-dots-svg"
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {shape.flatMap((row, r) =>
          row.map((cell, c) => {
            const cx = PAD + c * STEP + STEP / 2;
            const cy = PAD + r * STEP + STEP / 2;

            // Hard-edged shape: cell is either fully lit or off.
            // Off cells either pick up the scatter (mid-tone) or sit at base.
            let opacity: number;
            let fill: string;
            if (cell === 1) {
              opacity = 0.95;
              fill = "#fbfbf7";
            } else if (cell === 2) {
              opacity = 0.95;
              fill = "#e84d4d";
            } else {
              const sc = SCATTER[r][c];
              opacity = sc.lit ? sc.intensity : 0.08;
              fill = "#fbfbf7";
            }

            return (
              <circle
                key={`${r}-${c}`}
                cx={cx}
                cy={cy}
                r={DOT_R}
                fill={fill}
                style={{
                  transition:
                    "opacity 700ms cubic-bezier(0.22,1,0.36,1), fill 700ms cubic-bezier(0.22,1,0.36,1)",
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
