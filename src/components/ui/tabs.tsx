"use client";

import type { ReactNode } from "react";

type TabListProps = {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
};

export function TabList({ children, className, "aria-label": ariaLabel }: TabListProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={[
        "inline-flex flex-wrap gap-px rounded-[var(--radius-sm)] border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-px shadow-[var(--shadow-xs)]",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

type TabProps = {
  id: string;
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
  className?: string;
};

export function Tab({ id, selected, onSelect, children, className }: TabProps) {
  return (
    <button
      id={id}
      type="button"
      role="tab"
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      onClick={onSelect}
      className={[
        "cursor-pointer rounded-[var(--radius-sm)] px-[length:var(--space-2)] py-[length:var(--space-1)] text-[length:var(--text-xs)] font-semibold transition-[color,background-color,border-color,box-shadow,transform]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]",
        "active:scale-[0.99]",
        selected
          ? "border border-[color:var(--border-strong)] bg-[color:var(--surface)] text-[color:var(--text)] shadow-[var(--shadow-xs)] ring-2 ring-[color:color-mix(in_srgb,var(--primary)_38%,transparent)] ring-offset-1 ring-offset-[color:var(--surface-muted)]"
          : "border border-transparent text-[color:var(--text-muted)] hover:bg-[color:color-mix(in_srgb,var(--surface)_70%,var(--surface-muted))] hover:text-[color:var(--text)]",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

type TabPanelProps = {
  id: string;
  labelledBy: string;
  hidden: boolean;
  children: ReactNode;
  className?: string;
};

export function TabPanel({ id, labelledBy, hidden, children, className }: TabPanelProps) {
  return (
    <div
      id={id}
      role="tabpanel"
      aria-labelledby={labelledBy}
      hidden={hidden}
      className={[
        "min-h-0 outline-none",
        hidden ? "" : "pt-[length:var(--layout-inline-gap)]",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
