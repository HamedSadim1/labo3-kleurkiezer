import React, { useState } from "react";
import { hexToRgb, rgbToHex } from "../utils/colorUtils";

interface ColorInputProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({ color, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const rgb = hexToRgb(color) || { r: 0, g: 0, b: 0 };

  const handleRgbChange = (component: "r" | "g" | "b", value: number) => {
    const newRgb = { ...rgb, [component]: value };
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    onChange(newHex);
  };

  return (
    <div className="w-full">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="w-full h-12 rounded-lg border-2 border-white/30 shadow-lg flex items-center justify-center text-white font-semibold hover:border-white/50 transition-colors"
        style={{ backgroundColor: color }}
      >
        <span className="bg-black/50 px-2 py-1 rounded text-xs">
          {showPicker ? "Hide" : "Show"} RGB Picker
        </span>
      </button>

      {showPicker && (
        <div className="mt-4 p-4 bg-white/10 rounded-lg space-y-3">
          <div className="flex items-center space-x-3">
            <label className="text-white text-sm font-medium w-8">R:</label>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.r}
              onChange={(e) => handleRgbChange("r", parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-white text-sm w-8">{rgb.r}</span>
          </div>
          <div className="flex items-center space-x-3">
            <label className="text-white text-sm font-medium w-8">G:</label>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.g}
              onChange={(e) => handleRgbChange("g", parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-white text-sm w-8">{rgb.g}</span>
          </div>
          <div className="flex items-center space-x-3">
            <label className="text-white text-sm font-medium w-8">B:</label>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.b}
              onChange={(e) => handleRgbChange("b", parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-white text-sm w-8">{rgb.b}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorInput;
