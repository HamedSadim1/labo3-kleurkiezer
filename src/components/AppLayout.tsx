import React from "react";
import ColorPicker from "./ColorPicker";
import {
  APP_BG,
  APP_BG_VIGNETTE,
  BG_BLOB_FUCHSIA,
  BG_BLOB_INDIGO,
  BG_BLOB_PRIMARY,
  COLOR_KEY,
  DEFAULT_COLOR,
  SURFACE_CARD,
  TEXT_FAINT,
  type HexColor,
} from "../constants";
import useLocalStorage from "../hooks/useLocalStorage";
import { serializeRaw } from "../utils/storageUtils";
import { isValidHexColor } from "../utils/colorUtils";
import { COPY } from "../copy";

const AppLayout: React.FC = () => {
  const [color, setColor] = useLocalStorage<HexColor>(
    COLOR_KEY,
    DEFAULT_COLOR,
    {
      deserialize: (raw) => (isValidHexColor(raw) ? raw : DEFAULT_COLOR),
      serialize: serializeRaw,
    },
  );

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Animated, color-reactive background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0" style={{ backgroundColor: APP_BG }} />
        <div
          className={`absolute ${BG_BLOB_PRIMARY}`}
          style={{ backgroundColor: color }}
        />
        <div className={`absolute ${BG_BLOB_INDIGO}`} />
        <div className={`absolute ${BG_BLOB_FUCHSIA}`} />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: APP_BG_VIGNETTE }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center px-4 py-10 sm:py-16">
        <header className="mb-10 text-center">
          <div
            className={`mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 ${SURFACE_CARD} px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white/55 backdrop-blur`}
          >
            <span
              className="h-2 w-2 rounded-full transition-colors duration-300"
              style={{ backgroundColor: color }}
            />
            {COPY.app.badge}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            {COPY.app.title}{" "}
            <span className="bg-linear-to-r from-white via-white/85 to-white/40 bg-clip-text text-transparent">
              {COPY.app.titleAccent}
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/50 sm:text-base">
            {COPY.app.tagline}
          </p>
        </header>

        <main className="flex w-full flex-col items-center">
          <ColorPicker color={color} onChange={setColor} />
        </main>

        <footer className={`mt-12 text-center text-xs ${TEXT_FAINT}`}>
          {COPY.app.footer}
        </footer>
      </div>
    </div>
  );
};

export default AppLayout;
