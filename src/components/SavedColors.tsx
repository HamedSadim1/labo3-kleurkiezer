import React from "react";
import { colorsEqual } from "../utils/colorUtils";
import {
  CONTROL_FOCUS_RING,
  REMOVE_BADGE_BG,
  REMOVE_BADGE_SIZE,
  SAVED_GRID_COLS,
  SURFACE_HOVER,
  SURFACE_RAISED,
  TEXT_MUTED,
  type HexColor,
} from "../constants";
import { COPY } from "../copy";
import useTimedReset from "../hooks/useTimedReset";
import ColorSwatch from "./ColorSwatch";
import IconButton from "./IconButton";
import { BookmarkIcon } from "./icons";
import SectionHeader, { ClearButton } from "./SectionHeader";

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
        title={COPY.sections.saved}
        action={
          <div className="flex items-center gap-1.5">
            {saved.length > 1 && <ClearButton onClick={onClear} />}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaved}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition-all ${CONTROL_FOCUS_RING} ${
                isSaved || justSaved
                  ? "bg-emerald-400/20 text-emerald-300"
                  : `${SURFACE_RAISED} text-white/80 ${SURFACE_HOVER}`
              } disabled:cursor-default`}
            >
              <BookmarkIcon filled={isSaved || justSaved} />
              {isSaved || justSaved ? COPY.saved.saved : COPY.saved.save}
            </button>
          </div>
        }
      />

      {saved.length === 0 ? (
        <p className={`text-[11px] leading-relaxed ${TEXT_MUTED}`}>
          {COPY.saved.empty}
        </p>
      ) : (
        <div className={`grid ${SAVED_GRID_COLS} gap-2.5`}>
          {saved.map((savedColor) => {
            const selected = colorsEqual(savedColor, color);
            return (
              <div key={savedColor} className="group relative">
                <ColorSwatch
                  color={savedColor}
                  label={COPY.saved.select(savedColor.toUpperCase())}
                  selected={selected}
                  onClick={() => onSelect(savedColor)}
                  className="aspect-square w-full rounded-lg"
                />
                <IconButton
                  label={COPY.saved.remove(savedColor.toUpperCase())}
                  onClick={() => onRemove(savedColor)}
                  className={`absolute -right-1.5 -top-1.5 ${REMOVE_BADGE_SIZE} rounded-full border border-white/30 text-[10px] leading-none text-white/80 opacity-60 shadow hover:opacity-100 focus-visible:opacity-100 group-hover:opacity-100`}
                  style={{ backgroundColor: REMOVE_BADGE_BG }}
                >
                  ×
                </IconButton>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedColors;
