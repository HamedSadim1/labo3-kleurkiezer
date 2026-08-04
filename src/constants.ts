import { COPY } from "./copy";
import type { Rgb } from "./utils/colorUtils";

/* =====================================================================
 * Central constants — the single source of truth (SSOT) for every
 * hardcoded constant and magic value used across the app.
 *
 * Grouped by concern; each section is described under its banner.
 * The tiny hex helpers (hex, hexToRgb, hexToRgba) live here so the color
 * constants can be declared without a runtime dependency on colorUtils.
 * Dynamic gradient builders (glossOverlay, saturationGradient,
 * lightnessGradient, ...) intentionally stay in utils/colorUtils.ts
 * because they derive their output from color-domain values.
 * ===================================================================== */

/* ----- Color domain ----- */

/** A normalized "#RRGGBB" hex color string. */
export type HexColor = string & { readonly __brand: "HexColor" };

/** Coerce a known-valid hex string to the branded HexColor type. */
export const hex = (value: string): HexColor => value as HexColor;

/** Parse a "#RRGGBB" hex color into its RGB channels, or null when invalid. */
export const hexToRgb = (hexColor: string): Rgb | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/** Convert "#RRGGBB" to an rgba() string ("" when the hex is invalid). */
export const hexToRgba = (hexColor: string, alpha: number): string => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return "";
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
};

/** Max byte value of a single RGB channel. */
export const RGB_MAX: number = 255;

/** Full 360° hue circle in degrees. */
export const HUE_MAX: number = 360;

/** Width of one hue segment (60° per primary/secondary transition). */
export const HUE_SEGMENT: number = 60;

/** Saturation/lightness percentage scale (0–100). */
export const PERCENT_MAX: number = 100;

/** White text — highest contrast on dark backgrounds. */
export const LIGHT_TEXT = "#FFFFFF";

/** Dark-slate text — highest contrast on light backgrounds. */
export const DARK_TEXT = "#0F172A";

/** The two text colors that always read well on any background. */
export type TextColor = typeof LIGHT_TEXT | typeof DARK_TEXT;

/** WCAG minimum contrast ratios (see WCAG 2.1 contrast-minimum). */
export const MIN_CONTRAST_AAA: number = 7;
export const MIN_CONTRAST_AA: number = 4.5;
export const MIN_CONTRAST_LARGE: number = 3;

/** WCAG relative-luminance sRGB constants. */
export const SRGB_THRESHOLD: number = 0.03928;
export const SRGB_LINEAR: number = 12.92;
export const SRGB_GAMMA: number = 2.4;
export const SRGB_GAMMA_OFFSET: number = 0.055;
export const SRGB_GAMMA_DIVISOR: number = 1.055;
export const LUMINANCE_OFFSET: number = 0.05;

/** WCAG sRGB relative-luminance channel weights. */
export const LUMINANCE_RED: number = 0.2126;
export const LUMINANCE_GREEN: number = 0.7152;
export const LUMINANCE_BLUE: number = 0.0722;

/** WCAG rating badges for a contrast ratio. */
export type ContrastRating = "AAA" | "AA" | "AA large" | "Fail";

/* ----- Palette & app colors ----- */

export interface ColorOption {
  value: HexColor;
  label: string;
}

/** The predefined palette shown in the "Palette" section. */
export const COLOR_OPTIONS: readonly ColorOption[] = [
  { value: hex("#667eea"), label: COPY.palette.colors.bluePurple },
  { value: hex("#FF0000"), label: COPY.palette.colors.red },
  { value: hex("#00FF00"), label: COPY.palette.colors.green },
  { value: hex("#0000FF"), label: COPY.palette.colors.blue },
  { value: hex("#FFFF00"), label: COPY.palette.colors.yellow },
  { value: hex("#FF00FF"), label: COPY.palette.colors.magenta },
  { value: hex("#00FFFF"), label: COPY.palette.colors.cyan },
  { value: hex("#FFA500"), label: COPY.palette.colors.orange },
  { value: hex("#800080"), label: COPY.palette.colors.purple },
  { value: hex("#FFC0CB"), label: COPY.palette.colors.pink },
  { value: hex("#A52A2A"), label: COPY.palette.colors.brown },
  { value: hex("#808080"), label: COPY.palette.colors.gray },
];

/** Default color = the first palette option (kept in sync via the same source). */
export const DEFAULT_COLOR: HexColor = COLOR_OPTIONS[0].value;

/** Dark app background (mirrored in the index.html theme-color meta tag). */
export const APP_BG: HexColor = hex("#070b18");

/** Vignette opacity at the screen edges. */
export const APP_BG_VIGNETTE_ALPHA: number = 0.7;

