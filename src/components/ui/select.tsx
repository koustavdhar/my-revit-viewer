import { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select(props: SelectProps) {
  const { className, children, ...rest } = props;
  return (
    <select
      className={[
        "w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300",
        className ?? "",
      ].join(" ")}
      {...rest}
    >
      {children}
    </select>
  );
}
