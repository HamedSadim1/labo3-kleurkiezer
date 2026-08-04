import React from "react";
import {
  SPHERE_GLOW_CLASS,
  SPHERE_OVERLAY,
  SPHERE_SHADOW,
  SPHERE_SIZE,
  type HexColor,
} from "../constants";

interface ColorDisplayProps {
  color: HexColor;
}

const ColorDisplay: React.FC<ColorDisplayProps> = ({ color }) => {
  return (
    <div className={`relative mx-auto ${SPHERE_SIZE}`}>
      {/* Ambient glow */}
      <div
        className={`absolute ${SPHERE_GLOW_CLASS}`}
        style={{ backgroundColor: color }}
      />
      {/* Glossy sphere */}
      <div
        className={`relative h-full w-full rounded-full border border-white/20 ${SPHERE_SHADOW} transition-colors duration-300`}
        style={{
          backgroundColor: color,
          backgroundImage: SPHERE_OVERLAY,
        }}
      />
    </div>
  );
};

export default ColorDisplay;
