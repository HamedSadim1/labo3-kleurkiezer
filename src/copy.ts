/**
 * Central copy file — the single source of truth (SSOT) for the
 * user-facing UI texts used directly in components: section titles,
 * labels, buttons, error messages, aria-labels and tooltips.
 * Grouped by feature; read-only literals. Data structures in constants.ts
 * reference these labels (COLOR_OPTIONS, MODES). Pure glyphs (✓, ×, #, —)
 * stay inline.
 */
export const COPY = {
  /* ----- App chrome ----- */
  app: {
    badge: "Web Frameworks · Lab 3",
    title: "Color",
    titleAccent: "Studio",
    tagline: "Pick, refine and copy colors in a modern glass interface.",
    footer: "Built with React 19 · Vite 8 · Tailwind CSS 4",
  },

  /* ----- Section titles ----- */
  sections: {
    pickColor: "Pick a color",
    hslWheel: "HSL wheel",
    palette: "Palette",
    harmonies: "Harmonies",
    contrast: "Contrast",
    recent: "Recent",
    saved: "Saved",
  },

  /* ----- Color input ----- */
  picker: {
    openSystemPicker: "Open system color picker",
    hexValueLabel: "Hex color value",
    invalidHex: "Invalid hex code — use 3 or 6 hex digits (e.g. #667EEA).",
    channelValue: (label: string) => `${label} channel value`,
    channelNumberValue: (label: string) => `${label} channel number value`,
  },

  /* ----- HSL picker ----- */
  hsl: {
    modeSliders: "Sliders",
    modePlane: "2D plane",
    labelS: "S",
    labelL: "L",
    saturation: "Saturation",
    lightness: "Lightness",
    hue: "Hue",
    saturationLightness: "Saturation and lightness",
    valueText: (saturation: number, lightness: number) =>
      `Saturation ${saturation}%, lightness ${lightness}%`,
  },

  /* ----- Color value rows (HEX / RGB / HSL) ----- */
  formats: {
    hex: "HEX",
    rgb: "RGB",
    hsl: "HSL",
    copyValue: (label: string) => `Copy ${label} value`,
    copyLabel: (label: string) => `Copy ${label}`,
  },

  /* ----- Contrast checker ----- */
  contrast: {
    sampleAa: "Aa",
    whiteText: "White text",
    darkText: "Dark text",
    recommended: "Recommended text:",
    white: "white",
    dark: "dark",
  },

  /* ----- Palette ----- */
  palette: {
    /* Color names used by COLOR_OPTIONS in constants.ts. */
    colors: {
      bluePurple: "Blue Purple",
      red: "Red",
      green: "Green",
      blue: "Blue",
      yellow: "Yellow",
      magenta: "Magenta",
      cyan: "Cyan",
      orange: "Orange",
      purple: "Purple",
      pink: "Pink",
      brown: "Brown",
      gray: "Gray",
    },
    select: (name: string) => `Select ${name}`,
    selected: (name: string) => `Selected: ${name}`,
  },

  /* ----- Recent colors ----- */
  recent: {
    select: (color: string) => `Select recent color ${color}`,
  },

  /* ----- Saved colors ----- */
  saved: {
    save: "Save",
    saved: "Saved",
    empty: "Save your favorite colors to keep them at hand.",
    select: (color: string) => `Select saved color ${color}`,
    remove: (color: string) => `Remove saved color ${color}`,
  },

  /* ----- Harmonies ----- */
  harmony: {
    complementary: "Complementary",
    analogous: "Analogous",
    triadic: "Triadic",
    select: (color: string) => `Select harmony color ${color}`,
  },

  /* ----- Actions ----- */
  action: {
    clear: "Clear",
  },
} as const;
