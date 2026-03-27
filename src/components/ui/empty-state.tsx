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
        "rounded-md border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center",
        className ?? "",
      ].join(" ")}
    >
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path
            d="M4.5 7.5h15m-15 4.5h15m-15 4.5h9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{message}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
