/**
 * Autodesk Platform Services (APS) — frontend scaffold only.
 * Flip flags and wire `aps-bim-viewer-adapter.placeholder.tsx` into `viewer-adapters.tsx` when you add a real viewer + API routes.
 */

import type { LogicalFileFormat } from "@/features/viewer/formats/logical-formats";

/** When true, the BIM adapter may branch to the APS Viewer path (not implemented yet). */
export const APS_VIEWER_FRONTEND_ENABLED = false;

/**
 * Model Derivative output used for Design Web Format / viewer geometry in APS Viewer.
 * RVT and DWG uploads are translated to this format for browser viewing.
 */
export const APS_MODEL_DERIVATIVE_TARGET_FORMAT = "SVF2" as const;

export type ApsModelDerivativeTargetFormat = typeof APS_MODEL_DERIVATIVE_TARGET_FORMAT;

/** RVT/DWG usually go through APS (upload → derivative → SVF2), not the browser alone. */
export function formatUsesApsModelDerivative(format: LogicalFileFormat): boolean {
  return format === "RVT" || format === "DWG";
}

export function apsTranslationTargetLabel(): string {
  return APS_MODEL_DERIVATIVE_TARGET_FORMAT;
}
