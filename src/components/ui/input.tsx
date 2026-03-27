import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input(props: InputProps) {
  const { className, ...rest } = props;
  return (
    <input
      className={[
        "w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900",
        "placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300",
        className ?? "",
      ].join(" ")}
      {...rest}
    />
  );
}
