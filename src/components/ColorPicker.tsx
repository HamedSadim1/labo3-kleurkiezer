import React from "react";
import ColorInput from "./ColorInput";
import ColorSelect from "./ColorSelect";
import HslPicker from "./HslPicker";
import ColorDisplay from "./ColorDisplay";
import ColorValues from "./ColorValues";
import ColorHarmony from "./ColorHarmony";
import ContrastChecker from "./ContrastChecker";
import SavedColors from "./SavedColors";
import ColorSwatch from "./ColorSwatch";
import SectionHeader, { ClearButton } from "./SectionHeader";
import { DEFAULT_COLOR } from "../constants/colors";
import useLocalStorage from "../hooks/useLocalStorage";
import {
  colorsEqual,
  isValidHexColor,
  type HexColor,
} from "../utils/colorUtils";

interface ColorPickerProps {
  color: HexColor;
  onChange: (color: HexColor) => void;
}

const RECENTS_KEY = "color-studio-recents";
const MAX_RECENTS = 6;
const SAVED_KEY = "color-studio-saved";
const MAX_SAVED = 8;

/** Parse a stored JSON array into valid hex colors, or null when it is not an array. */
const parseHexArray = (raw: string): HexColor[] | null => {
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) return null;
  return parsed.filter(
    (item): item is HexColor =>
      typeof item === "string" && isValidHexColor(item),
  );
};

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [recentColors, setRecentColors] = useLocalStorage<HexColor[]>(
    RECENTS_KEY,
    [DEFAULT_COLOR],
    {
      deserialize: (raw) => {
        const valid = parseHexArray(raw);
        return valid?.length ? valid : [DEFAULT_COLOR];
      },
    },
  );

  const [savedColors, setSavedColors] = useLocalStorage<HexColor[]>(
    SAVED_KEY,
    [],
    {
      deserialize: (raw) => parseHexArray(raw) ?? [],
    },
  );

  /**
   * Sliders and the native picker fire continuously, so they call
   * handleChange with commit=false to keep the recent list clean.
   */
  const handleChange = (nextColor: HexColor, commit = true) => {
    onChange(nextColor);
    if (commit) {
      setRecentColors((prev) =>
        [
          nextColor,
          ...prev.filter((recent) => !colorsEqual(recent, nextColor)),
        ].slice(0, MAX_RECENTS),
      );
    }
  };

  const resetRecents = () => setRecentColors([color]);

  const saveColor = () => {
    setSavedColors((prev) =>
      prev.some((item) => colorsEqual(item, color))
        ? prev
        : [color, ...prev].slice(0, MAX_SAVED),
    );
  };

  return (
    <div className="glass w-full max-w-4xl animate-fade-up">
      <div className="grid gap-8 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* Preview + values */}
        <div className="flex flex-col items-center gap-6">
          <ColorDisplay color={color} />
          <ColorValues color={color} />
        </div>

        {/* Inputs + palette */}
        <div className="flex flex-col gap-6">
          <section>
            <SectionHeader title="Pick a color" />
            <ColorInput
              color={color}
              onChange={(next) => handleChange(next, false)}
              onCommit={(next) => handleChange(next, true)}
            />
          </section>
          <section>
            <SectionHeader title="HSL wheel" />
            <HslPicker
              color={color}
              onChange={(next) => handleChange(next, false)}
            />
          </section>
          <section>
            <SectionHeader title="Palette" />
            <ColorSelect
              color={color}
              onChange={(next) => handleChange(next, true)}
            />
          </section>
        </div>
      </div>

      <div className="mt-8 grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-2 lg:grid-cols-4">
        <section>
          <SectionHeader title="Harmonies" />
          <ColorHarmony
            color={color}
            onChange={(next) => handleChange(next, true)}
          />
        </section>
        <section>
          <SectionHeader title="Contrast" />
          <ContrastChecker color={color} />
        </section>
        <section>
          <SectionHeader
            title="Recent"
            action={
              recentColors.length > 1 ? (
                <ClearButton onClick={resetRecents} />
              ) : undefined
            }
          />
          <div className="flex flex-wrap gap-2.5">
            {recentColors.map((recent) => (
              <ColorSwatch
                key={recent}
                color={recent}
                label={`Select recent color ${recent.toUpperCase()}`}
                selected={colorsEqual(recent, color)}
                onClick={() => handleChange(recent, true)}
                className={`h-9 w-9 rounded-full ${
                  colorsEqual(recent, color) ? "ring-2 ring-white/30" : ""
                }`}
              />
            ))}
          </div>
        </section>
        <section>
          <SavedColors
            color={color}
            saved={savedColors}
            onSave={saveColor}
            onSelect={(next) => handleChange(next, true)}
            onRemove={(savedColor) =>
              setSavedColors((prev) =>
                prev.filter((item) => !colorsEqual(item, savedColor)),
              )
            }
            onClear={() => setSavedColors([])}
          />
        </section>
      </div>
    </div>
  );
};

export default ColorPicker;
