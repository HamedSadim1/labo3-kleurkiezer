import React from "react";

interface SectionHeaderProps {
  title: string;
  action?: React.ReactNode;
}

/** Shared section heading (e.g. "Palette", "Recent") with an optional action. */
const SectionHeader: React.FC<SectionHeaderProps> = ({ title, action }) => (
  <div className="mb-3 flex items-center justify-between gap-2">
    <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
      {title}
    </h2>
    {action}
  </div>
);

export const ClearButton: React.FC<{ onClick: () => void; label?: string }> = ({
  onClick,
  label = "Clear",
}) => (
  <button
    type="button"
    onClick={onClick}
    className="text-[11px] font-medium text-white/40 underline-offset-2 transition-colors hover:text-white/80 hover:underline"
  >
    {label}
  </button>
);

export default SectionHeader;
