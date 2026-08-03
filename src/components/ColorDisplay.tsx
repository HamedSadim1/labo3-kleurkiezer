import React from "react";

interface ColorDisplayProps {
  color: string;
}

const ColorDisplay: React.FC<ColorDisplayProps> = ({ color }) => {
  return (
    <div className="relative mx-auto h-40 w-40 sm:h-52 sm:w-52">
      {/* Ambient glow */}
      <div
        className="absolute -inset-6 rounded-full opacity-40 blur-2xl transition-colors duration-500"
        style={{ backgroundColor: color }}
      />
      {/* Glossy sphere */}
      <div
        className="relative h-full w-full rounded-full border border-white/20 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.7)] transition-colors duration-300"
        style={{
          backgroundColor: color,
          backgroundImage:
            "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.5), rgba(255,255,255,0) 55%), radial-gradient(circle at 72% 82%, rgba(0,0,0,0.3), rgba(0,0,0,0) 55%)",
        }}
      />
    </div>
  );
};

export default ColorDisplay;
