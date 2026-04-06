import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";

/** Scroll + border wrapper for dense enterprise data tables. */
export function TableShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={[
        "overflow-x-auto rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[var(--shadow-xs)]",
        className ?? "",
      ].join(" ")}
    >
      <table className="w-full min-w-[28rem] border-collapse text-left text-[length:var(--text-xs)] [&_th]:align-middle [&_td]:align-middle">
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <thead
      className={[
        "border-b border-[color:var(--border)] bg-[color:var(--surface-muted)]",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </thead>
  );
}

export function TableBody({ children, className }: { children: ReactNode; className?: string }) {
  return <tbody className={["divide-y divide-[color:var(--border-subtle)]", className ?? ""].join(" ")}>{children}</tbody>;
}

export function TableRow({ children, className, ...rest }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={[
        "cursor-default transition-[background-color,box-shadow] hover:bg-[color:color-mix(in_srgb,var(--primary-50)_52%,var(--surface-muted))] hover:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--primary)_12%,transparent)]",
        className ?? "",
      ].join(" ")}
      {...rest}
    >
      {children}
    </tr>
  );
}

export function TableTh({ children, className, ...rest }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={[
        "px-[length:var(--space-3)] py-[length:var(--space-2)] text-[length:var(--text-2xs)] font-bold tracking-wide text-[color:var(--text-muted)]",
        className ?? "",
      ].join(" ")}
      {...rest}
    >
      {children}
    </th>
  );
}

export function TableTd({ children, className, ...rest }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={[
        "px-[length:var(--space-3)] py-[length:var(--space-2)] text-[length:var(--text-xs)] text-[color:var(--text)]",
        className ?? "",
      ].join(" ")}
      {...rest}
    >
      {children}
    </td>
  );
}
