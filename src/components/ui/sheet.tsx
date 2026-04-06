"use client";

import { useEffect, useRef, type ReactNode } from "react";

export type SheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  side?: "right" | "left";
  className?: string;
};

/**
 * Slide-over panel using `<dialog>` — GIS/BIM inspector pattern without new dependencies.
 */
export function Sheet({ open, onClose, title, children, side = "right", className }: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  const position =
    side === "right"
      ? "ml-auto mr-0 rounded-[var(--radius-lg)] rounded-r-none border-r-0"
      : "mr-auto ml-0 rounded-[var(--radius-lg)] rounded-l-none border-l-0";

  return (
    <dialog
      ref={ref}
      className={[
        "enterprise-sheet fixed top-0 m-0 h-dvh max-h-dvh w-[min(22rem,calc(100vw-1rem))] max-w-full overflow-hidden p-0",
        position,
        className ?? "",
      ].join(" ")}
      onClose={() => onClose()}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="flex h-full flex-col">
        <header className="flex shrink-0 items-center justify-between gap-2 border-b border-[color:var(--border)] px-3 py-2">
          <h2 className="text-[length:var(--text-sm)] font-semibold tracking-tight text-[color:var(--text)]">{title}</h2>
          <button
            type="button"
            onClick={() => onClose()}
            className="ui-focus-ring rounded-[var(--radius-sm)] px-2 py-1 text-[length:var(--text-xs)] font-semibold text-[color:var(--text-muted)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--text)]"
          >
            Close
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2.5 text-[length:var(--text-xs)] text-[color:var(--text)]">
          {children}
        </div>
      </div>
    </dialog>
  );
}
