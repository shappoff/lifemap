import Link from "next/link";
import type { ReactNode } from "react";

const MODES = [
  { href: "/explorer", label: "Explorer" },
  { href: "/story", label: "Story" },
  { href: "/waypoints", label: "Waypoints" },
  { href: "/vitaemap", label: "VitaeMap" },
] as const;

type AppShellProps = {
  title: string;
  subtitle?: string;
  activeHref?: string;
  personQuery?: string;
  sidebar?: ReactNode;
  children: ReactNode;
};

export function AppShell({
  title,
  subtitle,
  activeHref,
  personQuery,
  sidebar,
  children,
}: AppShellProps) {
  const query = personQuery ? `?person=${personQuery}` : "";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line/80 bg-surface/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <div>
            <Link href="/" className="font-display text-lg text-ink">
              Life Map
            </Link>
            <p className="text-sm text-ink/65">
              {title}
              {subtitle ? ` · ${subtitle}` : null}
            </p>
          </div>
          <nav className="flex flex-wrap gap-1">
            {MODES.map((mode) => {
              const active = activeHref === mode.href;
              return (
                <Link
                  key={mode.href}
                  href={`${mode.href}${query}`}
                  className={`rounded-md px-3 py-1.5 text-sm transition ${
                    active
                      ? "bg-ink text-surface"
                      : "text-ink/75 hover:bg-surface-muted"
                  }`}
                >
                  {mode.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-4 lg:flex-row">
        {sidebar ? (
          <aside className="w-full shrink-0 lg:w-80 xl:w-96">{sidebar}</aside>
        ) : null}
        <main className="min-h-[70vh] min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
