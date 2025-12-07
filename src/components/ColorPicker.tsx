import React, { useState, useEffect } from "react";
import ColorInput from "./ColorInput";
import ColorSelect from "./ColorSelect";
import ColorDisplay from "./ColorDisplay";
import { DEFAULT_COLOR } from "../constants/colors";
import { hexToRgb } from "../utils/colorUtils";

const ColorPicker: React.FC = () => {
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [recentColors, setRecentColors] = useState<string[]>([DEFAULT_COLOR]);
  const [copied, setCopied] = useState(false);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    if (!recentColors.includes(newColor)) {
      setRecentColors((prev) => [newColor, ...prev.slice(0, 4)]);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(color);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const rgb = hexToRgb(color);

  return (
    <div className="glass max-w-md mx-auto">
      <h1 className="text-white text-3xl font-bold mb-6 text-center">
        🎨 Color Picker
      </h1>

      <div className="space-y-4">
        <div>
          <label className="block text-white text-lg font-semibold mb-2">
            Pick a Color:
          </label>
          <ColorInput color={color} onChange={handleColorChange} />
        </div>

        <div>
          <label className="block text-white text-lg font-semibold mb-2">
            Choose from Palette:
          </label>
          <ColorSelect color={color} onChange={handleColorChange} />
        </div>

        <ColorDisplay color={color} />

        <div className="bg-white/10 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Color Info:</h3>
          <p className="text-white">
            Hex: <span className="font-mono">{color.toUpperCase()}</span>
          </p>
          {rgb && (
            <p className="text-white">
              RGB:{" "}
              <span className="font-mono">
                rgb({rgb.r}, {rgb.g}, {rgb.b})
              </span>
            </p>
          )}
          <button
            onClick={copyToClipboard}
            className="mt-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition-colors"
          >
            {copied ? "Copied!" : "Copy Hex"}
          </button>
        </div>

        {recentColors.length > 1 && (
          <div>
            <h3 className="text-white font-semibold mb-2">Recent Colors:</h3>
            <div className="flex space-x-2">
              {recentColors.slice(1).map((recentColor, index) => (
                <button
                  key={index}
                  onClick={() => handleColorChange(recentColor)}
                  className="w-8 h-8 rounded-full border-2 border-white/50 shadow-lg hover:scale-110 transition-transform"
                  style={{ backgroundColor: recentColor }}
                  title={recentColor}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
