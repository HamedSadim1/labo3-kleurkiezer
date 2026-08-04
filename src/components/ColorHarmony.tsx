import React from "react";
import { getHarmony } from "../utils/colorUtils";
import {
  HARMONY_LABEL_WIDTH,
  HARMONY_SWATCH_SIZE,
  type HexColor,
} from "../constants";
import { COPY } from "../copy";
import ColorSwatch from "./ColorSwatch";

interface ColorHarmonyProps {
  color: HexColor;
  onChange: (color: HexColor) => void;
}

const ColorHarmony: React.FC<ColorHarmonyProps> = ({ color, onChange }) => {
  const harmony = getHarmony(color);

  const groups = [
    { label: COPY.harmony.complementary, colors: [harmony.complementary] },
    { label: COPY.harmony.analogous, colors: harmony.analogous },
    { label: COPY.harmony.triadic, colors: harmony.triadic },
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
          <div className="flex flex-wrap justify-end gap-2">
            {group.colors.map((harmonyColor) => (
              <ColorSwatch
                key={harmonyColor}
                color={harmonyColor}
                label={COPY.harmony.select(harmonyColor.toUpperCase())}
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
