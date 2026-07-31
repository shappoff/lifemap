import type { PlaceType } from "./types";

export const PLACE_TYPE_LABELS: Record<PlaceType, string> = {
  home: "Жильё",
  education: "Учёба",
  work: "Работа",
  travel: "Путешествие",
  event: "Событие",
};

export const PLACE_TYPE_COLORS: Record<PlaceType, string> = {
  home: "#0F766E",
  education: "#1D4ED8",
  work: "#B45309",
  travel: "#7C3AED",
  event: "#BE123C",
};

export const ALL_PLACE_TYPES = Object.keys(
  PLACE_TYPE_LABELS,
) as PlaceType[];

export function formatDatePart(value: string): string {
  const [year, month] = value.split("-");
  if (!month) return year;
  const months = [
    "янв",
    "фев",
    "мар",
    "апр",
    "май",
    "июн",
    "июл",
    "авг",
    "сен",
    "окт",
    "ноя",
    "дек",
  ];
  const monthIndex = Number(month) - 1;
  const monthLabel = months[monthIndex] ?? month;
  return `${monthLabel} ${year}`;
}

export function formatDateRange(start: string, end?: string): string {
  const from = formatDatePart(start);
  if (!end) return from;
  return `${from} — ${formatDatePart(end)}`;
}