/** Radial vignette that darkens the app background toward the edges. */
export const APP_BG_VIGNETTE: string = `radial-gradient(ellipse at center, transparent 0%, ${hexToRgba(APP_BG, APP_BG_VIGNETTE_ALPHA)} 100%)`;

/** Background of the saved-color remove badge. */
export const REMOVE_BADGE_BG: HexColor = hex("#1a2035");

/* ----- Feedback ----- */

/** How long success feedback (e.g. "Saved", copied checkmark) stays visible. */
export const FEEDBACK_TIMEOUT_MS: number = 1500;

/* ----- Static gradients ----- */

/** Hue-wheel conic gradient (pure CSS color keywords). */
export const WHEEL_GRADIENT: string =
  "conic-gradient(from 90deg, red, yellow, lime, cyan, blue, magenta, red)";

/** Glossy highlight + ambient shadow overlay used on the main color sphere. */
export const SPHERE_OVERLAY: string =
  "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.5), rgba(255,255,255,0) 55%), radial-gradient(circle at 72% 82%, rgba(0,0,0,0.3), rgba(0,0,0,0) 55%)";

/* ----- Picker geometry & behavior ----- */

/** Size of the interactive hue wheel and 2D plane, in pixels. */
export const WHEEL_SIZE: number = 176;
export const PLANE_SIZE: number = 176;

/** Radius of the hue marker around the wheel center, as a percentage. */
export const MARKER_RADIUS_PCT: number = 44;

/** Marker center position (50%) used with the marker radius percentage. */
export const MARKER_CENTER_PCT: number = 50;

/** Inset (in %) that keeps the 2D-plane marker inside the rounded corners. */
export const MARKER_INSET: number = 5;

/** Keyboard arrow-key step; shift adds the fast step. */
export const KEY_STEP: number = 1;
export const HUE_KEY_STEP_FAST: number = 15;
export const PLANE_KEY_STEP_FAST: number = 10;

/** Mid lightness (50%) used as the neutral default. */
export const LIGHTNESS_MID: number = PERCENT_MAX / 2;

/** Fallback HSL values when the current color cannot be parsed. */
export const DEFAULT_HSL: { h: number; s: number; l: number } = {
  h: 0,
  s: PERCENT_MAX,
  l: LIGHTNESS_MID,
};

/** Caps for the recents and saved color lists. */
export const MAX_RECENTS: number = 6;
export const MAX_SAVED: number = 8;

/** RGB channel labels for the sliders. */
export const CHANNELS = [
  { key: "r", label: "R" },
  { key: "g", label: "G" },
  { key: "b", label: "B" },
] as const;

export type ChannelKey = (typeof CHANNELS)[number]["key"];

/** Display modes of the HSL picker. */
export type HslMode = "sliders" | "plane";

export const MODES: readonly { id: HslMode; label: string }[] = [
  { id: "sliders", label: COPY.hsl.modeSliders },
  { id: "plane", label: COPY.hsl.modePlane },
];

/** Type guard for the HSL display modes. */
export const isHslMode = (value: string): value is HslMode =>
  MODES.some((option) => option.id === value);

/* ----- Storage keys ----- */

/** localStorage keys used across the app. */
export const COLOR_KEY: string = "color-studio-color";
export const RECENTS_KEY: string = "color-studio-recents";
export const SAVED_KEY: string = "color-studio-saved";
export const MODE_KEY: string = "color-studio-hsl-mode";

/* ----- UI / input configuration ----- */

/** Max characters in the hex input (RRGGBB). */
export const HEX_DIGITS: number = 6;

/** Alpha of the gloss overlay on the native-picker swatch (glossOverlay default: 0.25). */
export const SWATCH_GLOSS_ALPHA: number = 0.35;

/** Decimal places shown for contrast ratios. */
export const CONTRAST_DECIMALS: number = 2;

/** Pointer button id of the primary (left) button used for dragging. */
export const LEFT_BUTTON: number = 1;

/** Degrees ↔ radians conversion factors. */
export const DEG_TO_RAD: number = Math.PI / 180;
export const RAD_TO_DEG: number = 180 / Math.PI;

/* ----- Styling: reusable Tailwind class fragments -----
 *
 * This file is explicitly scanned by Tailwind (see the @source rule in
 * index.css), so all class fragments must live here to stay in the built CSS.
 */

/** Shared drop-shadow class for interactive controls (hue wheel + 2D plane). */
export const CONTROL_SHADOW: string =
  "shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]";

/** Shared keyboard-focus ring for interactive controls (hue wheel + 2D plane). */
export const CONTROL_FOCUS_RING: string =
  "focus-visible:ring-2 focus-visible:ring-white/70";

