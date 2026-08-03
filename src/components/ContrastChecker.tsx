import React from "react";
import { getContrastRatio, getTextColor } from "../utils/colorUtils";

interface ContrastCheckerProps {
  color: string;
}

const LIGHT_TEXT = "#FFFFFF";
const DARK_TEXT = "#0F172A";

interface Rating {
  badge: string;
  className: string;
}

const getRating = (ratio: number): Rating => {
  if (ratio >= 7) return { badge: "AAA", className: "text-emerald-300" };
  if (ratio >= 4.5) return { badge: "AA", className: "text-emerald-300" };
  if (ratio >= 3) return { badge: "AA large", className: "text-amber-300" };
  return { badge: "Fail", className: "text-rose-300" };
};

const ContrastChecker: React.FC<ContrastCheckerProps> = ({ color }) => {
  const lightRatio = getContrastRatio(color, LIGHT_TEXT);
  const darkRatio = getContrastRatio(color, DARK_TEXT);
  const lightRating = getRating(lightRatio);
  const darkRating = getRating(darkRatio);
  const recommended = getTextColor(color);

  const samples = [
    { key: "light", text: LIGHT_TEXT, ratio: lightRatio, rating: lightRating },
    { key: "dark", text: DARK_TEXT, ratio: darkRatio, rating: darkRating },
  ];

  return (
    <div className="space-y-2.5">
      {samples.map((sample) => (
        <div
          key={sample.key}
          className="flex items-center gap-3 rounded-xl border border-white/10 p-2.5"
          style={{ backgroundColor: color }}
        >
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-base font-bold"
            style={{ backgroundColor: sample.text, color }}
            aria-hidden="true"
          >
            Aa
          </span>
          <span className="min-w-0 flex-1">
            <span
              className="block truncate text-xs font-semibold"
              style={{ color: sample.text }}
            >
              {sample.key === "light" ? "White text" : "Dark text"}
            </span>
            <span
              className="block text-[10px] opacity-80"
              style={{ color: sample.text }}
            >
              {sample.ratio.toFixed(2)}:1
            </span>
          </span>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${sample.rating.className} ${
              sample.rating.badge === "Fail" ? "bg-rose-400/10" : "bg-white/10"
            }`}
          >
            {sample.rating.badge}
          </span>
        </div>
      ))}

      <p className="text-[11px] text-white/45">
        Recommended text:{" "}
        <span className="font-mono text-white/70">
          {recommended === LIGHT_TEXT ? "white" : "dark"}
        </span>
      </p>
    </div>
  );
};

export default ContrastChecker;
