type CardProps = {
  children: React.ReactNode;
  className?: string;
  muted?: boolean;
};

export function Card({ children, className, muted = false }: CardProps) {
  return (
    <section
      className={[
        "rounded-[var(--radius-lg)] border shadow-[var(--shadow-xs)]",
        muted
          ? "border-[color:var(--border-subtle)] bg-[color:var(--surface-muted)]"
          : "border-[color:var(--border)] bg-[color:var(--surface)]",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </section>
  );
}