/** Background for standard card rows and inputs (kept in sync with .glass in index.css). */
export const SURFACE_CARD: string = "bg-white/5";

/** Background for raised interactive elements (icon buttons, save button). */
export const SURFACE_RAISED: string = "bg-white/10";

/** Background for the selected option inside a segmented control. */
export const SURFACE_SELECTED: string = "bg-white/15";

/** Hover background for raised interactive elements. */
export const SURFACE_HOVER: string = "hover:bg-white/20";

/** Muted label text — WCAG AA compliant on the app background (was white/40–45). */
export const TEXT_MUTED: string = "text-white/60";

/** Faint decorative text (e.g. the footer) — WCAG AA compliant for 12px+ text. */
export const TEXT_FAINT: string = "text-white/50";

/** Dark backdrop for the contrast rating badge (independent of the sample color). */
export const BADGE_BG_CLASS: string = "bg-[#0b1020]/80";

/** Tailwind text color per WCAG rating badge (used by the ContrastChecker). */
export const RATING_CLASS: Record<ContrastRating, string> = {
  AAA: "text-emerald-300",
  AA: "text-emerald-300",
  "AA large": "text-amber-300",
  Fail: "text-rose-300",
};

/** Drop shadow under the main color sphere. */
export const SPHERE_SHADOW: string =
  "shadow-[0_30px_70px_-15px_rgba(0,0,0,0.7)]";

/** Size of the main color sphere (with responsive sm variant). */
export const SPHERE_SIZE: string = "h-40 w-40 sm:h-52 sm:w-52";

/** Ambient glow behind the color sphere. */
export const SPHERE_GLOW_CLASS: string =
  "-inset-6 rounded-full opacity-40 blur-2xl transition-colors duration-500";

/** Shared marker style on the hue wheel and S/L plane. */
export const PICKER_MARKER_CLASS: string =
  "h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white";

/** Current-color center dot on the hue wheel. */
export const CENTER_DOT_SIZE: string = "h-7 w-7";

/** Native color-picker swatch size in the "Pick a color" section. */
export const PICKER_SWATCH_SIZE: string = "h-12 w-12";

/** Width of the RGB channel label column in ColorInput. */
export const CHANNEL_LABEL_WIDTH: string = "w-4";

/** Width of the RGB channel number input in ColorInput. */
export const CHANNEL_NUMBER_WIDTH: string = "w-12";

/** Width of the value label column in ColorValues. */
export const VALUE_LABEL_WIDTH: string = "w-10";

/** Copy-button size in ColorValues. */
export const COPY_BUTTON_SIZE: string = "h-8 w-8";

/** Sample swatch size in the ContrastChecker. */
export const CONTRAST_SWATCH_SIZE: string = "h-9 w-9";

/** Remove-badge size on saved colors. */
export const REMOVE_BADGE_SIZE: string = "h-4 w-4";

/** Swatch size in the harmonies section. */
export const HARMONY_SWATCH_SIZE: string = "h-9 w-9";

/** Width of the harmony group label column. */
export const HARMONY_LABEL_WIDTH: string = "w-28";

/** Recent-color swatch size in ColorPicker. */
export const RECENT_SWATCH_SIZE: string = "h-10 w-10 rounded-full";

/** Width of the S/L slider column in the HSL picker. */
export const SLIDER_COLUMN_WIDTH: string = "w-44";

/** Grid columns for the palette swatches (4 on mobile, 6 from sm up). */
export const PALETTE_GRID_COLS: string = "grid-cols-4 sm:grid-cols-6";

/** Grid columns for the saved-color swatches. */
export const SAVED_GRID_COLS: string = "grid-cols-4";

/* ----- Background decoration (AppLayout) ----- */

/** Primary color-reactive glow blob behind the app. */
export const BG_BLOB_PRIMARY: string =
  "-left-40 -top-40 h-[36rem] w-[36rem] rounded-full opacity-25 blur-3xl transition-colors duration-700";

/** Static indigo glow blob behind the app. */
export const BG_BLOB_INDIGO: string =
  "-right-32 top-1/4 h-[30rem] w-[30rem] rounded-full bg-indigo-600 opacity-20 blur-3xl animate-drift";

/** Static fuchsia glow blob behind the app. */
export const BG_BLOB_FUCHSIA: string =
  "bottom-0 left-1/3 h-[26rem] w-[26rem] rounded-full bg-fuchsia-600 opacity-15 blur-3xl animate-drift-slow";

/* ----- Icon sizes ----- */

/** Size class for the standard (copy/check) icons. */
export const ICON_STANDARD_SIZE: string = "h-3.5 w-3.5";

/** Size class for the small (bookmark) icon. */
export const ICON_SMALL_SIZE: string = "h-3 w-3";
