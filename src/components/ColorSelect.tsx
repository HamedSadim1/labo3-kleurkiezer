import React from "react";
import { COLOR_OPTIONS } from "../constants/colors";

interface ColorSelectProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorSelect: React.FC<ColorSelectProps> = ({ color, onChange }) => {
  return (
    <select
      onChange={(e) => onChange(e.target.value)}
      value={color}
      className="w-full p-3 rounded-lg border-none bg-white/20 text-white text-base focus:outline-none focus:ring-2 focus:ring-white/50"
    >
      {COLOR_OPTIONS.map((option) => (
        <option key={option.value} value={option.value} className="text-black">
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default ColorSelect;
