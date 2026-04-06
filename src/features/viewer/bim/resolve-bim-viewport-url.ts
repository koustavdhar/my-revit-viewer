import type { ViewerProject } from "@/features/viewer/types";
import { resolveIfcUrl } from "@/features/viewer/bim/resolve-ifc-url";
import type { BimLoadSource } from "@/features/viewer/bim/bim-types";

/**
 * Site-relative path for the optional local dev IFC.
 * Place your test file at `public/bim/sample.ifc` (see `public/bim/README.md` and `docs/bim-local-testing.md`).
 */
export const BIM_DEV_SAMPLE_RELATIVE_PATH = "/bim/sample.ifc";

export type BimViewportLoadTarget = {
  /** URL or path passed to `fetch()` (absolute or site-relative). */
  effectiveUrl: string | null;
  loadSource: BimLoadSource;
  /** Short label for UI (e.g. `sample.ifc` or remote filename). */
  displayFileName: string | null;
};

function displayNameFromUrl(url: string): string {
  try {
    const u = new URL(url, "http://local.invalid");
    return decodeURIComponent(u.pathname.split("/").pop() || url);
  } catch {
    return url.split("/").pop() || url;
  }
}

function devSampleDisabled(): boolean {
  return process.env.NEXT_PUBLIC_BIM_DISABLE_DEV_SAMPLE === "1";
}

/**
 * Resolves which IFC the BIM viewport should load.
 *
 * - Production: only project `ifcUrl` / IFC `sourceFiles[].url` (same as {@link resolveIfcUrl}).
 * - Development: if the project has no IFC URL, falls back to {@link BIM_DEV_SAMPLE_RELATIVE_PATH}
 *   so you can drop `public/bim/sample.ifc` without touching mock data.
 */
export function resolveBimViewportUrl(project: ViewerProject): BimViewportLoadTarget {
  const fromProject = resolveIfcUrl(project);
  if (fromProject) {
    return {
      effectiveUrl: fromProject,
      loadSource: "project-ifc",
      displayFileName: displayNameFromUrl(fromProject),
    };
  }

  if (process.env.NODE_ENV === "development" && !devSampleDisabled()) {
    return {
      effectiveUrl: BIM_DEV_SAMPLE_RELATIVE_PATH,
      loadSource: "dev-sample",
      displayFileName: "sample.ifc",
    };
  }

  return {
    effectiveUrl: null,
    loadSource: "none",
    displayFileName: null,
  };
}
