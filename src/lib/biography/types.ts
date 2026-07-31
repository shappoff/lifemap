import { z } from "zod";

export const placeTypeSchema = z.enum([
  "home",
  "education",
  "work",
  "travel",
  "event",
]);

export const placeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: placeTypeSchema,
  lat: z.number(),
  lng: z.number(),
  dateStart: z.string().min(1),
  dateEnd: z.string().optional(),
  summary: z.string().min(1),
  description: z.string().min(1),
  images: z.array(z.string()),
  tags: z.array(z.string()),
  importance: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  storyOrder: z.number().int().nonnegative(),
});

export const mapViewSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  zoom: z.number(),
});

export const personSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  years: z.string().min(1),
  portrait: z.string().min(1),
  bio: z.string().min(1),
  defaultView: mapViewSchema,
  places: z.array(placeSchema).min(1),
});

export const biographiesSchema = z.object({
  people: z.array(personSchema).min(1),
});

export type PlaceType = z.infer<typeof placeTypeSchema>;
export type Place = z.infer<typeof placeSchema>;
export type MapView = z.infer<typeof mapViewSchema>;
export type Person = z.infer<typeof personSchema>;
export type Biographies = z.infer<typeof biographiesSchema>;
