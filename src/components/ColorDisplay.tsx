import React from "react";

interface ColorDisplayProps {
  color: string;
}

const ColorDisplay: React.FC<ColorDisplayProps> = ({ color }) => {
  return (
    <div className="flex justify-center">
      <div
        className="w-32 h-32 rounded-full border-4 border-white/50 shadow-2xl animate-pulse"
        style={{ backgroundColor: color }}
      ></div>
    </div>
  );
};

export default ColorDisplay;
