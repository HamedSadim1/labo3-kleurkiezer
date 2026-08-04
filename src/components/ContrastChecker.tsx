import React from "react";
import {
  getContrastRatio,
  getTextColor,
  type HexColor,
} from "../utils/colorUtils";
import { getRatingBadge } from "../utils/contrastUtils";
import {
  CONTRAST_DECIMALS,
  CONTRAST_SWATCH_SIZE,
  DARK_TEXT,
  LIGHT_TEXT,
} from "../constants";
import { COPY } from "../copy";

interface ContrastCheckerProps {
  color: HexColor;
}

const ContrastChecker: React.FC<ContrastCheckerProps> = ({ color }) => {
  const lightRatio = getContrastRatio(color, LIGHT_TEXT);
  const darkRatio = getContrastRatio(color, DARK_TEXT);
  const lightRating = getRatingBadge(lightRatio);
  const darkRating = getRatingBadge(darkRatio);
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
            className={`grid ${CONTRAST_SWATCH_SIZE} shrink-0 place-items-center rounded-lg text-base font-bold`}
            style={{ backgroundColor: sample.text, color }}
            aria-hidden="true"
          >
            {COPY.contrast.sampleAa}
          </span>
          <span className="min-w-0 flex-1">
            <span
              className="block truncate text-xs font-semibold"
              style={{ color: sample.text }}
            >
              {sample.key === "light"
                ? COPY.contrast.whiteText
                : COPY.contrast.darkText}
            </span>
            <span
              className="block text-[10px] opacity-80"
              style={{ color: sample.text }}
            >
              {sample.ratio.toFixed(CONTRAST_DECIMALS)}:1
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
        {COPY.contrast.recommended}{" "}
        <span className="font-mono text-white/70">
          {recommended === LIGHT_TEXT
            ? COPY.contrast.white
            : COPY.contrast.dark}
        </span>
      </p>
    </div>
  );
};

export default ContrastChecker;
