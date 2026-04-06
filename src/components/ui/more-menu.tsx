"use client";

import type { ReactNode } from "react";

type MoreMenuItem = {
  key: string;
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export function MoreMenu({
  label = "More",
  items,
  align = "right",
  className,
}: {
  label?: string;
  items: MoreMenuItem[];
  align?: "left" | "right";
  className?: string;
}) {
  const side = align === "right" ? "right-0" : "left-0";

  return (
    <details className={["relative", className ?? ""].join(" ")}>
      <summary
        className={[
          "ui-focus-ring inline-flex list-none cursor-pointer select-none items-center justify-center rounded-[var(--radius-sm)] border border-[color:var(--border-subtle)]",
          "h-7 min-h-7 px-2.5 text-[length:var(--text-xs)] font-bold text-[color:var(--text-muted)] shadow-none",
          "bg-transparent transition-[color,background-color,border-color,transform] hover:border-[color:var(--border)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--text)]",
          "active:scale-[0.99] active:bg-[color:color-mix(in_srgb,var(--surface-muted)_85%,var(--primary-50))]",
          "focus-visible:outline-none",
        ].join(" ")}
        aria-label={label}
      >
        {label}
        <span className="ml-1 text-[color:var(--text-subtle)]" aria-hidden>
          ▾
        </span>
      </summary>

      <div
        className={[
          "absolute z-50 mt-1 min-w-[12rem] overflow-hidden rounded-[var(--radius-md)] border border-[color:var(--border)]",
          "bg-[color:var(--surface)] shadow-[var(--shadow-md)]",
          side,
        ].join(" ")}
        role="menu"
      >
        <ul className="p-1">
          {items.map((item) => (
            <li key={item.key}>
              <MenuRow disabled={item.disabled}>
                {item.href ? (
                  <a
                    href={item.href}
                    className={rowClass(item.disabled)}
                    role="menuitem"
                    onClick={(e) => {
                      if (item.disabled) e.preventDefault();
                      closeMenu(e.currentTarget);
                    }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    type="button"
                    className={rowClass(item.disabled)}
                    role="menuitem"
                    disabled={item.disabled}
                    onClick={(e) => {
                      item.onClick?.();
                      closeMenu(e.currentTarget);
                    }}
                  >
                    {item.label}
                  </button>
                )}
              </MenuRow>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}

function rowClass(disabled?: boolean) {
  return [
    "ui-focus-ring flex w-full items-center justify-between rounded-[var(--radius-sm)] px-2 py-1.5",
    "text-[length:var(--text-xs)] font-semibold text-left transition-[background-color,color,transform]",
    disabled
      ? "cursor-not-allowed text-[color:var(--text-subtle)]"
      : "cursor-pointer text-[color:var(--text)] hover:bg-[color:color-mix(in_srgb,var(--primary-50)_35%,var(--surface-muted))] active:scale-[0.99]",
    "focus-visible:outline-none",
  ].join(" ");
}

function MenuRow({ children, disabled }: { children: ReactNode; disabled?: boolean }) {
  return <div className={disabled ? "opacity-70" : ""}>{children}</div>;
}

function closeMenu(el: HTMLElement) {
  const root = el.closest("details");
  if (root) root.removeAttribute("open");
}
