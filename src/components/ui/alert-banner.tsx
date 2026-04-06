type AlertBannerProps = {
  title?: string;
  message: string;
  tone?: "info" | "warning" | "error";
  className?: string;
};

export function AlertBanner({
  title,
  message,
  tone = "info",
  className,
}: AlertBannerProps) {
  const toneClass =
    tone === "error"
      ? "border-[color:color-mix(in_srgb,var(--error)_28%,var(--border))] bg-[color:var(--error-50)] text-[color:var(--error)]"
      : tone === "warning"
        ? "border-[color:color-mix(in_srgb,var(--warning)_28%,var(--border))] bg-[color:var(--warning-50)] text-[color:var(--warning)]"
        : "border-[color:color-mix(in_srgb,var(--info)_22%,var(--border))] bg-[color:var(--info-50)] text-[color:var(--info)]";

  return (
    <div
      className={[
        "rounded-[var(--radius-sm)] border px-[length:var(--space-3)] py-[length:var(--space-2)] text-[length:var(--text-xs)] leading-snug shadow-[var(--shadow-xs)]",
        toneClass,
        className ?? "",
      ].join(" ")}
      role="alert"
    >
      {title ? <p className="font-bold tracking-tight">{title}</p> : null}
      <p className={title ? "mt-0.5 leading-snug text-inherit" : "leading-snug text-inherit"}>{message}</p>
    </div>
  );
}
