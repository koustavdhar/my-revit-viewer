"use client";

import { Card } from "@/components/ui";
import { APS_MODEL_DERIVATIVE_TARGET_FORMAT, APS_VIEWER_FRONTEND_ENABLED } from "@/features/integrations/aps/aps-config";
import type { ViewerAdapterContext, ViewerAdapterLayout } from "@/features/viewer/shell/viewer-adapters";

/**
 * Placeholder for the future APS Viewer–based BIM viewport (SVF2).
 *
 * Wire this from `viewer-adapters.tsx` (`renderBimViewport`) when `project.bimEngine === "aps"` and
 * `APS_VIEWER_FRONTEND_ENABLED` is true, after the TODOs below are implemented.
 */

/*
 * =============================================================================
 * TODO 1 — APS auth / token retrieval
 * =============================================================================
 * - Add a Next.js Route Handler, e.g. `app/api/aps/token/route.ts`, that:
 *   - Uses APS_CLIENT_ID + APS_CLIENT_SECRET (server-only env vars) for 2-legged OAuth, OR
 *   - Exchanges a 3-legged code for a user token if you need per-user ACC/BIM 360 files.
 * - Return `{ access_token, expires_in }` as JSON; call from this component (or parent) with `fetch`.
 * - Cache the token until shortly before expiry to avoid hammering APS.
 * - Never ship the client secret to the browser.
 * =============================================================================
 */

/*
 * =============================================================================
 * TODO 2 — Translated derivative URN
 * =============================================================================
 * - After upload to OSS and a Model Derivative job, APS gives you a **base64-encoded URN**
 *   for the translated SVF2 package. Store it on your project or file record (see `ProjectSpatialFile.aps`).
 * - Pass that URN into `Autodesk.Viewing.Document.load` (see APS Viewer tutorials).
 * - Your backend should expose something like: GET /api/projects/:id/aps-viewer-bootstrap
 *   → `{ accessToken, encodedDerivativeUrn }`.
 * =============================================================================
 */

/*
 * =============================================================================
 * TODO 3 — Viewer initialization (APS Viewer / Forge Viewer)
 * =============================================================================
 * - Load the APS Viewer script from Autodesk’s CDN (version-pinned) or bundle via npm if you prefer.
 * - Create a container `div`, then:
 *     `Autodesk.Viewing.Initializer({ env: 'AutodeskProduction', accessToken }, () => { ... })`
 * - Instantiate `GuiViewer3D`, `start()`, then `loadDocument(urn, onLoadSuccess, onLoadError)`.
 * - On teardown (React `useEffect` cleanup), `viewer.tearDown()` and remove the DOM node.
 * - Map selection events to your existing `BimElementSelection` shape for the right-hand properties panel.
 * =============================================================================
 */

export type ApsBimViewportPlaceholderProps = {
  ctx: ViewerAdapterContext;
  layout: ViewerAdapterLayout;
};

export function ApsBimViewportPlaceholder({ ctx }: ApsBimViewportPlaceholderProps) {
  const projectName = ctx.project.name;

  return (
    <Card className="flex min-h-[280px] flex-col items-center justify-center border-dashed border-[color:var(--border-strong)] bg-[color:var(--surface-muted)] p-8 text-center shadow-[var(--shadow-xs)]">
      <p className="text-[length:var(--text-sm)] font-bold text-[color:var(--text)]">APS Viewer (placeholder)</p>
      <p className="mt-2 max-w-md text-[length:var(--text-sm)] text-[color:var(--text-muted)]">
        Project <span className="font-semibold text-[color:var(--text)]">{projectName}</span> is flagged for the APS BIM path. The real{" "}
        <span className="font-mono text-[length:var(--text-xs)]">{APS_MODEL_DERIVATIVE_TARGET_FORMAT}</span> viewer is not mounted yet —
        implement the TODO sections in{" "}
        <code className="rounded-[var(--radius-xs)] bg-[color:var(--surface)] px-1 font-mono text-[length:var(--text-2xs)]">
          aps-bim-viewer-adapter.placeholder.tsx
        </code>
        .
      </p>
      <p className="mt-3 text-[length:var(--text-xs)] text-[color:var(--text-subtle)]">
        Frontend flag{" "}
        <code className="rounded-[var(--radius-xs)] bg-[color:var(--surface)] px-1 font-mono text-[length:var(--text-2xs)]">
          APS_VIEWER_FRONTEND_ENABLED
        </code>{" "}
        = {String(APS_VIEWER_FRONTEND_ENABLED)}
      </p>
    </Card>
  );
}
