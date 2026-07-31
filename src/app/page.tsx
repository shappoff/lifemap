import Link from "next/link";
import { getAllPeople } from "@/lib/biography";
import { withBasePath } from "@/lib/paths";

const MODES = [
  {
    href: "/explorer",
    title: "Explorer",
    text: "Свободный просмотр: кластеры, фильтры по типу и боковая карточка места.",
  },
  {
    href: "/story",
    title: "Story",
    text: "Scrollytelling: главы биографии ведут карту от места к месту.",
  },
  {
    href: "/waypoints",
    title: "Waypoints",
    text: "Leaflet-карта с фото в попапах и переключаемыми слоями типов мест.",
  },
  {
    href: "/vitaemap",
    title: "VitaeMap",
    text: "Связка карты и вертикального таймлайна: наведение и клик синхронизированы.",
  },
] as const;

export default function HomePage() {
  const people = getAllPeople();
  const defaultPerson = people[0];

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-12 px-4 py-16">
        <section className="max-w-3xl">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-accent">
            Life Map
          </p>
          <h1 className="font-display text-5xl leading-tight text-ink md:text-6xl">
            Жизнь на карте
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/75">
            Четыре режима исследования одной JSON-биографии: от свободного
            explorer до scroll-driven истории. Данные — пути писателей.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {MODES.map((mode) => (
            <Link
              key={mode.href}
              href={`${mode.href}?person=${defaultPerson.id}`}
              className="group rounded-2xl border border-line bg-surface/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
            >
              <h2 className="font-display text-2xl text-ink group-hover:text-accent">
                {mode.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{mode.text}</p>
            </Link>
          ))}
        </section>

        <section className="rounded-2xl border border-line bg-surface/80 p-6">
          <h2 className="font-display text-xl text-ink">Персоны в данных</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {people.map((person) => (
              <li key={person.id} className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={withBasePath(person.portrait)}
                  alt={person.name}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-ink">{person.name}</p>
                  <p className="text-xs text-ink/60">{person.years}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
