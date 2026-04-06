type BadgeVariant = "neutral" | "primary" | "success" | "warning" | "error";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  /** `compact` for dense tables and toolbars — matches design-system rhythm. */
  size?: "default" | "compact";
  className?: string;
};

function variantClass(variant: BadgeVariant) {
  if (variant === "primary")
    return "bg-[color:var(--primary-50)] text-[color:var(--primary)] border-[color:var(--primary-100)]";
  if (variant === "success")
    return "bg-[color:var(--success-50)] text-[color:var(--success)] border-[color:color-mix(in_srgb,var(--success)_20%,white)]";
  if (variant === "warning")
    return "bg-[color:var(--warning-50)] text-[color:var(--warning)] border-[color:color-mix(in_srgb,var(--warning)_20%,white)]";
  if (variant === "error")
    return "bg-[color:var(--error-50)] text-[color:var(--error)] border-[color:color-mix(in_srgb,var(--error)_20%,white)]";
  return "bg-[color:var(--surface-muted)] text-[color:var(--text-muted)] border-[color:var(--border)]";
}

function sizeClass(size: "default" | "compact") {
  if (size === "compact") {
    return "min-h-[1.125rem] px-1 py-px text-[length:var(--text-2xs)] font-bold leading-none tracking-tight";
  }
  return "min-h-[1.25rem] px-1.5 py-0.5 text-[length:var(--text-xs)] font-semibold leading-none tracking-tight";
}

export function Badge({ children, variant = "neutral", size = "default", className }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center justify-center rounded-[var(--radius-sm)] border align-middle",
        sizeClass(size),
        variantClass(variant),
        className ?? "",
      ].join(" ")}
    >
      {children}
    </span>
  );
}
