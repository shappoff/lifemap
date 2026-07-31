import type { ReactNode } from "react";

type AppShellProps = {
  sidebar?: ReactNode;
  children: ReactNode;
};

export function AppShell({ sidebar, children }: AppShellProps) {
  return (
    <div className="flex h-svh flex-col overflow-hidden">
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-4 lg:flex-row">
        {sidebar ? (
          <aside className="flex min-h-0 flex-1 flex-col lg:h-full lg:w-80 lg:shrink-0 lg:flex-none xl:w-96">
            {sidebar}
          </aside>
        ) : null}
        <main className="flex h-[60%] min-h-0 min-w-0 shrink-0 flex-col lg:h-full lg:flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
