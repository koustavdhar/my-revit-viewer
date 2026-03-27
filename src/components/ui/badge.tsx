type BadgeVariant = "neutral" | "primary" | "success" | "warning" | "error";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

function variantClass(variant: BadgeVariant) {
  if (variant === "primary") return "bg-sky-50 text-sky-700 border-sky-200";
  if (variant === "success") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (variant === "warning") return "bg-amber-50 text-amber-700 border-amber-200";
  if (variant === "error") return "bg-rose-50 text-rose-700 border-rose-200";
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
