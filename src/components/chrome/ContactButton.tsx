"use client";

import { type CSSProperties, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function ContactButton({ children, className = "btn btn-primary", style }: Props) {
  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={() => window.dispatchEvent(new CustomEvent("open-contact"))}
    >
      {children}
    </button>
  );
}
