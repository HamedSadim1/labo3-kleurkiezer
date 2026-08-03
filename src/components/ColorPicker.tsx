import React, { useEffect, useState } from "react";
import ColorInput from "./ColorInput";
import ColorSelect from "./ColorSelect";
import HslPicker from "./HslPicker";
import ColorDisplay from "./ColorDisplay";
import ColorValues from "./ColorValues";
import ColorHarmony from "./ColorHarmony";
import ContrastChecker from "./ContrastChecker";
import SavedColors from "./SavedColors";
import { DEFAULT_COLOR } from "../constants/colors";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const RECENTS_KEY = "color-studio-recents";
const MAX_RECENTS = 6;
const SAVED_KEY = "color-studio-saved";
const MAX_SAVED = 8;

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
    {children}
  </h2>
);

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [recentColors, setRecentColors] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENTS_KEY);
      const parsed: string[] = saved ? JSON.parse(saved) : [];
      return parsed.length ? parsed : [DEFAULT_COLOR];
    } catch {
      return [DEFAULT_COLOR];
    }
  });

  const [savedColors, setSavedColors] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(SAVED_KEY);
      const parsed: unknown = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === "string")
        : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(recentColors));
  }, [recentColors]);

  useEffect(() => {
    localStorage.setItem(SAVED_KEY, JSON.stringify(savedColors));
  }, [savedColors]);

  /**
   * Sliders and the native picker fire continuously, so they call
   * handleChange with commit=false to keep the recent list clean.
   */
  const handleChange = (nextColor: string, commit = true) => {
    onChange(nextColor);
    if (commit) {
      setRecentColors((prev) =>
        [
          nextColor,
          ...prev.filter(
            (recent) => recent.toLowerCase() !== nextColor.toLowerCase(),
          ),
        ].slice(0, MAX_RECENTS),
      );
    }
  };

  const resetRecents = () => setRecentColors([color]);

  const saveColor = () => {
    setSavedColors((prev) =>
      prev.some((item) => item.toLowerCase() === color.toLowerCase())
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
            <SectionTitle>Pick a color</SectionTitle>
            <ColorInput
              color={color}
              onChange={(next) => handleChange(next, false)}
              onCommit={(next) => handleChange(next, true)}
            />
          </section>
          <section>
            <SectionTitle>HSL wheel</SectionTitle>
            <HslPicker
              color={color}
              onChange={(next) => handleChange(next, false)}
            />
          </section>
          <section>
            <SectionTitle>Palette</SectionTitle>
            <ColorSelect
              color={color}
              onChange={(next) => handleChange(next, true)}
            />
          </section>
        </div>
      </div>

      <div className="mt-8 grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-2 lg:grid-cols-4">
        <section>
          <SectionTitle>Harmonies</SectionTitle>
          <ColorHarmony
            color={color}
            onChange={(next) => handleChange(next, true)}
          />
        </section>
        <section>
          <SectionTitle>Contrast</SectionTitle>
          <ContrastChecker color={color} />
        </section>
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
              Recent
            </h2>
            {recentColors.length > 1 && (
              <button
                type="button"
                onClick={resetRecents}
                className="text-[11px] font-medium text-white/40 underline-offset-2 transition-colors hover:text-white/80 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2.5">
            {recentColors.map((recent) => (
              <button
                key={recent}
                type="button"
                onClick={() => handleChange(recent, true)}
                title={recent.toUpperCase()}
                aria-label={`Select recent color ${recent.toUpperCase()}`}
                className={`h-9 w-9 rounded-full border transition-all duration-200 hover:scale-110 ${
                  recent.toLowerCase() === color.toLowerCase()
                    ? "border-white ring-2 ring-white/30"
                    : "border-white/20"
                }`}
                style={{ backgroundColor: recent }}
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
                prev.filter(
                  (item) => item.toLowerCase() !== savedColor.toLowerCase(),
                ),
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
