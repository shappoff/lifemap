import { getDefaultPerson } from "@/lib/biography";
import { WaypointsPageClient } from "@/features/waypoints/WaypointsPageClient";

export default function HomePage() {
  return <WaypointsPageClient person={getDefaultPerson()} />;
}
