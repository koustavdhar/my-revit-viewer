"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  matches: string[];
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", matches: ["/dashboard"] },
  { label: "Projects", href: "/projects/sp-bim-001", matches: ["/projects"] },
  { label: "Viewer", href: "/viewer/sp-bim-001", matches: ["/viewer"] },
  { label: "Settings", href: "/settings", matches: ["/settings"] },
  { label: "Integration", href: "/integration-setup", matches: ["/integration-setup"] },
];

export default function AppSidebar() {
  const pathname = usePathname();

  function isActive(item: NavItem) {
    return item.matches.some((prefix) => pathname.startsWith(prefix));
  }

  return (
    <aside className="hidden flex-col border-r border-[color:var(--border)] bg-[color:var(--surface-sidebar)] lg:flex">
      <div className="flex h-[var(--shell-header-height)] shrink-0 items-center border-b border-[color:var(--border-subtle)] px-[length:var(--shell-content-pad-x)]">
        <Link
          href="/"
          className="truncate text-[length:var(--text-xs)] font-bold leading-none tracking-tight text-[color:var(--text)] hover:text-[color:var(--primary)]"
        >
          My Revit Viewer
        </Link>
      </div>

      <nav
        className="flex flex-1 flex-col gap-px overflow-y-auto p-[length:var(--space-2)] text-[length:var(--text-xs)]"
        aria-label="Application"
      >
        <p className="label-key mb-px px-[length:var(--space-2)]">Navigate</p>
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={[
                "cursor-pointer rounded-[var(--radius-sm)] px-[length:var(--space-2)] py-[length:var(--space-2)] font-semibold leading-snug transition-[color,background-color,border-color,box-shadow,transform]",
                active
                  ? "border border-[color:var(--primary-100)] bg-[color:var(--primary-50)] text-[color:var(--text)] shadow-[var(--shadow-xs)] ring-2 ring-[color:color-mix(in_srgb,var(--primary)_32%,transparent)]"
                  : "border border-transparent text-[color:var(--text-muted)] hover:border-[color:var(--border-subtle)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--text)] active:scale-[0.99]",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
