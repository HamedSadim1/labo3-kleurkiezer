/** Signed step to apply on arrow keys, plus the Home/End jump target. */
export interface ArrowKeyIntent {
  /** Signed horizontal step (positive = right, negative = left); 0 otherwise. */
  horizontalDelta: number;
  /** Signed vertical step (positive = up, negative = down); 0 otherwise. */
  verticalDelta: number;
  /** Home/End jump target, or null for arrow keys. */
  jump: "min" | "max" | null;
}

/**
 * Interpret an arrow/navigation key press as a navigation intent.
 * Returns null when the key is not a navigation key (the caller should
 * ignore the event in that case). Holding Shift uses the `fastStep`.
 */
export const getArrowKeyIntent = (
  event: { key: string; shiftKey: boolean },
  step: number,
  fastStep: number,
): ArrowKeyIntent | null => {
  const delta = event.shiftKey ? fastStep : step;
  switch (event.key) {
    case "ArrowRight":
      return { horizontalDelta: delta, verticalDelta: 0, jump: null };
    case "ArrowLeft":
      return { horizontalDelta: -delta, verticalDelta: 0, jump: null };
    case "ArrowUp":
      return { horizontalDelta: 0, verticalDelta: delta, jump: null };
    case "ArrowDown":
      return { horizontalDelta: 0, verticalDelta: -delta, jump: null };
    case "Home":
      return { horizontalDelta: 0, verticalDelta: 0, jump: "min" };
    case "End":
      return { horizontalDelta: 0, verticalDelta: 0, jump: "max" };
    default:
      return null;
  }
};
