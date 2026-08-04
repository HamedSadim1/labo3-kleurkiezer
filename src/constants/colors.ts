import { hex, type HexColor } from "../utils/colorUtils";

export interface ColorOption {
  value: HexColor;
  label: string;
}

export const COLOR_OPTIONS: readonly ColorOption[] = [
  { value: hex("#667eea"), label: "Blue Purple" },
  { value: hex("#FF0000"), label: "Red" },
  { value: hex("#00FF00"), label: "Green" },
  { value: hex("#0000FF"), label: "Blue" },
  { value: hex("#FFFF00"), label: "Yellow" },
  { value: hex("#FF00FF"), label: "Magenta" },
  { value: hex("#00FFFF"), label: "Cyan" },
  { value: hex("#FFA500"), label: "Orange" },
  { value: hex("#800080"), label: "Purple" },
  { value: hex("#FFC0CB"), label: "Pink" },
  { value: hex("#A52A2A"), label: "Brown" },
  { value: hex("#808080"), label: "Gray" },
];

export const DEFAULT_COLOR: HexColor = hex("#667eea");
