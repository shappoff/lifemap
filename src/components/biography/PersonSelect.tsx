"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { Person } from "@/lib/biography/types";

type PersonSelectProps = {
  people: Person[];
  personId: string;
};

export function PersonSelect({ people, personId }: PersonSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-ink/70">Персона</span>
      <select
        className="rounded-lg border border-line bg-surface px-3 py-2 text-ink shadow-sm outline-none focus:border-accent"
        value={personId}
        onChange={(event) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("person", event.target.value);
          router.push(`${pathname}?${params.toString()}`);
        }}
      >
        {people.map((person) => (
          <option key={person.id} value={person.id}>
            {person.name}
          </option>
        ))}
      </select>
    </label>
  );
}
