export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface Hsl {
  h: number;
  s: number;
  l: number;
}

/* ----- Color-domain constants ----- */

/** Max byte value of a single RGB channel. */
export const RGB_MAX = 255;

/** Full 360° hue circle in degrees. */
export const HUE_MAX = 360;

/** Width of one hue segment (60° per primary/secondary transition). */
export const HUE_SEGMENT = 60;

/** Saturation/lightness percentage scale (0–100). */
export const PERCENT_MAX = 100;

/** White text — highest contrast on dark backgrounds. */
export const LIGHT_TEXT = "#FFFFFF";

/** Dark-slate text — highest contrast on light backgrounds. */
export const DARK_TEXT = "#0F172A";

/** The two text colors that always read well on any background. */
export type TextColor = typeof LIGHT_TEXT | typeof DARK_TEXT;

/** WCAG minimum contrast ratios (see WCAG 2.1 contrast-minimum). */
export const MIN_CONTRAST_AAA = 7;
export const MIN_CONTRAST_AA = 4.5;
export const MIN_CONTRAST_LARGE = 3;

/** WCAG relative-luminance sRGB constants. */
const SRGB_THRESHOLD = 0.03928;
const SRGB_LINEAR = 12.92;
const SRGB_GAMMA = 2.4;
const SRGB_GAMMA_OFFSET = 0.055;
const SRGB_GAMMA_DIVISOR = 1.055;
const LUMINANCE_OFFSET = 0.05;

/** WCAG sRGB relative-luminance channel weights. */
const LUMINANCE_RED = 0.2126;
const LUMINANCE_GREEN = 0.7152;
const LUMINANCE_BLUE = 0.0722;

/** A normalized "#RRGGBB" hex color string. */
export type HexColor = string & { readonly __brand: "HexColor" };

/** Coerce a known-valid hex string to the branded HexColor type. */
export const hex = (value: string): HexColor => value as HexColor;

export const isValidHexColor = (color: string): color is HexColor => {
  return /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(color);
};

/** Case-insensitive comparison of two hex colors. */
export const colorsEqual = (a: string, b: string): boolean =>
  a.toLowerCase() === b.toLowerCase();

/** Subtle glossy highlight overlay used on color swatches. */
export const glossOverlay = (alpha = 0.25): string =>
  `radial-gradient(circle at 30% 30%, rgba(255,255,255,${alpha}), rgba(255,255,255,0) 60%)`;

/** Accepts "#fff", "#ffffff" or "fff" and returns a normalized "#RRGGBB". */
export const normalizeHex = (color: string): string => {
  let hex = color.trim().replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }
  return `#${hex.toUpperCase()}`;
};

export const hexToRgb = (hex: string): Rgb | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const rgbToHex = (r: number, g: number, b: number): HexColor => {
  const toHex = (value: number) =>
    Math.max(0, Math.min(RGB_MAX, Math.round(value)))
      .toString(16)
      .padStart(2, "0");
  return hex(`#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase());
};

export const hexToHsl = (hex: string): Hsl | null => {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const r = rgb.r / RGB_MAX;
  const g = rgb.g / RGB_MAX;
  const b = rgb.b / RGB_MAX;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= HUE_SEGMENT;
    if (h < 0) h += HUE_MAX;
  }
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return {
    h: Math.round(h),
    s: Math.round(s * PERCENT_MAX),
    l: Math.round(l * PERCENT_MAX),
  };
};

export const hslToHex = (h: number, s: number, l: number): HexColor => {
  const saturation = s / PERCENT_MAX;
  const lightness = l / PERCENT_MAX;
  const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = c * (1 - Math.abs(((h / HUE_SEGMENT) % 2) - 1));
  const m = lightness - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < HUE_SEGMENT) {
    r = c;
    g = x;
  } else if (h < HUE_SEGMENT * 2) {
    r = x;
    g = c;
  } else if (h < HUE_SEGMENT * 3) {
    g = c;
    b = x;
  } else if (h < HUE_SEGMENT * 4) {
    g = x;
    b = c;
  } else if (h < HUE_SEGMENT * 5) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  return rgbToHex((r + m) * RGB_MAX, (g + m) * RGB_MAX, (b + m) * RGB_MAX);
};

export const rotateHue = (hex: HexColor, degrees: number): HexColor => {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;
  const h = (hsl.h + degrees + HUE_MAX) % HUE_MAX;
  return hslToHex(h, hsl.s, hsl.l);
};

export interface ColorHarmony {
  complementary: HexColor;
  analogous: HexColor[];
  triadic: HexColor[];
}

export const getHarmony = (hex: HexColor): ColorHarmony => ({
  complementary: rotateHue(hex, 180),
  analogous: [rotateHue(hex, -30), rotateHue(hex, 30)],
  triadic: [rotateHue(hex, 120), rotateHue(hex, 240)],
});

/** WCAG relative luminance of a hex color. */
export const getLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((value) => {
    const c = value / RGB_MAX;
    return c <= SRGB_THRESHOLD
      ? c / SRGB_LINEAR
      : Math.pow((c + SRGB_GAMMA_OFFSET) / SRGB_GAMMA_DIVISOR, SRGB_GAMMA);
  });
  return LUMINANCE_RED * r + LUMINANCE_GREEN * g + LUMINANCE_BLUE * b;
};

/** WCAG contrast ratio between two hex colors (1 to 21). */
export const getContrastRatio = (hexA: string, hexB: string): number => {
  const l1 = getLuminance(hexA);
  const l2 = getLuminance(hexB);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + LUMINANCE_OFFSET) / (darker + LUMINANCE_OFFSET);
};

/** Returns the text color ("#FFFFFF" or a dark slate) that reads best on the given background. */
export const getTextColor = (hex: string): TextColor => {
  return getContrastRatio(hex, LIGHT_TEXT) >= MIN_CONTRAST_AA
    ? LIGHT_TEXT
    : DARK_TEXT;
};
