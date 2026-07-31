"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { resolvePerson } from "@/lib/biography";
import type { Person } from "@/lib/biography/types";

export function useResolvedPerson(people: Person[]): Person {
  const searchParams = useSearchParams();
  const personId = searchParams.get("person");

  return useMemo(() => {
    if (personId) {
      return people.find((person) => person.id === personId) ?? people[0];
    }
    return resolvePerson(personId);
  }, [people, personId]);
}
