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
import {
  DEFAULT_COLOR,
  MAX_RECENTS,
  MAX_SAVED,
  RECENT_SWATCH_SIZE,
  RECENTS_KEY,
  SAVED_KEY,
} from "../constants";
import { COPY } from "../copy";
import useLocalStorage from "../hooks/useLocalStorage";
import {
  colorsEqual,
  parseHexArray,
  prependUnique,
  withoutColor,
  type HexColor,
} from "../utils/colorUtils";

interface ColorPickerProps {
  color: HexColor;
  onChange: (color: HexColor) => void;
}

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
      setRecentColors((prev) => prependUnique(prev, nextColor, MAX_RECENTS));
    }
  };

  const resetRecents = () => setRecentColors([color]);

  const saveColor = () => {
    setSavedColors((prev) => prependUnique(prev, color, MAX_SAVED));
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
            <SectionHeader title={COPY.sections.pickColor} />
            <ColorInput
              color={color}
              onChange={(next) => handleChange(next, false)}
              onCommit={(next) => handleChange(next, true)}
            />
          </section>
          <section>
            <SectionHeader title={COPY.sections.hslWheel} />
            <HslPicker
              color={color}
              onChange={(next) => handleChange(next, false)}
            />
          </section>
          <section>
            <SectionHeader title={COPY.sections.palette} />
            <ColorSelect
              color={color}
              onChange={(next) => handleChange(next, true)}
            />
          </section>
        </div>
      </div>

      <div className="mt-8 grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-2 lg:grid-cols-4">
        <section>
          <SectionHeader title={COPY.sections.harmonies} />
          <ColorHarmony
            color={color}
            onChange={(next) => handleChange(next, true)}
          />
        </section>
        <section>
          <SectionHeader title={COPY.sections.contrast} />
          <ContrastChecker color={color} />
        </section>
        <section>
          <SectionHeader
            title={COPY.sections.recent}
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
                label={COPY.recent.select(recent.toUpperCase())}
                selected={colorsEqual(recent, color)}
                onClick={() => handleChange(recent, true)}
                className={`${RECENT_SWATCH_SIZE} ${
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
              setSavedColors((prev) => withoutColor(prev, savedColor))
            }
            onClear={() => setSavedColors([])}
          />
        </section>
      </div>
    </div>
  );
};

export default ColorPicker;
