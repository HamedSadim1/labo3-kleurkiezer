import React, { useRef } from "react";
import { saturationLightnessPlaneGradient } from "../utils/colorUtils";
import {
  CONTROL_FOCUS_RING,
  CONTROL_SHADOW,
  KEY_STEP,
  MARKER_INSET,
  PERCENT_MAX,
  PICKER_MARKER_CLASS,
  PLANE_KEY_STEP_FAST,
  PLANE_SIZE,
  type HexColor,
} from "../constants";
import { handlePointerDown, handlePointerMove } from "../utils/pointerUtils";
import { getArrowKeyIntent } from "../utils/keyboardUtils";
import { clamp } from "../utils/mathUtils";
import { COPY } from "../copy";

interface SaturationLightnessPlaneProps {
  hue: number;
  saturation: number;
  lightness: number;
  color: HexColor;
  onChange: (saturation: number, lightness: number) => void;
}

/** 2D saturation/lightness plane for the HSL picker. */
const SaturationLightnessPlane: React.FC<SaturationLightnessPlaneProps> = ({
  hue,
  saturation,
  lightness,
  color,
  onChange,
}) => {
  const planeRef = useRef<HTMLDivElement>(null);

  const updatePoint = (clientX: number, clientY: number) => {
    const el = planeRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const xPct = ((clientX - rect.left) / rect.width) * PERCENT_MAX;
    const yPct = ((clientY - rect.top) / rect.height) * PERCENT_MAX;
    const s = Math.round(clamp(xPct, 0, PERCENT_MAX));
    const l = Math.round(clamp(PERCENT_MAX - yPct, 0, PERCENT_MAX));
    onChange(s, l);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const intent = getArrowKeyIntent(event, KEY_STEP, PLANE_KEY_STEP_FAST);
    if (!intent) return;
    event.preventDefault();
    if (intent.jump === "min") {
      onChange(0, 0);
    } else if (intent.jump === "max") {
      onChange(PERCENT_MAX, PERCENT_MAX);
    } else {
      onChange(
        clamp(saturation + intent.horizontalDelta, 0, PERCENT_MAX),
        clamp(lightness + intent.verticalDelta, 0, PERCENT_MAX),
      );
    }
  };

  return (
    <div
      ref={planeRef}
      role="slider"
      aria-label={COPY.hsl.saturationLightness}
      aria-valuetext={COPY.hsl.valueText(saturation, lightness)}
      tabIndex={0}
      onPointerDown={(event) => handlePointerDown(event, updatePoint)}
      onPointerMove={(event) => handlePointerMove(event, updatePoint)}
      onKeyDown={handleKeyDown}
      className={`relative cursor-crosshair touch-none rounded-2xl border border-white/20 ${CONTROL_SHADOW} outline-none ${CONTROL_FOCUS_RING}`}
      style={{
        width: PLANE_SIZE,
        height: PLANE_SIZE,
        backgroundImage: saturationLightnessPlaneGradient(hue),
      }}
    >
      {/* Saturation / lightness marker (inset so it stays inside the rounded corners) */}
      <div
        className={`absolute ${PICKER_MARKER_CLASS} shadow-[0_0_0_1px_rgba(0,0,0,0.6)]`}
        style={{
          left: `${clamp(
            saturation,
            MARKER_INSET,
            PERCENT_MAX - MARKER_INSET,
          )}%`,
          top: `${clamp(
            PERCENT_MAX - lightness,
            MARKER_INSET,
            PERCENT_MAX - MARKER_INSET,
          )}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
};

export default SaturationLightnessPlane;
