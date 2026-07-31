import { getAllPeople } from "@/lib/biography";
import { ExplorerView } from "@/features/explorer/ExplorerView";

export default function ExplorerPage() {
  const people = getAllPeople();
  return <ExplorerView people={people} />;
}
