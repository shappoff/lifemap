import { getAllPeople } from "@/lib/biography";
import { VitaeMapView } from "@/features/vitaemap/VitaeMapView";

export default function VitaeMapPage() {
  return <VitaeMapView people={getAllPeople()} />;
}
