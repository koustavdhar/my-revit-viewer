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
      ? "mt-0.5 text-heading-md"
      : "mt-1 text-heading-lg";

  return (
    <header
      className={["flex flex-wrap items-center justify-between gap-[length:var(--layout-inline-gap)]", className ?? ""].join(
        " ",
      )}
    >
      <div className="min-w-0 flex-1">
        {eyebrow ? <p className="label-eyebrow">{eyebrow}</p> : null}
        <h1 className={titleClass}>{title}</h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-caption leading-relaxed">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-[length:var(--layout-inline-gap)]">{actions}</div>
      ) : null}
    </header>
  );
}
