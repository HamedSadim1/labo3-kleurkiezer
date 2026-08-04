import React from "react";
import { glossOverlay } from "../utils/colorUtils";
import { type HexColor } from "../constants";

interface ColorSwatchProps {
  color: HexColor;
  label: string;
  onClick?: () => void;
  selected?: boolean;
  gloss?: boolean;
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * A colored button used across the palette, recent, saved and harmony sections.
 * Size and shape come from `className` (e.g. "h-9 w-9 rounded-full").
 */
const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  label,
  onClick,
  selected,
  gloss = false,
  title = color.toUpperCase(),
  className = "",
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    aria-label={label}
    aria-pressed={selected === undefined ? undefined : selected}
    className={`relative border transition-all duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 ${
      selected ? "border-white shadow-lg" : "border-white/15"
    } ${className}`}
    style={{
      backgroundColor: color,
      backgroundImage: gloss ? glossOverlay() : undefined,
    }}
  >
    {children}
  </button>
);

export default ColorSwatch;
