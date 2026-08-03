import React, { useState } from "react";
import {
  hexToRgb,
  rgbToHex,
  isValidHexColor,
  normalizeHex,
} from "../utils/colorUtils";

interface ColorInputProps {
  color: string;
  onChange: (color: string) => void;
  onCommit: (color: string) => void;
}

const CHANNELS = [
  { key: "r", label: "R" },
  { key: "g", label: "G" },
  { key: "b", label: "B" },
] as const;

type ChannelKey = (typeof CHANNELS)[number]["key"];

const ColorInput: React.FC<ColorInputProps> = ({
  color,
  onChange,
  onCommit,
}) => {
  // Draft pattern: while editing, show the draft; otherwise derive from the prop.
  const [hexText, setHexText] = useState(color);
  const [isEditing, setIsEditing] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const rgb = hexToRgb(color) ?? { r: 0, g: 0, b: 0 };

  const displayedHex = (isEditing ? hexText : color).replace(/^#/, "");

  const applyHex = (raw: string) => {
    const candidate = normalizeHex(raw);
    if (isValidHexColor(candidate)) {
      onCommit(candidate);
      setInvalid(false);
    } else {
      setInvalid(true);
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
    setHexText(color);
  };

  const handleBlur = () => {
    const candidate = normalizeHex(hexText);
    if (isValidHexColor(candidate)) {
      onCommit(candidate);
    }
    setIsEditing(false);
    setInvalid(false);
  };

  const handleHexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHexText(event.target.value);
    setInvalid(false);
  };

  const handleHexSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    applyHex(hexText);
    setIsEditing(false);
  };

  const handleSlider = (channel: ChannelKey, value: number) => {
    const next = { ...rgb, [channel]: value };
    onChange(rgbToHex(next.r, next.g, next.b));
  };

  const sliderTrack = (channel: ChannelKey): string => {
    const [r, g, b] = [
      channel === "r" ? 0 : rgb.r,
      channel === "g" ? 0 : rgb.g,
      channel === "b" ? 0 : rgb.b,
    ];
    const [rMax, gMax, bMax] = [
      channel === "r" ? 255 : rgb.r,
      channel === "g" ? 255 : rgb.g,
      channel === "b" ? 255 : rgb.b,
    ];
    return `linear-gradient(to right, rgb(${r}, ${g}, ${b}), rgb(${rMax}, ${gMax}, ${bMax}))`;
  };

  return (
    <div className="space-y-4">
      {/* Native picker + hex field */}
      <div className="flex items-center gap-3">
        <label
          className="relative block h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-white/20 shadow-lg transition-transform hover:scale-105"
          title="Open system color picker"
        >
          <input
            type="color"
            value={color}
            onChange={(event) => onChange(event.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label="Open system color picker"
          />
          <span
            className="absolute inset-0"
            style={{
              backgroundColor: color,
              backgroundImage:
                "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), rgba(255,255,255,0) 60%)",
            }}
          />
        </label>

        <form onSubmit={handleHexSubmit} className="flex-1">
          <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-3 focus-within:border-white/40">
            <span className="text-white/40">#</span>
            <label htmlFor="hex-value" className="sr-only">
              Hex color value
            </label>
            <input
              id="hex-value"
              type="text"
              value={displayedHex}
              onChange={handleHexChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              maxLength={6}
              spellCheck={false}
              className={`w-full bg-transparent py-2.5 font-mono text-sm tracking-wider outline-none placeholder:text-white/25 ${
                invalid ? "text-rose-300" : "text-white"
              }`}
              placeholder="667EEA"
            />
          </div>
        </form>
      </div>

      {invalid && (
        <p className="text-xs text-rose-300">
          Invalid hex code — use 3 or 6 hex digits (e.g. #667EEA).
        </p>
      )}

      {/* RGB sliders */}
      <div className="space-y-3">
        {CHANNELS.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-3">
            <span className="w-4 text-xs font-bold text-white/50">{label}</span>
            <input
              type="range"
              min={0}
              max={255}
              value={rgb[key]}
              onChange={(event) =>
                handleSlider(key, Number(event.target.value))
              }
              className="flex-1"
              style={{ background: sliderTrack(key) }}
              aria-label={`${label} channel value`}
            />
            <input
              type="number"
              min={0}
              max={255}
              value={rgb[key]}
              onChange={(event) => {
                const value = event.target.value;
                if (value === "") return;
                const num = Number(value);
                if (!Number.isNaN(num)) handleSlider(key, num);
              }}
              className="w-12 rounded-lg border border-white/10 bg-white/[0.06] px-1.5 py-1 text-center font-mono text-xs text-white outline-none focus:border-white/40"
              aria-label={`${label} channel number value`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorInput;
