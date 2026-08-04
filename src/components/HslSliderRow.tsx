import React from "react";
import { PERCENT_MAX } from "../utils/colorUtils";

interface HslSliderRowProps {
  label: string;
  value: number;
  gradient: string;
  ariaLabel: string;
  onChange: (value: number) => void;
}

/** A single labeled saturation/lightness slider row. */
const HslSliderRow: React.FC<HslSliderRowProps> = ({
  label,
  value,
  gradient,
  ariaLabel,
  onChange,
}) => (
  <div className="flex items-center gap-2">
    <span className="w-3 shrink-0 text-xs font-bold text-white/50">
      {label}
    </span>
    <input
      type="range"
      min={0}
      max={PERCENT_MAX}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className="flex-1"
      style={{ background: gradient }}
      aria-label={ariaLabel}
    />
    <span className="w-8 shrink-0 text-right font-mono text-xs text-white/70">
      {value}
    </span>
  </div>
);

export default HslSliderRow;
