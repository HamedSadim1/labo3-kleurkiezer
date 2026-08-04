import React from "react";
import ColorPicker from "./ColorPicker";
import { DEFAULT_COLOR } from "../constants/colors";
import useLocalStorage, { serializeRaw } from "../hooks/useLocalStorage";

const COLOR_KEY = "color-studio-color";

const AppLayout: React.FC = () => {
  const [color, setColor] = useLocalStorage<string>(COLOR_KEY, DEFAULT_COLOR, {
    deserialize: (raw) => raw || DEFAULT_COLOR,
    serialize: serializeRaw,
  });

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Animated, color-reactive background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#070b18]" />
        <div
          className="absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full opacity-25 blur-3xl transition-colors duration-700"
          style={{ backgroundColor: color }}
        />
        <div className="absolute -right-32 top-1/4 h-[30rem] w-[30rem] rounded-full bg-indigo-600 opacity-20 blur-3xl animate-drift" />
        <div className="absolute bottom-0 left-1/3 h-[26rem] w-[26rem] rounded-full bg-fuchsia-600 opacity-15 blur-3xl animate-drift-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,11,24,0.7)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center px-4 py-10 sm:py-16">
        <header className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white/55 backdrop-blur">
            <span
              className="h-2 w-2 rounded-full transition-colors duration-300"
              style={{ backgroundColor: color }}
            />
            Web Frameworks · Lab 3
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Color{" "}
            <span className="bg-gradient-to-r from-white via-white/85 to-white/40 bg-clip-text text-transparent">
              Studio
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/50 sm:text-base">
            Pick, refine and copy colors in a modern glass interface.
          </p>
        </header>

        <ColorPicker color={color} onChange={setColor} />

        <footer className="mt-12 text-center text-xs text-white/30">
          Built with React 19 · Vite 8 · Tailwind CSS 4
        </footer>
      </div>
    </div>
  );
};

export default AppLayout;
