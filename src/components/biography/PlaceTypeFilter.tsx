"use client";

import {
  ALL_PLACE_TYPES,
  PLACE_TYPE_LABELS,
} from "@/lib/biography/labels";
import type { PlaceType } from "@/lib/biography/types";

type PlaceTypeFilterProps = {
  selected: PlaceType[];
  onChange: (next: PlaceType[]) => void;
};

export function PlaceTypeFilter({ selected, onChange }: PlaceTypeFilterProps) {
  const selectedSet = new Set(selected);

  function toggle(type: PlaceType) {
    if (selectedSet.has(type)) {
      onChange(selected.filter((item) => item !== type));
      return;
    }
    onChange([...selected, type]);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-ink/70">Типы мест</span>
        <button
          type="button"
          className="text-xs text-accent underline-offset-2 hover:underline"
          onClick={() =>
            onChange(
              selected.length === ALL_PLACE_TYPES.length ? [] : [...ALL_PLACE_TYPES],
            )
          }
        >
          {selected.length === ALL_PLACE_TYPES.length
            ? "Сбросить"
            : "Все"}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {ALL_PLACE_TYPES.map((type) => {
          const active = selectedSet.has(type);
          return (
            <button
              key={type}
              type="button"
              onClick={() => toggle(type)}
              className={`rounded-md border px-2.5 py-1 text-xs transition ${
                active
                  ? "border-accent bg-accent-soft text-ink"
                  : "border-line bg-surface text-ink/60"
              }`}
            >
              {PLACE_TYPE_LABELS[type]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
