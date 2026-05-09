"use client";

import { useState } from "react";

type Phase = { id: string; label: string; angle: number };

const PHASES: Phase[] = [
  { id: "origins",     label: "Origins",     angle: 0 },
  { id: "junctions",   label: "Junctions",   angle: 60 },
  { id: "connections", label: "Connections", angle: 120 },
  { id: "reflections", label: "Reflections", angle: 180 },
  { id: "directions",  label: "Directions",  angle: 240 },
  { id: "horizons",    label: "Horizons",    angle: 300 },
];

// SHE pillars in a triangle around centre
const PILLARS = [
  { letter: "S", word: "Systems",  x: 300, y: 200 },
  { letter: "H", word: "Humanity", x: 380, y: 340 },
  { letter: "E", word: "Ecology",  x: 220, y: 340 },
];

const CX = 300;
const CY = 300;
const OUTER_R = 240;

function pointOn(angleDeg: number, r: number) {
  // 0deg = top, clockwise
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

export function OrbitalDiagram() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="orb-diagram-wrap" aria-label="Orbital design diagram">
      <svg
        viewBox="0 0 600 600"
        xmlns="http://www.w3.org/2000/svg"
        className="orb-diagram-svg"
        role="img"
      >
        {/* concentric guide rings */}
        <circle cx={CX} cy={CY} r={OUTER_R} className="orb-ring orb-ring-outer" />
        <circle cx={CX} cy={CY} r={150} className="orb-ring orb-ring-mid" />
        <circle cx={CX} cy={CY} r={86}  className="orb-ring orb-ring-inner" />

        {/* travelling satellite — single dot that orbits the outer ring */}
        <g className="orb-satellite-group">
          <circle r="5" cx={CX} cy={CY - OUTER_R} className="orb-satellite" />
        </g>

        {/* phase nodes around outer ring */}
        {PHASES.map((p) => {
          const pt = pointOn(p.angle, OUTER_R);
          const labelPt = pointOn(p.angle, OUTER_R + 38);
          const isHovered = hovered === p.id;
          return (
            <g
              key={p.id}
              className="orb-phase"
              data-active={isHovered}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <circle cx={pt.x} cy={pt.y} r={isHovered ? 9 : 6} className="orb-phase-dot" />
              <text
                x={labelPt.x}
                y={labelPt.y}
                className="orb-phase-label"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {p.label}
              </text>
            </g>
          );
        })}

        {/* SHE pillars — letter discs in inner triangle */}
        <g className="orb-pillars">
          {PILLARS.map((pl, i) => (
            <g
              key={pl.letter}
              className="orb-pillar"
              style={{ animationDelay: `${i * 1.4}s` }}
            >
              <circle cx={pl.x} cy={pl.y} r={42} className="orb-pillar-disc" />
              <text
                x={pl.x}
                y={pl.y + 1}
                className="orb-pillar-letter"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {pl.letter}
              </text>
              <text
                x={pl.x}
                y={pl.y + 64}
                className="orb-pillar-word"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {pl.word}
              </text>
            </g>
          ))}
        </g>

        {/* connecting lines between SHE — subtle triangle */}
        <polygon
          points={PILLARS.map((p) => `${p.x},${p.y}`).join(" ")}
          className="orb-pillar-link"
        />

        {/* centre — Mother Nature pulse */}
        <circle cx={CX} cy={CY} r={4} className="orb-centre" />
      </svg>
    </div>
  );
}
