type CardProps = {
  children: React.ReactNode;
  className?: string;
  muted?: boolean;
};

export function Card({ children, className, muted = false }: CardProps) {
  return (
    <section
      className={[
        "rounded-xl border",
        muted ? "border-slate-200 bg-slate-50" : "border-slate-200 bg-white",
        "shadow-none",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </section>
  );
}
