"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MapRef } from "react-map-gl/maplibre";
import { Marker } from "react-map-gl/maplibre";
import { MapLibreMap } from "@/components/map/MapLibreMap";
import { PersonSelect } from "@/components/biography/PersonSelect";
import { PlaceTypeBadge } from "@/components/biography/PlaceTypeBadge";
import { AppShell } from "@/components/layout/AppShell";
import { sortByStoryOrder } from "@/lib/biography";
import { formatDateRange, PLACE_TYPE_COLORS } from "@/lib/biography/labels";
import type { Person, Place } from "@/lib/biography/types";
import { useResolvedPerson } from "@/hooks/useResolvedPerson";
import { withBasePath } from "@/lib/paths";
import { MAP_STYLE_VOYAGER } from "@/lib/map-styles";

type StoryViewProps = {
  people: Person[];
};

export function StoryView({ people }: StoryViewProps) {
  const person = useResolvedPerson(people);
  const chapters = useMemo(
    () => sortByStoryOrder(person.places),
    [person.places],
  );
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? "");
  const mapRef = useRef<MapRef>(null);
  const chapterRefs = useRef<Record<string, HTMLElement | null>>({});

  const activePlace = chapters.find((place) => place.id === activeId) ?? chapters[0];

  useEffect(() => {
    setActiveId(chapters[0]?.id ?? "");
  }, [person.id, chapters]);

  useEffect(() => {
    if (!activePlace || !mapRef.current) return;
    mapRef.current.flyTo({
      center: [activePlace.lng, activePlace.lat],
      zoom: Math.max(person.defaultView.zoom + 2.5, 6),
      duration: 1400,
      essential: true,
    });
  }, [activePlace, person.defaultView.zoom]);

  useEffect(() => {
    const nodes = chapters
      .map((chapter) => chapterRefs.current[chapter.id])
      .filter(Boolean) as HTMLElement[];

    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveId(visible.target.id.replace("chapter-", ""));
        }
      },
      {
        root: null,
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0.2, 0.5, 0.8],
      },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [chapters, person.id]);

  return (
    <AppShell
      title="Story"
      subtitle={person.name}
      activeHref="/story"
      personQuery={person.id}
    >
      <div className="mb-4 max-w-sm">
        <PersonSelect people={people} personId={person.id} />
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <div className="sticky top-4 h-[70vh] overflow-hidden rounded-2xl border border-line shadow-sm lg:h-[calc(100vh-7rem)]">
          <MapLibreMap
            key={person.id}
            ref={mapRef}
            mapStyle={MAP_STYLE_VOYAGER}
            initialViewState={{
              latitude: person.defaultView.lat,
              longitude: person.defaultView.lng,
              zoom: person.defaultView.zoom,
            }}
          >
            {chapters.map((place) => (
              <Marker
                key={place.id}
                longitude={place.lng}
                latitude={place.lat}
                anchor="center"
              >
                <span
                  className={`block h-3.5 w-3.5 rounded-full border-2 border-white shadow ${
                    place.id === activePlace?.id ? "scale-150" : "opacity-70"
                  }`}
                  style={{ backgroundColor: PLACE_TYPE_COLORS[place.type] }}
                />
              </Marker>
            ))}
          </MapLibreMap>
        </div>

        <div className="space-y-6 pb-24">
          <header className="rounded-2xl border border-line bg-surface/95 p-5">
            <p className="text-sm text-ink/60">{person.years}</p>
            <h2 className="font-display text-3xl text-ink">{person.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">{person.bio}</p>
          </header>
          {chapters.map((place, index) => (
            <StoryChapter
              key={place.id}
              place={place}
              index={index}
              active={place.id === activePlace?.id}
              setRef={(node) => {
                chapterRefs.current[place.id] = node;
              }}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

type StoryChapterProps = {
  place: Place;
  index: number;
  active: boolean;
  setRef: (node: HTMLElement | null) => void;
};

function StoryChapter({ place, index, active, setRef }: StoryChapterProps) {
  return (
    <section
      id={`chapter-${place.id}`}
      ref={setRef}
      className={`rounded-2xl border p-5 transition ${
        active
          ? "border-accent bg-surface shadow-md"
          : "border-line bg-surface/80"
      }`}
    >
      <p className="text-xs uppercase tracking-wider text-ink/50">
        Глава {index + 1}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <PlaceTypeBadge type={place.type} />
        <time className="text-xs text-ink/60">
          {formatDateRange(place.dateStart, place.dateEnd)}
        </time>
      </div>
      <h3 className="mt-3 font-display text-2xl text-ink">{place.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink/80">{place.description}</p>
      {place.images[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={withBasePath(place.images[0])}
          alt={place.title}
          className="mt-4 h-44 w-full rounded-xl object-cover"
        />
      ) : null}
    </section>
  );
}
