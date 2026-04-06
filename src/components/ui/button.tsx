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
  /** Passed through when `href` is set (Link). */
  "aria-label"?: string;
  title?: string;
};

function getVariantClass(variant: ButtonVariant) {
  if (variant === "primary") {
    return [
      "border border-transparent text-white shadow-[var(--shadow-xs)]",
      "bg-[color:var(--primary)] hover:bg-[color:var(--primary-700)] hover:brightness-[1.03]",
      "active:brightness-[0.96] active:scale-[0.99]",
      "focus-visible:ring-[color:var(--primary)]",
    ].join(" ");
  }
  if (variant === "secondary") {
    return [
      "border border-[color:var(--border-subtle)] bg-[color:color-mix(in_srgb,var(--surface)_78%,var(--background))] text-[color:var(--text-muted)]",
      "shadow-none hover:border-[color:var(--border)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--text)]",
      "active:bg-[color:color-mix(in_srgb,var(--surface-muted)_88%,var(--primary-50))] active:scale-[0.99]",
      "focus-visible:ring-[color:var(--border)]",
    ].join(" ");
  }
  return [
    "border border-transparent bg-transparent text-[color:var(--text-muted)]",
    "hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--text)]",
    "active:bg-[color:color-mix(in_srgb,var(--surface-muted)_90%,var(--primary-50))] active:scale-[0.99]",
    "focus-visible:ring-[color:var(--border)]",
  ].join(" ");
}

function getSizeClass(size: ButtonSize) {
  if (size === "sm") {
    return "h-6 min-h-6 px-2 text-[length:var(--text-2xs)]";
  }
  return "h-7 min-h-7 px-2.5 text-[length:var(--text-xs)]";
}

function baseClass(variant: ButtonVariant, size: ButtonSize, className?: string) {
  return [
    "ui-focus-ring box-border inline-flex cursor-pointer items-center justify-center gap-1 rounded-[var(--radius-sm)] font-bold transition-[color,background-color,border-color,transform,box-shadow,filter]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
    getSizeClass(size),
    getVariantClass(variant),
    className ?? "",
  ].join(" ");
}

export function Button(props: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const variant = props.variant ?? "secondary";
  const size = props.size ?? "md";
  if (props.href) {
    const { href, children, className, target, rel, "aria-label": ariaLabel, title } = props;
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className={baseClass(variant, size, className)}
        aria-label={ariaLabel}
        title={title}
      >
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
