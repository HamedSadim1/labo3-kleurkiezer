import React from "react";
import {
  CONTROL_FOCUS_RING,
  SURFACE_CARD,
  SURFACE_SELECTED,
} from "@/constants";
import { cn } from "@/utils/cn";

interface SegmentedOption<T extends string> {
  id: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  value: T;
  options: readonly SegmentedOption<T>[];
  onChange: (value: T) => void;
}

/** Generic pill-shaped segmented control (e.g. the HSL picker mode switcher). */
const SegmentedControl = <T extends string>({
  value,
  options,
  onChange,
}: SegmentedControlProps<T>): React.JSX.Element => (
  <div className="flex justify-center">
    <div
      className={cn(
        "flex rounded-full border border-white/10 p-1",
        SURFACE_CARD,
      )}
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          aria-pressed={value === option.id}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
            CONTROL_FOCUS_RING,
            value === option.id
              ? [SURFACE_SELECTED, "text-white shadow"]
              : "text-white/50 hover:text-white/80",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

export default SegmentedControl;
