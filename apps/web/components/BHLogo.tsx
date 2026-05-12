// Bennett & Hayes LLP firm mark. Used wherever we want to make clear that
// the surface belongs to B&H specifically (vs Clockd, which is the platform).
// Dark forest green (matches the sidebar palette) with a serif "BH" — legal-
// firm feel without overdoing it.

export function BHLogo({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      className={`shrink-0 ${className}`}
      aria-label="Bennett & Hayes LLP">
      <rect x="0" y="0" width="36" height="36" rx="7" fill="#0E2A1E" />
      <rect x="0.5" y="0.5" width="35" height="35" rx="6.5" fill="none" stroke="#22C55E" strokeOpacity="0.4" strokeWidth="1" />
      <text
        x="18"
        y="24"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="15"
        fontWeight="700"
        fill="#22C55E"
        textAnchor="middle"
        letterSpacing="0.5">
        BH
      </text>
    </svg>
  );
}

// Small inline badge variant — useful as a corner badge on an avatar to
// indicate "this user belongs to B&H".
export function BHBadge({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={`shrink-0 ${className}`}
      aria-label="Bennett & Hayes LLP">
      <rect x="0" y="0" width="16" height="16" rx="3" fill="#0E2A1E" />
      <text
        x="8"
        y="11.5"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="8"
        fontWeight="700"
        fill="#22C55E"
        textAnchor="middle"
        letterSpacing="0.25">
        BH
      </text>
    </svg>
  );
}
