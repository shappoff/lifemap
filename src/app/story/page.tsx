import { getAllPeople } from "@/lib/biography";
import { StoryView } from "@/features/story/StoryView";

export default function StoryPage() {
  return <StoryView people={getAllPeople()} />;
}
