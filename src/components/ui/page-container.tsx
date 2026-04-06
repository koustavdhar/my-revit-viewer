type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
};

/** Page content wrapper — sits inside root `<main>`. Use `flex-1 min-h-0 flex flex-col` for full-bleed app views (e.g. viewer). */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={[
        "shell-content flex flex-1 flex-col gap-[length:var(--layout-section-gap)] py-[length:var(--shell-content-pad-y)]",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
