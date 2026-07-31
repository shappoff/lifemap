import {
  PLACE_TYPE_COLORS,
  PLACE_TYPE_LABELS,
} from "@/lib/biography/labels";
import type { PlaceType } from "@/lib/biography/types";

type PlaceTypeBadgeProps = {
  type: PlaceType;
  className?: string;
};

export function PlaceTypeBadge({ type, className = "" }: PlaceTypeBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium text-white ${className}`}
      style={{ backgroundColor: PLACE_TYPE_COLORS[type] }}
    >
      {PLACE_TYPE_LABELS[type]}
    </span>
  );
}
