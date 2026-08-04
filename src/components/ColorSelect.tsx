import React from "react";
import { COLOR_OPTIONS } from "../constants/colors";
import { type HexColor } from "../utils/colorUtils";

interface ColorSelectProps {
  color: HexColor;
  onChange: (color: HexColor) => void;
}

const ColorSelect: React.FC<ColorSelectProps> = ({ color, onChange }) => {
  const selectedName =
    COLOR_OPTIONS.find(
      (option) => option.value.toLowerCase() === color.toLowerCase(),
    )?.label ?? null;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-6 gap-2.5">
        {COLOR_OPTIONS.map((option) => {
          const selected = option.value.toLowerCase() === color.toLowerCase();
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              title={option.label}
              aria-label={`Select ${option.label}`}
              aria-pressed={selected}
              className={`relative aspect-square w-full rounded-xl border transition-all duration-200 hover:scale-110 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 ${
                selected
                  ? "scale-110 border-white shadow-lg"
                  : "border-white/15"
              }`}
              style={{
                backgroundColor: option.value,
                backgroundImage:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), rgba(255,255,255,0) 60%)",
              }}
            >
              {selected && (
                <span
                  className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                  aria-hidden="true"
                >
                  ✓
                </span>
              )}
            </button>
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
