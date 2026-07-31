import { getDefaultPerson } from "@/lib/biography";
import { WaypointsPageClient } from "@/features/waypoints/WaypointsPageClient";

export default function WaypointsPage() {
  return <WaypointsPageClient person={getDefaultPerson()} />;
}
