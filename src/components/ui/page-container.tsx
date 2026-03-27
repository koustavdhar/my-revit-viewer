type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageContainer({ children, className }: PageContainerProps) {
  return <main className={["app-shell flex flex-1 py-8", className ?? ""].join(" ")}>{children}</main>;
}
