import type { ReactNode } from "react";

type AppShellProps = {
  sidebar?: ReactNode;
  children: ReactNode;
};

export function AppShell({ sidebar, children }: AppShellProps) {
  return (
    <div className="flex min-h-svh flex-col lg:h-svh lg:overflow-hidden">
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-4 lg:flex-row">
        {sidebar ? (
          <aside className="flex w-full shrink-0 flex-col lg:h-full lg:w-80 xl:w-96">
            {sidebar}
          </aside>
        ) : null}
        <main className="min-h-[70vh] min-w-0 flex-1 lg:flex lg:h-full lg:min-h-0 lg:flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
