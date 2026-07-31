"use client";

import dynamic from "next/dynamic";
import type { Person } from "@/lib/biography/types";

const WaypointsView = dynamic(
  () =>
    import("@/features/waypoints/WaypointsView").then(
      (mod) => mod.WaypointsView,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="p-6 text-sm text-ink/60">Загрузка карты Waypoints…</div>
    ),
  },
);

type WaypointsPageClientProps = {
  people: Person[];
};

export function WaypointsPageClient({ people }: WaypointsPageClientProps) {
  return <WaypointsView people={people} />;
}
