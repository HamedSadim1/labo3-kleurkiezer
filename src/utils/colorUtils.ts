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

/** A normalized "#RRGGBB" hex color string. */
export type HexColor = string & { readonly __brand: "HexColor" };

/** The two text colors that always read well on any background. */
export type TextColor = "#FFFFFF" | "#0F172A";

/** Coerce a known-valid hex string to the branded HexColor type. */
export const hex = (value: string): HexColor => value as HexColor;

export const isValidHexColor = (color: string): color is HexColor => {
  return /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(color);
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
    Math.max(0, Math.min(255, Math.round(value)))
      .toString(16)
      .padStart(2, "0");
  return hex(`#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase());
};

export const hexToHsl = (hex: string): Hsl | null => {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
};

export const hslToHex = (h: number, s: number, l: number): HexColor => {
  const saturation = s / 100;
  const lightness = l / 100;
  const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lightness - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
};

export const rotateHue = (hex: HexColor, degrees: number): HexColor => {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;
  const h = (hsl.h + degrees + 360) % 360;
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
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** WCAG contrast ratio between two hex colors (1 to 21). */
export const getContrastRatio = (hexA: string, hexB: string): number => {
  const l1 = getLuminance(hexA);
  const l2 = getLuminance(hexB);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

/** Returns the text color ("#FFFFFF" or a dark slate) that reads best on the given background. */
export const getTextColor = (hex: string): TextColor => {
  return getContrastRatio(hex, "#FFFFFF") >= 4.5 ? "#FFFFFF" : "#0F172A";
};
