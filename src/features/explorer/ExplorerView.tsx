"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import {
  Layer,
  Popup,
  Source,
  type MapLayerMouseEvent,
  type MapRef,
} from "react-map-gl/maplibre";
import type {
  CircleLayerSpecification,
  SymbolLayerSpecification,
} from "maplibre-gl";
import { MapLibreMap } from "@/components/map/MapLibreMap";
import { PersonSelect } from "@/components/biography/PersonSelect";
import { PlaceDetails } from "@/components/biography/PlaceDetails";
import { PlaceTypeFilter } from "@/components/biography/PlaceTypeFilter";
import { AppShell } from "@/components/layout/AppShell";
import { filterPlaces, toGeoJSON } from "@/lib/biography";
import { ALL_PLACE_TYPES, PLACE_TYPE_COLORS } from "@/lib/biography/labels";
import type { Person, Place, PlaceType } from "@/lib/biography/types";
import { useResolvedPerson } from "@/hooks/useResolvedPerson";
import { withBasePath } from "@/lib/paths";

type ExplorerViewProps = {
  people: Person[];
};

const clusterLayer: CircleLayerSpecification = {
  id: "clusters",
  type: "circle",
  source: "places",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": "#0f6b63",
    "circle-radius": ["step", ["get", "point_count"], 16, 4, 22, 8, 28],
    "circle-opacity": 0.85,
  },
};

const clusterCountLayer: SymbolLayerSpecification = {
  id: "cluster-count",
  type: "symbol",
  source: "places",
  filter: ["has", "point_count"],
  layout: {
    "text-field": "{point_count_abbreviated}",
    "text-size": 12,
  },
  paint: {
    "text-color": "#ffffff",
  },
};

const unclusteredLayer: CircleLayerSpecification = {
  id: "unclustered-point",
  type: "circle",
  source: "places",
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-color": [
      "match",
      ["get", "type"],
      "home",
      PLACE_TYPE_COLORS.home,
      "education",
      PLACE_TYPE_COLORS.education,
      "work",
      PLACE_TYPE_COLORS.work,
      "travel",
      PLACE_TYPE_COLORS.travel,
      "event",
      PLACE_TYPE_COLORS.event,
      "#64748b",
    ],
    "circle-radius": [
      "interpolate",
      ["linear"],
      ["get", "importance"],
      1,
      6,
      3,
      11,
    ],
    "circle-stroke-width": 2,
    "circle-stroke-color": "#ffffff",
  },
};

export function ExplorerView({ people }: ExplorerViewProps) {
  const person = useResolvedPerson(people);
  const mapRef = useRef<MapRef>(null);
  const [types, setTypes] = useState<PlaceType[]>([...ALL_PLACE_TYPES]);
  const [selected, setSelected] = useState<Place | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [person.id]);

  const visiblePlaces = useMemo(
    () => filterPlaces(person.places, types),
    [person.places, types],
  );

  const geojson = useMemo(
    () => toGeoJSON(visiblePlaces, person.id),
    [visiblePlaces, person.id],
  );

  async function onClick(event: MapLayerMouseEvent) {
    const feature = event.features?.[0];
    if (!feature) {
      setSelected(null);
      return;
    }

    if (feature.properties?.cluster) {
      const map = mapRef.current;
      const clusterId = feature.properties.cluster_id as number;
      const source = map?.getSource("places");
      if (
        source &&
        "getClusterExpansionZoom" in source &&
        typeof source.getClusterExpansionZoom === "function"
      ) {
        const zoom = await source.getClusterExpansionZoom(clusterId);
        const geometry = feature.geometry as GeoJSON.Point;
        map?.easeTo({
          center: geometry.coordinates as [number, number],
          zoom,
        });
      }
      return;
    }

    const placeId = feature.properties?.id as string | undefined;
    const place = person.places.find((item) => item.id === placeId) ?? null;
    setSelected(place);
  }

  return (
    <AppShell
      title="Explorer"
      subtitle={person.name}
      activeHref="/explorer"
      personQuery={person.id}
      sidebar={
        <div className="flex h-full flex-col gap-4 rounded-2xl border border-line bg-surface/95 p-4 shadow-sm">
          <PersonSelect people={people} personId={person.id} />
          <PlaceTypeFilter selected={types} onChange={setTypes} />
          <div className="rounded-xl bg-accent-soft/60 p-3 text-sm text-ink/80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={withBasePath(person.portrait)}
              alt={person.name}
              className="mb-3 h-24 w-full rounded-lg object-cover"
            />
            <p className="font-display text-lg text-ink">{person.name}</p>
            <p className="text-xs text-ink/60">{person.years}</p>
            <p className="mt-2 leading-relaxed">{person.bio}</p>
          </div>
          <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-line p-3">
            {selected ? (
              <PlaceDetails place={selected} />
            ) : (
              <p className="text-sm text-ink/60">
                Выберите маркер на карте, чтобы открыть описание места.
              </p>
            )}
          </div>
        </div>
      }
    >
      <div className="h-[75vh] overflow-hidden rounded-2xl border border-line shadow-sm">
        <MapLibreMap
          key={person.id}
          ref={mapRef}
          initialViewState={{
            latitude: person.defaultView.lat,
            longitude: person.defaultView.lng,
            zoom: person.defaultView.zoom,
          }}
          interactiveLayerIds={["clusters", "unclustered-point"]}
          onClick={onClick}
          cursor="pointer"
        >
          <Source
            id="places"
            type="geojson"
            data={geojson}
            cluster
            clusterMaxZoom={12}
            clusterRadius={44}
          >
            <Layer {...clusterLayer} />
            <Layer {...clusterCountLayer} />
            <Layer {...unclusteredLayer} />
          </Source>
          {selected ? (
            <Popup
              longitude={selected.lng}
              latitude={selected.lat}
              anchor="bottom"
              onClose={() => setSelected(null)}
              closeOnClick={false}
            >
              <strong>{selected.title}</strong>
            </Popup>
          ) : null}
        </MapLibreMap>
      </div>
    </AppShell>
  );
}
