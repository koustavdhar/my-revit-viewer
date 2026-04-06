"use client";

import { useEffect, useRef, type ReactNode } from "react";

export type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

/**
 * Native `<dialog>` modal — centered, token-driven chrome. No extra dependencies.
 */
export function Dialog({ open, onClose, title, description, children, footer, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
    }
    if (!open && el.open) {
      el.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={[
        "enterprise-dialog w-[min(28rem,calc(100vw-1.5rem))] max-w-[calc(100vw-1.5rem)] overflow-hidden",
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
      <header className="border-b border-[color:var(--border)] px-3 py-2">
        <h2 className="text-[length:var(--text-md)] font-semibold tracking-tight text-[color:var(--text)]">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-[length:var(--text-sm)] text-[color:var(--text-muted)]">{description}</p>
        ) : null}
      </header>
      <div className="max-h-[min(24rem,55dvh)] overflow-y-auto px-3 py-2.5 text-[length:var(--text-xs)] text-[color:var(--text)]">
        {children}
      </div>
      {footer ? (
        <footer className="flex flex-wrap justify-end gap-1.5 border-t border-[color:var(--border)] bg-[color:var(--surface-muted)] px-3 py-2">
          {footer}
        </footer>
      ) : null}
    </dialog>
  );
}
