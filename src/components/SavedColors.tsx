import React from "react";
import { colorsEqual, type HexColor } from "../utils/colorUtils";
import {
  REMOVE_BADGE_BG,
  REMOVE_BADGE_SIZE,
  SAVED_GRID_COLS,
} from "../constants";
import useTimedReset from "../hooks/useTimedReset";
import { BookmarkIcon } from "./icons";
import SectionHeader, { ClearButton } from "./SectionHeader";
import ColorSwatch from "./ColorSwatch";

interface SavedColorsProps {
  color: HexColor;
  saved: HexColor[];
  onSave: () => void;
  onSelect: (color: HexColor) => void;
  onRemove: (color: HexColor) => void;
  onClear: () => void;
}

const SavedColors: React.FC<SavedColorsProps> = ({
  color,
  saved,
  onSave,
  onSelect,
  onRemove,
  onClear,
}) => {
  const [justSaved, setJustSaved] = useTimedReset(false);
  const isSaved = saved.some((item) => colorsEqual(item, color));

  const handleSave = () => {
    onSave();
    setJustSaved(true);
  };

  return (
    <div>
      <SectionHeader
        title="Saved"
        action={
          <div className="flex items-center gap-1.5">
            {saved.length > 1 && <ClearButton onClick={onClear} />}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaved}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition-all ${
                isSaved || justSaved
                  ? "bg-emerald-400/20 text-emerald-300"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              } disabled:cursor-default`}
            >
              <BookmarkIcon filled={isSaved || justSaved} />
              {isSaved || justSaved ? "Saved" : "Save"}
            </button>
          </div>
        }
      />

      {saved.length === 0 ? (
        <p className="text-[11px] leading-relaxed text-white/40">
          Save your favorite colors to keep them at hand.
        </p>
      ) : (
        <div className={`grid ${SAVED_GRID_COLS} gap-2.5`}>
          {saved.map((savedColor) => {
            const selected = colorsEqual(savedColor, color);
            return (
              <div key={savedColor} className="group relative">
                <ColorSwatch
                  color={savedColor}
                  label={`Select saved color ${savedColor.toUpperCase()}`}
                  selected={selected}
                  onClick={() => onSelect(savedColor)}
                  className="aspect-square w-full rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => onRemove(savedColor)}
                  aria-label={`Remove saved color ${savedColor.toUpperCase()}`}
                  className={`absolute -right-1.5 -top-1.5 flex ${REMOVE_BADGE_SIZE} items-center justify-center rounded-full border border-white/30 text-[10px] leading-none text-white/80 opacity-60 shadow transition-opacity hover:opacity-100 focus-visible:opacity-100 group-hover:opacity-100`}
                  style={{ backgroundColor: REMOVE_BADGE_BG }}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedColors;
