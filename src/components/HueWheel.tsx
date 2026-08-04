import React, { useRef } from "react";
import { hslToHex } from "../utils/colorUtils";
import {
  CENTER_DOT_SIZE,
  CONTROL_FOCUS_RING,
  CONTROL_SHADOW,
  DEG_TO_RAD,
  HUE_KEY_STEP_FAST,
  HUE_MAX,
  KEY_STEP,
  LIGHTNESS_MID,
  MARKER_CENTER_PCT,
  MARKER_RADIUS_PCT,
  PERCENT_MAX,
  PICKER_MARKER_CLASS,
  RAD_TO_DEG,
  WHEEL_GRADIENT,
  WHEEL_SIZE,
  type HexColor,
} from "../constants";
import { handlePointerDown, handlePointerMove } from "../utils/pointerUtils";
import { getArrowKeyIntent } from "../utils/keyboardUtils";
import { COPY } from "../copy";

interface HueWheelProps {
  hue: number;
  color: HexColor;
  onChange: (hue: number) => void;
}

/** Interactive hue wheel with a draggable marker. */
const HueWheel: React.FC<HueWheelProps> = ({ hue, color, onChange }) => {
  const wheelRef = useRef<HTMLDivElement>(null);

  const updateHueFromPoint = (clientX: number, clientY: number) => {
    const el = wheelRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = Math.atan2(clientY - cy, clientX - cx) * RAD_TO_DEG;
    onChange((angle + HUE_MAX) % HUE_MAX);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const intent = getArrowKeyIntent(event, KEY_STEP, HUE_KEY_STEP_FAST);
    if (!intent) return;
    event.preventDefault();
    const nextHue =
      intent.jump === "min"
        ? 0
        : intent.jump === "max"
          ? HUE_MAX - 1
          : hue + intent.horizontalDelta + intent.verticalDelta;
    onChange((nextHue + HUE_MAX) % HUE_MAX);
  };

  const angleRad = hue * DEG_TO_RAD;
  const markerLeft = MARKER_CENTER_PCT + Math.cos(angleRad) * MARKER_RADIUS_PCT;
  const markerTop = MARKER_CENTER_PCT + Math.sin(angleRad) * MARKER_RADIUS_PCT;

  return (
    <div
      ref={wheelRef}
      role="slider"
      aria-label={COPY.hsl.hue}
      aria-valuemin={0}
      aria-valuemax={HUE_MAX - 1}
      aria-valuenow={hue}
      tabIndex={0}
      onPointerDown={(event) => handlePointerDown(event, updateHueFromPoint)}
      onPointerMove={(event) => handlePointerMove(event, updateHueFromPoint)}
      onKeyDown={handleKeyDown}
      className={`relative cursor-crosshair touch-none rounded-full border border-white/20 ${CONTROL_SHADOW} outline-none ${CONTROL_FOCUS_RING}`}
      style={{
        width: WHEEL_SIZE,
        height: WHEEL_SIZE,
        background: WHEEL_GRADIENT,
      }}
    >
      {/* Hue marker */}
      <div
        className={`absolute ${PICKER_MARKER_CLASS} shadow-lg`}
        style={{
          left: `${markerLeft}%`,
          top: `${markerTop}%`,
          backgroundColor: hslToHex(hue, PERCENT_MAX, LIGHTNESS_MID),
        }}
      />
      {/* Current color center dot */}
      <div
        className={`absolute left-1/2 top-1/2 ${CENTER_DOT_SIZE} -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/80 shadow-xl`}
        style={{ backgroundColor: color }}
      />
    </div>
  );
};

export default HueWheel;
