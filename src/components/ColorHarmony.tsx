import React from "react";
import { getHarmony, type HexColor } from "../utils/colorUtils";

interface ColorHarmonyProps {
  color: HexColor;
  onChange: (color: HexColor) => void;
}

const ColorHarmony: React.FC<ColorHarmonyProps> = ({ color, onChange }) => {
  const harmony = getHarmony(color);

  const groups = [
    { label: "Complementary", colors: [harmony.complementary] },
    { label: "Analogous", colors: harmony.analogous },
    { label: "Triadic", colors: harmony.triadic },
  ];

  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <div key={group.label} className="flex items-center justify-between">
          <span className="w-28 text-xs font-medium text-white/50">
            {group.label}
          </span>
          <div className="flex gap-2">
            {group.colors.map((harmonyColor) => (
              <button
                key={harmonyColor}
                type="button"
                onClick={() => onChange(harmonyColor)}
                title={harmonyColor.toUpperCase()}
                aria-label={`Select harmony color ${harmonyColor.toUpperCase()}`}
                className="h-7 w-7 rounded-full border border-white/20 shadow transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
                style={{ backgroundColor: harmonyColor }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ColorHarmony;
