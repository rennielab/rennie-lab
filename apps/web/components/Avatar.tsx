'use client';

import { useState } from 'react';

// Avatar with graceful fallback: tries the image, falls back to initials if it
// fails to load. Use this anywhere we previously rendered <img src={...} /> for
// a user photo so the layout never breaks when the file is missing.

export function Avatar({
  src,
  name,
  initials,
  size = 36,
  className = '',
  ringClassName = '',
  bg,
  fg,
}: {
  src?: string;
  name?: string;
  initials: string;
  size?: number;
  className?: string;
  ringClassName?: string;
  bg?: string;
  fg?: string;
}) {
  const [errored, setErrored] = useState(false);
  const showImage = !!src && !errored;

  const style: React.CSSProperties = {
    width: size,
    height: size,
    fontSize: Math.max(10, Math.floor(size * 0.35)),
    ...(showImage ? {} : { background: bg ?? '#F3F4F6', color: fg ?? '#4B5563' }),
  };

  if (showImage) {
    return (
      <img
        src={src}
        alt={name ?? initials}
        title={name}
        onError={() => setErrored(true)}
        style={style}
        className={`rounded-full object-cover ${ringClassName} ${className}`}
      />
    );
  }

  return (
    <span
      title={name}
      style={style}
      className={`inline-flex items-center justify-center rounded-full font-bold ${ringClassName} ${className}`}>
      {initials}
    </span>
  );
}
