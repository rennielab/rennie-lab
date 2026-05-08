"use client";

import { type CSSProperties, type ReactNode } from "react";

type Props = {
  kind: "press" | "deck";
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function DownloadButton({ kind, children, className = "btn btn-primary", style }: Props) {
  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={() =>
        window.dispatchEvent(new CustomEvent("open-download", { detail: { kind } }))
      }
    >
      {children}
    </button>
  );
}
