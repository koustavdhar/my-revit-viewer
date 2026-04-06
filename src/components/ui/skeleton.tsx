type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={[
        "animate-pulse rounded-[var(--radius-md)] bg-[color:color-mix(in_srgb,var(--border)_55%,var(--surface-muted))]",
        className ?? "",
      ].join(" ")}
      aria-hidden="true"
    />
  );
}
