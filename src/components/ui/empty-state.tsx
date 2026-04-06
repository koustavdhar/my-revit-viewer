import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  message: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, message, action, className }: EmptyStateProps) {
  return (
    <div
      className={[
        "rounded-[var(--radius-md)] border border-dashed border-[color:var(--border-strong)] bg-[color:var(--surface-muted)] px-[length:var(--card-padding)] py-[length:var(--card-padding)] text-center shadow-[var(--shadow-xs)]",
        className ?? "",
      ].join(" ")}
    >
      <div className="mx-auto mb-[length:var(--space-2)] flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-muted)] shadow-[var(--shadow-xs)]">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path
            d="M4.5 7.5h15m-15 4.5h15m-15 4.5h9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <p className="text-[length:var(--text-xs)] font-bold text-[color:var(--text)]">{title}</p>
      <p className="mt-0.5 text-[length:var(--text-xs)] leading-snug text-[color:var(--text-muted)]">{message}</p>
      {action ? (
        <div className="mt-[length:var(--space-3)] flex justify-center">{action}</div>
      ) : null}
    </div>
  );
}
