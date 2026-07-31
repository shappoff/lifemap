import { formatDateRange } from "@/lib/biography/labels";
import type { Place } from "@/lib/biography/types";
import { withBasePath } from "@/lib/paths";
import { PlaceTypeBadge } from "./PlaceTypeBadge";

type PlaceDetailsProps = {
  place: Place;
  compact?: boolean;
};

export function PlaceDetails({ place, compact = false }: PlaceDetailsProps) {
  return (
    <article className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <PlaceTypeBadge type={place.type} />
        <time className="text-xs text-ink/60">
          {formatDateRange(place.dateStart, place.dateEnd)}
        </time>
      </div>
      <div>
        <h2 className="font-display text-xl text-ink">{place.title}</h2>
        <p className="mt-1 text-sm text-ink/70">{place.summary}</p>
      </div>
      {!compact ? (
        <p className="text-sm leading-relaxed text-ink/85">{place.description}</p>
      ) : null}
      {place.images[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={withBasePath(place.images[0])}
          alt={place.title}
          className="h-40 w-full rounded-lg object-cover"
        />
      ) : null}
      {place.tags.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {place.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md bg-surface-muted px-2 py-0.5 text-xs text-ink/70"
            >
              #{tag}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
