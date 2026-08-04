import React from "react";
import { hexToHsl } from "../utils/colorUtils";
import useTimedReset from "../hooks/useTimedReset";
import {
  COPY_BUTTON_SIZE,
  SURFACE_CARD,
  SURFACE_HOVER,
  SURFACE_RAISED,
  TEXT_MUTED,
  VALUE_LABEL_WIDTH,
  hexToRgb,
  type HexColor,
} from "../constants";
import { copyToClipboard } from "../utils/clipboardUtils";
import { COPY } from "../copy";
import IconButton from "./IconButton";
import { CheckIcon, CopyIcon } from "./icons";

interface ColorValuesProps {
  color: HexColor;
}

type ValueKey = "hex" | "rgb" | "hsl";

const ColorValues: React.FC<ColorValuesProps> = ({ color }) => {
  const [copied, setCopied] = useTimedReset<ValueKey | null>(null);

  const rgb = hexToRgb(color);
  const hsl = hexToHsl(color);

  const rows: { key: ValueKey; label: string; value: string }[] = [
    { key: "hex", label: COPY.formats.hex, value: color.toUpperCase() },
    {
      key: "rgb",
      label: COPY.formats.rgb,
      value: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "—",
    },
    {
      key: "hsl",
      label: COPY.formats.hsl,
      value: hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : "—",
    },
  ];

  const copy = async (key: ValueKey, value: string) => {
    if (await copyToClipboard(value)) setCopied(key);
  };

  return (
    <div className="w-full space-y-2">
      {rows.map((row) => (
        <div
          key={row.key}
          className={`flex items-center justify-between gap-3 rounded-xl border border-white/10 ${SURFACE_CARD} px-3 py-2.5`}
        >
          <span
            className={`${VALUE_LABEL_WIDTH} shrink-0 text-[10px] font-semibold uppercase tracking-widest ${TEXT_MUTED}`}
          >
            {row.label}
          </span>
          <span className="min-w-0 flex-1 truncate text-right font-mono text-sm text-white/90">
            {row.value}
          </span>
          <IconButton
            label={COPY.formats.copyValue(row.label)}
            title={COPY.formats.copyLabel(row.label)}
            onClick={() => copy(row.key, row.value)}
            className={`${COPY_BUTTON_SIZE} rounded-lg ${
              copied === row.key
                ? "bg-emerald-400/20 text-emerald-300"
                : `${SURFACE_RAISED} text-white/70 ${SURFACE_HOVER} hover:text-white`
            }`}
          >
            {copied === row.key ? <CheckIcon /> : <CopyIcon />}
          </IconButton>
        </div>
      ))}
    </div>
  );
};

export default ColorValues;
