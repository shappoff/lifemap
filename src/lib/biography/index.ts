import raw from "../../../data/biographies.json";
import {
  biographiesSchema,
  type Place,
  type PlaceFeatureCollection,
  type PlaceType,
  type Person,
} from "./types";

const biographies = biographiesSchema.parse(raw);

export function getAllPeople(): Person[] {
  return biographies.people;
}

export function getPerson(id: string): Person | undefined {
  return biographies.people.find((person) => person.id === id);
}

export function getDefaultPerson(): Person {
  return biographies.people[0];
}

export function resolvePerson(personId?: string | null): Person {
  if (!personId) return getDefaultPerson();
  return getPerson(personId) ?? getDefaultPerson();
}

export function filterPlaces(
  places: Place[],
  types: PlaceType[] | null,
): Place[] {
  if (!types || types.length === 0) return places;
  const set = new Set(types);
  return places.filter((place) => set.has(place.type));
}

export function sortByStoryOrder(places: Place[]): Place[] {
  return [...places].sort((a, b) => a.storyOrder - b.storyOrder);
}

export function sortByDate(places: Place[]): Place[] {
  return [...places].sort((a, b) => a.dateStart.localeCompare(b.dateStart));
}

export function toGeoJSON(
  places: Place[],
  personId: string,
): PlaceFeatureCollection {
  return {
    type: "FeatureCollection",
    features: places.map((place) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [place.lng, place.lat],
      },
      properties: {
        ...place,
        personId,
      },
    })),
  };
}

export function findPlace(person: Person, placeId: string): Place | undefined {
  return person.places.find((place) => place.id === placeId);
}
