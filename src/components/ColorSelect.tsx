import React from "react";
import { COLOR_OPTIONS } from "../constants/colors";
import { colorsEqual, type HexColor } from "../utils/colorUtils";
import ColorSwatch from "./ColorSwatch";

interface ColorSelectProps {
  color: HexColor;
  onChange: (color: HexColor) => void;
}

const ColorSelect: React.FC<ColorSelectProps> = ({ color, onChange }) => {
  const selectedName =
    COLOR_OPTIONS.find((option) => colorsEqual(option.value, color))?.label ??
    null;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-6 gap-2.5">
        {COLOR_OPTIONS.map((option) => {
          const selected = colorsEqual(option.value, color);
          return (
            <ColorSwatch
              key={option.value}
              color={option.value}
              label={`Select ${option.label}`}
              title={option.label}
              selected={selected}
              onClick={() => onChange(option.value)}
              gloss
              className={`aspect-square w-full rounded-xl ${
                selected ? "scale-110 hover:scale-110" : "hover:shadow-lg"
              }`}
            >
              {selected && (
                <span
                  className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                  aria-hidden="true"
                >
                  ✓
                </span>
              )}
            </ColorSwatch>
          );
        })}
      </div>
      <p className="h-4 text-xs font-medium text-white/50" aria-live="polite">
        {selectedName ? `Selected: ${selectedName}` : ""}
      </p>
    </div>
  );
};

export default ColorSelect;
