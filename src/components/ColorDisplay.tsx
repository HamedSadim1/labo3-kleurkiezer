import React from "react";
import {
  SPHERE_GLOW_CLASS,
  SPHERE_OVERLAY,
  SPHERE_SHADOW,
  SPHERE_SIZE,
  type HexColor,
} from "@/constants";
import { cn } from "@/utils/cn";

interface ColorDisplayProps {
  color: HexColor;
}

const ColorDisplay: React.FC<ColorDisplayProps> = ({ color }) => {
  return (
    <div className={cn("relative mx-auto", SPHERE_SIZE)}>
      {/* Ambient glow */}
      <div
        className={cn("absolute", SPHERE_GLOW_CLASS)}
        style={{ backgroundColor: color }}
      />
      {/* Glossy sphere */}
      <div
        className={cn(
          "relative h-full w-full rounded-full border border-white/20 transition-colors duration-300",
          SPHERE_SHADOW,
        )}
        style={{
          backgroundColor: color,
          backgroundImage: SPHERE_OVERLAY,
        }}
      />
    </div>
  );
};

export default ColorDisplay;
