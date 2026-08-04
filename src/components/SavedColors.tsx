import React, { useState } from "react";

interface SavedColorsProps {
  color: string;
  saved: string[];
  onSave: () => void;
  onSelect: (color: string) => void;
  onRemove: (color: string) => void;
  onClear: () => void;
}

const BookmarkIcon: React.FC<{ filled?: boolean }> = ({ filled }) => (
  <svg
    className="h-3 w-3"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);

const SavedColors: React.FC<SavedColorsProps> = ({
  color,
  saved,
  onSave,
  onSelect,
  onRemove,
  onClear,
}) => {
  const [justSaved, setJustSaved] = useState(false);
  const isSaved = saved.some(
    (item) => item.toLowerCase() === color.toLowerCase(),
  );

  const handleSave = () => {
    onSave();
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 1500);
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
          Saved
        </h2>
        <div className="flex items-center gap-1.5">
          {saved.length > 1 && (
            <button
              type="button"
              onClick={onClear}
              className="text-[11px] font-medium text-white/40 underline-offset-2 transition-colors hover:text-white/80 hover:underline"
            >
              Clear
            </button>
          )}
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
      </div>

      {saved.length === 0 ? (
        <p className="text-[11px] leading-relaxed text-white/40">
          Save your favorite colors to keep them at hand.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2.5">
          {saved.map((savedColor) => {
            const selected = savedColor.toLowerCase() === color.toLowerCase();
            return (
              <div key={savedColor} className="group relative">
                <button
                  type="button"
                  onClick={() => onSelect(savedColor)}
                  title={savedColor.toUpperCase()}
                  aria-label={`Select saved color ${savedColor.toUpperCase()}`}
                  aria-pressed={selected}
                  className={`aspect-square w-full rounded-lg border transition-all duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 ${
                    selected ? "border-white shadow-lg" : "border-white/15"
                  }`}
                  style={{ backgroundColor: savedColor }}
                />
                <button
                  type="button"
                  onClick={() => onRemove(savedColor)}
                  aria-label={`Remove saved color ${savedColor.toUpperCase()}`}
                  className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-white/30 bg-[#1a2035] text-[10px] leading-none text-white/80 opacity-60 shadow transition-opacity hover:opacity-100 focus-visible:opacity-100 group-hover:opacity-100"
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
