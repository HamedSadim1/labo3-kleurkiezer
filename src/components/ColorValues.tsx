import React, { useState } from "react";
import { hexToRgb, hexToHsl, type HexColor } from "../utils/colorUtils";

interface ColorValuesProps {
  color: HexColor;
}

const CopyIcon: React.FC = () => (
  <svg
    className="h-3.5 w-3.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon: React.FC = () => (
  <svg
    className="h-3.5 w-3.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

type ValueKey = "hex" | "rgb" | "hsl";

const ColorValues: React.FC<ColorValuesProps> = ({ color }) => {
  const [copied, setCopied] = useState<ValueKey | null>(null);

  const rgb = hexToRgb(color);
  const hsl = hexToHsl(color);

  const rows: { key: ValueKey; label: string; value: string }[] = [
    { key: "hex", label: "HEX", value: color.toUpperCase() },
    {
      key: "rgb",
      label: "RGB",
      value: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "—",
    },
    {
      key: "hsl",
      label: "HSL",
      value: hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : "—",
    },
  ];

  const copy = async (key: ValueKey, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      window.setTimeout(() => {
        setCopied((current) => (current === key ? null : current));
      }, 1500);
    } catch {
      // Clipboard unavailable — ignore silently.
    }
  };

  return (
    <div className="w-full space-y-2">
      {rows.map((row) => (
        <div
          key={row.key}
          className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5"
        >
          <span className="w-10 shrink-0 text-[10px] font-semibold uppercase tracking-widest text-white/40">
            {row.label}
          </span>
          <span className="min-w-0 flex-1 truncate text-right font-mono text-sm text-white/90">
            {row.value}
          </span>
          <button
            type="button"
            onClick={() => copy(row.key, row.value)}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${
              copied === row.key
                ? "bg-emerald-400/20 text-emerald-300"
                : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
            }`}
            aria-label={`Copy ${row.label} value`}
            title={`Copy ${row.label}`}
          >
            {copied === row.key ? <CheckIcon /> : <CopyIcon />}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ColorValues;
