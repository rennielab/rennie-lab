// Real Clockd wordmark — same SVG glyphs as the mobile app, served as
// static assets from /public/logo. Fill is baked into the SVG as #22C55E.

const LETTERS = [
  { src: '/logo/l1.svg', w: 28.523, h: 31.859 },
  { src: '/logo/l2.svg', w: 22.382, h: 30.814 },
  { src: '/logo/l3.svg', w: 33.015, h: 31.901 },
  { src: '/logo/l4.svg', w: 28.706, h: 31.925 },
  { src: '/logo/l5.svg', w: 28.238, h: 30.852 },
  { src: '/logo/l6.svg', w: 39.454, h: 30.811 },
] as const;

const MAX_H = Math.max(...LETTERS.map((l) => l.h));

export function Logo({ height = 32, className = '' }: { height?: number; className?: string }) {
  const scale = height / MAX_H;
  return (
    <span className={`inline-flex items-center ${className}`} style={{ gap: 4 * scale }}>
      {LETTERS.map((l, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={l.src}
          alt={i === 0 ? 'Clockd' : ''}
          width={l.w * scale}
          height={l.h * scale}
          style={{ width: l.w * scale, height: l.h * scale }}
        />
      ))}
    </span>
  );
}
