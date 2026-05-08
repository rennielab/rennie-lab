"use client";

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
};

export function FormField({ label, value, onChange, type = "text" }: Props) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span className="mono">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "12px 0",
          border: "none",
          borderBottom: "1px solid currentColor",
          fontFamily: "var(--sans)",
          fontWeight: 500,
          fontSize: 22,
          background: "transparent",
          color: "inherit",
          outline: "none",
          borderRadius: 0,
          opacity: 0.95,
        }}
      />
    </label>
  );
}
