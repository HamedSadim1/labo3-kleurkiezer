import React from "react";
import { CONTROL_FOCUS_RING } from "../constants";

interface IconButtonProps {
  /** Accessible name (aria-label). */
  label: string;
  /** Optional tooltip; falls back to the label. */
  title?: string;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * A small square icon button (copy, remove, ...) with a consistent
 * keyboard-focus ring. Size, shape and colors come from `className`
 * (or `style` for values that cannot be expressed as Tailwind classes).
 */
const IconButton: React.FC<IconButtonProps> = ({
  label,
  title,
  onClick,
  className = "",
  style,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={title ?? label}
    className={`flex shrink-0 items-center justify-center transition-all ${CONTROL_FOCUS_RING} ${className}`}
    style={style}
  >
    {children}
  </button>
);

export default IconButton;
