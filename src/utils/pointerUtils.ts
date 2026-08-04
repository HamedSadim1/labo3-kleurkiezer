import type { PointerEvent as ReactPointerEvent } from "react";
import { LEFT_BUTTON } from "../constants";

type PointerUpdate = (clientX: number, clientY: number) => void;

/** Shared pointer-drag behavior for the hue wheel and the 2D plane. */
export const handlePointerDown = (
  event: ReactPointerEvent<HTMLDivElement>,
  update: PointerUpdate,
) => {
  event.currentTarget.setPointerCapture(event.pointerId);
  update(event.clientX, event.clientY);
};

export const handlePointerMove = (
  event: ReactPointerEvent<HTMLDivElement>,
  update: PointerUpdate,
) => {
  if (event.buttons !== LEFT_BUTTON) return;
  update(event.clientX, event.clientY);
};
