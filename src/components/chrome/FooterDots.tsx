"use client";

import { useEffect, useState } from "react";

/* Dot-matrix footer display — Fourmula-inspired.
   Renders a faint cream grid of dots; each frame illuminates a subset to
   form a shape (heart, tree, leaf) or render a text/number string ("91%",
   "40%", "2026") via a tiny 5×7 pixel font. Cycles every CYCLE_MS with a
   smooth opacity transition per cell.

   Coordinate system: rows top→bottom, cols left→right. Cell value:
     0 = off (faint)   · 1 = cream (lit)   · 2 = accent red

   ASCII art format: '#' lights cream, '*' lights accent red, '.' off.    */

const COLS = 56;
const ROWS = 14;
const DOT_R = 3;
const STEP = 14;
const PAD = 8;
const W = COLS * STEP + PAD * 2;
const H = ROWS * STEP + PAD * 2;
const CYCLE_MS = 4500;

type Cell = 0 | 1 | 2;
type Grid = Cell[][];

function emptyGrid(): Grid {
  return Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(0));
}

/* Stamp ASCII art onto a fresh grid at (offsetCol, offsetRow). Default
   value can be overridden — passing 2 maps every '#' to accent red.      */
function stamp(art: string, offsetCol: number, offsetRow: number, defaultValue: Cell = 1): Grid {
  const g = emptyGrid();
  const lines = art.split("\n").filter((l) => l.length > 0);
  for (let r = 0; r < lines.length; r++) {
    const line = lines[r];
    for (let c = 0; c < line.length; c++) {
      const ch = line[c];
      if (ch === "#" || ch === "*") {
        const tr = r + offsetRow;
        const tc = c + offsetCol;
        if (tr >= 0 && tr < ROWS && tc >= 0 && tc < COLS) {
          g[tr][tc] = ch === "*" ? 2 : defaultValue;
        }
      }
    }
  }
  return g;
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

/* Build ASCII art for a string. charSpacing is # of empty cols between
   chars. Optional accentChars set marks specific characters as accent red. */
function textArt(text: string, charSpacing: number = 1, accentChars?: Set<string>): { art: string; width: number; accentCols: Set<number> } {
  const chars = text.toUpperCase().split("");
  const knownChars = chars.filter((c) => FONT[c]);
  if (knownChars.length === 0) return { art: "", width: 0, accentCols: new Set() };

  const accentCols = new Set<number>();
  let runningCol = 0;
  if (accentChars) {
    knownChars.forEach((c) => {
      const charWidth = FONT[c][0].length;
      if (accentChars.has(c)) {
        for (let i = 0; i < charWidth; i++) accentCols.add(runningCol + i);
      }
      runningCol += charWidth + charSpacing;
    });
  }

  const lines: string[] = [];
  for (let r = 0; r < 7; r++) {
    let line = "";
    knownChars.forEach((c, i) => {
      line += FONT[c][r];
      if (i < knownChars.length - 1) line += ".".repeat(charSpacing);
    });
    lines.push(line);
  }
  const width = lines[0].length;
  return { art: lines.join("\n"), width, accentCols };
}

function stampText(text: string, accentChars?: Set<string>): Grid {
  const { art, width, accentCols } = textArt(text, 1, accentChars);
  const offsetCol = Math.floor((COLS - width) / 2);
  const offsetRow = Math.floor((ROWS - 7) / 2);
  const g = emptyGrid();
  const lines = art.split("\n");
  for (let r = 0; r < lines.length; r++) {
    const line = lines[r];
    for (let c = 0; c < line.length; c++) {
      if (line[c] === "#") {
        const tr = r + offsetRow;
        const tc = c + offsetCol;
        if (tr >= 0 && tr < ROWS && tc >= 0 && tc < COLS) {
          g[tr][tc] = accentCols.has(c) ? 2 : 1;
        }
      }
    }
  }
  return g;
}

/* ---- shape art ---- */

const HEART = `
..####....####..
.######..######.
################
################
################
.##############.
..############..
...##########...
....########....
.....######.....
......####......
.......##.......
`;

const LEAF = `
.......##.......
.....######.....
....########....
...##########...
..############..
.##############.
##############..
.##############.
..############..
...##########...
....########....
.....######.....
......####......
.......##.......
`;

const TREE = `
......####......
.....######.....
....########....
...##########...
..############..
.##############.
####********####
##**********####
.##**********##.
.....######.....
......####......
......####......
......####......
.....######.....
`;

/* Cycle frames — heart in red, leaf cream, tree mixed (red trunk),
   then text frames showing the studio's headline numbers + LOVE.        */
const FRAMES: Grid[] = [
  stamp(HEART, Math.floor((COLS - 16) / 2), 1, 2), // accent red heart
  stamp(LEAF, Math.floor((COLS - 16) / 2), 0, 1),
  stamp(TREE, Math.floor((COLS - 16) / 2), 0, 1),
  stampText("91%", new Set(["%"])),  // 91 cream, % red
  stampText("40%", new Set(["%"])),
  stampText("LOVE"),
  stampText("2026"),
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

  const grid = FRAMES[frameIdx];

  return (
    <div className="footer-dots-wrap" aria-hidden="true">
      <svg
        className="footer-dots-svg"
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {grid.flatMap((row, r) =>
          row.map((cell, c) => {
            const cx = PAD + c * STEP + STEP / 2;
            const cy = PAD + r * STEP + STEP / 2;
            const fill = cell === 2 ? "#e84d4d" : "#fbfbf7";
            const opacity = cell === 0 ? 0.10 : cell === 2 ? 0.96 : 0.92;
            const r2 = cell === 0 ? DOT_R * 0.75 : DOT_R;
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
