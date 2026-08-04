import { getContrastRating } from "@/utils/colorUtils";
import { RATING_CLASS, type ContrastRating } from "@/constants";

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
