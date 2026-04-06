import { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select(props: SelectProps) {
  const { className, children, ...rest } = props;
  return (
    <select
      className={[
        "ui-focus-ring h-7 w-full cursor-pointer rounded-[var(--radius-sm)] border border-[color:var(--border-strong)]",
        "bg-[color:var(--surface)] px-2 pr-7 text-[length:var(--text-xs)] text-[color:var(--text)] shadow-[var(--shadow-xs)]",
        "transition-[border-color,box-shadow,background-color] hover:border-[color:color-mix(in_srgb,var(--primary)_35%,var(--border-strong))] hover:bg-[color:color-mix(in_srgb,var(--primary-50)_12%,var(--surface))]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className ?? "",
      ].join(" ")}
      {...rest}
    >
      {children}
    </select>
  );
}
