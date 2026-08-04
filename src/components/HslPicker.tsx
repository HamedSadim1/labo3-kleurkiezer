import React, { useRef } from "react";
import { hexToHsl, hslToHex, type HexColor } from "../utils/colorUtils";
import useLocalStorage, { serializeRaw } from "../hooks/useLocalStorage";

interface HslPickerProps {
  color: HexColor;
  onChange: (color: HexColor) => void;
}

const WHEEL_SIZE = 176;
const PLANE_SIZE = 176;
const MARKER_RADIUS_PCT = 44;
const MODE_KEY = "color-studio-hsl-mode";

type HslMode = "sliders" | "plane";

const MODES: { id: HslMode; label: string }[] = [
  { id: "sliders", label: "Sliders" },
  { id: "plane", label: "2D plane" },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

type PointerUpdate = (clientX: number, clientY: number) => void;

/** Shared pointer-drag behavior for the hue wheel and the 2D plane. */
const handlePointerDown = (
  event: React.PointerEvent<HTMLDivElement>,
  update: PointerUpdate,
) => {
  event.currentTarget.setPointerCapture(event.pointerId);
  update(event.clientX, event.clientY);
};

const handlePointerMove = (
  event: React.PointerEvent<HTMLDivElement>,
  update: PointerUpdate,
) => {
  if (event.buttons !== 1) return;
  update(event.clientX, event.clientY);
};

const HslPicker: React.FC<HslPickerProps> = ({ color, onChange }) => {
  const [mode, setMode] = useLocalStorage<HslMode>(MODE_KEY, "sliders", {
    deserialize: (raw) =>
      raw === "sliders" || raw === "plane" ? raw : "sliders",
    serialize: serializeRaw,
  });
  const hsl = hexToHsl(color) ?? { h: 0, s: 100, l: 50 };
  const hue = hsl.h % 360;
  const wheelRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);

  /* ----- Hue wheel ----- */

  const updateHueFromPoint = (clientX: number, clientY: number) => {
    const el = wheelRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI;
    const nextHue = (angle + 360) % 360;
    onChange(hslToHex(Math.round(nextHue), hsl.s, hsl.l));
  };

  const handleWheelKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 15 : 1;
    let nextHue = hue;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      nextHue += step;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      nextHue -= step;
    } else if (event.key === "Home") {
      nextHue = 0;
    } else if (event.key === "End") {
      nextHue = 359;
    } else {
      return;
    }
    event.preventDefault();
    onChange(hslToHex((nextHue + 360) % 360, hsl.s, hsl.l));
  };

  /* ----- 2D saturation / lightness plane ----- */

  const updatePoint = (clientX: number, clientY: number) => {
    const el = planeRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const xPct = ((clientX - rect.left) / rect.width) * 100;
    const yPct = ((clientY - rect.top) / rect.height) * 100;
    const s = Math.round(clamp(xPct, 0, 100));
    const l = Math.round(clamp(100 - yPct, 0, 100));
    onChange(hslToHex(hue, s, l));
  };

  const handlePlaneKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 1;
    let s = hsl.s;
    let l = hsl.l;
    if (event.key === "ArrowRight") s = clamp(s + step, 0, 100);
    else if (event.key === "ArrowLeft") s = clamp(s - step, 0, 100);
    else if (event.key === "ArrowUp") l = clamp(l + step, 0, 100);
    else if (event.key === "ArrowDown") l = clamp(l - step, 0, 100);
    else if (event.key === "Home") {
      s = 0;
      l = 0;
    } else if (event.key === "End") {
      s = 100;
      l = 100;
    } else {
      return;
    }
    event.preventDefault();
    onChange(hslToHex(hue, s, l));
  };

  /* ----- Render ----- */

  const angleRad = (hue * Math.PI) / 180;
  const markerLeft = 50 + Math.cos(angleRad) * MARKER_RADIUS_PCT;
  const markerTop = 50 + Math.sin(angleRad) * MARKER_RADIUS_PCT;

  return (
    <div className="space-y-4">
      {/* Mode switcher */}
      <div className="flex justify-center">
        <div className="flex rounded-full border border-white/10 bg-white/5 p-1">
          {MODES.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setMode(option.id)}
              aria-pressed={mode === option.id}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                mode === option.id
                  ? "bg-white/15 text-white shadow"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-center">
        {/* Hue wheel */}
        <div
          ref={wheelRef}
          role="slider"
          aria-label="Hue"
          aria-valuemin={0}
          aria-valuemax={359}
          aria-valuenow={hue}
          tabIndex={0}
          onPointerDown={(event) =>
            handlePointerDown(event, updateHueFromPoint)
          }
          onPointerMove={(event) =>
            handlePointerMove(event, updateHueFromPoint)
          }
          onKeyDown={handleWheelKeyDown}
          className="relative cursor-crosshair touch-none rounded-full border border-white/20 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          style={{
            width: WHEEL_SIZE,
            height: WHEEL_SIZE,
            background:
              "conic-gradient(from 90deg, red, yellow, lime, cyan, blue, magenta, red)",
          }}
        >
          {/* Hue marker */}
          <div
            className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg"
            style={{
              left: `${markerLeft}%`,
              top: `${markerTop}%`,
              backgroundColor: hslToHex(hue, 100, 50),
            }}
          />
          {/* Current color center dot */}
          <div
            className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/80 shadow-xl"
            style={{ backgroundColor: color }}
          />
        </div>

        {mode === "sliders" ? (
          /* Saturation + lightness sliders */
          <div className="flex w-44 flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 shrink-0 text-xs font-bold text-white/50">
                S
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={hsl.s}
                onChange={(event) =>
                  onChange(hslToHex(hue, Number(event.target.value), hsl.l))
                }
                className="flex-1"
                style={{
                  background: `linear-gradient(to right, hsl(${hue}, 0%, 50%), hsl(${hue}, 100%, 50%))`,
                }}
                aria-label="Saturation"
              />
              <span className="w-8 shrink-0 text-right font-mono text-xs text-white/70">
                {hsl.s}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 shrink-0 text-xs font-bold text-white/50">
                L
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={hsl.l}
                onChange={(event) =>
                  onChange(hslToHex(hue, hsl.s, Number(event.target.value)))
                }
                className="flex-1"
                style={{
                  background: `linear-gradient(to right, hsl(${hue}, 100%, 0%), hsl(${hue}, 100%, 50%), hsl(${hue}, 100%, 100%))`,
                }}
                aria-label="Lightness"
              />
              <span className="w-8 shrink-0 text-right font-mono text-xs text-white/70">
                {hsl.l}
              </span>
            </div>
          </div>
        ) : (
          /* 2D saturation / lightness plane */
          <div
            ref={planeRef}
            role="slider"
            aria-label="Saturation and lightness"
            aria-valuetext={`Saturation ${hsl.s}%, lightness ${hsl.l}%`}
            tabIndex={0}
            onPointerDown={(event) => handlePointerDown(event, updatePoint)}
            onPointerMove={(event) => handlePointerMove(event, updatePoint)}
            onKeyDown={handlePlaneKeyDown}
            className="relative cursor-crosshair touch-none rounded-2xl border border-white/20 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            style={{
              width: PLANE_SIZE,
              height: PLANE_SIZE,
              backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0)), linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0)), linear-gradient(to right, hsl(${hue}, 0%, 50%), hsl(${hue}, 100%, 50%))`,
            }}
          >
            {/* Saturation / lightness marker (inset so it stays inside the rounded corners) */}
            <div
              className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.6)]"
              style={{
                left: `${clamp(hsl.s, 5, 95)}%`,
                top: `${clamp(100 - hsl.l, 5, 95)}%`,
                backgroundColor: color,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HslPicker;
