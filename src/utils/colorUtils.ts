import { clamp } from "./mathUtils";
import {
  hex,
  hexToRgb,
  RGB_MAX,
  HUE_MAX,
  HUE_SEGMENT,
  PERCENT_MAX,
  LIGHT_TEXT,
  DARK_TEXT,
  MIN_CONTRAST_AAA,
  MIN_CONTRAST_AA,
  MIN_CONTRAST_LARGE,
  SRGB_THRESHOLD,
  SRGB_LINEAR,
  SRGB_GAMMA,
  SRGB_GAMMA_OFFSET,
  SRGB_GAMMA_DIVISOR,
  LUMINANCE_OFFSET,
  LUMINANCE_RED,
  LUMINANCE_GREEN,
  LUMINANCE_BLUE,
  type HexColor,
  type TextColor,
  type ContrastRating,
} from "../constants";

// Re-exported so existing callers can keep importing them from here.
export { hexToRgb };
export type { HexColor };

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

export const isValidHexColor = (color: string): color is HexColor => {
  return /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(color);
};

/** Case-insensitive comparison of two hex colors. */
export const colorsEqual = (a: string, b: string): boolean =>
  a.toLowerCase() === b.toLowerCase();

/** Prepend a color to a list, de-duplicating case-insensitively, capped at `max`. */
export const prependUnique = (
  list: HexColor[],
  color: HexColor,
  max: number,
): HexColor[] =>
  [color, ...list.filter((item) => !colorsEqual(item, color))].slice(0, max);

/** Return the list without any case-insensitive matches of `color`. */
export const withoutColor = (list: HexColor[], color: HexColor): HexColor[] =>
  list.filter((item) => !colorsEqual(item, color));

/** Parse a stored JSON array into valid hex colors, or null when it is not an array. */
export const parseHexArray = (raw: string): HexColor[] | null => {
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) return null;
  return parsed.filter(
    (item): item is HexColor =>
      typeof item === "string" && isValidHexColor(item),
  );
};

/** Subtle glossy highlight overlay used on color swatches. */
export const glossOverlay = (alpha = 0.25): string =>
  `radial-gradient(circle at 30% 30%, rgba(255,255,255,${alpha}), rgba(255,255,255,0) 60%)`;

/** Horizontal saturation gradient (0% → 100% saturation) at a given hue. */
export const saturationGradient = (hue: number): string =>
  `linear-gradient(to right, hsl(${hue}, 0%, ${PERCENT_MAX / 2}%), hsl(${hue}, 100%, ${PERCENT_MAX / 2}%))`;

/** Horizontal lightness gradient (0% → 100% lightness) at a given hue. */
export const lightnessGradient = (hue: number): string =>
  `linear-gradient(to right, hsl(${hue}, 100%, 0%), hsl(${hue}, 100%, ${PERCENT_MAX / 2}%), hsl(${hue}, 100%, 100%))`;

/** Vertical white/black overlays + horizontal saturation for the 2D S/L plane. */
export const saturationLightnessPlaneGradient = (hue: number): string =>
  `linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0)), linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0)), ${saturationGradient(hue)}`;

/** Horizontal RGB slider track gradient (0 → max) for a single channel. */
export const rgbSliderGradient = (rgb: Rgb, channel: keyof Rgb): string => {
  const [r, g, b] = [
    channel === "r" ? 0 : rgb.r,
    channel === "g" ? 0 : rgb.g,
    channel === "b" ? 0 : rgb.b,
  ];
  const [rMax, gMax, bMax] = [
    channel === "r" ? RGB_MAX : rgb.r,
    channel === "g" ? RGB_MAX : rgb.g,
    channel === "b" ? RGB_MAX : rgb.b,
  ];
  return `linear-gradient(to right, rgb(${r}, ${g}, ${b}), rgb(${rMax}, ${gMax}, ${bMax}))`;
};

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

export const rgbToHex = (r: number, g: number, b: number): HexColor => {
  const toHex = (value: number) =>
    clamp(Math.round(value), 0, RGB_MAX).toString(16).padStart(2, "0");
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

/** Map a contrast ratio to its WCAG rating (see WCAG 2.1 contrast-minimum). */
export const getContrastRating = (ratio: number): ContrastRating => {
  if (ratio >= MIN_CONTRAST_AAA) return "AAA";
  if (ratio >= MIN_CONTRAST_AA) return "AA";
  if (ratio >= MIN_CONTRAST_LARGE) return "AA large";
  return "Fail";
};
