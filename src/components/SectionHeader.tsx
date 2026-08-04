import React from "react";
import { CONTROL_FOCUS_RING, TEXT_MUTED } from "@/constants";
import { COPY } from "@/copy";
import { cn } from "@/utils/cn";

interface SectionHeaderProps {
  title: string;
  action?: React.ReactNode;
}

/** Shared section heading (e.g. "Palette", "Recent") with an optional action. */
const SectionHeader: React.FC<SectionHeaderProps> = ({ title, action }) => (
  <div className="mb-3 flex items-center justify-between gap-2">
    <h2
      className={cn(
        "text-[11px] font-semibold uppercase tracking-[0.18em]",
        TEXT_MUTED,
      )}
    >
      {title}
    </h2>
    {action}
  </div>
);

export const ClearButton: React.FC<{ onClick: () => void; label?: string }> = ({
  onClick,
  label = COPY.action.clear,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "rounded text-[11px] font-medium underline-offset-2 transition-colors hover:text-white/80 hover:underline",
      TEXT_MUTED,
      CONTROL_FOCUS_RING,
    )}
  >
    {label}
  </button>
);

export default SectionHeader;
