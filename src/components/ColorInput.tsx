import React, { useState } from "react";
import {
  rgbToHex,
  isValidHexColor,
  normalizeHex,
  glossOverlay,
  rgbSliderGradient,
} from "@/utils/colorUtils";
import {
  CHANNELS,
  CHANNEL_LABEL_WIDTH,
  CHANNEL_NUMBER_WIDTH,
  DEFAULT_COLOR,
  HEX_DIGITS,
  PICKER_SWATCH_SIZE,
  RGB_MAX,
  SURFACE_CARD,
  SWATCH_GLOSS_ALPHA,
  TEXT_MUTED,
  hexToRgb,
  type ChannelKey,
  type HexColor,
} from "@/constants";
import { COPY } from "@/copy";
import { cn } from "@/utils/cn";

interface ColorInputProps {
  color: HexColor;
  onChange: (color: HexColor) => void;
  onCommit: (color: HexColor) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({
  color,
  onChange,
  onCommit,
}) => {
  // Draft pattern: while editing, show the draft; otherwise derive from the prop.
  const [hexText, setHexText] = useState<string>(color);
  const [isEditing, setIsEditing] = useState(false);
  const [invalid, setInvalid] = useState(false);
  // Draft pattern for the RGB number inputs: while focused, the typed text is
  // kept as-is (no clamping to 0–255 while typing); the color updates on commit
  // (blur or Enter) so values like "300" don't snap back to 255 immediately.
  const [channelText, setChannelText] = useState<Record<ChannelKey, string>>({
    r: "",
    g: "",
    b: "",
  });
  const [activeChannel, setActiveChannel] = useState<ChannelKey | null>(null);
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

  const handleChannelFocus = (key: ChannelKey) => {
    setChannelText((prev) => ({ ...prev, [key]: String(rgb[key]) }));
    setActiveChannel(key);
  };

  const commitChannel = (key: ChannelKey) => {
    if (activeChannel !== key) return;
    const value = channelText[key];
    if (value !== "") {
      const num = Number(value);
      if (!Number.isNaN(num)) {
        handleSlider(key, Math.min(RGB_MAX, Math.max(0, Math.round(num))));
      }
    }
    setActiveChannel(null);
  };

  return (
    <div className="space-y-4">
      {/* Native picker + hex field */}
      <div className="flex items-center gap-3">
        <label
          className={cn(
            "relative block shrink-0 cursor-pointer overflow-hidden rounded-xl border border-white/20 shadow-lg transition-transform hover:scale-105 focus-within:ring-2 focus-within:ring-white/70",
            PICKER_SWATCH_SIZE,
          )}
          title={COPY.picker.openSystemPicker}
        >
          <input
            type="color"
            value={color}
            onChange={(event) =>
              // Browsers always emit a valid hex value from <input type="color">.
              onChange(event.target.value as HexColor)
            }
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label={COPY.picker.openSystemPicker}
          />
          <span
            className="absolute inset-0"
            style={{
              backgroundColor: color,
              backgroundImage: glossOverlay(SWATCH_GLOSS_ALPHA),
            }}
          />
        </label>

        <form onSubmit={handleHexSubmit} className="flex-1">
          <div
            className={cn(
              "flex items-center gap-2 rounded-xl border border-white/15 px-3 focus-within:border-white/40",
              SURFACE_CARD,
            )}
          >
            <span className={TEXT_MUTED}>#</span>
            <label htmlFor="hex-value" className="sr-only">
              {COPY.picker.hexValueLabel}
            </label>
            <input
              id="hex-value"
              type="text"
              value={displayedHex}
              onChange={handleHexChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              maxLength={HEX_DIGITS}
              spellCheck={false}
              className={cn(
                "w-full bg-transparent py-2.5 font-mono text-sm tracking-wider outline-none placeholder:text-white/40",
                invalid ? "text-rose-300" : "text-white",
              )}
              placeholder={DEFAULT_COLOR.replace(/^#/, "").toUpperCase()}
            />
          </div>
        </form>
      </div>

      {invalid && (
        <p className="text-xs text-rose-300">{COPY.picker.invalidHex}</p>
      )}

      {/* RGB sliders */}
      <div className="space-y-3">
        {CHANNELS.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-3">
            <span
              className={cn(
                CHANNEL_LABEL_WIDTH,
                "text-xs font-bold text-white/50",
              )}
            >
              {label}
            </span>
            <input
              type="range"
              min={0}
              max={RGB_MAX}
              value={rgb[key]}
              onChange={(event) =>
                handleSlider(key, Number(event.target.value))
              }
              className="flex-1"
              style={{ background: rgbSliderGradient(rgb, key) }}
              aria-label={COPY.picker.channelValue(label)}
            />
            <input
              type="number"
              min={0}
              max={RGB_MAX}
              value={activeChannel === key ? channelText[key] : rgb[key]}
              onFocus={() => handleChannelFocus(key)}
              onChange={(event) =>
                setChannelText((prev) => ({
                  ...prev,
                  [key]: event.target.value,
                }))
              }
              onBlur={() => commitChannel(key)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  event.currentTarget.blur();
                }
              }}
              className={cn(
                CHANNEL_NUMBER_WIDTH,
                "rounded-lg border border-white/10 px-1.5 py-1 text-center font-mono text-xs text-white outline-none focus:border-white/40",
                SURFACE_CARD,
              )}
              aria-label={COPY.picker.channelNumberValue(label)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorInput;
