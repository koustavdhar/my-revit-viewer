/**
 * APS (Autodesk Platform Services) integration — scaffold only.
 * See `docs/aps-viewer-integration.md` for the end-to-end flow.
 */

export {
  APS_MODEL_DERIVATIVE_TARGET_FORMAT,
  APS_VIEWER_FRONTEND_ENABLED,
  apsTranslationTargetLabel,
  formatUsesApsModelDerivative,
  type ApsModelDerivativeTargetFormat,
} from "@/features/integrations/aps/aps-config";
export type {
  ApsAccessToken,
  ApsBootstrapForViewer,
  ApsObjectStorageUrn,
  ApsTranslationJobStatus,
  ApsViewerDocumentUrn,
} from "@/features/integrations/aps/aps-types";
export { ApsBimViewportPlaceholder } from "@/features/integrations/aps/aps-bim-viewer-adapter.placeholder";
export type { ApsBimViewportPlaceholderProps } from "@/features/integrations/aps/aps-bim-viewer-adapter.placeholder";
