import type { ReactNode } from "react";

/**
 * Enterprise application shell — left nav, top header, scrollable main, optional inspector rail.
 * Compose inside `app/layout.tsx`; individual routes can later add a right rail via nested layouts.
 */

export function EnterpriseAppShell({ children }: { children: ReactNode }) {
  return (
    <div className="enterprise-shell-root grid min-h-dvh w-full grid-cols-1 lg:grid-cols-[var(--shell-sidebar-width)_minmax(0,1fr)]">
      {children}
    </div>
  );
}

export function EnterpriseMainColumn({ children }: { children: ReactNode }) {
  return <div className="enterprise-shell-main">{children}</div>;
}

type EnterpriseAppHeaderProps = {
  eyebrow?: string;
  title: string;
  actions?: ReactNode;
};

export function EnterpriseAppHeader({ eyebrow, title, actions }: EnterpriseAppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 shrink-0">
      <div className="header-gradient-accent w-full" aria-hidden />
      <div className="enterprise-shell-header flex items-center justify-between gap-[length:var(--layout-inline-gap)] px-[length:var(--shell-content-pad-x)]">
        <div className="flex min-w-0 items-center gap-[length:var(--layout-inline-gap)]">
          {eyebrow ? (
            <>
              <span className="shrink-0 text-[length:var(--text-2xs)] font-bold uppercase tracking-[0.12em] text-[color:var(--text-subtle)]">
                {eyebrow}
              </span>
              <span className="shrink-0 text-[color:var(--border-strong)] select-none" aria-hidden>
                /
              </span>
            </>
          ) : null}
          <p className="truncate text-[length:var(--text-xs)] font-bold leading-none tracking-tight text-[color:var(--text)]">
            {title}
          </p>
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-[length:var(--layout-inline-gap)]">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}

export function EnterpriseAppMain({ children }: { children: ReactNode }) {
  return (
    <main id="app-main" className="flex min-h-0 flex-1 flex-col overflow-auto">
      {children}
    </main>
  );
}

/** Optional right utility / inspector column (e.g. metadata, tools). Hidden below `xl` by default — pass className to override. */
export function EnterpriseInspectorRail({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <aside
      className={[
        "enterprise-inspector-rail w-[min(20rem,32vw)] shrink-0 overflow-y-auto border-l border-[color:var(--border)] bg-[color:var(--surface)]",
        "hidden xl:block",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </aside>
  );
}
