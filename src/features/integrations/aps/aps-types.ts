/**
 * Placeholder types for APS + Model Derivative. Shapes match what your backend will eventually return.
 * Names are intentionally close to APS docs so you can map responses 1:1 later.
 */

/** OAuth access token (2-legged app or 3-legged user). Never expose client_secret in browser bundles. */
export type ApsAccessToken = string;

/**
 * Base64-encoded URN of the **translated** model (SVF2), passed to `Autodesk.Viewing.Initializer` / `loadDocument`.
 * Example shape in docs: `dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6...`
 */
export type ApsViewerDocumentUrn = string;

/** Raw OSS object URN for the uploaded source (before translation). */
export type ApsObjectStorageUrn = string;

export type ApsTranslationJobStatus =
  | "pending"
  | "inprogress"
  | "successful"
  | "failed"
  | "timeout";

export type ApsBootstrapForViewer = {
  accessToken: ApsAccessToken;
  /** Use this URN with APS Viewer after Model Derivative succeeds. */
  encodedDerivativeUrn: ApsViewerDocumentUrn;
  /** Optional: expiry for token refresh UI. */
  expiresAt?: string;
};
