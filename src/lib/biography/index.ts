import raw from "../../../data/biographies.json";
import { biographiesSchema, type Place, type Person } from "./types";

const biographies = biographiesSchema.parse(raw);

export function getDefaultPerson(): Person {
  return biographies.people[0];
}

export function findPlace(person: Person, placeId: string): Place | undefined {
  return person.places.find((place) => place.id === placeId);
}
