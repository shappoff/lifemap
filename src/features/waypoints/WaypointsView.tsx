"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { PersonSelect } from "@/components/biography/PersonSelect";
import { PlaceTypeFilter } from "@/components/biography/PlaceTypeFilter";
import { PlaceTypeBadge } from "@/components/biography/PlaceTypeBadge";
import { AppShell } from "@/components/layout/AppShell";
import { filterPlaces } from "@/lib/biography";
import {
  ALL_PLACE_TYPES,
  formatDateRange,
  PLACE_TYPE_COLORS,
} from "@/lib/biography/labels";
import type { Person, PlaceType } from "@/lib/biography/types";
import { useResolvedPerson } from "@/hooks/useResolvedPerson";
import { withBasePath } from "@/lib/paths";
import { LEAFLET_ATTRIBUTION, LEAFLET_TILE_URL } from "@/lib/map-styles";
import "leaflet/dist/leaflet.css";

type WaypointsViewProps = {
  people: Person[];
};

function createDivIcon(color: string, active: boolean) {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:${active ? 18 : 14}px;height:${active ? 18 : 14}px;border-radius:9999px;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></span>`,
    iconSize: [active ? 18 : 14, active ? 18 : 14],
    iconAnchor: [active ? 9 : 7, active ? 9 : 7],
  });
}

function FitBounds({ places }: { places: { lat: number; lng: number }[] }) {
  const map = useMap();

  useEffect(() => {
    if (places.length === 0) return;
    const bounds = L.latLngBounds(places.map((place) => [place.lat, place.lng]));
    map.fitBounds(bounds.pad(0.25));
  }, [map, places]);

  return null;
}

export function WaypointsView({ people }: WaypointsViewProps) {
  const person = useResolvedPerson(people);
  const [types, setTypes] = useState<PlaceType[]>([...ALL_PLACE_TYPES]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const visiblePlaces = useMemo(
    () => filterPlaces(person.places, types),
    [person.places, types],
  );

  return (
    <AppShell
      title="Waypoints"
      subtitle={person.name}
      personQuery={person.id}
      sidebar={
        <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface/95 p-4 shadow-sm">
          <PersonSelect people={people} personId={person.id} />
          <PlaceTypeFilter selected={types} onChange={setTypes} />
          <p className="text-sm leading-relaxed text-ink/75">{person.bio}</p>
          <button
            type="button"
            className="rounded-lg bg-ink px-3 py-2 text-sm text-surface"
            onClick={() => setActiveId(null)}
          >
            Показать все точки
          </button>
          <ul className="max-h-72 space-y-2 overflow-auto">
            {visiblePlaces.map((place) => (
              <li key={place.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(place.id)}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                    activeId === place.id
                      ? "border-accent bg-accent-soft"
                      : "border-line bg-surface hover:bg-surface-muted"
                  }`}
                >
                  <span className="font-medium text-ink">{place.title}</span>
                  <span className="mt-1 block text-xs text-ink/60">
                    {formatDateRange(place.dateStart, place.dateEnd)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <div className="h-[75vh] overflow-hidden rounded-2xl border border-line shadow-sm">
        <MapContainer
          key={person.id}
          center={[person.defaultView.lat, person.defaultView.lng]}
          zoom={person.defaultView.zoom}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer attribution={LEAFLET_ATTRIBUTION} url={LEAFLET_TILE_URL} />
          <FitBounds places={visiblePlaces} />
          {visiblePlaces.map((place) => (
            <Marker
              key={place.id}
              position={[place.lat, place.lng]}
              icon={createDivIcon(
                PLACE_TYPE_COLORS[place.type],
                activeId === place.id,
              )}
              eventHandlers={{
                click: () => setActiveId(place.id),
              }}
            >
              <Popup>
                <div className="min-w-56 space-y-2">
                  <PlaceTypeBadge type={place.type} />
                  <strong className="block text-base">{place.title}</strong>
                  <p className="text-xs text-slate-600">
                    {formatDateRange(place.dateStart, place.dateEnd)}
                  </p>
                  <p className="text-sm">{place.summary}</p>
                  {place.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={withBasePath(place.images[0])}
                      alt={place.title}
                      className="h-28 w-full rounded object-cover"
                    />
                  ) : null}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </AppShell>
  );
}
