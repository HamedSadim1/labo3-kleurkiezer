import React from "react";

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
    <div className="flex rounded-full border border-white/10 bg-white/5 p-1">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          aria-pressed={value === option.id}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
            value === option.id
              ? "bg-white/15 text-white shadow"
              : "text-white/50 hover:text-white/80"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

export default SegmentedControl;
