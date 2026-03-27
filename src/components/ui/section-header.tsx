type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  actions?: React.ReactNode;
  size?: "compact" | "default";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  actions,
  size = "default",
}: SectionHeaderProps) {
  const titleClass =
    size === "compact"
      ? "mt-1 text-xl font-semibold tracking-tight text-slate-900 md:text-2xl"
      : "mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl";

  return (
    <header className={["flex flex-wrap items-start justify-between gap-4", className ?? ""].join(" ")}>
      <div>
        {eyebrow ? (
          <p className="label-eyebrow">{eyebrow}</p>
        ) : null}
        <h1 className={titleClass}>{title}</h1>
        {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}
