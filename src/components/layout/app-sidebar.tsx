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
  { label: "Projects", href: "/projects/p-001", matches: ["/projects"] },
  { label: "Viewer", href: "/viewer/p-001", matches: ["/viewer"] },
  { label: "Settings", href: "/settings", matches: ["/settings"] },
  { label: "Integration Setup", href: "/integration-setup", matches: ["/integration-setup"] },
];

export default function AppSidebar() {
  const pathname = usePathname();

  function isActive(item: NavItem) {
    return item.matches.some((prefix) => pathname.startsWith(prefix));
  }

  return (
    <aside className="hidden border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="border-b border-slate-200 px-4 py-4">
        <Link href="/" className="text-sm font-semibold tracking-tight text-slate-900">
          My Revit Viewer
        </Link>
        <p className="mt-1 text-xs text-slate-500">Read-only BIM review platform</p>
      </div>

      <nav className="space-y-1 px-3 py-3 text-sm">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={[
                "block rounded-md px-3 py-2",
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100",
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
