import type { ReactNode } from "react";

/**
 * Viewer routes fill the app main column and avoid nested page scroll.
 * Child pages (e.g. ViewerShell) own internal scrolling inside the canvas/panels.
 */
export default function ViewerRouteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="viewer-route-layout flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
  );
}
