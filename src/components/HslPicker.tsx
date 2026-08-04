import React from "react";
import {
  hexToHsl,
  hslToHex,
  lightnessGradient,
  saturationGradient,
} from "../utils/colorUtils";
import {
  HUE_MAX,
  LIGHTNESS_MID,
  MODE_KEY,
  MODES,
  PERCENT_MAX,
  SLIDER_COLUMN_WIDTH,
  isHslMode,
  type HslMode,
  type HexColor,
} from "../constants";
import { COPY } from "../copy";
import useLocalStorage from "../hooks/useLocalStorage";
import { serializeRaw } from "../utils/storageUtils";
import HueWheel from "./HueWheel";
import HslSliderRow from "./HslSliderRow";
import SaturationLightnessPlane from "./SaturationLightnessPlane";
import SegmentedControl from "./SegmentedControl";

interface HslPickerProps {
  color: HexColor;
  onChange: (color: HexColor) => void;
}

const HslPicker: React.FC<HslPickerProps> = ({ color, onChange }) => {
  const [mode, setMode] = useLocalStorage<HslMode>(MODE_KEY, MODES[0].id, {
    deserialize: (raw) => (isHslMode(raw) ? raw : MODES[0].id),
    serialize: serializeRaw,
  });
  const hsl = hexToHsl(color) ?? {
    h: 0,
    s: PERCENT_MAX,
    l: LIGHTNESS_MID,
  };
  const hue = hsl.h % HUE_MAX;

  const updateHue = (nextHue: number) =>
    onChange(hslToHex(Math.round(nextHue), hsl.s, hsl.l));

  const updatePoint = (s: number, l: number) => onChange(hslToHex(hue, s, l));

  return (
    <div className="space-y-4">
      <SegmentedControl value={mode} options={MODES} onChange={setMode} />

      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-center">
        <HueWheel hue={hue} color={color} onChange={updateHue} />

        {mode === "sliders" ? (
          /* Saturation + lightness sliders */
          <div className={`flex ${SLIDER_COLUMN_WIDTH} flex-col gap-4`}>
            <HslSliderRow
              label={COPY.hsl.labelS}
              value={hsl.s}
              gradient={saturationGradient(hue)}
              ariaLabel={COPY.hsl.saturation}
              onChange={(value) => updatePoint(value, hsl.l)}
            />
            <HslSliderRow
              label={COPY.hsl.labelL}
              value={hsl.l}
              gradient={lightnessGradient(hue)}
              ariaLabel={COPY.hsl.lightness}
              onChange={(value) => updatePoint(hsl.s, value)}
            />
          </div>
        ) : (
          <SaturationLightnessPlane
            hue={hue}
            saturation={hsl.s}
            lightness={hsl.l}
            color={color}
            onChange={updatePoint}
          />
        )}
      </div>
    </div>
  );
};

export default HslPicker;
