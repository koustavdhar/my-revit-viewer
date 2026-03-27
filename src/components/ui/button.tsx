import { ButtonHTMLAttributes } from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
  href?: string;
  target?: string;
  rel?: string;
};

function getVariantClass(variant: ButtonVariant) {
  if (variant === "primary") {
    return "bg-slate-900 text-white border border-slate-900 hover:bg-slate-800 focus-visible:ring-slate-400";
  }
  if (variant === "secondary") {
    return "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-300";
  }
  return "bg-transparent text-slate-600 border border-transparent hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-300";
}

function getSizeClass(size: ButtonSize) {
  if (size === "sm") {
    return "px-3 py-1.5 text-xs";
  }
  return "px-4 py-2 text-sm";
}

function baseClass(variant: ButtonVariant, size: ButtonSize, className?: string) {
  return [
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition",
    "focus-visible:outline-none focus-visible:ring-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    getSizeClass(size),
    getVariantClass(variant),
    className ?? "",
  ].join(" ");
}

export function Button(props: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const variant = props.variant ?? "secondary";
  const size = props.size ?? "md";
  if (props.href) {
    const { href, children, className, target, rel } = props;
    return (
      <Link href={href} target={target} rel={rel} className={baseClass(variant, size, className)}>
        {children}
      </Link>
    );
  }

  const { children, className, type, ...rest } = props;
  return (
    <button type={type ?? "button"} className={baseClass(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
