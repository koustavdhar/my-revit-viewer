type BadgeVariant = "neutral" | "primary" | "success" | "warning" | "error";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
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
  return "bg-slate-100 text-slate-700 border-slate-200";
}

export function Badge({ children, variant = "neutral", className }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        variantClass(variant),
        className ?? "",
      ].join(" ")}
    >
      {children}
    </span>
  );
}
