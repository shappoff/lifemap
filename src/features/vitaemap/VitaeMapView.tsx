"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Marker, type MapRef } from "react-map-gl/maplibre";
import { MapLibreMap } from "@/components/map/MapLibreMap";
import { PersonSelect } from "@/components/biography/PersonSelect";
import { PlaceDetails } from "@/components/biography/PlaceDetails";
import { AppShell } from "@/components/layout/AppShell";
import { sortByDate } from "@/lib/biography";
import { formatDateRange, PLACE_TYPE_COLORS } from "@/lib/biography/labels";
import type { Person, Place } from "@/lib/biography/types";
import { useResolvedPerson } from "@/hooks/useResolvedPerson";

type VitaeMapViewProps = {
  people: Person[];
};

export function VitaeMapView({ people }: VitaeMapViewProps) {
  const person = useResolvedPerson(people);
  const timeline = useMemo(() => sortByDate(person.places), [person.places]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    setHoveredId(null);
    setSelectedId(timeline[0]?.id ?? null);
  }, [person.id, timeline]);

  const focusId = selectedId ?? hoveredId;
  const focusPlace =
    timeline.find((place) => place.id === focusId) ?? timeline[0] ?? null;

  function focusOnPlace(place: Place, select = false) {
    if (select) setSelectedId(place.id);
    mapRef.current?.flyTo({
      center: [place.lng, place.lat],
      zoom: Math.max(person.defaultView.zoom + 2, 5.5),
      duration: 900,
    });
  }

  return (
    <AppShell
      title="VitaeMap"
      subtitle={person.name}
      activeHref="/vitaemap"
      personQuery={person.id}
    >
      <div className="mb-4 max-w-sm">
        <PersonSelect people={people} personId={person.id} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
        <div className="h-[55vh] overflow-hidden rounded-2xl border border-line shadow-sm lg:h-[75vh]">
          <MapLibreMap
            key={person.id}
            ref={mapRef}
            initialViewState={{
              latitude: person.defaultView.lat,
              longitude: person.defaultView.lng,
              zoom: person.defaultView.zoom,
            }}
          >
            {timeline.map((place) => {
              const emphasized =
                place.id === hoveredId || place.id === selectedId;
              return (
                <Marker
                  key={place.id}
                  longitude={place.lng}
                  latitude={place.lat}
                  anchor="center"
                  onClick={(event) => {
                    event.originalEvent.stopPropagation();
                    focusOnPlace(place, true);
                  }}
                >
                  <button
                    type="button"
                    aria-label={place.title}
                    onMouseEnter={() => setHoveredId(place.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`rounded-full border-2 border-white shadow transition ${
                      emphasized ? "h-5 w-5" : "h-3 w-3 opacity-80"
                    }`}
                    style={{ backgroundColor: PLACE_TYPE_COLORS[place.type] }}
                  />
                </Marker>
              );
            })}
          </MapLibreMap>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-line bg-surface/95 p-4 shadow-sm">
            {focusPlace ? (
              <PlaceDetails place={focusPlace} />
            ) : (
              <p className="text-sm text-ink/60">Выберите событие на таймлайне.</p>
            )}
          </div>

          <ol className="max-h-[40vh] space-y-2 overflow-auto rounded-2xl border border-line bg-surface/95 p-3 lg:max-h-[28vh]">
            {timeline.map((place, index) => {
              const active =
                place.id === selectedId || place.id === hoveredId;
              return (
                <li key={place.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setHoveredId(place.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => focusOnPlace(place, true)}
                    className={`flex w-full items-start gap-3 rounded-xl border px-3 py-2 text-left transition ${
                      active
                        ? "border-accent bg-accent-soft"
                        : "border-transparent hover:bg-surface-muted"
                    }`}
                  >
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-xs text-surface">
                      {index + 1}
                    </span>
                    <span>
                      <span className="block font-medium text-ink">
                        {place.title}
                      </span>
                      <span className="block text-xs text-ink/60">
                        {formatDateRange(place.dateStart, place.dateEnd)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </AppShell>
  );
}
