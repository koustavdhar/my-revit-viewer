type DividerProps = {
  className?: string;
};

export function Divider({ className }: DividerProps) {
  return <hr className={["border-0 border-t border-[color:var(--border-subtle)]", className ?? ""].join(" ")} />;
}
