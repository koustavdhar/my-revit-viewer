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
      ? "border-rose-200 bg-rose-50 text-rose-800"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-blue-200 bg-blue-50 text-blue-800";

  return (
    <div
      className={[
        "rounded-md border px-3 py-2 text-sm",
        toneClass,
        className ?? "",
      ].join(" ")}
      role="alert"
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      <p>{message}</p>
    </div>
  );
}
