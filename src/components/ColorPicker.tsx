import React from "react";
import ColorInput from "@/components/ColorInput";
import ColorSelect from "@/components/ColorSelect";
import HslPicker from "@/components/HslPicker";
import ColorDisplay from "@/components/ColorDisplay";
import ColorValues from "@/components/ColorValues";
import ColorHarmony from "@/components/ColorHarmony";
import ContrastChecker from "@/components/ContrastChecker";
import SavedColors from "@/components/SavedColors";
import ColorSwatch from "@/components/ColorSwatch";
import Panel from "@/components/Panel";
import { ClearButton } from "@/components/SectionHeader";
import {
  DEFAULT_COLOR,
  MAX_RECENTS,
  MAX_SAVED,
  RECENT_SWATCH_SIZE,
  RECENTS_KEY,
  SAVED_KEY,
  type HexColor,
} from "@/constants";
import { COPY } from "@/copy";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  colorsEqual,
  parseHexArray,
  prependUnique,
  withoutColor,
} from "@/utils/colorUtils";
import { cn } from "@/utils/cn";

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
          <Panel title={COPY.sections.pickColor}>
            <ColorInput
              color={color}
              onChange={(next) => handleChange(next, false)}
              onCommit={(next) => handleChange(next, true)}
            />
          </Panel>
          <Panel title={COPY.sections.hslWheel}>
            <HslPicker
              color={color}
              onChange={(next) => handleChange(next, false)}
            />
          </Panel>
          <Panel title={COPY.sections.palette}>
            <ColorSelect
              color={color}
              onChange={(next) => handleChange(next, true)}
            />
          </Panel>
        </div>
      </div>

      <div className="mt-8 grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-2 lg:grid-cols-4">
        <Panel title={COPY.sections.harmonies}>
          <ColorHarmony
            color={color}
            onChange={(next) => handleChange(next, true)}
          />
        </Panel>
        <Panel title={COPY.sections.contrast}>
          <ContrastChecker color={color} />
        </Panel>
        <Panel
          title={COPY.sections.recent}
          action={
            recentColors.length > 1 ? (
              <ClearButton onClick={resetRecents} />
            ) : undefined
          }
        >
          <div className="flex flex-wrap gap-2.5">
            {recentColors.map((recent) => (
              <ColorSwatch
                key={recent}
                color={recent}
                label={COPY.recent.select(recent.toUpperCase())}
                selected={colorsEqual(recent, color)}
                onClick={() => handleChange(recent, true)}
                className={cn(
                  RECENT_SWATCH_SIZE,
                  colorsEqual(recent, color) && "ring-2 ring-white/30",
                )}
              />
            ))}
          </div>
        </Panel>
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
      </div>
    </div>
  );
};

export default ColorPicker;
