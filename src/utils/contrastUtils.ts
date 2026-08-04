import { getContrastRating, type ContrastRating } from "./colorUtils";
// The badge styling classes live in the constants SSOT, so this module
// depends on ../constants (constants never imports back — no cycle).
import { RATING_CLASS } from "../constants";

/** A WCAG rating badge together with the Tailwind class used to render it. */
export interface RatingBadge {
  badge: ContrastRating;
  className: string;
}

/** Map a contrast ratio to its WCAG rating badge (badge label + styling class). */
export const getRatingBadge = (ratio: number): RatingBadge => {
  const badge = getContrastRating(ratio);
  return { badge, className: RATING_CLASS[badge] };
};
