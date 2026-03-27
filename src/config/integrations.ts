/**
 * Central integration config area.
 * Keep environment access in one place so future providers (Speckle/APS) are easier to maintain.
 */

export type ViewerBackend = "dummy" | "speckle" | "aps";

/**
 * Prototype selector:
 * - dummy: local mock viewer state
 * - speckle: target future real provider
 * - aps: target future real provider
 */
export const VIEWER_BACKEND: ViewerBackend = "dummy";

export const integrationsConfig = {
  speckle: {
    /**
     * For prototype/local testing only.
     * Production should use a backend token-exchange flow.
     */
    publicToken: process.env.NEXT_PUBLIC_SPECKLE_TOKEN ?? "",
  },
  aps: {
    /**
     * Placeholder keys for future setup. Keep real secrets server-side.
     */
    clientId: process.env.NEXT_PUBLIC_APS_CLIENT_ID ?? "",
  },
} as const;
