import React from "react";
import { getHarmony, type HexColor } from "../utils/colorUtils";
import { HARMONY_LABEL_WIDTH, HARMONY_SWATCH_SIZE } from "../constants";
import ColorSwatch from "./ColorSwatch";

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
          <span
            className={`${HARMONY_LABEL_WIDTH} text-xs font-medium text-white/50`}
          >
            {group.label}
          </span>
          <div className="flex gap-2">
            {group.colors.map((harmonyColor) => (
              <ColorSwatch
                key={harmonyColor}
                color={harmonyColor}
                label={`Select harmony color ${harmonyColor.toUpperCase()}`}
                onClick={() => onChange(harmonyColor)}
                className={`${HARMONY_SWATCH_SIZE} rounded-full shadow`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ColorHarmony;
