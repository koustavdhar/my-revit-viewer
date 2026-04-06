import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input(props: InputProps) {
  const { className, ...rest } = props;
  return (
    <input
      className={[
        "ui-focus-ring h-7 w-full cursor-text rounded-[var(--radius-sm)] border border-[color:var(--border-strong)]",
        "bg-[color:var(--surface)] px-2 text-[length:var(--text-xs)] text-[color:var(--text)] shadow-[var(--shadow-xs)]",
        "transition-[border-color,box-shadow] placeholder:text-[color:var(--text-subtle)]",
        "hover:border-[color:color-mix(in_srgb,var(--primary)_22%,var(--border-strong))]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className ?? "",
      ].join(" ")}
      {...rest}
    />
  );
}
